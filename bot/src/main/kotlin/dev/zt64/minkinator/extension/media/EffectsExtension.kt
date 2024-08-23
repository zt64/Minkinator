package dev.zt64.minkinator.extension.media

import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.angles.Degrees
import com.sksamuel.scrimage.filter.*
import dev.kord.core.behavior.reply
import dev.kord.core.entity.interaction.OptionValue
import dev.kord.rest.Image
import dev.kord.rest.NamedFile
import dev.kord.rest.builder.message.create.MessageCreateBuilder
import dev.kordex.core.DiscordRelayedException
import dev.kordex.core.commands.Argument
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.CommandContext
import dev.kordex.core.commands.chat.ChatCommandContext
import dev.kordex.core.commands.converters.OptionalConverter
import dev.kordex.core.commands.converters.impl.*
import dev.kordex.core.extensions.Extension
import dev.kordex.core.utils.suggestStringCollection
import dev.kordex.parser.StringParser
import dev.zt64.minkinator.util.chatCommand
import dev.zt64.minkinator.util.displayAvatar
import dev.zt64.minkinator.util.publicSlashCommand
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import org.bytedeco.ffmpeg.avcodec.AVPacket
import org.bytedeco.ffmpeg.avformat.AVFormatContext
import org.bytedeco.ffmpeg.global.avcodec.*
import org.bytedeco.ffmpeg.global.avformat.*
import org.bytedeco.ffmpeg.global.avutil.AVMEDIA_TYPE_VIDEO
import org.bytedeco.javacpp.BytePointer
import org.bytedeco.javacpp.PointerPointer
import thirdparty.jhlabs.image.ConvolveFilter
import java.nio.ByteBuffer
import kotlin.math.PI
import kotlin.system.exitProcess

object EffectsExtension : Extension() {
    override val name = "effects"

