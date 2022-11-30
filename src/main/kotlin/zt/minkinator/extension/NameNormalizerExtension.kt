package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.hasPermission
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.member
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import com.kotlindiscord.kord.extensions.types.respond
import com.kotlindiscord.kord.extensions.utils.hasPermission
import com.kotlindiscord.kord.extensions.utils.selfMember
import dev.kord.common.entity.Permission
import dev.kord.core.behavior.edit
import dev.kord.core.entity.Member
import dev.kord.core.event.guild.MemberJoinEvent
import dev.kord.core.event.guild.MemberUpdateEvent
import dev.kord.core.kordLogger
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import zt.minkinator.util.ephemeralSlashCommand
import zt.minkinator.util.ephemeralUserCommand
import java.text.Normalizer

class NameNormalizerExtension(override val name: String = "name-normalizer") : Extension() {
    @OptIn(PrivilegedIntent::class)
    override val intents: MutableSet<Intent> = mutableSetOf(Intent.GuildMembers)

    private fun String.normalize(form: Normalizer.Form): String = Normalizer.normalize(this, form)
    private fun String.isNormalized(form: Normalizer.Form = Normalizer.Form.NFD) = Normalizer.isNormalized(this, form)

    private suspend fun Member.normalizeName() {
        val normalized = displayName.normalize(Normalizer.Form.NFD)

        edit {
            nickname = normalized
            reason = "Normalized name from $displayName to $normalized"
        }
    }

    override suspend fun setup() {
        event<MemberJoinEvent> {
            check {
                failIfNot {
                    event.guild.selfMember().hasPermission(Permission.ManageNicknames)
                }
            }

            action {
                if (!event.member.displayName.isNormalized()) {
                    // event.member.normalizeName()
                    kordLogger.info("Normalized name for ${event.member.displayName} (${event.member.id})")
                }
            }
        }

        event<MemberUpdateEvent> {
            check {
                failIfNot {
                    event.guild.selfMember().hasPermission(Permission.ManageNicknames)
                }
            }

            action {
                if (event.old?.displayName != event.member.displayName && !event.member.displayName.isNormalized()) {
                    // event.member.normalizeName()
                    kordLogger.info("Normalized name for ${event.member.displayName} (${event.member.id})")
                }
            }
        }

        ephemeralSlashCommand(
            name = "normalize",
            description = "Normalize a members display name",
            arguments = ::NormalizeArgs
        ) {
            requireBotPermissions(Permission.ManageNicknames)

            check {
                anyGuild()
                hasPermission(Permission.ManageNicknames)
            }

            action {
                val target = arguments.member

                respond {
                    content = if (!target.displayName.isNormalized()) {
                        target.normalizeName()

                        "Normalized name for ${target.mention}"
                    } else {
                        "Name is already normalized for ${target.mention}"
                    }
                }
            }
        }

        ephemeralUserCommand("normalize") {
            requireBotPermissions(Permission.ManageNicknames)

            check {
                anyGuild()
                hasPermission(Permission.ManageNicknames)
            }

            action {
                val member = targetUsers.single().asMember(guild!!.id)

                respond {
                    content = if (!member.displayName.isNormalized()) {
                        member.normalizeName()

                        "Normalized name for ${member.mention}"
                    } else {
                        "Name is already normalized for ${member.mention}"
                    }
                }
            }
        }
    }

    private class NormalizeArgs : Arguments() {
        val member by member {
            name = "member"
            description = "The member whose display name to normalize"
        }
    }
}