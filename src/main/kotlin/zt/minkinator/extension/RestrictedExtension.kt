package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.chat.ChatCommandContext
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.utils.env
import dev.kord.common.Color
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.edit
import dev.kord.core.behavior.reply
import dev.kord.gateway.Intent
import dev.kord.rest.builder.message.EmbedBuilder
import dev.kord.rest.builder.message.create.embed
import dev.kord.rest.builder.message.modify.embed
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.toList
import zt.minkinator.util.*
import java.net.InetAddress
import java.util.concurrent.TimeUnit
import kotlin.time.Duration.Companion.milliseconds

object RestrictedExtension : Extension() {
    override val name = "restricted"
    override val intents = mutableSetOf<Intent>(Intent.Guilds)

    private val testingGuildId = Snowflake(env("TESTING_GUILD_ID"))

    override suspend fun setup() {
        suspend fun command(
            name: String,
            description: String,
            block: suspend ChatCommandContext<out Arguments>.() -> Unit
        ) = chatCommand(name, description) {
            check {
                isSuperuser()
            }

            action {
                block()
            }
        }

        command("stop", "Stop the bot") {
            message.reply("Stopping...")

            kord.shutdown()
        }

        command("stats", "Get bot information") {
            message.reply {
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

            message.reply {
                paginator {
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
        }

        command("db", "Database related commands") {
            message.reply("Not implemented yet")
        }

        command("exec", "Execute a command") {
            if (argString.isBlank()) throw IllegalArgumentException("No command provided")

            withContext(Dispatchers.IO) {
                val lines = mutableListOf<String>()

                val embed = message.reply {
                    embed {
                        title = "Executing command..."
                    }
                }

                fun editEmbed(block: EmbedBuilder.() -> Unit = {}) {
                    launch {
                        embed.edit {
                            embed {
                                description = lines.joinToString("\n")
                                block()
                            }
                        }
                    }
                }

                val process = ProcessBuilder(argString.split(" "))
                    .redirectErrorStream(true)
                    .start()

                val job = launch {
                    while (isActive) {
                        editEmbed()
                        delay(1000)
                    }
                }

                process.inputReader().use {
                    it.forEachLine { line -> lines += line }
                }

                process.waitFor(10, TimeUnit.MINUTES)

                job.cancelAndJoin()

                embed.edit {
                    embed {
                        title = "Command exited with code ${process.exitValue()}"
                        color = if (process.exitValue() == 0) Color.success else Color.error
                        description = lines.joinToString("\n")
                    }
                }
            }
        }
    }
}