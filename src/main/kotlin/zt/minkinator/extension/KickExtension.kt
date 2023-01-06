package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.hasPermission
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.member
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalString
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.common.entity.Permission
import dev.kord.rest.builder.message.create.embed
import dev.kord.rest.request.RestRequestException
import zt.minkinator.util.*

object KickExtension : Extension() {
    override val name = "kick"

    override suspend fun setup() {
        ephemeralSlashCommand(
            name = "kick",
            description = "Kick a member from the server",
            arguments = ::KickArguments
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