package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.common.entity.Permission
import dev.kord.rest.builder.message.embed
import dev.kord.rest.request.RestRequestException
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.checks.hasPermission
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.member
import dev.kordex.core.commands.converters.impl.optionalString
import dev.kordex.core.extensions.Extension
import dev.zt64.minkinator.util.*

object KickExtension : Extension() {
    override val name = "kick"

    override suspend fun setup() {
        ephemeralSlashCommand(
            name = "kick",
            description = "Kick a member from the server",
            arguments = KickExtension::KickArguments
        ) {
            check {
                anyGuild()
                hasPermission(Permission.KickMembers)
            }

            requireBotPermissions(Permission.KickMembers)

            action {
                val member = arguments.member
                val reason = arguments.reason

                respond {
                    embed {
                        author(member)

                        try {
                            guild!!.kick(member.id, reason)

                            color = Color.success
                            description = "Successfully kicked ${member.mention}"

                            reason?.let { reason ->
                                field(
                                    name = "Reason:",
                                    value = reason
                                )
                            }
                        } catch (e: RestRequestException) {
                            color = Color.error
                            description = "Failed to kick member"
                        }
                    }
                }
            }
        }
    }

    private class KickArguments : Arguments() {
        val member by member {
            name = "member"
            description = "The member to kick"
        }
        val reason by optionalString {
            name = "reason"
            description = "The reason for kick"
            maxLength = 1000
        }
    }
}