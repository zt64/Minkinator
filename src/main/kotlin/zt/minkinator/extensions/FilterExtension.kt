package zt.minkinator.extensions

import com.kotlindiscord.kord.extensions.DiscordRelayedException
import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.isNotBot
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.application.slash.ephemeralSubCommand
import com.kotlindiscord.kord.extensions.commands.application.slash.group
import com.kotlindiscord.kord.extensions.commands.converters.impl.*
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.ephemeralSlashCommand
import com.kotlindiscord.kord.extensions.extensions.event
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.rest.builder.message.create.embed
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import zt.minkinator.data.Guild

class FilterExtension(override val name: String = "filter") : Extension() {
    override suspend fun setup() {
        event<MessageCreateEvent> {
            check {
                anyGuild()
                isNotBot()
            }

            action { //                val filters = transaction {
                //                    Guild.select { Guild.id eq event.guildId!!.toString() }
                //                        .single()[Guild.filters].table
                //                        .selectAll()
                //                        .associate { it[Filter.filter] to it[Filter.action] }
                //                }
                //
                //                val message = messageFor(event)
                //
                //                message?.delete("")
            }
        }

        ephemeralSlashCommand {
            name = "filter"
            description = "Manage server filters"

            check {
                anyGuild()
            }

            group("add") {
                description = "Add a filter"

                ephemeralSubCommand(::ReplyArgs) {
                    name = "reply"
                    description = "Reply to a message"

                    action { }
                }

                ephemeralSubCommand(::TimeoutArgs) {
                    name = "timeout"
                    description = "Timeout a user"

                    action { }
                }
            }

            ephemeralSubCommand(::RemoveArgs) {
                name = "remove"
                description = "Remove a filter"

                action {

                }
            }

            ephemeralSubCommand {
                name = "list"
                description = "List all configured filters"

                action {
                    transaction {
                        Guild.select { Guild.id eq guild!!.id.toString() }
                    }

                    respond {
                        embed {

                        }
                    }
                }
            }
        }
    }


    private abstract inner class AddArgs : Arguments() {
        val filter by regex {
            name = "filter"
            description = "The filter to add. This can be a regex expression for more control"
        }
    }

    private inner class ReplyArgs : AddArgs() {
        val content by string {
            name = "content"
            description = "The message content to reply with"
        }
    }

    private inner class TimeoutArgs : AddArgs() {
        val duration by duration {
            name = "duration"
            description = "The duration to timeout the user for"
        }
        val deleteMessage by boolean {
            name = "delete-message"
            description = "Whether the message should be deleted"
        }
    }

    private inner class RemoveArgs : Arguments() {
        val id by int {
            name = "id"
            description = "The ID of the filter to remove"

            validate {
                if (value < 0) throw DiscordRelayedException("ID must be a positive integer")

                newSuspendedTransaction {
                    Guild.select { Guild.id eq context.getGuild()!!.id.toString() }.singleOrNull()
                        ?: throw DiscordRelayedException("No filter with ID $value found")
                }
            }
        }
    }
}