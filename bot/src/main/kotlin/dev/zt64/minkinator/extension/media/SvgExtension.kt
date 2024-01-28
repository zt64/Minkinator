package dev.zt64.minkinator.extension.media

import com.kotlindiscord.kord.extensions.DiscordRelayedException
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.string
import com.kotlindiscord.kord.extensions.extensions.Extension
import dev.kord.core.behavior.reply
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

        chatCommand("svg", "", ::SvgArgs) {
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
                        throw DiscordRelayedException("An error occurred while parsing the SVG. ${e.message}")
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
            name = "data"
            description = "SVG to convert"
        }
    }
}