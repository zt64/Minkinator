package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.rest.builder.message.MessageBuilder
import dev.kord.rest.builder.message.embed
import dev.kordex.core.components.components
import dev.kordex.core.components.publicButton
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.zt64.minkinator.i18n.Translations
import dev.zt64.minkinator.util.field
import dev.zt64.minkinator.util.publicSlashCommand
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.datetime.format
import kotlinx.datetime.format.DateTimeComponents
import kotlinx.serialization.Serializable
import org.koin.core.component.inject
import kotlin.time.ExperimentalTime
import kotlin.time.Instant

object GeneralExtension : Extension() {
    override val name: String = "general"

    private val start = System.currentTimeMillis()
    private val httpClient: HttpClient by inject()

    private const val VNC_BASE_URL = "https://computernewb.com/vncresolver/api/v1"

    @OptIn(ExperimentalTime::class)
    override suspend fun setup() {
        publicSlashCommand(
            name = "stats".toKey(),
            description = "Get the bot's stats".toKey()
        ) {
            action {
                respond {
                    embed {
                        color = Color(0x7289DA)

                        field("Bot started", true) {
                            val uptime = System.currentTimeMillis() - start

                            "${uptime / 1000 / 60}:${uptime / 1000 % 60}"
                        }
                        field("CPU Usage", true) {
                            val runtime = Runtime.getRuntime()
                            val availableProcessors = runtime.availableProcessors()
                            val cpuUsage = (availableProcessors - runtime.availableProcessors()) / availableProcessors * 100

                            "$cpuUsage%"
                        }
                        field("Memory Usage", true) {
                            val runtime = Runtime.getRuntime()
                            val totalMemory = runtime.totalMemory()
                            val freeMemory = runtime.freeMemory()
                            val usedMemory = totalMemory - freeMemory

                            "${usedMemory / 1024 / 1024}MB"
                        }

                        field("Kotlin Version", true) { KotlinVersion.CURRENT.toString() }

                        thumbnail {
                            url = this@GeneralExtension.kord.getSelf().avatar?.cdnUrl?.toUrl()!!
                        }
                    }
                }
            }
        }

        publicSlashCommand(
            name = "vnc".toKey(),
            description = "Get a random unsecured vnc image".toKey()
        ) {
            allowInDms = true
            guild(null)

            action {
                @Serializable
                data class VNC(
                    val asn: String,
                    val desktop_name: String?,
                    val geo_city: String,
                    val geo_country: String,
                    val geo_state: String,
                    val height: Int,
                    val id: Int,
                    val ip_address: String,
                    val password: String,
                    val port: Int,
                    val rdns_hostname: String?,
                    val scanned_on: Int,
                    val width: Int
                )

                var vnc = httpClient.get("$VNC_BASE_URL/random").body<VNC>()

                respond {
                    fun MessageBuilder.updateEmbed() {
                        embed {
                            image = "$VNC_BASE_URL/screenshot/${vnc.id}"
                            title = "${vnc.ip_address}:${vnc.port}"
                            url = "https://computernewb.com/vncresolver/browse#id/${vnc.id}"

                            field("Where", "${vnc.geo_city}, ${vnc.geo_state}, ${vnc.geo_country}", true)
                            field("Desktop Name", vnc.desktop_name.orEmpty().ifEmpty { "Unknown" }, true)
                            field("Screen Resolution", "${vnc.width}x${vnc.height}", true)
                            field("Hostname", vnc.rdns_hostname ?: "Unknown", true)

                            footer {
                                text = Instant.fromEpochMilliseconds(vnc.scanned_on.toLong()).format(
                                    DateTimeComponents.Formats.RFC_1123
                                )
                            }
                        }
                    }
                    updateEmbed()

                    components {
                        publicButton {
                            label = Translations.Button.refresh
                            action {
                                vnc = httpClient.get("$VNC_BASE_URL/random").body<VNC>()
                                edit {
                                    updateEmbed()
                                }
                            }
                        }
                    }
                }
            }
        }

        publicSlashCommand(Translations.Command.map, Translations.Command.Description.map) {
            action {
                respond {
                    embed {
                    }
                }
            }
        }
    }
}