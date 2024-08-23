package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.common.toMessageFormat
import dev.kord.core.entity.Member
import dev.kord.core.entity.Role
import dev.kord.rest.builder.message.EmbedBuilder
import dev.kord.rest.builder.message.embed
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.optionalMember
import dev.kordex.core.extensions.Extension
import dev.kordex.core.utils.createdAt
import dev.kordex.core.utils.profileLink
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

        target.joinedAt?.let {
            field(
                name = "Joined At:",
                value = it.toMessageFormat()
            )
        }

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