package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.common.entity.Permission
import dev.kord.core.behavior.ban
import dev.kord.rest.builder.message.embed
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.checks.hasPermission
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.*
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.kordex.core.utils.toDuration
import dev.zt64.minkinator.i18n.Translations
import dev.zt64.minkinator.util.*
import kotlinx.datetime.TimeZone

object BanExtension : Extension() {
    override val name = "ban"

    override suspend fun setup() {
        publicSlashCommand(
            name = Translations.Command.ban,
            description = Translations.Command.Description.ban,
            arguments = BanExtension::BanArguments
        ) {
            requireBotPermissions(Permission.BanMembers)

            check {
                anyGuild()
                hasPermission(Permission.BanMembers)
            }

            action {
                val target = arguments.member

                guild!!.ban(target.id) {
                    reason = arguments.reason

                    if (arguments.duration != null) {
                        deleteMessageDuration = arguments.duration!!.toDuration(TimeZone.UTC)
                    }
                }

                respond {
                    embed {
                        color = Color.success
                        description = arguments.reason

                        author(
                            icon = target.displayAvatar,
                            name = "Banned User: ${target.username}"
                        )

                        field(
                            name = "User ID:",
                            value = target.id.toString()
                        )
                    }
                }
            }
        }

        publicSlashCommand(
            name = Translations.Command.unban,
            description = Translations.Command.Description.unban,
            arguments = BanExtension::UnbanArguments
        ) {
            requireBotPermissions(Permission.BanMembers)

            check {
                anyGuild()
                hasPermission(Permission.BanMembers)
            }

            action {
                val user = arguments.user
                val reason = arguments.reason

                guild!!.unban(user.id, reason)

                respond {
                    embed {
                        color = Color.success
                        description = arguments.reason

                        author(
                            icon = user.displayAvatar,
                            name = "Unbanned User: ${user.username}"
                        )
                    }
                }
            }
        }
    }

    private class BanArguments : Arguments() {
        val member by member {
            name = Translations.Common.member
            description = "The member to ban".toKey()
        }
        val reason by optionalString {
            name = Translations.Common.reason
            description = "The reason to ban".toKey()
            maxLength = 512
        }
        val duration by optionalDuration {
            name = Translations.Common.duration
            description = "Duration of messages to delete".toKey()

            validate {
                failIf {
                    value!!.toDuration(TimeZone.UTC).inWholeDays > 7
                }
            }
        }
    }

    private class UnbanArguments : Arguments() {
        val user by user {
            name = Translations.Common.user
            description = "The user to unban".toKey()
        }
        val reason by optionalString {
            name = Translations.Common.reason
            description = "The reason to unban".toKey()
            maxLength = 512
        }
    }
}