package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.attachment
import com.kotlindiscord.kord.extensions.commands.converters.impl.defaultingBoolean
import com.kotlindiscord.kord.extensions.commands.converters.impl.string
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.respond
import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.Position
import com.sksamuel.scrimage.canvas.drawables.Text
import dev.kord.rest.NamedFile
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.utils.io.*
import org.koin.core.component.inject
import zt.minkinator.extension.media.mutateGif
import zt.minkinator.extension.media.mutateImage
import zt.minkinator.util.publicSlashCommand
import java.awt.Font
import kotlin.math.roundToInt

object CaptionExtension : Extension() {
    override val name = "caption"

    private val httpClient: HttpClient by inject()

    private const val FONT_NAME = "Futura Extra Black Condensed"

    override suspend fun setup() {
        publicSlashCommand(
            name = "caption",
            description = "Caption an image",
            arguments = ::CaptionArgs
        ) {
            action {
                val attachment = arguments.attachment
                val text = arguments.text
                val dark = arguments.dark

                fun block(image: ImmutableImage): ImmutableImage {
                    val width = image.width
                    val height = image.height

                    val baseFont = Font(FONT_NAME, Font.PLAIN, width / 6)

                    val metrics = image.awt().graphics.getFontMetrics(baseFont)
                    val vector = baseFont.createGlyphVector(metrics.fontRenderContext, text)

                    val expectedWidth = vector.outline.bounds.width
                    val expectedHeight = vector.outline.bounds.height
                    val captionHeight = (expectedHeight * 1.8).roundToInt()

                    return image.resizeTo(
                        /* targetWidth = */ width,
                        /* targetHeight = */ height + captionHeight,
                        /* position = */ Position.BottomLeft,
                        /* background = */ if (dark) java.awt.Color.BLACK else java.awt.Color.WHITE
                    ).toCanvas().draw(
                        Text(
                            text,
                            (width - expectedWidth) / 2,
                            (captionHeight - metrics.height) / 2 + metrics.ascent
                        ) { g ->
                            g.font = baseFont
                            g.color = if (dark) java.awt.Color.WHITE else java.awt.Color.BLACK
                            g.setAntiAlias(true)
                        }
                    ).image
                }

                val byteArray = httpClient.get(attachment.url).readBytes()

                fun mutate(
                    kFunction: (ByteArray, (frame: ImmutableImage) -> ImmutableImage) -> ByteReadChannel
                ) = ChannelProvider { kFunction(byteArray, ::block) }

                val file = if (attachment.filename.endsWith(".gif")) {
                    NamedFile(
                        name = "h.gif",
                        contentProvider = mutate(::mutateGif)
                    )
                } else {
                    NamedFile(
                        name = "h.png",
                        contentProvider = mutate(::mutateImage)
                    )
                }

                respond {
                    files += file
                }
            }
        }
    }

    private class CaptionArgs : Arguments() {
        val attachment by attachment {
            name = "attachment"
            description = "The image to caption"

            validate {
                //                failIf("GIFs are not supported at this time") {
                //                    value.filename.endsWith(".gif")
                //                }

                failIf("You must provide an image") {
                    !value.isImage
                }
            }
        }
        val text by string {
            name = "text"
            description = "The text to caption with"
            minLength = 1
            maxLength = 64
        }

        val dark by defaultingBoolean {
            name = "dark"
            description = "Whether to use a dark background"
            defaultValue = false
        }
    }
}