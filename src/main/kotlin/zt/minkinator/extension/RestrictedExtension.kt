package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.editingPaginator
import com.kotlindiscord.kord.extensions.types.respond
import com.kotlindiscord.kord.extensions.utils.env
import dev.kord.common.Color
import dev.kord.gateway.Intent
import dev.kord.rest.builder.message.create.embed
import kotlinx.coroutines.flow.toList
import zt.minkinator.util.ephemeralSlashCommand
import zt.minkinator.util.success
import java.net.InetAddress
import kotlin.time.Duration.Companion.milliseconds

object RestrictedExtension : Extension() {
    override val name = "restricted"
    override val intents = mutableSetOf<Intent>(Intent.Guilds)

    private val testingGuildId = env("TESTING_GUILD_ID").toLong()

    override suspend fun setup() {
        ephemeralSlashCommand(
            name = "stop",
            description = "Stop the bot"
        ) {
            guild(testingGuildId)

            check {

            }

            action {
                respond { content = "Stopping..." }

                this@RestrictedExtension.kord.shutdown()
            }
        }

        ephemeralSlashCommand(
            name = "stats",
            description = "Get bot information"
        ) {
            guild(testingGuildId)

            check {

            }

            action {
                respond {
                    embed {
                        title = "Bot Stats"
                        color = Color.success
                        description = buildString {
                            appendLine("IP: ${InetAddress.getLocalHost().hostAddress}")
                            appendLine("Uptime: ${System.currentTimeMillis().milliseconds}}")
                            appendLine("Hostname: ${InetAddress.getLocalHost().hostName}")
                        }
                    }
                }
            }
        }

        ephemeralSlashCommand(
            name = "guilds",
            description = "Get guilds"
        ) {
            guild(testingGuildId)

            check {

            }

            action {
                val guilds = this@RestrictedExtension.kord.guilds.toList()
                val guildCount = guilds.size

                val paginator = editingPaginator {
                    guilds.chunked(10).forEach { guilds ->
                        page {
                            color = Color.success
                            title = "Guilds (${guildCount})"

                            guilds.forEach { guild ->
                                field {
                                    name = "${guild.name} (${guild.id.value})"
                                    value = "${guild.memberCount} members"
                                    inline = true
                                }
                            }
                        }
                    }
                }

                paginator.send()
            }
        }
    }
}