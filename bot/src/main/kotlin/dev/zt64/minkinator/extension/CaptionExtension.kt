package dev.zt64.minkinator.extension

import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.Position
import com.sksamuel.scrimage.canvas.drawables.Text
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.attachment
import dev.kordex.core.commands.converters.impl.defaultingBoolean
import dev.kordex.core.commands.converters.impl.string
import dev.kordex.core.extensions.Extension
import dev.zt64.minkinator.extension.media.mutateGif
import dev.zt64.minkinator.extension.media.mutateImage
import dev.zt64.minkinator.util.publicSlashCommand
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import org.koin.core.component.inject
import java.awt.Color
import java.awt.Font

object CaptionExtension : Extension() {
    override val name = "caption"

    private val httpClient: HttpClient by inject()

    private const val FONT_NAME = "Futura Extra Black Condensed"

    override suspend fun setup() {
        publicSlashCommand(
            name = "caption",
            description = "Caption an image or gif",
            arguments = CaptionExtension::CaptionArgs
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

                    val textFits = image.width >= expectedWidth && image.height >= expectedHeight

                    val widthBasedFontSize = (baseFont.size2D * image.width) / expectedWidth
                    val heightBasedFontSize = (baseFont.size2D * image.height) / expectedHeight

                    val newFontSize = (if (widthBasedFontSize < heightBasedFontSize) widthBasedFontSize else heightBasedFontSize).toDouble()
                    val newFont = baseFont.deriveFont(baseFont.style, newFontSize.toFloat())
                    val captionHeight = expectedHeight * 3

                    return image
                        .resizeTo(
                            // targetWidth =
                            width,
                            // targetHeight =
                            height + captionHeight,
                            // position =
                            Position.Center,
                            // background =
                            if (dark) Color.BLACK else Color.WHITE
                        ).toCanvas()
                        .apply {
                            drawInPlace(
                                Text(
                                    text,
                                    (width - expectedWidth) / 2,
                                    (captionHeight - metrics.height) / 2 + metrics.ascent
                                ) { g ->
                                    g.font = baseFont
                                    g.color = if (dark) Color.WHITE else Color.BLACK
                                    g.setAntiAlias(true)
                                }
                            )
                        }.image
                }

                val mutatedByteArray = httpClient.get(attachment.url).readBytes().let {
                    if (attachment.filename.endsWith(".gif")) {
                        mutateGif(it, ::block)
                    } else {
                        mutateImage(it, ::block)
                    }
                }

                respond {
                    addFile(
                        name = attachment.filename,
                        contentProvider = ChannelProvider { mutatedByteArray }
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