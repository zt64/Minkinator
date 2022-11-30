package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.commands.events.ChatCommandInvocationEvent
import com.kotlindiscord.kord.extensions.commands.events.SlashCommandInvocationEvent
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import dev.kord.core.entity.channel.GuildChannel
import dev.kord.core.event.gateway.ReadyEvent
import dev.kord.core.event.guild.MemberJoinEvent
import dev.kord.core.event.guild.MemberLeaveEvent
import dev.kord.core.kordLogger

class EventLogExtension(override val name: String = "event-log") : Extension() {
    override suspend fun setup() {
        val self = kord.getSelf()

        event<ReadyEvent> {
            action {
                kordLogger.info("Ready!")
            }
        }

        event<MemberJoinEvent> {
            action {
                if (event.member == self) {
                    kordLogger.info("Added to ${event.getGuild().name}")
                }
            }
        }

        event<MemberLeaveEvent> {
            action {
                if (event.user == self) {
                    kordLogger.info("Removed from ${event.getGuild().name}")
                }
            }
        }

        event<SlashCommandInvocationEvent<*>> {
            action {
                val interaction = event.event.interaction
                val command = event.command
                val channel = interaction.getChannel()

                kordLogger.info(
                    buildString {
                        if (channel is GuildChannel) {
                            append("${channel.getGuild().name} #${channel.name} ")
                        }

                        append("${interaction.user.tag}: ")


                        if (command.parentGroup != null) {
                            append("${command.parentGroup!!.parent.name} ")
                            append("${command.parentGroup!!.name} ")
                        } else {
                            append("${command.parentCommand?.name!!} ")
                            append("${command.name} ")
                        }

                        append(
                            interaction.command.options.map { (name, optionValue) ->
                                "$name: ${optionValue.value}"
                            }.joinToString()
                        )
                    }
                )
            }
        }

        event<ChatCommandInvocationEvent> {
            action {
                val message = event.event.message
                val channel = message.getChannel()

                kordLogger.info(
                    buildString {
                        if (channel is GuildChannel) {
                            append("${channel.getGuild().name} #${channel.name} ")
                        }

                        append("${message.author!!.tag} ${message.content}")
                    }
                )
            }
        }
    }
}