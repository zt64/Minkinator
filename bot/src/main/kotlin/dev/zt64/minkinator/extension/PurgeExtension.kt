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
import dev.zt64.minkinator.i18n.Translations
import dev.zt64.minkinator.util.ephemeralSlashCommand
import dev.zt64.minkinator.util.pluralize
import dev.zt64.minkinator.util.success
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.take

object PurgeExtension : Extension() {
    override val name = "purge"

    override suspend fun setup() {
        ephemeralSlashCommand(
            name = Translations.Command.purge,
            description = Translations.Command.Description.purge,
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
                            throw DiscordRelayedException(Translations.Error.purgeFailed)
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
            name = Translations.Argument.count
            description = Translations.Argument.Description.count
            minValue = 0
            maxValue = 100
        }
        val target by optionalMember {
            name = Translations.Argument.target
            description = Translations.Argument.Description.targetForPurge
        }
        val reason by optionalString {
            name = Translations.Argument.reason
            description = Translations.Argument.Description.reasonForPurge
            maxLength = 500
        }
    }
}