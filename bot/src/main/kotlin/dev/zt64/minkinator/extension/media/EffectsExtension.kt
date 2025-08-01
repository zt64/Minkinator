package dev.zt64.minkinator.extension.media

import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.angles.Degrees
import com.sksamuel.scrimage.filter.*
import com.sksamuel.scrimage.format.Format
import com.sksamuel.scrimage.format.FormatDetector
import com.sksamuel.scrimage.nio.AnimatedGifReader
import com.sksamuel.scrimage.nio.ImageSource
import com.sksamuel.scrimage.nio.StreamingGifWriter
import com.sksamuel.scrimage.nio.internal.GifSequenceReader
import dev.kord.common.entity.Snowflake
import dev.kord.rest.Image
import dev.kord.rest.NamedFile
import dev.kordex.core.DiscordRelayedException
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.application.slash.PublicSlashCommandContext
import dev.kordex.core.commands.application.slash.converters.ChoiceEnum
import dev.kordex.core.commands.converters.impl.*
import dev.kordex.core.extensions.Extension
import dev.kordex.core.extensions.ephemeralMessageCommand
import dev.kordex.core.i18n.toKey
import dev.kordex.core.i18n.types.Key
import dev.kordex.core.utils.suggestStringCollection
import dev.zt64.minkinator.util.displayAvatar
import dev.zt64.minkinator.util.publicSlashCommand
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.utils.io.*
import org.koin.core.component.inject
import thirdparty.jhlabs.image.ConvolveFilter
import java.awt.AlphaComposite
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.time.Duration
import javax.imageio.ImageIO
import kotlin.jvm.optionals.getOrNull
import kotlin.math.*

object EffectsExtension : Extension() {
    override val name = "effects"

    private val httpClient: HttpClient by inject()

    private val selection = hashMapOf<Snowflake, String>()

