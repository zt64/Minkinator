package dev.zt64.minkinator.extension

import dev.kord.rest.builder.message.embed
import dev.kordex.core.DiscordRelayedException
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.optionalAttachment
import dev.kordex.core.commands.converters.impl.optionalString
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.zt64.minkinator.util.publicSlashCommand
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.utils.io.jvm.javaio.*
import net.sourceforge.tess4j.ITessAPI
import net.sourceforge.tess4j.Tesseract
import org.koin.core.component.inject
import javax.imageio.ImageIO

object OcrExtension : Extension() {
    override val name = "ocr"

    private val httpClient: HttpClient by inject()
    private val tess = Tesseract().apply {
        val resourcePath = Thread.currentThread().contextClassLoader.getResource("tessdata")?.path
        setDatapath(resourcePath ?: throw IllegalStateException("tessdata not found in resources"))
        setLanguage("eng")
    }

    class OcrArgs : Arguments() {
        val link by optionalString {
            name = "link".toKey()
            description = "The link to the image to apply the filter to".toKey()
        }
        val attachment by optionalAttachment {
            name = "attachment".toKey()
            description = "The image or gif to apply the filter to".toKey()
        }
    }

    override suspend fun setup() {
        publicSlashCommand("ocr".toKey(), "Identify text content in an image using OCR".toKey(), ::OcrArgs) {
            action {
                val image = when {
                    arguments.link != null -> {
                        httpClient.get(arguments.link!!).bodyAsChannel()
                    }
                    arguments.attachment != null -> {
                        httpClient.get(arguments.attachment!!.url).bodyAsChannel()
                    }
                    else -> {
                        throw DiscordRelayedException("No image provided".toKey())
                    }
                }

                val bi = ImageIO.read(image.toInputStream())
                val r = tess.getWords(bi, ITessAPI.TessPageIteratorLevel.RIL_BLOCK).toList().drop(2).dropLast(3)

                respond {
                    embed {
                        title = "OCR Testing"
                        description = r.joinToString("\n")
                    }
                }
            }
        }
    }
}