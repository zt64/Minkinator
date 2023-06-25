package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.DiscordRelayedException
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.chat.ChatCommand
import com.kotlindiscord.kord.extensions.commands.chat.ChatCommandContext
import com.kotlindiscord.kord.extensions.commands.converters.impl.string
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.chatGroupCommand
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
import org.koin.core.component.inject
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import zt.minkinator.util.*
import java.net.InetAddress
import java.util.concurrent.TimeUnit
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.DurationUnit
import kotlin.time.ExperimentalTime
import kotlin.time.measureTime

object RestrictedExtension : Extension() {
    override val name = "restricted"
    override val intents = mutableSetOf<Intent>(Intent.Guilds)

    private val database: R2dbcDatabase by inject()
    private val testingGuildId = Snowflake(env("TESTING_GUILD_ID"))

    @OptIn(ExperimentalTime::class)
    override suspend fun setup() {
        fun ChatCommand<*>.checkSuperuser() = check { isSuperuser() }

        suspend fun command(
            name: String,
            description: String,
            block: suspend ChatCommandContext<out Arguments>.() -> Unit
        ) = chatCommand(name, description) {
            checkSuperuser()

            action {
                block()
            }
        }

        suspend fun <T : Arguments> command(
            name: String,
            description: String,
            arguments: () -> T,
            block: suspend ChatCommandContext<out T>.() -> Unit
        ) = chatCommand(name, description, arguments) {
            checkSuperuser()

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

            paginator(targetMessage = message) {
                owner = message.author!!

                guilds.chunked(10).forEach { guilds ->
                    page {
                        color = Color.success
                        title = "Guilds (${guilds.size})"

                        guilds.forEach { guild ->
                            field(
                                name = "${guild.name} (${guild.id.value})",
                                value = "member".pluralize(guild.memberCount!!),
                                inline = true
                            )
                        }
                    }
                }
            }.send()
        }

        chatGroupCommand {
            name = "db"
            description = "Database related commands"

            checkSuperuser()

            chatCommand {
                name = "reset"

                action {
                    database.runQuery {
                        QueryDsl.drop(Meta.all())
                    }
                }
            }
        }

        command("exec", "Execute a command") {
            if (argString.isBlank()) throw IllegalArgumentException("No command provided")

            withContext(Dispatchers.IO) {
                val lines = mutableListOf<String>()

                val embed = message.reply {
                    embed {
                        description = "Executing command..."
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

                val process = ProcessBuilder("sh -c \"${argString}\"")
                    .redirectErrorStream(true)
                    .start()

                val job = launch {
                    while (isActive) {
                        editEmbed()
                        delay(1000)
                    }
                }

                process.inputStream.bufferedReader().use {
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

        class ExtensionArgs : Arguments() {
            val extension by string {
                name = "extension"
                description = "Extension to reload"

                validate {
                    failIf("Extension `$value` is not loaded") {
                        !bot.extensions.contains(value)
                    }
                }
            }
        }

        command("reload", "Reload an extension", ::ExtensionArgs) {
            val extension = arguments.extension
            val response = message.reply("Reloading extension `$extension`...")

            val duration = measureTime {
                bot.unloadExtension(extension)
                bot.loadExtension(extension)
            }

            response.edit {
                content = "Finished reloading extension `$extension` in ${duration.toString(DurationUnit.SECONDS, decimals = 2)}"
            }
        }

        command("unload", "Unload an extension", ::ExtensionArgs) {
            val extension = arguments.extension

            if (extension !in bot.extensions) throw DiscordRelayedException("Extension `$extension` not loaded")

            val response = message.reply("Unloading extension `$extension`...")

            bot.unloadExtension(extension)

            response.edit {
                content = "Finished unloading extension `$extension`"
            }
        }

        command("load", "Load an extension", ::ExtensionArgs) {
            val extension = arguments.extension

            if (extension in bot.extensions) throw DiscordRelayedException("Extension `$extension` already loaded")

            val response = message.reply("Loading extension `$extension`...")

            bot.loadExtension(extension)

            response.edit {
                content = "Finished loading extension `$extension`"
            }
        }
    }
}