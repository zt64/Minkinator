package zt.minkinator.extension.filter

import com.kotlindiscord.kord.extensions.annotations.DoNotChain
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
import com.kotlindiscord.kord.extensions.utils.timeout
import dev.kord.common.Color
import dev.kord.common.entity.Permission
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.ban
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.rest.builder.message.create.embed
import org.koin.core.component.inject
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import zt.minkinator.data.*
import zt.minkinator.util.*
import kotlin.time.Duration

object FilterExtension : Extension() {
    override val name = "filter"

    private val db: R2dbcDatabase by inject()

    private suspend fun filters(): List<Filter> {
        val store = db.runQuery {
            QueryDsl
                .from(Meta.guild)
                .innerJoin(Meta.filter) {
                    Meta.guild.id eq Meta.filter.guildId
                }
                .includeAll()
        }

        return store.guilds().singleOrNull()?.filters(store).orEmpty().toList()
    }

    @OptIn(DoNotChain::class)
    override suspend fun setup() {
        event<MessageCreateEvent> {
            check {
                anyGuild()
            }

            action {
                val message = event.message
                val filters = filters().takeUnless { it.isEmpty() } ?: return@action

                filters.forEach { filter ->
                    val pattern = filter.pattern.toRegex()
                    val matches = pattern.findAll(message.content).toList()
                    val match = matches.firstOrNull() ?: return@forEach

                    val member = message.getAuthorAsMemberOrNull()!!

                    when (filter.action) {
                        FilterAction.REPLY -> {
                            val values = match.groupValues.drop(1)
                            var newResponse = filter.response!!

                            values.forEachIndexed { index, value ->
                                newResponse = filter.response.replace("\$$index", value)
                            }

                            message.reply(newResponse)
                        }

                        FilterAction.WARN -> {
                        }

                        FilterAction.TIMEOUT -> {
                            member.timeout(
                                until = Duration.INFINITE,
                                reason = "Triggered filter: ${filter.id}: ${message.content}"
                            )
                        }

                        FilterAction.KICK -> {
                            member.kick("Triggered filter ${filter.id}: ${message.content}")
                        }

                        FilterAction.BAN -> {
                            member.ban {
                                reason = "Triggered filter ${filter.id}: ${message.content}"
                            }
                        }
                    }

                    if (filter.deleteMessage) {
                        message.delete("Triggered filter ${filter.id}: ${message.content}")
                    }
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
                    initBlock: T.(guildId: Snowflake) -> Filter
                ) {
                    ephemeralSubCommand(
                        name = name,
                        description = description,
                        arguments = arguments
                    ) {
                        action {
                            val guildId = getGuild()!!.id

                            db.runQuery {
                                QueryDsl
                                    .insert(Meta.filter)
                                    .single(initBlock(this@action.arguments, guildId))
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
                ) { guildId ->
                    Filter(
                        guildId = guildId,
                        action = FilterAction.REPLY,
                        pattern = regex,
                        response = content,
                        deleteMessage = deleteMessage
                    )
                }

                filterAction(
                    name = "timeout",
                    description = "Timeout a user for a duration",
                    arguments = ::TimeoutArgs
                ) { guildId ->
                    Filter(
                        guildId = guildId,
                        action = FilterAction.TIMEOUT,
                        pattern = regex,
                        deleteMessage = deleteMessage
                    )
                }
            }

            ephemeralSubCommand(
                name = "remove",
                description = "Remove a filter",
                arguments = ::RemoveArgs
            ) {
                action {
                    val removed = db.runQuery {
                        QueryDsl
                            .delete(Meta.filter)
                            .where {
                                Meta.filter.id eq arguments.id
                            }
                    } > 0

                    respond {
                        content = if (removed) "Removed filter" else "Filter not found"
                    }
                }
            }

            fun Filter.print() = buildString {
                appendLine("Filter ID: $id")
                appendLine("Pattern: `$pattern`")

                when (action) {
                    FilterAction.REPLY -> {
                        appendLine("Response: $response")
                        appendLine("Delete message: $deleteMessage")
                    }

                    FilterAction.WARN -> {}
                    FilterAction.TIMEOUT -> {}
                    FilterAction.KICK -> {}
                    FilterAction.BAN -> {}
                }
            }

            ephemeralSubCommand(
                name = "list",
                description = "List all configured filters"
            ) {
                action {
                    val guild = guildFor(event)!!
                    val filters = filters()

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
                                        field(
                                            name = "ID: ${filter.id}",
                                            value = filter.print(),
                                            inline = true
                                        )
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
                    val matchedFilters = filters().filter { filter ->
                        filter.pattern.toRegex().matches(arguments.message)
                    }

                    respond {
                        embed {
                            if (matchedFilters.isEmpty()) {
                                color = Color.error
                                description = "No filters matched"
                            } else {
                                color = Color.success
                                description = matchedFilters.joinToString(transform = Filter::print)
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
        }
    }

    private class TestArgs : Arguments() {
        val message by string {
            name = "message"
            description = "The message to test"
        }
    }
}