    override suspend fun setup() {
        suspend fun <T : BaseArgs> addCommand(name: String, description: String, arguments: () -> T, block: T.(image: ImmutableImage) -> ImmutableImage) {
            suspend fun PublicSlashCommandContext<*, *>.processImage(arguments: T): NamedFile {
                val image = when {
                    arguments.link != null -> {
                        httpClient.get(arguments.link!!).readRawBytes()
                    }

                    arguments.member != null -> {
                        val avatar = arguments.member!!.avatar ?: arguments.member!!.defaultAvatar
                        if (avatar.isAnimated) {
                            avatar.getImage(Image.Format.GIF).data
                        } else {
                            avatar.getImage().data
                        }
                    }

                    arguments.attachment != null -> {
                        httpClient.get(arguments.attachment!!.url).readRawBytes()
                    }

                    selection.contains(user.id) -> {
                        httpClient.get(selection[user.id]!!).readRawBytes()
                    }

                    else -> {
                        throw DiscordRelayedException("No image provided".toKey())
                    }
                }
                val format = FormatDetector.detect(image).getOrNull() ?: throw DiscordRelayedException("No image provided".toKey())
                val mutator = { frame: ImmutableImage -> arguments.block(frame) }

                val (extension, byteReadChannel) = if (format == Format.GIF) {
                    "gif" to mutateGif(image, mutator)
                } else {
                    "png" to mutateImage(image, mutator)
                }

                return NamedFile(
                    name = "a.$extension",
                    contentProvider = ChannelProvider { byteReadChannel }
                )
            }

            publicSlashCommand(name.toKey(), description.toKey(), arguments) {
                action {
                    val response = respond {
                        val f = processImage(this@action.arguments)

                        files += f
                    }

                    selection[user.id] = response.message.attachments.single().url
                }
            }

            // chatCommand(name.toKey(), description.toKey(), arguments) {
            //     action {
            //         message.reply {
            //             processAvatar(this@action.arguments)
            //         }
            //     }
            // }
        }

        suspend fun addCommand(name: String, description: String, block: (image: ImmutableImage) -> ImmutableImage) {
            addCommand(name, description, EffectsExtension::BaseArgs) { block(it) }
        }

        suspend fun <T : BaseArgs> addFilterCommand(name: String, description: String, arguments: () -> T, filter: T.() -> Filter) =
            addCommand(name, description, arguments) { image ->
                image.filter(filter())
            }

        suspend fun addFilterCommand(name: String, description: String, filter: () -> Filter) {
            addCommand(name, description) { image -> image.filter(filter()) }
        }

        addFilterCommand("invert", "Invert the colors of an image", ::InvertFilter)
        addFilterCommand("grayscale", "Convert an image to grayscale", ::GrayscaleFilter)
        addFilterCommand("solarize", "Solarize an image", ::SolarizeFilter)
        addFilterCommand("sepia", "Convert an image to sepia", ::SepiaFilter)
        addFilterCommand("posterize", "Posterize an image", ::PosterizeFilter)
        addFilterCommand("oil", "Apply an oil filter to an image", ::OilFilter)
        addFilterCommand("emboss", "Emboss an image", ::EmbossFilter)
        addFilterCommand("bump", "Apply a bump filter to an image", ::BumpFilter)
        addFilterCommand("blur", "Blur an image", ::LensBlurFilter)
        addFilterCommand("sharpen", "Sharpen an image", ::SharpenFilter)
        addFilterCommand("edge", "Detect edges in a an image", ::EdgeFilter)
        addFilterCommand("dither", "Apply a dither filter to a an image", ::DitherFilter)
        addFilterCommand("glow", "Apply a glow filter to an image", ::GlowFilter)
        addFilterCommand("chrome", "Apply a chrome filter to an image", ::ChromeFilter)
        addFilterCommand("sparkle", "Apply a sparkle filter to an image", ::SparkleFilter)
        addFilterCommand("quantize", "Apply a quantize filter to an image", ::QuantizeFilter)
        addFilterCommand("dissolve", "Apply a dissolve filter to an image") {
            DissolveFilter(0.5f)
        }
        addFilterCommand("crystallize", "Apply a crystallize filter to an image") {
            CrystallizeFilter(6.0, 0.25, 0x000000, 0.7)
        }
        addFilterCommand("ripple", "Apply a ripple filter to a an image") {
            RippleFilter(RippleType.Noise)
        }

        class PixelateArgs : BaseArgs() {
            val blockSize by defaultingInt {
                name = "block-size".toKey()
                description = "The number of pixels along each block edge".toKey()
                defaultValue = 8
                minValue = 8
                maxValue = 512
            }
        }

        addFilterCommand("pixelate", "Pixelate a image", ::PixelateArgs) {
            PixelateFilter(blockSize)
        }

        class KaleidoscopeArgs : BaseArgs() {
            val sides by defaultingInt {
                name = "sides".toKey()
                description = "The number of sides".toKey()
                defaultValue = 5
                minValue = 3
                maxValue = 128
            }
        }

        addFilterCommand("kaleidoscope", "Apply a kaleidoscope filter to an image", ::KaleidoscopeArgs) {
            KaleidoscopeFilter(sides)
        }

        addFilterCommand("rays", "Apply a rays filter to an image") {
            RaysFilter()
        }

        addFilterCommand("television", "Apply a television filter to an image") {
            TelevisionFilter()
        }

        class TwirlArgs : BaseArgs() {
            val angle by defaultingDecimal {
                name = "angle".toKey()
                description = "The angle in degrees".toKey()
                defaultValue = 200.0

                mutate { it * (PI / 180) }
            }
            val radius by defaultingDecimal {
                name = "radius".toKey()
                description = "The radius".toKey()
                defaultValue = 50.0
                minValue = 0.0
            }
        }

        addFilterCommand("twirl", "Apply a twirl filter to an image", ::TwirlArgs) {
            TwirlFilter(angle.toFloat(), radius.toFloat())
        }

        class ThresholdArgs : BaseArgs() {
            val threshold by defaultingInt {
                name = "threshold".toKey()
                description = "The threshold".toKey()
                defaultValue = 127
                minValue = 0
                maxValue = 255
            }
        }

        addFilterCommand("threshold", "Apply a threshold filter to an image", ::ThresholdArgs) {
            ThresholdFilter(threshold)
        }

        class RotateArgs : BaseArgs() {
            val degrees by defaultingInt {
                name = "degrees".toKey()
                description = "How many degrees to rotate the avatar by".toKey()
                defaultValue = 0
            }
        }

        addCommand("rotate", "Rotate an image", ::RotateArgs) { image ->
            image.rotate(Degrees(degrees))
        }

        class FlipArgs : BaseArgs() {
            val axis by defaultingEnum<Axis> {
                name = "axis".toKey()
                typeName = "axis".toKey()
                description = "The axis to flip the avatar on".toKey()
                defaultValue = Axis.X

                autoComplete {
                    suggestStringCollection(Axis.entries.map(Axis::name))
                }
            }
        }

        addCommand("flip", "Flip an image", ::FlipArgs) { image ->
            when (axis) {
                Axis.X -> image.flipX()
                Axis.Y -> image.flipY()
            }
        }

        class ResizeArgs : BaseArgs() {
            val factor by defaultingDecimal {
                name = "factor".toKey()
                description = "The factor to resize the image by".toKey()
                minValue = 0.0
                maxValue = 10.0
                defaultValue = 2.0
            }
        }

        addCommand("resize", "Resizes an image", ::ResizeArgs) { image ->
            image.scale(factor)
        }

        addCommand("speech-bubble", "Adds a speech bubble to an image") { image ->
            val scaledImage = image.scaleTo(512, 512)
            val speechBubble = ImmutableImage
                .loader()
                .fromResource("/speech-bubble.png")
                .scaleToWidth(scaledImage.width)

            scaledImage.overlay(speechBubble)
        }

        class MirrorArgs : BaseArgs() {
            val axis by defaultingEnum<Axis> {
                name = "axis".toKey()
                typeName = "axis".toKey()
                description = "The axis to mirror the avatar on".toKey()
                defaultValue = Axis.X
                autoComplete {
                    suggestStringCollection(Axis.entries.map(Axis::name))
                }
            }
        }

        addCommand("mirror", "Mirrors an image", ::MirrorArgs) { image ->
            when (axis) {
                Axis.X -> {
                    val half = image.takeRight(image.width / 2)
                    image.overlay(half.flipX())
                }

                Axis.Y -> {
                    val half = image.takeBottom(image.height / 2)
                    image.overlay(half.flipY())
                }
            }
        }

        class ConvolveArgs : BaseArgs() {
            val data by defaultingString {
                name = "matrix".toKey()
                description = "The matrix to convolve the image with. In the format of a 2D array such as 0,0,0,0,1,0,0,0,0".toKey()
                defaultValue = "0,0,0,0,1,0,0,0,0"
            }
        }

        addCommand("convolve", "Apply a convolution matrix to a user", ::ConvolveArgs) { image ->
            val matrix = data.split(",").map(String::toFloat).toFloatArray()
            val filter = ConvolveFilter(matrix).apply {
                useAlpha = true
                edgeAction = ConvolveFilter.CLAMP_EDGES
            }

            ImmutableImage.fromAwt(filter.filter(image.awt(), null))
        }

        class SpeedArgs : BaseArgs() {
            val multiplier by defaultingDecimal {
                name = "multiplier".toKey()
                description = "Speed multiplier (0.5 = half speed, 2 = double speed)".toKey()
                defaultValue = 1.0
                minValue = 0.1
                maxValue = 5.0
            }
        }

        // class OverlayArgs : BaseArgs() {
        //     val overlayLink by string {
        //         name = "overlay-link".toKey()
        //         description = "Link to the image to overlay".toKey()
        //     }
        // }
        //
        // publicSlashCommand("overlay".toKey(), "Overlay an image on top of another".toKey(), ::OverlayArgs) {
        //     action {
        //         respond {
        //
        //         }
        //     }
        // }

        class BounceArgs : BaseArgs() {
            val heightMultiplier by defaultingDecimal {
                name = "height".toKey()
                description = "How high to bounce (1.5 = 1.5x the image height)".toKey()
                defaultValue = 2.0
                minValue = 2.0
                maxValue = 4.0
            }

            val speedMultiplier by defaultingDecimal {
                name = "speed".toKey()
                description = "Speed multiplier (0.5 = half speed, 2 = double speed)".toKey()
                defaultValue = 1.0
                minValue = 0.1
                maxValue = 10.0
            }
        }

        publicSlashCommand("bounce".toKey(), "Make an image bounce up and down".toKey(), ::BounceArgs) {
            action {
                val os = ByteArrayOutputStream()
                val gif = StreamingGifWriter().prepareStream(os, BufferedImage.TYPE_INT_ARGB)

                val bytes = extractImage() ?: throw DiscordRelayedException("Invalid image".toKey())

                val image = ImageIO.read(ByteArrayInputStream(bytes))
                val baseFps = 24.0 // Desired smoothness
                val baseFrameCount = 24 // Number of frames at base speed
                (1000.0 / baseFps).toLong() // Base frame duration in ms

                val adjustedFps = (baseFps * arguments.speedMultiplier).coerceAtLeast(1.0)
                val frameDuration = (1000.0 / adjustedFps).toLong()
                val frameCount = (baseFrameCount / arguments.speedMultiplier).toInt().coerceAtLeast(1)

                val bounceHeight = (image.height * (arguments.heightMultiplier - 1.0)).toInt()

                fun calculateNaturalOffset(frame: Int): Int {
                    val t = frame.toDouble() / frameCount
                    val cycle = (t * 2) % 2 // Complete cycle takes 2 units

                    return if (cycle < 1) {
                        // Going up: slow down at peak
                        val easeOut = 1 - (1 - cycle) * (1 - cycle)
                        (bounceHeight * easeOut).toInt()
                    } else {
                        // Coming down: accelerate and bounce
                        val easeIn = (cycle - 1) * (cycle - 1)
                        (bounceHeight * (1 - easeIn)).toInt()
                    }
                }
                if (FormatDetector.detect(bytes).getOrNull() == Format.GIF) {
                    // Handle animated GIF input
                    val sourceGif = AnimatedGifReader.read(ImageSource.of(bytes))
                    val sourceFrameCount = sourceGif.frameCount

                    // Total number of frames for the bounce animation
                    val totalDuration = sourceGif.frames.withIndex().sumOf { sourceGif.getDelay(it.index).toMillis() }
                    val totalBounceFrames = (totalDuration / frameDuration).toInt()

                    repeat(totalBounceFrames) { bounceFrameIndex ->
                        // Determine the offset for the bounce
                        val offset = calculateNaturalOffset(bounceFrameIndex % frameCount)

                        // Calculate the current inner GIF frame based on elapsed time
                        val elapsedTime = bounceFrameIndex * frameDuration
                        var cumulativeTime = 0L
                        var innerFrameIndex = 0

                        while (innerFrameIndex < sourceFrameCount) {
                            cumulativeTime += sourceGif.getDelay(innerFrameIndex).toMillis()
                            if (cumulativeTime > elapsedTime) break
                            innerFrameIndex++
                        }
                        innerFrameIndex %= sourceFrameCount

                        // Get the inner GIF frame
                        val sourceFrame = sourceGif.getFrame(innerFrameIndex)

                        // Create a new frame with bounce effect
                        val bounceImage = BufferedImage(
                            sourceFrame.width,
                            sourceFrame.height + bounceHeight,
                            BufferedImage.TYPE_INT_ARGB
                        )
                        val g2d = bounceImage.createGraphics()

                        // Clear the background and draw the image with the offset
                        g2d.clearRect(0, 0, bounceImage.width, bounceImage.height)
                        g2d.drawImage(
                            sourceFrame.awt(),
                            0,
                            bounceImage.height - sourceFrame.height - offset,
                            null
                        )
                        g2d.dispose()

                        gif.writeFrame(
                            ImmutableImage.fromAwt(bounceImage),
                            Duration.ofMillis(frameDuration)
                        )
                    }
                } else {
                    repeat(frameCount) { frameIndex ->
                        val offset = calculateNaturalOffset(frameIndex)

                        // Create frame with room for bounce
                        val bounceFrame = BufferedImage(image.width, image.height + bounceHeight, BufferedImage.TYPE_INT_ARGB)
                        val g2d = bounceFrame.createGraphics()

                        // Draw image at the bottom, offset by bounce height
                        g2d.clearRect(0, 0, bounceFrame.width, bounceFrame.height)
                        g2d.drawImage(
                            image,
                            0,
                            bounceFrame.height - image.height - offset,
                            null
                        )
                        g2d.dispose()

                        gif.writeFrame(
                            ImmutableImage.fromAwt(bounceFrame),
                            Duration.ofMillis(frameDuration)
                        )
                    }
                }
                gif.close()

                respond {
                    files += NamedFile("bounce.gif", ChannelProvider { ByteReadChannel(os.toByteArray()) })
                }
            }
        }

        class SpinArgs : BaseArgs() {
            val degreesPerSecond by defaultingInt {
                name = "degrees-per-second".toKey()
                description = "How many degrees to rotate per second, positive is clockwise, and negative is counter-clockwise".toKey()
                defaultValue = 240
            }
        }

        publicSlashCommand("spin".toKey(), "Make an image spin".toKey(), ::SpinArgs) {
            action {
                val os = ByteArrayOutputStream()
                val gif = StreamingGifWriter().prepareStream(os, BufferedImage.TYPE_INT_ARGB)

                val bytes = extractImage()
                val frameDuration = 50L // 50ms per frame (20 FPS)
                val fps = 1000 / frameDuration // Frames per second
                val degreesPerFrame = arguments.degreesPerSecond / fps.toDouble()
                val framesForFullRotation = ceil(360.0 / abs(degreesPerFrame)).toInt()

                val sourceFormat = FormatDetector.detect(bytes).getOrNull()
                val sourceGif = if (sourceFormat == Format.GIF) {
                    GifSequenceReader().apply {
                        read(ByteArrayInputStream(bytes))
                    }
                } else {
                    null
                }

                if (sourceGif != null) {
                    // Handle GIFs
                    repeat(sourceGif.frameCount) { sourceFrameIndex ->
                        val sourceFrame = sourceGif.getFrame(sourceFrameIndex)
                        val delay = sourceGif.getDelay(sourceFrameIndex)

                        // Rotate each frame
                        repeat(fps.toInt()) { subFrameIndex ->
                            val totalDegrees = (sourceFrameIndex * fps + subFrameIndex) * degreesPerFrame
                            gif.writeFrame(
                                ImmutableImage.fromAwt(rotateImageAroundCenter(sourceFrame, totalDegrees)),
                                Duration.ofMillis(delay / fps) // Split delay evenly
                            )
                        }
                    }
                } else {
                    // Handle static images
                    val image = ImageIO.read(ByteArrayInputStream(bytes))
                    repeat(framesForFullRotation) { frameIndex ->
                        val totalDegrees = frameIndex * degreesPerFrame
                        gif.writeFrame(
                            ImmutableImage.fromAwt(rotateImageAroundCenter(image, totalDegrees)),
                            Duration.ofMillis(frameDuration)
                        )
                    }
                }

                gif.close()

                respond {
                    files += NamedFile("spinny.gif", ChannelProvider { ByteReadChannel(os.toByteArray()) })
                }
            }
        }

        publicSlashCommand("speed".toKey(), "Modify the speed of a GIF".toKey(), ::SpeedArgs) {
            action {
                respond {
                    val image = extractImage() ?: throw DiscordRelayedException("Invalid image".toKey())

                    val gif = AnimatedGifReader.read(ImageSource.of(image))
                    val newDelay = (gif.getDelay(0).toMillis() / arguments.multiplier).toInt()

                    files += NamedFile(
                        name = "speed.gif",
                        contentProvider = ChannelProvider {
                            mutateGifFormat(image, delay = newDelay)
                        }
                    )
                }
            }
        }

        class SphereArgs : BaseArgs() {
            val rotations by defaultingInt {
                name = "rotations".toKey()
                description = "Number of complete rotations".toKey()
                defaultValue = 1
                minValue = 1
                maxValue = 5
            }

            val quality by defaultingInt {
                name = "quality".toKey()
                description = "Quality of the sphere (higher = smoother)".toKey()
                defaultValue = 32
                minValue = 16
                maxValue = 64
            }

            val frameRate by defaultingInt {
                name = "framerate".toKey()
                description = "Frames per second".toKey()
                defaultValue = 24
                minValue = 24
                maxValue = 24
            }
        }

        publicSlashCommand("sphere".toKey(), "Map an image onto a spinning 3D sphere".toKey(), ::SphereArgs) {
            action {
                val os = ByteArrayOutputStream()
                val bytes = extractImage() ?: throw DiscordRelayedException("Invalid image".toKey())
                val image = ImageIO.read(ByteArrayInputStream(bytes))

                // Parameters
                val width = 256
                val height = 256
                val framesPerRotation = arguments.frameRate * 2
                val totalFrames = framesPerRotation * arguments.rotations
                val frameDuration = (1000 / arguments.frameRate).toLong()

                val gif = StreamingGifWriter().prepareStream(os, BufferedImage.TYPE_INT_ARGB)

                // Generate sphere frames
                repeat(totalFrames) { frameIndex ->
                    val angle = 360.0 * frameIndex / framesPerRotation
                    val frame = renderSphereFrame(image, width, height, angle, arguments.quality)

                    gif.writeFrame(
                        ImmutableImage.fromAwt(frame),
                        Duration.ofMillis(frameDuration)
                    )
                }

                gif.close()

                respond {
                    files += NamedFile("sphere.gif", ChannelProvider { ByteReadChannel(os.toByteArray()) })
                }
            }
        }

        class LoopArgs : BaseArgs() {
            val count by defaultingInt {
                name = "count".toKey()
                description = "Number of times to loop (-1 for infinite)".toKey()
                defaultValue = -1
                minValue = -1
                maxValue = 100
            }
        }

        publicSlashCommand("loop".toKey(), "Change how many times a GIF loops".toKey(), ::LoopArgs) {
            action {
                respond {
                    val image = extractImage() ?: throw DiscordRelayedException("Invalid image".toKey())

                    files += NamedFile(
                        name = "loop.gif",
                        contentProvider = ChannelProvider {
                            mutateGifFormat(image, loop = arguments.count)
                        }
                    )
                }
            }
        }

        ephemeralMessageCommand {
            name = "select".toKey()

            action {
                val attachments = this.targetMessages.single().attachments.filter { it.isImage }
                if (attachments.isEmpty()) {
                    respond {
                        content = "This message has no attachments!"
                    }
                } else {
                    selection[user.id] = attachments.first().url

                    respond {
                        content = "Selected"
                    }
                }
            }
        }
    }