    override suspend fun setup() {
        suspend fun <T : BaseArgs> addCommand(
            name: String,
            description: String,
            arguments: () -> T,
            block: T.(image: ImmutableImage) -> ImmutableImage
        ) {
            suspend fun MessageCreateBuilder.processAvatar(arguments: T) {
                val user = arguments.user
                val avatar = user.avatar ?: user.defaultAvatar
                val mutator = { frame: ImmutableImage -> arguments.block(frame) }

                val (extension, byteReadChannel) = if (avatar.isAnimated) {
                    "gif" to mutateGif(avatar.getImage(Image.Format.GIF).data, mutator)
                } else {
                    "png" to mutateImage(avatar.getImage().data, mutator)
                }

                files += NamedFile(
                    name = "${user.username}.$extension",
                    contentProvider = ChannelProvider { byteReadChannel }
                )
            }

            publicSlashCommand(name, description, arguments) {
                action {
                    respond {
                        processAvatar(this@action.arguments)
                    }
                }
            }

            chatCommand(name, description, arguments) {
                action {
                    message.reply {
                        processAvatar(this@action.arguments)
                    }
                }
            }
        }

        suspend fun addCommand(
            name: String,
            description: String,
            block: (image: ImmutableImage) -> ImmutableImage
        ) = addCommand(name, description, EffectsExtension::BaseArgs) {
            block(it)
        }

        suspend fun <T : BaseArgs> addFilterCommand(
            name: String,
            description: String,
            arguments: () -> T,
            filter: T.() -> Filter
        ) = addCommand(name, description, arguments) { image ->
            image.filter(filter())
        }

        suspend fun addFilterCommand(
            name: String,
            description: String,
            filter: () -> Filter
        ) = addCommand(name, description) { image ->
            image.filter(filter())
        }

        addFilterCommand("invert", "Invert the colors of a user's avatar", ::InvertFilter)
        addFilterCommand("grayscale", "Convert a user's avatar to grayscale", ::GrayscaleFilter)
        addFilterCommand("solarize", "Solarize a user's avatar", ::SolarizeFilter)
        addFilterCommand("sepia", "Convert a user's avatar to sepia", ::SepiaFilter)
        addFilterCommand("posterize", "Posterize a user's avatar", ::PosterizeFilter)
        addFilterCommand("oil", "Apply an oil filter to a user's avatar", ::OilFilter)
        addFilterCommand("emboss", "Emboss a user's avatar", ::EmbossFilter)
        addFilterCommand("bump", "Apply a bump filter to a user's avatar", ::BumpFilter)
        addFilterCommand("blur", "Blur a user's avatar", ::BlurFilter)
        addFilterCommand("sharpen", "Sharpen a user's avatar", ::SharpenFilter)
        addFilterCommand("edge", "Detect edges in a user's avatar", ::EdgeFilter)
        addFilterCommand("dither", "Apply a dither filter to a user's avatar", ::DitherFilter)
        addFilterCommand("ripple", "Apply a ripple filter to a user's avatar") {
            RippleFilter(RippleType.Noise)
        }

        class PixelateArgs : BaseArgs() {
            val blockSize by defaultingInt {
                name = "block-size"
                description = "The number of pixels along each block edge"
                defaultValue = 8
                minValue = 8
                maxValue = 512
            }
        }

        addFilterCommand("pixelate", "Pixelate a user's avatar", ::PixelateArgs) {
            PixelateFilter(blockSize)
        }

        class KaleidoscopeArgs : BaseArgs() {
            val sides by defaultingInt {
                name = "sides"
                description = "The number of sides"
                defaultValue = 5
                minValue = 3
                maxValue = 128
            }
        }

        addFilterCommand("kaleidoscope", "Apply a kaleidoscope filter to a user's avatar", ::KaleidoscopeArgs) {
            KaleidoscopeFilter(sides)
        }

        class TwirlArgs : BaseArgs() {
            val angle by defaultingDecimal {
                name = "angle"
                description = "The angle in degrees"
                defaultValue = 200.0

                mutate { it * (PI / 180) }
            }
            val radius by defaultingDecimal {
                name = "radius"
                description = "The radius"
                defaultValue = 50.0
                minValue = 0.0
            }
        }

        addFilterCommand("twirl", "Apply a twirl filter to a user's avatar", ::TwirlArgs) {
            TwirlFilter(angle.toFloat(), radius.toFloat())
        }

        class ThresholdArgs : BaseArgs() {
            val threshold by defaultingInt {
                name = "threshold"
                description = "The threshold"
                defaultValue = 127
                minValue = 0
                maxValue = 255
            }
        }

        addFilterCommand("threshold", "Apply a threshold filter to a user's avatar", ::ThresholdArgs) {
            ThresholdFilter(threshold)
        }

        class RotateArgs : BaseArgs() {
            val degrees by int {
                name = "degrees"
                description = "How many degrees to rotate the avatar by"
            }
        }

        addCommand("rotate", "Rotate a user's avatar", ::RotateArgs) { image ->
            image.rotate(Degrees(degrees))
        }

        class FlipArgs : BaseArgs() {
            val axis by enum<Axis> {
                name = "axis"
                typeName = "axis"
                description = "The axis to flip the avatar on"

                autoComplete {
                    suggestStringCollection(Axis.entries.map(Axis::name))
                }
            }
        }

        addCommand("flip", "Flip a user's avatar", ::FlipArgs) { image ->
            when (axis) {
                Axis.X -> image.flipX()
                Axis.Y -> image.flipY()
            }
        }

        class ResizeArgs : BaseArgs() {
            val factor by decimal {
                name = "factor"
                description = "The factor to resize the image by"
                minValue = 0.0
                maxValue = 10.0
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
            val axis by enum<Axis> {
                name = "axis"
                typeName = "axis"
                description = "The axis to mirror the avatar on"

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
            val data by string {
                name = "matrix"
                description = "The matrix to convolve the image with"
            }
        }

        addCommand("convolve", "Apply a convolution matrix to a user", ::ConvolveArgs) { image ->
            val matrix = data.split(",").map(String::toFloat).toFloatArray()
            val filter = ConvolveFilter(matrix).apply {
                useAlpha = true
                edgeAction = ConvolveFilter.CLAMP_EDGES
            }

            val output = filter.filter(image.awt(), null)

            ImmutableImage.fromAwt(output)
        }

        class LoopArgs : Arguments() {
            val url by string {
                name = "url"
                description = "The URL of the video to loop"
            }
        }

        publicSlashCommand("loop", "Test", arguments = ::LoopArgs) {
            action {
                val bytes = HttpClient().get(arguments.url).readBytes()

                val ctx = AVFormatContext(null)
                val packet = AVPacket()

                val bytePointer = BytePointer(ByteBuffer.wrap(bytes))
                var ret = avformat_open_input(ctx, bytePointer, null, null)

                if (ret < 0) {
                    throw DiscordRelayedException("Failed to process video")
                }

                if (avformat_find_stream_info(ctx, null as PointerPointer<*>?) < 0) {
                    exitProcess(-1)
                }

                av_dump_format(ctx, 0, bytePointer, 0)
                var i = 0
                var vStreamIdx = -1
                while (i < ctx.nb_streams()) {
                    if (ctx.streams(i).codecpar().codec_type() == AVMEDIA_TYPE_VIDEO) {
                        vStreamIdx = i
                        break
                    }
                    i++
                }

                if (vStreamIdx == -1) {
                    println("Cannot find video stream")
                    throw DiscordRelayedException("Failed to process video")
                } else {
                    System.out.printf(
                        "Video stream %d with resolution %dx%d\n",
                        vStreamIdx,
                        ctx.streams(i).codecpar().width(),
                        ctx.streams(i).codecpar().height()
                    )
                }

                val codecCtx = avcodec_alloc_context3(null)
                avcodec_parameters_to_context(codecCtx, ctx.streams(vStreamIdx).codecpar())

                val codec = avcodec_find_decoder(codecCtx.codec_id())
                if (codec == null) {
                    println("Unsupported codec for video file")
                    throw IllegalStateException()
                }
                ret = avcodec_open2(codecCtx, codec, null as PointerPointer<*>?)
                if (ret < 0) {
                    println("Can not open codec")
                    throw IllegalStateException()
                }
            }
        }
    }

    private open class BaseArgs : Arguments() {
        val user by user {
            name = "user"
            description = "The user to apply the filter to"
        }
    }

    private enum class Axis {
        X,
        Y
    }
}

class MediaReferenceConverter : OptionalConverter<String>() {
    override val signatureTypeString: String = "converters.string.signatureType"

    override suspend fun parse(
        parser: StringParser?,
        context: CommandContext,
        named: String?
    ): Boolean {
        context as ChatCommandContext<*>

        if (context.message.attachments.isNotEmpty()) {
            context
                .message
                .attachments
                .first()
                .url
        }

        parser?.parseNext()
        context.getMember()?.asMember()?.displayAvatar

        return false
    }

    override suspend fun parseOption(
        context: CommandContext,
        option: OptionValue<*>
    ): Boolean {
        return false
    }

    override suspend fun toSlashOption(arg: Argument<*>) = TODO()
}