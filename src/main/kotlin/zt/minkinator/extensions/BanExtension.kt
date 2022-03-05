package zt.minkinator.extensions

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.hasPermission
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.member
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalInt
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalString
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.publicSlashCommand
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.common.entity.Permission
import dev.kord.core.behavior.ban
import dev.kord.rest.builder.message.create.embed
import zt.minkinator.util.success

class BanExtension(override val name: String = "ban") : Extension() {
    override suspend fun setup() {
        publicSlashCommand(::BanArguments) {
            name = "ban"
            description = "Ban a user"

            requireBotPermissions(Permission.BanMembers)

            check {
                anyGuild()
                hasPermission(Permission.BanMembers)
            }

            action {
                val target = arguments.target

                guild!!.ban(target.id) {
                    reason = arguments.reason
                    deleteMessagesDays = arguments.days
                }

                respond {
                    embed {
                        color = Color.success
                        description = arguments.reason

                        author {
                            icon = target.data.avatar
                            name = "Banned User: ${target.username}#${target.discriminator}"
                        }

                        field {
                            name = "User ID:"
                            value = target.id.toString()
                        }
                    }
                }
            }
        }
    }

    inner class BanArguments : Arguments() {
        val target by member {
            name = "target"
            description = "The member to ban"
        }
        val reason by optionalString {
            name = "reason"
            description = "The reason to ban"
        }
        val days by optionalInt {
            name = "days"
            description = "Days of messages to delete"
        }
    }
}