    private suspend fun <T : BaseArgs> PublicSlashCommandContext<T, *>.extractImage(): ByteArray? {
        val bytes = when {
            arguments.link != null -> httpClient.get(arguments.link!!).readRawBytes()
            arguments.attachment != null -> httpClient.get(arguments.attachment!!.url).readRawBytes()
            arguments.member != null -> arguments.member!!.displayAvatar.getImage().data
            selection[user.id] != null -> httpClient.get(selection[user.id]!!).readRawBytes()
            else -> throw DiscordRelayedException("No image provided".toKey())
        }

        if (FormatDetector.detect(bytes).getOrNull() == null) return null

        return bytes
    }

    private open class BaseArgs : Arguments() {
        val link by optionalString {
            name = "link".toKey()
            description = "The link to the image to apply the filter to".toKey()
        }
        val attachment by optionalAttachment {
            name = "attachment".toKey()
            description = "The image or gif to apply the filter to".toKey()
        }
        val member by optionalMember {
            name = "member".toKey()
            description = "The user to apply the filter to".toKey()
        }
    }

    private enum class Axis(override val readableName: Key) : ChoiceEnum {
        X("X".toKey()),
        Y("Y".toKey())
    }
}

private fun rotateImageAroundCenter(image: BufferedImage, angle: Double): BufferedImage {
    val radians = Math.toRadians(angle)

    val rotatedImage = BufferedImage(image.width, image.height, BufferedImage.TYPE_INT_ARGB)
    val g2d = rotatedImage.createGraphics()

    g2d.clearRect(0, 0, image.width, image.height)
    g2d.translate(image.width / 2.0, image.height / 2.0)
    g2d.rotate(radians)
    g2d.drawImage(
        image,
        -image.width / 2,
        -image.height / 2,
        null
    )

    g2d.dispose()

    return rotatedImage
}

