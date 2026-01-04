package dev.zt64.minkinator.extension

import dev.kord.rest.NamedFile
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.attachment
import dev.kordex.core.extensions.Extension
import dev.kordex.i18n.toKey
import dev.zt64.minkinator.util.publicSlashCommand
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.utils.io.*
import org.koin.core.component.inject
import java.io.ByteArrayOutputStream
import javax.sound.sampled.*

object FileExtension : Extension() {
    override val name: String = "file"

    private val httpClient: HttpClient by inject()

    override suspend fun setup() {
        class PlayFileArgs : Arguments() {
            val file by attachment {
                name = "file".toKey()
                description = "The file to convert to audio".toKey()
                validate {
                    failIf("File too large (max 10MB)".toKey()) { value.size > 10_000_000 }
                }
            }
        }

        publicSlashCommand("play-file".toKey(), "Convert any file to audio".toKey(), ::PlayFileArgs) {
            action {
                val fileBytes = httpClient.get(arguments.file.url).readRawBytes()
                val audioBytes = convertToAudio(fileBytes)

                respond {
                    content = "File converted to audio (${fileBytes.size} bytes -> ${audioBytes.size / 1024}KB WAV)"
                    files += NamedFile(
                        "${arguments.file.filename}.wav",
                        ChannelProvider { ByteReadChannel(audioBytes) }
                    )
                }
            }
        }
    }

    @Suppress("ktlint:standard:comment-wrapping")
    private fun convertToAudio(data: ByteArray): ByteArray {
        val audioData = ByteArray(data.size) { i ->
            ((data[i].toInt() - 128) * 0.1).toInt().toByte()
        }

        val audioFormat = AudioFormat(
            /* sampleRate = */ 44100f,
            /* sampleSizeInBits = */ 8,
            /* channels = */ 1,
            /* signed = */ true,
            /* bigEndian = */ false
        )

        val audioInputStream = AudioInputStream(audioData.inputStream(), audioFormat, audioData.size.toLong())

        return ByteArrayOutputStream().use {
            AudioSystem.write(audioInputStream, AudioFileFormat.Type.WAVE, it)
            it.toByteArray()
        }
    }
}