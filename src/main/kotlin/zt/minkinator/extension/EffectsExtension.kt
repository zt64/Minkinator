package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.application.slash.PublicSlashCommand
import com.kotlindiscord.kord.extensions.commands.converters.impl.*
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.respond
import com.kotlindiscord.kord.extensions.utils.suggestStringCollection
import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.angles.Degrees
import com.sksamuel.scrimage.filter.*
import dev.kord.common.entity.EmbedType
import dev.kord.core.behavior.reply
import dev.kord.core.entity.Attachment
import dev.kord.rest.Image
import dev.kord.rest.NamedFile
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import org.koin.core.component.inject
import zt.minkinator.util.chatCommand
import zt.minkinator.util.mutateGif
import zt.minkinator.util.mutateImage
import zt.minkinator.util.publicSlashCommand
import kotlin.math.PI

object EffectsExtension : Extension() {
    override val name = "effects"

    private val httpClient: HttpClient by inject()

    override suspend fun setup() {
        suspend fun <T : BaseArgs> addCommand(
            name: String,
            description: String,
            arguments: () -> T,
            block: T.(image: ImmutableImage) -> ImmutableImage
        ) = publicSlashCommand(
            name = name,
            description = description,
            arguments = arguments
        ) {
            action {
                val user = this@action.arguments.user
                val avatar = user.avatar ?: user.defaultAvatar

                val file = if (avatar.animated) {
                    val mutatedGif = mutateGif(avatar.getImage(Image.Format.GIF).data) { frame ->
                        block(this@action.arguments, frame)
                    }

                    NamedFile(
                        name = "${user.username}.gif",
                        contentProvider = ChannelProvider { mutatedGif }
                    )
                } else {
                    val mutatedImage = mutateImage(avatar.getImage().data) { image ->
                        block(this@action.arguments, image)
                    }

                    NamedFile(
                        name = "${user.username}.png",
                        contentProvider = ChannelProvider { mutatedImage }
                    )
                }

                respond {
                    files += file
                }
            }
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
            filter: Filter
        ): PublicSlashCommand<BaseArgs, *> {
            return addCommand(name, description, ::BaseArgs) { image ->
                image.filter(filter)
            }
        }

        addFilterCommand("invert", "Invert the colors of a user's avatar", InvertFilter())
        addFilterCommand("grayscale", "Convert a user's avatar to grayscale", GrayscaleFilter())
        addFilterCommand("solarize", "Solarize a user's avatar", SolarizeFilter())
        addFilterCommand("sepia", "Convert a user's avatar to sepia", SepiaFilter())
        addFilterCommand("posterize", "Posterize a user's avatar", PosterizeFilter())
        addFilterCommand("oil", "Apply an oil filter to a user's avatar", OilFilter())
        addFilterCommand("emboss", "Emboss a user's avatar", EmbossFilter())
        addFilterCommand("bump", "Apply a bump filter to a user's avatar", BumpFilter())
        addFilterCommand("blur", "Blur a user's avatar", BlurFilter())
        addFilterCommand("sharpen", "Sharpen a user's avatar", SharpenFilter())
        addFilterCommand("edge", "Detect edges in a user's avatar", EdgeFilter())
        addFilterCommand("dither", "Apply a dither filter to a user's avatar", DitherFilter())
        addFilterCommand("ripple", "Apply a ripple filter to a user's avatar", RippleFilter(RippleType.Noise))

        class PixelateArgs : BaseArgs() {
            val blockSize by defaultingInt {
                name = "block-size"
                description = "The number of pixels along each block edge"
                defaultValue = 8
                minValue = 0
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

                mutate { value -> value * (PI / 180) }
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

        class ResizeArgs : Arguments() {
            val message by message {
                name = "message"
                description = "The message containing an image to resize"

                validate {
                    failIf("Message has no images") {
                        value.embeds.none { embed ->
                            embed.type is EmbedType.Image || embed.type is EmbedType.Gifv
                        } && value.attachments.none(Attachment::isImage)
                    }
                }
            }
            val factor by decimal {
                name = "factor"
                description = "The factor to resize the image by"
                minValue = 0.0
                maxValue = 10.0
            }
        }

        chatCommand(
            name = "resize",
            description = "Resizes an image",
            arguments = ::ResizeArgs
        ) {
            action {
                val message = arguments.message

                val (isAnimated, url) = if (message.attachments.isNotEmpty()) {
                    val attachment = message.attachments.first { it.isImage }

                    attachment.filename.endsWith(".gif") to attachment.url
                } else {
                    val embed = message.embeds.first { embed ->
                        embed.type is EmbedType.Image || embed.type is EmbedType.Gifv
                    }
                    val animated = embed.url!!.endsWith(".gif") || embed.type is EmbedType.Gifv

                    animated to embed.url!!
                }

                val byteArray = httpClient.get(url).readBytes()
                val output = ChannelProvider {
                    mutateImage(byteArray) { image -> image.scale(arguments.factor) }
                }

                val file = if (isAnimated) {
                    NamedFile(
                        name = "resized.gif",
                        contentProvider = output
                    )
                } else {
                    NamedFile(
                        name = "resized.png",
                        contentProvider = output
                    )
                }

                message.reply {
                    files += file
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