private fun renderSphereFrame(texture: BufferedImage, width: Int, height: Int, rotation: Double, quality: Int): BufferedImage {
    val frame = BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)
    frame.createGraphics().apply {
        // Clear background with transparency
        composite = AlphaComposite.getInstance(AlphaComposite.CLEAR)
        fillRect(0, 0, width, height)
        composite = AlphaComposite.getInstance(AlphaComposite.SRC_OVER)
        dispose()
    }

    val radius = width.coerceAtMost(height) / 2 - 20
    val centerX = width / 2
    val centerY = height / 2

    // Calculate sphere points
    val rotRad = Math.toRadians(rotation)
    val cosRotation = cos(rotRad)
    val sinRotation = sin(rotRad)

    // Z-buffer approach with depth tracking
    val zBuffer = Array(width) { FloatArray(height) { Float.NEGATIVE_INFINITY } }

    // Z-buffer approach - scan all pixels in the output image
    for (screenY in 0 until height) {
        for (screenX in 0 until width) {
            // Calculate 2D vector from center
            val dx = (screenX - centerX).toDouble() / radius
            val dy = (screenY - centerY).toDouble() / radius

            // Calculate distance from center (squared)
            val distSquared = dx * dx + dy * dy

            // Only process points inside the circle
            if (distSquared <= 1.0) {
                // Calculate Z coordinate on the sphere
                val dz = sqrt(1.0 - distSquared)

                // Calculate 3D coordinates on unit sphere (before rotation)
                val x3d = dx
                val z3d = dz

                // Rotate around Y axis
                val rotX = x3d * cosRotation - z3d * sinRotation
                val rotZ = x3d * sinRotation + z3d * cosRotation

                // Z-buffer check - only draw if this point is closer to the viewer
                if (rotZ > zBuffer[screenX][screenY]) {
                    zBuffer[screenX][screenY] = rotZ.toFloat()

                    // Calculate texture coordinates from the 3D point
                    val longitude = atan2(rotZ, rotX)
                    val latitude = asin(dy)

                    // Map longitude from -π to π range to 0 to texture.width
                    val u = ((longitude + PI) / (2 * PI)) * texture.width
                    val texX = (u % texture.width).toInt()
                    // Fix negative modulo result
                    val wrappedTexX = if (texX < 0) texture.width + texX else texX

                    // Map latitude from -π/2 to π/2 range to 0 to texture.height
                    val texY = ((latitude + PI / 2) / PI * texture.height)
                        .toInt()
                        .coerceIn(0, texture.height - 1)

                    // Apply pixel from texture to the sphere
                    val color = texture.getRGB(wrappedTexX, texY)

                    // Lighting effect based on Z component (facing the viewer)
                    val lighting = rotZ * 0.5 + 0.5 // 0.5 to 1.0
                    val colorWithLighting = applyLighting(color, lighting)

                    frame.setRGB(screenX, screenY, colorWithLighting)
                }
            }
        }
    }

    return frame
}

private fun applyLighting(color: Int, factor: Double): Int {
    val alpha = color shr 24 and 0xFF
    val r = ((color shr 16 and 0xFF) * factor).toInt().coerceIn(0, 255)
    val g = ((color shr 8 and 0xFF) * factor).toInt().coerceIn(0, 255)
    val b = ((color and 0xFF) * factor).toInt().coerceIn(0, 255)

    return (alpha shl 24) or (r shl 16) or (g shl 8) or b
}