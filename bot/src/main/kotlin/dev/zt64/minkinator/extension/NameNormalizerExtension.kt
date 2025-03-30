package dev.zt64.minkinator.extension

import dev.kord.common.entity.Permission
import dev.kord.core.behavior.edit
import dev.kord.core.entity.Member
import dev.kord.core.event.guild.MemberJoinEvent
import dev.kord.core.event.guild.MemberUpdateEvent
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.checks.hasPermission
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.member
import dev.kordex.core.extensions.Extension
import dev.kordex.core.extensions.event
import dev.kordex.core.i18n.toKey
import dev.kordex.core.types.EphemeralInteractionContext
import dev.kordex.core.utils.hasPermission
import dev.kordex.core.utils.selfMember
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
                    bot.logger.info { "Normalized name for ${event.member.effectiveName} (${event.member.id})" }
                }
            }
        }

        event<MemberUpdateEvent> {
            check {
                failIfNot {
                    try {
                        event.guild.selfMember().hasPermission(Permission.ManageNicknames)
                    } catch (_: Exception) {
                        false
                    }
                }
            }

            action {
                if (event.old?.effectiveName != event.member.effectiveName && !event.member.effectiveName.isNormalized()) {
                    event.member.normalizeName()
                    bot.logger.info { "Normalized name for ${event.member.effectiveName} (${event.member.id})" }
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
            name = "normalize".toKey(),
            description = "Normalize a members display name".toKey(),
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

        ephemeralUserCommand("normalize".toKey()) {
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
            name = "member".toKey()
            description = "The member whose display name to normalize".toKey()
        }
    }
}