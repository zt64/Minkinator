package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.DiscordRelayedException
import com.kotlindiscord.kord.extensions.checks.*
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalBoolean
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalInt
import com.kotlindiscord.kord.extensions.components.components
import com.kotlindiscord.kord.extensions.components.ephemeralButton
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import com.kotlindiscord.kord.extensions.types.respond
import com.kotlindiscord.kord.extensions.utils.hasPermission
import com.kotlindiscord.kord.extensions.utils.selfMember
import dev.kord.common.Color
import dev.kord.common.entity.ButtonStyle
import dev.kord.common.entity.Permission
import dev.kord.core.behavior.reply
import dev.kord.core.entity.Attachment
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.kordLogger
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kord.rest.builder.message.create.allowedMentions
import dev.kord.rest.builder.message.create.embed
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import zt.minkinator.Guild
import zt.minkinator.util.ephemeralSubCommand
import zt.minkinator.util.mentions
import zt.minkinator.util.publicSlashCommand
import zt.minkinator.util.success
import java.util.*

class MarkovExtension(override val name: String = "markov") : Extension() {
    @OptIn(PrivilegedIntent::class)
    override val intents: MutableSet<Intent> = mutableSetOf(Intent.MessageContent)

    private fun markov(text: String, outputSize: Int): String {
        val words = text.lines().flatMap { line ->
            line.split(' ').filter(String::isNotBlank)
        }

        println("Corpus size: ${words.size} words")

        val chain = mutableMapOf<List<String>, MutableList<String>>()

        val numWords = words.size
        for ((index, key1) in words.withIndex()) {
            if (numWords > index + 2) {
                val key2 = words[index + 1]
                val word = words[index + 2]

                if (listOf(key1, key2) !in chain) {
                    chain[listOf(key1, key2)] = mutableListOf(word)
                } else {
                    chain[listOf(key1, key2)]!!.add(word)
                }
            }
        }

        return buildString {
            val random = words.indices.random()
            var key = listOf(words[random], words[random + 1])

            while (length < outputSize) {
                val w = chain[key]?.random() ?: break
                append(" $w")
                key = listOf(key[1], w)
            }
        }
    }

    override suspend fun setup() {
        event<MessageCreateEvent> {
            check {
                anyGuild()
                isNotBot()
                failIfNot {
                    guildFor(event)?.selfMember()?.hasPermission(Permission.SendMessages) ?: false
                }
                // Buddy.net whitelist
                // inGuild(Snowflake(664479042161999894))
            }

            action {
                val message = event.message
                val guild = event.getGuild()!!

                val dbGuild = transaction {
                    Guild.findById(event.guildId!!.value.toLong()) ?: Guild.new(event.guildId!!.value.toLong()) { }
                }

                newSuspendedTransaction {
                    dbGuild.data += buildString {
                        append(message.content.replace(guild.selfMember().mention, "").trim())

                        if (message.attachments.isNotEmpty()) {
                            append(" ${message.attachments.joinToString(separator = " ", transform = Attachment::url)}")
                        }

                        appendLine()
                    }
                }

                if (guild.selfMember().hasPermission(Permission.SendMessages) && message.mentions(kord.selfId)) {
                    val sentence = markov(dbGuild.data, (1..100).random())

                    message.reply {
                        content = sentence

                        allowedMentions {
                            repliedUser = true
                        }
                    }

                    kordLogger.info("Sent markov sentence in ${guild.name}: $sentence")
                }
            }
        }

        publicSlashCommand(
            name = "markov",
            description = "Markov commands"
        ) {
            check {
                anyGuild()
            }

            ephemeralSubCommand(
                name = "config",
                description = "Markov configuration",
                arguments = ::ConfigArguments
            ) {

                check {
                    // Check if user has role to configure commands
                }

                action {
                    val enabled = arguments.enabled
                    val frequency = arguments.frequency
                    val speakOnMention = arguments.speakOnMention

                    if (enabled == null && frequency == null && speakOnMention == null) {
                        throw DiscordRelayedException("You must specify at least one argument to change.")
                    }

                    respond {
                        fun configureEmbed() = embed {
                            color = Color.success
                            title = "Markov Configuration"

                            description = buildString {
                                appendLine("Save changes?")

                                if (enabled != null) {
                                    appendLine("Enabled: prevValue -> $enabled")
                                }

                                if (frequency != null) {
                                    appendLine("Frequency: prevValue -> $frequency")
                                }

                                if (speakOnMention != null) {
                                    appendLine("Speak on mention: prevValue -> $speakOnMention")
                                }
                            }
                        }

                        configureEmbed()

                        components {
                            ephemeralButton {
                                style = ButtonStyle.Primary
                                label = "Save"

                                action {
                                    respond {
                                        content = "Saved!"
                                    }
                                }
                            }

                            ephemeralButton {
                                style = ButtonStyle.Secondary
                                label = "Cancel"

                                action {

                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private class ConfigArguments : Arguments() {
        val enabled by optionalBoolean {
            name = "enabled"
            description = "Whether to store messages for generating strings"
        }
        val frequency by optionalInt {
            name = "frequency"
            description = "How often to speak"
            minValue = 0
            maxValue = 100
        }
        val speakOnMention by optionalBoolean {
            name = "mention"
            description = "Whether pinging the bot should trigger markov"
        }
    }
}