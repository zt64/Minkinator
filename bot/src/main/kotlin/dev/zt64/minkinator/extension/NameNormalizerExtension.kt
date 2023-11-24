package dev.zt64.minkinator.extension

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.hasPermission
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.member
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import com.kotlindiscord.kord.extensions.types.EphemeralInteractionContext

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
import dev.zt64.minkinator.util.ephemeralSlashCommand
import dev.zt64.minkinator.util.ephemeralUserCommand
import java.text.Normalizer

object NameNormalizerExtension : Extension() {
    override val name = "name-normalizer"

    @OptIn(PrivilegedIntent::class)
    override val intents = mutableSetOf<Intent>(Intent.GuildMembers)

    private fun String.normalize(form: Normalizer.Form): String = Normalizer.normalize(this, form)
    private fun String.isNormalized(form: Normalizer.Form = Normalizer.Form.NFD) = Normalizer.isNormalized(this, form)

    private suspend fun Member.normalizeName() {
        val normalized = effectiveName.normalize(Normalizer.Form.NFD)

        edit {
            nickname = normalized
            reason = "Normalized name from $effectiveName to $normalized"
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
                if (!event.member.effectiveName.isNormalized()) {
                    // event.member.normalizeName()
                    kordLogger.info("Normalized name for ${event.member.effectiveName} (${event.member.id})")
                }
            }
        }

        event<MemberUpdateEvent> {
            check {
                failIfNot {
                    try {
                        event.guild.selfMember().hasPermission(Permission.ManageNicknames)
                    } catch (e: Exception) {
                        false
                    }
                }
            }

            action {
                if (event.old?.effectiveName != event.member.effectiveName && !event.member.effectiveName.isNormalized()) {
                    // event.member.normalizeName()
                    kordLogger.info("Normalized name for ${event.member.effectiveName} (${event.member.id})")
                }
            }
        }

        suspend fun EphemeralInteractionContext.normalize(member: Member) {
            respond {
                content = if (!member.effectiveName.isNormalized()) {
                    member.normalizeName()

                    "Normalized name for ${member.mention}"
                } else {
                    "Name is already normalized for ${member.mention}"
                }
            }
        }

        ephemeralSlashCommand(
            name = "normalize",
            description = "Normalize a members display name",
            arguments = NameNormalizerExtension::NormalizeArgs
        ) {
            requireBotPermissions(Permission.ManageNicknames)

            check {
                anyGuild()
                hasPermission(Permission.ManageNicknames)
            }

            action {
                normalize(arguments.member)
            }
        }

        ephemeralUserCommand("normalize") {
            requireBotPermissions(Permission.ManageNicknames)

            check {
                anyGuild()
                hasPermission(Permission.ManageNicknames)
            }

            action {
                normalize(targetUsers.single().asMember(guild!!.id))
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