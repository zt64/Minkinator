package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.rest.builder.message.embed
import dev.kordex.core.DiscordRelayedException
import dev.kordex.core.extensions.Extension
import dev.kordex.core.utils.env
import dev.kordex.i18n.toKey
import dev.zt64.minkinator.i18n.Translations
import dev.zt64.minkinator.util.publicSlashCommand
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.utils.io.*
import io.ktor.utils.io.jvm.javaio.*
import kotlinx.datetime.format
import kotlinx.datetime.format.DateTimeComponents
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import org.koin.core.component.inject
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO
import kotlin.time.Clock

object SpaceExtension : Extension() {
    override val name = "space"

    private val httpClient by inject<HttpClient>()

    private const val SOLAR_CONDITIONS_URL = "https://www.hamqsl.com/solar101vhfpic.php"
    private const val APOD_URL = "https://api.nasa.gov/planetary/apod"

    override suspend fun setup() {
        publicSlashCommand(Translations.Command.hamSolar, Translations.Command.Description.hamSolar) {
            action {
                val inputImage = ImageIO.read(httpClient.get(SOLAR_CONDITIONS_URL).bodyAsChannel().toInputStream())
                val outputImage = BufferedImage(inputImage.width, inputImage.height, BufferedImage.TYPE_INT_RGB)

                outputImage.createGraphics().apply {
                    color = java.awt.Color.BLACK
                    fillRect(0, 0, outputImage.width, outputImage.height)
                    drawImage(inputImage, 0, 0, null)
                    dispose()
                }

                val outputStream = ByteArrayOutputStream()
                ImageIO.write(outputImage, "png", outputStream)

                val now = Clock.System.now().format(DateTimeComponents.Formats.ISO_DATE_TIME_OFFSET)

                respond {
                    addFile(
                        name = "$now-solar-terrestrial-data.png",
                        contentProvider = ChannelProvider { ByteReadChannel(outputStream.toByteArray()) }
                    )
                }
            }
        }

        @Serializable
        data class Apod(
            val copyright: String? = null,
            val date: String,
            val explanation: String,
            @SerialName("hdurl")
            val hdUrl: String,
            @SerialName("media_type")
            val mediaType: String,
            @SerialName("service_version")
            val serviceVersion: String,
            val title: String,
            val url: String
        )

        val nasaApiKey = env("NASA_API_KEY")
        publicSlashCommand(Translations.Command.apod, Translations.Command.Description.apod) {
            action {
                val apod = try {
                    httpClient.get(APOD_URL) {
                        parameter("api_key", nasaApiKey)
                    }.body<Apod>()
                } catch (e: HttpRequestTimeoutException) {
                    throw DiscordRelayedException("NASA APOD API timed out. Is it down?".toKey())
                } catch (e: Exception) {
                    e.printStackTrace()
                    throw DiscordRelayedException("An unknown error occurred".toKey())
                }

                respond {
                    embed {
                        title = apod.title
                        description = apod.explanation
                        image = apod.hdUrl
                        color = Color(0x1e3a8a)

                        footer {
                            text = buildString {
                                append(apod.date)
                                if (apod.copyright != null) {
                                    append("© ${apod.copyright.removeSurrounding("\n").trim()}}")
                                }
                            }
                        }
                    }
                }
            }
        }

        // publicSlashCommand(Translations.Command.spaceWeather, Translations.Command.Description.apod) {
        //     action {
        //         respond {
        //             embed {
        //                 footer {
        //                     text = "https://www.swpc.noaa.gov/"
        //                 }
        //             }
        //         }
        //     }
        // }
    }
}