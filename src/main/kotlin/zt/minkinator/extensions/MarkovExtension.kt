package zt.minkinator.extensions

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.application.slash.ephemeralSubCommand
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalBoolean
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalInt
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalString
import com.kotlindiscord.kord.extensions.components.components
import com.kotlindiscord.kord.extensions.components.ephemeralButton
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.publicSlashCommand
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.rest.builder.message.create.embed
import org.jetbrains.exposed.sql.transactions.transaction
import zt.minkinator.util.success

class MarkovExtension(override val name: String = "markov") : Extension() {
    override suspend fun setup() {
        //        event<MessageCreateEvent> {
        //            check {
        //                anyGuild() // check if channel is enabled for markov
        //                isNotBot()
        //                // failIf(channelFor(event))
        //            }
        //
        //            action {
        //                val message = messageFor(event)!!.asMessage()
        //                val guild = guildFor(event)!!
        //
        //                val newData = buildString {
        //                    append(message.content.replace(guild.selfMember().mention, "").trim())
        //
        //                    if (message.attachments.isNotEmpty()) {
        //                        append(" ${message.attachments.joinToString { it.url }}")
        //                    }
        //
        //                    append("\n")
        //                }
        //
        //                transaction {
        //                    Guild.insertIgnore {
        //                        it[id] = guild.id.toString()
        //                    }
        //
        //                    Guild.update({ Guild.id eq guild.id.toString() }) {
        //                        it[data] = concat(data, stringLiteral(newData))
        //                    }
        //                }
        //
        //                // Also check if mention setting is enabled
        //
        //                if (guild.selfMember().hasPermission(Permission.SendMessages) && message.mentions(guild.selfMember())) {
        //                    val words = transaction {
        //                        Guild.select { Guild.id eq guild.id.toString() }.single()[Guild.data].split("\\n").toMutableList().onEach { it.split(" ") }
        //                    }
        //
        //                    markov(words, 2, (10..50).random()).let { sentence ->
        //                        if (sentence.length <= 2000) {
        //                            message.reply {
        //                                allowedMentions {
        //                                    repliedUser = true
        //
        //                                    users.add(Snowflake(558481110330507294L))
        //                                }
        //                                content = sentence
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }

        publicSlashCommand {
            name = "markov"
            description = "Markov commands"

            check {
                anyGuild()
            }

            //            publicSubCommand(::GenerateArguments) {
            //                name = "generate"
            //                description = "Generate a markov string"
            //
            //                action {
            //                    val start = arguments.start
            //
            //                    respond {
            //                        content = markov(words, 2, (5..100).random())
            //                    }
            //                }
            //            }

            ephemeralSubCommand(::ConfigArguments) {
                name = "config"
                description = "Markov configuration"

                check { // Check if user has role to configure commands
                    // failIfNot
                }

                action {
                    val config = transaction {

                        // Fetch current config
                    }

                    respond {
                        embed {
                            color = Color.success
                            title = "Markov Configuration"
                        }

                        components {
                            ephemeralButton {
                                label = "Save"

                                action {
                                    transaction {

                                    }
                                }
                            }


                            ephemeralButton {
                                label = "Cancel"

                                action {
                                    transaction {

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private inner class GenerateArguments : Arguments() {
        val start by optionalString {
            name = "start"
            description = "String to start at"
        }
    }

    private inner class ConfigArguments : Arguments() {
        val enabled by optionalBoolean {
            name = "enabled"
            description = "Whether to store messages for generating strings"
        }
        val frequency by optionalInt {
            name = "frequency"
            description = "How often to speak"
        }
        val speakOnMention by optionalBoolean {
            name = "mention"
            description = "Whether pinging the bot should trigger markov"
        }
    }

    // I literally don't understand this but it works
    private fun markov(data: List<String>, keySize: Int = 1, outputSize: Int): String {
        require(outputSize in keySize..data.size) { "Output size is out of range" }

        val dict = mutableMapOf<String, MutableList<String>>()

        repeat(data.size - keySize) { index ->
            val prefix = data.subList(index, index + keySize).joinToString(" ")
            val suffix = if (index + keySize < data.size) data[index + keySize] else ""
            val suffixes = dict.getOrPut(prefix) { mutableListOf() }
            suffixes += suffix
        }

        val output = mutableListOf<String>()
        var prefix = dict.keys.random()
        output += prefix.split(' ')

        for (n in 1..data.size) {
            val nextWord = dict[prefix]?.random() ?: continue
            if (nextWord.isEmpty()) break

            output += nextWord
            if (output.size >= outputSize) break

            prefix = output.subList(n, n + keySize).joinToString(" ")
        }

        return output.take(outputSize).joinToString(" ")
    }
}