package zt.minkinator.extensions

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.hasPermission
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.member
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalString
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.ephemeralSlashCommand
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.common.entity.Permission
import dev.kord.rest.builder.message.create.embed
import dev.kord.rest.request.RestRequestException
import zt.minkinator.util.configureAuthor
import zt.minkinator.util.error
import zt.minkinator.util.success

class KickExtension(override val name: String = "kick") : Extension() {
    override suspend fun setup() {
        ephemeralSlashCommand(::KickArguments) {
            name = "kick"
            description = "Kick a user"

            check {
                anyGuild()
                hasPermission(Permission.KickMembers)
            }

            requireBotPermissions(Permission.KickMembers)

            action {
                val target = arguments.target
                val reason = arguments.reason

                respond {
                    embed {
                        configureAuthor(target)

                        try {
                            guild!!.kick(target.id, reason)

                            color = Color.success
                            description = "Successfully kicked member"

                            reason?.let { reason ->
                                field {
                                    name = "Reason:"
                                    value = reason
                                }
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

    private inner class KickArguments : Arguments() {
        val target by member {
            name = "target"
            description = "The member to kick"
        }
        val reason by optionalString {
            name = "reason"
            description = "The reason for kick"
        }
    }
}