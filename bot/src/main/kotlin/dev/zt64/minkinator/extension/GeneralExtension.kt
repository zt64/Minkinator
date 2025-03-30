package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.rest.builder.message.embed
import dev.kordex.core.components.components
import dev.kordex.core.components.publicButton
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.zt64.minkinator.util.field
import dev.zt64.minkinator.util.publicSlashCommand
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.datetime.Instant
import kotlinx.datetime.format
import kotlinx.datetime.format.DateTimeComponents
import kotlinx.serialization.Serializable
import org.koin.core.component.inject

object GeneralExtension : Extension() {
    override val name: String = "general"

    private val start = System.currentTimeMillis()
    private val httpClient: HttpClient by inject()

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
                    val id: Int,
                    val ip: String,
                    val port: Int,
                    val city: String,
                    val state: String,
                    val country: String,
                    val clientname: String,
                    val screenres: String,
                    val hostname: String?,
                    val osname: String = "unknown",
                    val openports: String = "none",
                    val username: String = "unknown",
                    val password: String?,
                    val createdat: Long
                )

                val vnc = httpClient.get("https://computernewb.com/vncresolver/api/scans/vnc/random").body<VNC>()

                respond {
                    embed {
                        image = "https://computernewb.com/vncresolver/api/scans/vnc/screenshot/${vnc.id}"

                        field("IP", vnc.ip.toString(), true)
                        field("Port", vnc.port.toString(), true)
                        field("City", vnc.city, true)
                        field("State", vnc.state, true)
                        field("Country", vnc.country, true)
                        field("Client Name", vnc.clientname.ifEmpty { "unknown" }, true)
                        field("Screen Resolution", vnc.screenres, true)
                        field("Hostname", vnc.hostname ?: "unknown", true)
                        field("OS Name", vnc.osname, true)
                        field("Open Ports", vnc.openports, true)
                        field("Username", vnc.username, true)
                        field("Password", vnc.password ?: "NO PASSWORD", true)
                        field(
                            "Created At",
                            Instant.fromEpochMilliseconds(vnc.createdat).format(
                                DateTimeComponents.Formats.RFC_1123
                            ),
                            true
                        )
                    }

                    components {
                        publicButton {
                            label = "Refresh".toKey()
                            action { }
                        }
                    }
                }
            }
        }
    }
}