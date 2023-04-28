package zt.minkinator.extension.media

import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.*
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.respond
import com.kotlindiscord.kord.extensions.utils.suggestStringCollection
import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.angles.Degrees
import com.sksamuel.scrimage.filter.*
import dev.kord.core.behavior.reply
import dev.kord.rest.Image
import dev.kord.rest.NamedFile
import dev.kord.rest.builder.message.create.MessageCreateBuilder
import io.ktor.client.request.forms.*
import zt.minkinator.util.chatCommand
import zt.minkinator.util.publicSlashCommand
import kotlin.math.PI

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
                val mutator = { frame: ImmutableImage -> block(arguments, frame) }

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
            image.filter(filter(this))
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
                    suggestStringCollection(Axis.values().map(Axis::name))
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
            val speechBubble = ImmutableImage.loader()
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
                    suggestStringCollection(Axis.values().map(Axis::name))
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
    }

    private open class BaseArgs : Arguments() {
        val user by user {
            name = "user"
            description = "The user to apply the filter to"
        }
    }

    private enum class Axis {
        X, Y
    }
}