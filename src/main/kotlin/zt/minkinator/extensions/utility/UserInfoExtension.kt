package zt.minkinator.extensions.utility

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalMember
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.ephemeralSlashCommand
import com.kotlindiscord.kord.extensions.extensions.ephemeralUserCommand
import com.kotlindiscord.kord.extensions.types.respond
import com.kotlindiscord.kord.extensions.utils.createdAt
import com.kotlindiscord.kord.extensions.utils.profileLink
import dev.kord.common.toMessageFormat
import dev.kord.core.entity.Member
import dev.kord.rest.builder.message.EmbedBuilder
import dev.kord.rest.builder.message.create.embed
import kotlinx.coroutines.flow.count
import kotlinx.coroutines.flow.toList
import zt.minkinator.util.configureAuthor

class UserInfoExtension(override val name: String = "user-info") : Extension() {
    private suspend fun EmbedBuilder.buildUserInfoEmbed(target: Member) {
        color = target.accentColor
        url = target.profileLink

        configureAuthor(target)

        if (target.roles.count() != 0) {
            field {
                name = "Roles:"
                value = target.roles.toList().joinToString { role -> role.mention }
            }
        }

        target.premiumSince?.let { premiumSince ->
            field {
                name = "Premium Since:"
                value = premiumSince.toMessageFormat()
            }
        }

        field {
            name = "Joined At:"
            value = target.joinedAt.toMessageFormat()
        }

        field {
            name = "Created At:"
            value = target.createdAt.toMessageFormat()
        }
    }

    override suspend fun setup() {
        ephemeralSlashCommand(::UserArgs) {
            name = "user-info"
            description = "Lookup details on a specific user, defaulting to yourself"

            check {
                anyGuild()
            }

            action {
                val target = arguments.target ?: member!!.asMember()

                respond {
                    embed {
                        buildUserInfoEmbed(target)
                    }
                }
            }
        }

        ephemeralUserCommand {
            name = "user-info"

            action {
                respond {
                    embed {
                        buildUserInfoEmbed(member!!.asMember())
                    }
                }
            }
        }
    }

    private inner class UserArgs : Arguments() {
        val target by optionalMember {
            name = "target"
            description = "The user to lookup"
        }
    }
}