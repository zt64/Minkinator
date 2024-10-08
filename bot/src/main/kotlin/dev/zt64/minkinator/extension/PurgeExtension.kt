package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.common.entity.Permission
import dev.kord.rest.builder.message.embed
import dev.kord.rest.request.RestRequestException
import dev.kordex.core.DiscordRelayedException
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.checks.hasPermission
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.int
import dev.kordex.core.commands.converters.impl.optionalMember
import dev.kordex.core.commands.converters.impl.optionalString
import dev.kordex.core.extensions.Extension
import dev.zt64.minkinator.util.ephemeralSlashCommand
import dev.zt64.minkinator.util.pluralize
import dev.zt64.minkinator.util.success
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.take

object PurgeExtension : Extension() {
    override val name = "purge"

    override suspend fun setup() {
        ephemeralSlashCommand(
            name = "purge",
            description = "Delete a certain number of messages",
            arguments = PurgeExtension::PurgeArguments
        ) {
            requireBotPermissions(Permission.ManageMessages)

            check {
                anyGuild()
                hasPermission(Permission.ManageMessages)
            }

            action {
                val count = arguments.count

                channel
                    .messages
                    .filter { message -> message.author == arguments.target }
                    .take(count)
                    .collect { message ->
                        try {
                            message.delete(arguments.reason)
                        } catch (error: RestRequestException) {
                            throw DiscordRelayedException("Failed to purge messages")
                        }
                    }

                respond {
                    embed {
                        color = Color.success
                        title = "Purged ${"message".pluralize(count)}"
                    }
                }
            }
        }
    }

    private class PurgeArguments : Arguments() {
        val count by int {
            name = "count"
            description = "The number of messages to delete"
            minValue = 0
            maxValue = 100
        }
        val target by optionalMember {
            name = "target"
            description = "The user to delete messages for"
        }
        val reason by optionalString {
            name = "reason"
            description = "The reason to delete messages"
            maxLength = 500
        }
    }
}