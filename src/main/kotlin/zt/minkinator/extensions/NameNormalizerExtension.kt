package zt.minkinator.extensions

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.hasPermission
import com.kotlindiscord.kord.extensions.checks.memberFor
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.member
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.ephemeralSlashCommand
import com.kotlindiscord.kord.extensions.extensions.ephemeralUserCommand
import com.kotlindiscord.kord.extensions.extensions.event
import com.kotlindiscord.kord.extensions.types.respond
import com.kotlindiscord.kord.extensions.utils.hasPermission
import com.kotlindiscord.kord.extensions.utils.selfMember
import dev.kord.common.entity.Permission
import dev.kord.core.behavior.edit
import dev.kord.core.entity.Member
import dev.kord.core.event.guild.MemberJoinEvent
import java.text.Normalizer

class NameNormalizerExtension(override val name: String = "name-normalizer") : Extension() {
    private suspend fun Member.normalizeName() {
        val normalized = Normalizer.normalize(displayName, Normalizer.Form.NFD)

        edit {
            nickname = normalized
            reason = "Normalized name from $displayName to $normalized"
        }
    }

    override suspend fun setup() {
        event<MemberJoinEvent> {
            check {
                failIf {
                    // check if normalizeOnJoin is enabled for the guild
                    false
                }
                failIfNot {
                    event.guild.selfMember().hasPermission(Permission.ManageNicknames)
                }
            }

            action {
                val member = memberFor(event)!!.asMember()

                if (Normalizer.isNormalized(member.displayName, Normalizer.Form.NFD)) member.normalizeName()
            }
        }

        ephemeralUserCommand {
            name = "normalize"

            requireBotPermissions(Permission.ManageNicknames)

            check {
                anyGuild()
                //                hasPermission(Permission.ManageNicknames)

            }

            action {
                memberFor(event)!!.asMember().normalizeName()
            }
        }

        ephemeralSlashCommand(::NormalizeArgs) {
            name = "normalize"
            description = "Normalize a members username"

            //            requireBotPermissions(Permission.ManageNicknames)

            check {
                anyGuild()
                hasPermission(Permission.ManageNicknames)
            }

            action {
                val target = arguments.target

                if (Normalizer.isNormalized(target.displayName, Normalizer.Form.NFD)) {
                    target.normalizeName()

                    respond {
                        content = "Normalized name for ${target.mention}"
                    }
                } else {
                    target.normalizeName()

                    respond {
                        content = "Name is already normalized for ${target.mention}"
                    }
                }
            }
        }
    }

    private inner class NormalizeArgs : Arguments() {
        val target by member {
            name = "target"
            description = "The member whose display name to normalize"
        }
    }
}