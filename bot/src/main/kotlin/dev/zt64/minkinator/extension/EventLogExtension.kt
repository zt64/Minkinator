package dev.zt64.minkinator.extension

import com.kotlindiscord.kord.extensions.commands.events.ChatCommandInvocationEvent
import com.kotlindiscord.kord.extensions.commands.events.SlashCommandInvocationEvent
import com.kotlindiscord.kord.extensions.extensions.Extension
import dev.kord.core.entity.channel.GuildChannel
import dev.kord.core.event.gateway.ReadyEvent
import dev.kord.core.event.guild.MemberJoinEvent
import dev.kord.core.event.guild.MemberLeaveEvent
import dev.kord.core.kordLogger
import dev.zt64.minkinator.util.event

object EventLogExtension : Extension() {
    override val name = "event-log"

    override suspend fun setup() {
        val self = kord.getSelf()

        event<ReadyEvent> {
            kordLogger.info("Ready!")
        }

        event<MemberJoinEvent> {
            if (event.member == self) {
                kordLogger.info("Added to ${event.getGuild().name}")
            }
        }

        event<MemberLeaveEvent> {
            if (event.user == self) {
                kordLogger.info("Removed from ${event.getGuild().name}")
            }
        }

        event<SlashCommandInvocationEvent<*>> {
            val interaction = event.event.interaction
            val command = event.command
            val channel = interaction.getChannel()

            val message = buildString {
                if (channel is GuildChannel) {
                    append("${channel.getGuild().name} #${channel.name} ")
                }

                append("${interaction.user.username}: ")
                append("/")

                if (command.parentGroup != null) {
                    append("${command.parentGroup!!.parent.name} ")
                    append("${command.parentGroup!!.name} ")
                } else {
                    command.parentCommand?.let { append("${it.name} ") }
                    append("${command.name} ")
                }

                append(
                    interaction.command.options.map { (name, optionValue) ->
                        "$name: ${optionValue.value}"
                    }.joinToString()
                )
            }

            kordLogger.info(message)
        }

        event<ChatCommandInvocationEvent> {
            val message = event.event.message
            val channel = message.getChannel()

            kordLogger.info(
                buildString {
                    if (channel is GuildChannel) {
                        append("${channel.getGuild().name} #${channel.name} ")
                    }

                    append("${message.author!!.username} ${message.content}")
                }
            )
        }
    }
}