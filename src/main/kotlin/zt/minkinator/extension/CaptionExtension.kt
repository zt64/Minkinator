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
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import org.koin.core.component.inject
import zt.minkinator.extension.media.mutateGif
import zt.minkinator.extension.media.mutateImage
import zt.minkinator.util.publicSlashCommand
import java.awt.Color
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
                        /* background = */ if (dark) Color.BLACK else Color.WHITE
                    ).toCanvas().draw(
                        Text(
                            text,
                            (width - expectedWidth) / 2,
                            (captionHeight - metrics.height) / 2 + metrics.ascent
                        ) {
                            with(it) {
                                font = baseFont
                                color = if (dark) Color.WHITE else Color.BLACK
                                setAntiAlias(true)
                            }
                        }
                    ).image
                }

                val (fileName, mutator) = if (attachment.filename.endsWith(".gif")) {
                    "a.gif" to ::mutateGif
                } else {
                    "a.png" to ::mutateImage
                }

                val byteArray = httpClient.get(attachment.url).readBytes()

                respond {
                    addFile(
                        name = fileName,
                        contentProvider = ChannelProvider {
                            mutator(byteArray, ::block)
                        }
                    )
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