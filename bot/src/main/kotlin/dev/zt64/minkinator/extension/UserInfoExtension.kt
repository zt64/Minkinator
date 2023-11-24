package dev.zt64.minkinator.extension

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalMember
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.utils.createdAt
import com.kotlindiscord.kord.extensions.utils.profileLink
import dev.kord.common.Color
import dev.kord.common.toMessageFormat
import dev.kord.core.entity.Member
import dev.kord.core.entity.Role
import dev.kord.rest.builder.message.EmbedBuilder
import dev.kord.rest.builder.message.embed
import dev.zt64.minkinator.util.*
import kotlinx.coroutines.flow.count
import kotlinx.coroutines.flow.toList

object UserInfoExtension : Extension() {
    override val name = "user-info"

    private suspend fun EmbedBuilder.buildUserInfoEmbed(target: Member) {
        color = target.accentColor ?: Color.success
        url = target.profileLink

        author(target)

        if (target.roles.count() > 0) {
            field(
                name = "Roles:",
                value = target.roles.toList().joinToString(transform = Role::mention)
            )
        }

        target.premiumSince?.let { premiumSince ->
            field(
                name = "Premium Since:",
                value = premiumSince.toMessageFormat()
            )
        }

        field(
            name = "Joined At:",
            value = target.joinedAt.toMessageFormat()
        )

        field(
            name = "Created At:",
            value = target.createdAt.toMessageFormat()
        )
    }

    override suspend fun setup() {
        ephemeralSlashCommand(
            name = "user-info",
            description = "Lookup details on a specific user, defaulting to yourself",
            arguments = UserInfoExtension::UserArgs
        ) {
            check {
                anyGuild()
            }

            action {
                val target = arguments.target ?: member!!.asMember()

                respond {
                    embed { buildUserInfoEmbed(target) }
                }
            }
        }

        ephemeralUserCommand("user-info") {
            action {
                respond {
                    embed { buildUserInfoEmbed(member!!.asMember()) }
                }
            }
        }
    }

    private class UserArgs : Arguments() {
        val target by optionalMember {
            name = "target"
            description = "The user to lookup"
        }
    }
}