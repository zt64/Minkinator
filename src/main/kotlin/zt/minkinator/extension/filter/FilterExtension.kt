package zt.minkinator.extension.filter

import com.kotlindiscord.kord.extensions.DiscordRelayedException
import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.guildFor
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.application.slash.SlashGroup
import com.kotlindiscord.kord.extensions.commands.converters.impl.defaultingBoolean
import com.kotlindiscord.kord.extensions.commands.converters.impl.duration
import com.kotlindiscord.kord.extensions.commands.converters.impl.int
import com.kotlindiscord.kord.extensions.commands.converters.impl.string
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import com.kotlindiscord.kord.extensions.types.editingPaginator
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.common.entity.Permission
import dev.kord.core.behavior.ban
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.rest.builder.message.create.embed
import org.jetbrains.exposed.sql.transactions.transaction
import zt.minkinator.Filter
import zt.minkinator.Guild
import zt.minkinator.util.*

object FilterExtension : Extension() {
    override val name = "filter"

    override suspend fun setup() {
        event<MessageCreateEvent> {
            check {
                anyGuild()
            }

            action {
                val message = event.message
                val filters = transaction {
                    Guild.findById(event.guildId!!.value.toLong())?.filters?.toList()
                } ?: return@action

                filters.forEach { filter ->
                    val pattern = filter.pattern.toRegex()
                    val matches = pattern.findAll(message.content).toList()
                    val match = matches.firstOrNull() ?: return@forEach

                    val member = message.getAuthorAsMember()!!

                    when (filter.action) {
                        FilterAction.REPLY -> {
                            val values = match.groupValues.drop(1)
                            var newResponse = filter.response!!

                            values.forEachIndexed { index, value ->
                                newResponse = filter.response!!.replace("\$$index", value)
                            }

                            message.reply(newResponse)
                        }

                        FilterAction.WARN -> {

                        }

                        FilterAction.TIMEOUT -> {
                            // member.timeout()
                        }

                        FilterAction.KICK -> {
                            member.kick("Triggered filter ${filter.id.value}: ${message.content}")
                        }

                        FilterAction.BAN -> {
                            member.ban {
                                reason = "Triggered filter ${filter.id.value}: ${message.content}"
                            }
                        }
                    }

                    if (filter.deleteMessage) message.delete("Triggered filter ${filter.id.value}: ${message.content}")
                }
            }
        }

        ephemeralSlashCommand(
            name = "filter",
            description = "Manage server filters"
        ) {
            check {
                anyGuild()
                requirePermission(Permission.ManageMessages)
            }

            group(
                name = "add",
                description = "Add a filter"
            ) {
                suspend fun <T : Arguments> SlashGroup.filterAction(
                    name: String,
                    description: String,
                    arguments: () -> T,
                    initBlock: Filter.(arguments: T) -> Unit
                ) {
                    ephemeralSubCommand(
                        name = name,
                        description = description,
                        arguments = arguments
                    ) {
                        action {
                            val guildId = getGuild()!!.id.value.toLong()

                            transaction {
                                Filter.new {
                                    guild = Guild.findById(guildId)!!

                                    initBlock(this@action.arguments)
                                }
                            }

                            respond {
                                embed {
                                    color = Color.success
                                    title = "Added filter"
                                }
                            }
                        }
                    }
                }

                filterAction(
                    name = "reply",
                    description = "Reply to a message with a message",
                    arguments = ::ReplyArgs
                ) { arguments ->
                    action = FilterAction.REPLY
                    pattern = arguments.regex
                    response = arguments.content
                    deleteMessage = arguments.deleteMessage
                }

                filterAction(
                    name = "timeout",
                    description = "Timeout a user for a duration",
                    arguments = ::TimeoutArgs
                ) { arguments ->
                    action = FilterAction.TIMEOUT
                    pattern = arguments.regex
                    deleteMessage = arguments.deleteMessage
                }
            }

            ephemeralSubCommand(
                name = "remove",
                description = "Remove a filter",
                arguments = ::RemoveArgs
            ) {
                action {
                    val removed = transaction {
                        Filter.findById(arguments.id)?.delete() == null
                    }

                    respond {
                        content = if (removed) "Removed filter" else "Filter not found"
                    }
                }
            }

            ephemeralSubCommand(
                name = "list",
                description = "List all configured filters"
            ) {
                action {
                    val guild = guildFor(event)!!
                    val filters = transaction {
                        Guild.findById(guild.id.value.toLong())?.filters?.toList().orEmpty()
                    }

                    if (filters.isEmpty()) {
                        respond {
                            content = "No filters configured"
                        }
                    } else {
                        val paginator = editingPaginator {
                            filters.chunked(10).forEach { chunkedFilters ->
                                page {
                                    color = Color.success
                                    title = "Filters"

                                    chunkedFilters.forEach { filter ->
                                        field {
                                            name = "ID: ${filter.id.value}"
                                            value = buildString {
                                                appendLine("Pattern: `${filter.pattern}`")

                                                when (filter.action) {
                                                    FilterAction.REPLY -> {
                                                        appendLine("Response: ${filter.response}")
                                                        appendLine("Delete message: ${filter.deleteMessage}")
                                                    }

                                                    FilterAction.WARN -> {}
                                                    FilterAction.TIMEOUT -> {}
                                                    FilterAction.KICK -> {}
                                                    FilterAction.BAN -> {}
                                                }
                                            }
                                            inline = true
                                        }
                                    }
                                }
                            }
                        }

                        paginator.send()
                    }
                }
            }

            ephemeralSubCommand(
                name = "test",
                description = "Test for any matches of a given string",
                arguments = ::TestArgs
            ) {
                action {
                    val guild = guildFor(event)!!
                    val filters = transaction {
                        Guild.findById(guild.id.value.toLong())?.filters?.toList().orEmpty()
                    }

                    val matchedFilters = filters.filter { filter ->
                        filter.pattern.toRegex().matches(arguments.message)
                    }

                    respond {
                        embed {
                            if (matchedFilters.isEmpty()) {
                                color = Color.error
                                description = "No filters matched"
                            } else {
                                color = Color.success
                                description = matchedFilters.joinToString { filter ->
                                    buildString {
                                        appendLine("Filter ID: ${filter.id.value}")
                                        appendLine("Pattern: `${filter.pattern}`")

                                        when (filter.action) {
                                            FilterAction.REPLY -> {
                                                appendLine("Response: ${filter.response}")
                                                appendLine("Delete message: ${filter.deleteMessage}")
                                            }

                                            FilterAction.WARN -> {}
                                            FilterAction.TIMEOUT -> {}
                                            FilterAction.KICK -> {}
                                            FilterAction.BAN -> {}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private open class AddArgs : Arguments() {
        val regex by string {
            name = "regex"
            description = "The filter to add. This can be a regex expression for more control"

            validate {
                try {
                    value.toRegex()
                } catch (e: Exception) {
                    fail(e.message)
                }
            }
        }
    }

    private class ReplyArgs : AddArgs() {
        val content by string {
            name = "content"
            description = "The message content to reply with"
            maxLength = 2000
        }
        val deleteMessage by defaultingBoolean {
            name = "delete-message"
            description = "Whether the message should be deleted"
            defaultValue = false
        }
    }

    private class TimeoutArgs : AddArgs() {
        val duration by duration {
            name = "duration"
            description = "The duration to timeout the user for"
        }
        val deleteMessage by defaultingBoolean {
            name = "delete-message"
            description = "Whether the message should be deleted"
            defaultValue = false
        }
    }

    private class RemoveArgs : Arguments() {
        val id by int {
            name = "id"
            description = "The ID of the filter to remove"
            minValue = 0

            validate {
                transaction {
                    Filter.findById(value)?.delete() ?: throw DiscordRelayedException("Filter not found")
                }
            }
        }
    }

    private class TestArgs : Arguments() {
        val message by string {
            name = "message"
            description = "The message to test"
        }
    }
}