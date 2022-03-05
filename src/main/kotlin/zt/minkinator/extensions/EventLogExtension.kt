package zt.minkinator.extensions

import com.kotlindiscord.kord.extensions.checks.guildFor
import com.kotlindiscord.kord.extensions.checks.userFor
import com.kotlindiscord.kord.extensions.commands.events.SlashCommandSucceededEvent
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import dev.kord.core.behavior.channel.asChannelOf
import dev.kord.core.entity.channel.TextChannel
import dev.kord.core.event.gateway.ReadyEvent
import dev.kord.core.event.guild.MemberJoinEvent
import dev.kord.core.event.guild.MemberLeaveEvent
import dev.kord.core.kordLogger

class EventLogExtension(override val name: String = "event-log") : Extension() {
    override suspend fun setup() {
        event<ReadyEvent> {
            action {
                kordLogger.info("Ready!")
            }
        }

        event<MemberJoinEvent> {
            action {
                val guild = guildFor(event)!!.asGuild()

                if (userFor(event)!! == kord.getSelf()) kordLogger.info("Added to ${guild.name}")
            }
        }

        event<MemberLeaveEvent> {
            action {
                val guild = guildFor(event)!!.asGuild()

                if (userFor(event) == kord.getSelf()) kordLogger.info("Removed from ${guild.name}")
            }
        }

        event<SlashCommandSucceededEvent<*>> {
            action {
                val interaction = event.event.interaction
                val command = event.command
                val channel = interaction.getChannel().asChannelOf<TextChannel>()

                kordLogger.info(buildString {
                    append("${channel.getGuild().name} ")
                    append("${channel.name} ${interaction.user.asUser().username}: ")

                    command.parentCommand?.let { append("${it.name} ") }
                    command.parentGroup?.parent?.let { append("${it.name} ") }
                    append("${command.name} ")

                    append(
                        interaction.command.options.map { (name, optionValue) ->
                            "$name: ${optionValue.value}"
                        }.joinToString()
                    )
                })
            }
        }
    }
}