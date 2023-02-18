package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.commands.application.slash.EphemeralSlashCommandContext
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.editingPaginator
import com.kotlindiscord.kord.extensions.types.respond
import com.kotlindiscord.kord.extensions.utils.env
import dev.kord.common.Color
import dev.kord.gateway.Intent
import dev.kord.rest.builder.message.create.embed
import kotlinx.coroutines.flow.toList
import zt.minkinator.util.ephemeralSlashCommand
import zt.minkinator.util.field
import zt.minkinator.util.isSuperuser
import zt.minkinator.util.success
import java.net.InetAddress
import kotlin.time.Duration.Companion.milliseconds

object RestrictedExtension : Extension() {
    override val name = "restricted"
    override val intents = mutableSetOf<Intent>(Intent.Guilds)

    private val testingGuildId = env("TESTING_GUILD_ID").toLong()

    override suspend fun setup() {
        suspend fun command(
            name: String,
            description: String,
            block: suspend EphemeralSlashCommandContext<*, *>.() -> Unit
        ) = ephemeralSlashCommand(name, description) {
            guild(testingGuildId)

            check {
                isSuperuser()
            }

            action {
                block()
            }
        }

        command("stop", "Stop the bot") {
            respond { content = "Stopping..." }

            kord.shutdown()
        }

        command("stats", "Get bot information") {
            respond {
                embed {
                    color = Color.success
                    title = "Bot Stats"
                    description = buildString {
                        appendLine("IP: ${InetAddress.getLocalHost().hostAddress}")
                        appendLine("Uptime: ${System.currentTimeMillis().milliseconds}}")
                        appendLine("Hostname: ${InetAddress.getLocalHost().hostName}")
                    }
                }
            }
        }

        command("guilds", "Get guilds") {
            val guilds = kord.guilds.toList()

            editingPaginator {
                guilds.chunked(10).forEach { guilds ->
                    page {
                        color = Color.success
                        title = "Guilds (${guilds.size})"

                        guilds.forEach { guild ->
                            field(
                                name = "${guild.name} (${guild.id.value})",
                                value = "${guild.memberCount} members",
                                inline = true
                            )
                        }
                    }
                }
            }.send()
        }

        command("db", "Database related commands") {
            respond { content = "Not implemented yet" }
        }
    }
}