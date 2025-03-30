package dev.zt64.minkinator.extension.media

import dev.kord.core.behavior.reply
import dev.kordex.core.DiscordRelayedException
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.string
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.zt64.minkinator.util.chatCommand
import io.ktor.client.request.forms.*
import io.ktor.utils.io.*
import org.apache.batik.transcoder.TranscoderInput
import org.apache.batik.transcoder.TranscoderOutput
import org.apache.batik.transcoder.image.PNGTranscoder
import org.xml.sax.InputSource
import org.xml.sax.SAXException
import java.io.ByteArrayOutputStream
import java.io.StringReader
import javax.xml.parsers.DocumentBuilderFactory

object SvgExtension : Extension() {
    override val name = "svg"

    override suspend fun setup() {
        val transcoder = PNGTranscoder()

        chatCommand("svg".toKey(), "".toKey(), ::SvgArgs) {
            action {
                val input = if (arguments.data.startsWith("https") || arguments.data.startsWith("http")) {
                    TranscoderInput(arguments.data)
                } else {
                    val input = InputSource(StringReader(arguments.data))

                    val doc = try {
                        DocumentBuilderFactory
                            .newInstance()
                            .newDocumentBuilder()
                            .parse(input)
                    } catch (e: SAXException) {
                        throw DiscordRelayedException("An error occurred while parsing the SVG. ${e.message}".toKey())
                    }

                    TranscoderInput(doc)
                }

                val output = TranscoderOutput(ByteArrayOutputStream())

                transcoder.transcode(input, output)

                val provider = ChannelProvider {
                    ByteReadChannel((output.outputStream as ByteArrayOutputStream).toByteArray())
                }

                message.reply {
                    addFile("transcoded.png", provider)
                }
            }
        }
    }

    private class SvgArgs : Arguments() {
        val data by string {
            name = "data".toKey()
            description = "SVG to convert".toKey()
        }
    }
}