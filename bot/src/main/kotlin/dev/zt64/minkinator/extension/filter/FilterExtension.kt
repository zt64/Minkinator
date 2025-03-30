package dev.zt64.minkinator.extension.filter

import dev.kord.common.Color
import dev.kord.common.entity.Permission
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.ban
import dev.kord.core.entity.Guild
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.rest.builder.message.embed
import dev.kordex.core.annotations.DoNotChain
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.checks.guildFor
import dev.kordex.core.checks.isNotBot
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.application.slash.SlashGroup
import dev.kordex.core.commands.converters.impl.*
import dev.kordex.core.extensions.Extension
import dev.kordex.core.extensions.event
import dev.kordex.core.i18n.toKey
import dev.kordex.core.i18n.types.Key
import dev.kordex.core.utils.timeout
import dev.zt64.minkinator.data.DBFilter
import dev.zt64.minkinator.data.FilterAction
import dev.zt64.minkinator.data.filter
import dev.zt64.minkinator.util.*
import org.koin.core.component.inject
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import kotlin.time.Duration

object FilterExtension : Extension() {
    override val name = "filter"

    private val db: R2dbcDatabase by inject()

    private suspend fun Guild.filters(): List<DBFilter> = db.runQuery {
        QueryDsl
            .from(Meta.filter)
            .where { Meta.filter.guildId eq id }
    }

    override suspend fun setup() {
        event<MessageCreateEvent> {
            check {
                anyGuild()
                isNotBot()
            }

            action {
                val message = event.message
                val filters = event.getGuildOrNull()!!.filters()

                if (filters.isEmpty()) return@action

                filters.asSequence().forEach { filter ->
                    val pattern = filter.pattern.toRegex()
                    val matches = pattern.findAll(message.content).toList()
                    val match = matches.firstOrNull() ?: return@forEach
                    val member = message.getAuthorAsMemberOrNull()!!

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
                            @OptIn(DoNotChain::class)
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
                        try {
                            message.delete("Triggered filter ${filter.id}: ${message.content}")
                        } catch (e: Exception) {
                            bot.logger.error(e) { "Failed to delete message" }
                        }
                    }
                }
            }
        }

        ephemeralSlashCommand(
            name = "filter".toKey(),
            description = "Manage server filters".toKey()
        ) {
            check {
                anyGuild()
                requirePermission(Permission.ManageMessages)
            }

            group(
                name = "add".toKey(),
                description = "Add a filter".toKey()
            ) {
                suspend fun <T : Arguments> SlashGroup.filterAction(
                    name: Key,
                    description: Key,
                    arguments: () -> T,
                    initBlock: T.(guildId: Snowflake) -> DBFilter
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
                                    .single(this@action.arguments.initBlock(guildId))
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
                    name = "reply".toKey(),
                    description = "Reply to a message with a message".toKey(),
                    arguments = FilterExtension::ReplyArgs
                ) { guildId ->
                    DBFilter(
                        guildId = guildId,
                        action = FilterAction.REPLY,
                        pattern = regex,
                        response = content,
                        deleteMessage = deleteMessage
                    )
                }

                filterAction(
                    name = "timeout".toKey(),
                    description = "Timeout a user for a duration".toKey(),
                    arguments = FilterExtension::TimeoutArgs
                ) { guildId ->
                    DBFilter(
                        guildId = guildId,
                        action = FilterAction.TIMEOUT,
                        pattern = regex,
                        deleteMessage = deleteMessage
                    )
                }
            }

            ephemeralSubCommand(
                name = "remove".toKey(),
                description = "Remove a filter".toKey(),
                arguments = FilterExtension::RemoveArgs
            ) {
                action {
                    val removed = db.runQuery {
                        QueryDsl
                            .delete(Meta.filter)
                            .where { Meta.filter.id eq arguments.id }
                    } > 0

                    respond {
                        content = if (removed) "Removed filter" else "Filter not found"
                    }
                }
            }

            fun DBFilter.print(): String {
                return buildString {
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
            }

            ephemeralSubCommand(
                name = "list".toKey(),
                description = "List all configured filters".toKey()
            ) {
                action {
                    val guild = guildFor(event)!!
                    val filters = guild.asGuild().filters()

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
                name = "test".toKey(),
                description = "Test for any matches of a given string".toKey(),
                arguments = FilterExtension::TestArgs
            ) {
                action {
                    val guild = guildFor(event)!!
                    val matchedFilters = guild.asGuild().filters().filter { filter ->
                        filter.pattern.toRegex().matches(arguments.message)
                    }

                    respond {
                        embed {
                            if (matchedFilters.isEmpty()) {
                                color = Color.error
                                description = "No filters matched"
                            } else {
                                color = Color.success
                                description = matchedFilters.joinToString(transform = DBFilter::print)
                            }
                        }
                    }
                }
            }
        }
    }

    private open class AddArgs : Arguments() {
        val regex by string {
            name = "regex".toKey()
            description = "The filter to add. This can be a regex expression for more control".toKey()

            validate {
                try {
                    value.toRegex()
                } catch (e: Exception) {
                    fail(e.message ?: "Failed")
                }
            }
        }
    }

    private class ReplyArgs : AddArgs() {
        val content by string {
            name = "content".toKey()
            description = "The message content to reply with".toKey()
            maxLength = 2000
        }
        val deleteMessage by defaultingBoolean {
            name = "delete-message".toKey()
            description = "Whether the message should be deleted".toKey()
            defaultValue = false
        }
    }

    private class TimeoutArgs : AddArgs() {
        val duration by duration {
            name = "duration".toKey()
            description = "The duration to timeout the user for".toKey()
        }
        val deleteMessage by defaultingBoolean {
            name = "delete-message".toKey()
            description = "Whether the message should be deleted".toKey()
            defaultValue = false
        }
    }

    private class RemoveArgs : Arguments() {
        val id by int {
            name = "id".toKey()
            description = "The ID of the filter to remove".toKey()
            minValue = 0
        }
    }

    private class TestArgs : Arguments() {
        val message by string {
            name = "message".toKey()
            description = "The message to test".toKey()
        }
    }
}