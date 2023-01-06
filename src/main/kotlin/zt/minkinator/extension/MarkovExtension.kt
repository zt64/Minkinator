package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.DiscordRelayedException
import com.kotlindiscord.kord.extensions.checks.*
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.channel
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalBoolean
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalInt
import com.kotlindiscord.kord.extensions.components.components
import com.kotlindiscord.kord.extensions.components.ephemeralButton
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import com.kotlindiscord.kord.extensions.types.respond
import com.kotlindiscord.kord.extensions.utils.botHasPermissions
import com.kotlindiscord.kord.extensions.utils.env
import com.kotlindiscord.kord.extensions.utils.hasPermission
import com.kotlindiscord.kord.extensions.utils.selfMember
import dev.kord.common.Color
import dev.kord.common.entity.ButtonStyle
import dev.kord.common.entity.Permission
import dev.kord.common.entity.optional.value
import dev.kord.core.behavior.channel.asChannelOfOrNull
import dev.kord.core.behavior.edit
import dev.kord.core.behavior.reply
import dev.kord.core.entity.Message
import dev.kord.core.entity.channel.TextChannel
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.kordLogger
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kord.rest.builder.message.create.embed
import kotlinx.coroutines.flow.toList
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import zt.minkinator.Guild
import zt.minkinator.util.*
import java.util.*
import kotlin.random.Random

object MarkovExtension : Extension() {
    override val name = "markov"

    @OptIn(PrivilegedIntent::class)
    override val intents = mutableSetOf<Intent>(Intent.MessageContent)

    private fun markov(text: String, outputSize: Int): String {
        val words = text.lines().flatMap { line ->
            line.split(' ').filter(String::isNotBlank)
        }

        val chain = mutableMapOf<List<String>, MutableList<String>>()

        for ((index, key1) in words.withIndex()) {
            if (words.size <= index + 2) continue

            val key2 = words[index + 1]
            val word = words[index + 2]

            if (listOf(key1, key2) !in chain) {
                chain[listOf(key1, key2)] = mutableListOf(word)
            } else {
                chain[listOf(key1, key2)]!!.add(word)
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
                            append(" ${message.attachments.joinToString(" ") { it.url }}")
                        }

                        appendLine()
                    }
                }

                if (!guild.selfMember().hasPermission(Permission.SendMessages)) return@action

                if (message.mentions(kord.selfId)) {
                    val sentence = markov(dbGuild.data, (1..100).random())

                    message.reply {
                        content = sentence

//                        allowedMentions {
//                            repliedUser = true
//                        }
                    }

                    kordLogger.info("Sent markov sentence in ${guild.name}: $sentence")
                } else if (Random.nextFloat() < 0.008) {
                    val sentence = markov(dbGuild.data, (1..100).random())

                    message.channel.createMessage(sentence)

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

            class TrainArguments : Arguments() {
                val channel by channel {
                    name = "channel"
                    description = "Channel to train on"
                }
                val maxMessages by optionalInt {
                    name = "max-messages"
                    description = "Maximum number of messages to train on"
                    minValue = 0
                }
            }

            chatCommand(
                name = "train-markov",
                description = "Train markov on past messages",
                arguments = ::TrainArguments
            ) {
                check {
                    failIf("You must be granted access to this command.") {
                        userFor(event)!!.id.value != env("SUPER_USER_ID").toULong()
                    }
                }

                action {
                    val channel = arguments.channel.asChannelOfOrNull<TextChannel>() ?: throw DiscordRelayedException("Channel must be a text channel.")
                    if (!channel.botHasPermissions(Permission.ReadMessageHistory)) {
                        throw DiscordRelayedException("Bot does not have permission to read message history in ${channel.mention}.")
                    }

                    val msg = message.channel.createMessage("Training...")
                    val messages = channel.messages.toList()
                    val newData = messages.joinToString("\n", transform = Message::content)

                    val guildId = channel.guildId
                    val dbGuild = transaction {
                        Guild.findById(guildId.value.toLong()) ?: Guild.new(guildId.value.toLong()) { }
                    }

                    transaction {
                        dbGuild.data += "\n$newData"
                    }

                    msg.edit {
                        content = "Trained using ${messages.size} ${"message".pluralize(messages.size)}"
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