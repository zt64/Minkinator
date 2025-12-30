package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.common.entity.ButtonStyle
import dev.kord.common.entity.Permission
import dev.kord.core.event.guild.MemberJoinEvent
import dev.kord.core.event.guild.MemberLeaveEvent
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kord.rest.builder.message.embed
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.checks.hasPermission
import dev.kordex.core.components.components
import dev.kordex.core.components.ephemeralButton
import dev.kordex.core.extensions.Extension
import dev.kordex.core.extensions.event
import dev.kordex.core.i18n.toKey
import dev.zt64.minkinator.i18n.Translations
import dev.zt64.minkinator.util.ephemeralSlashCommand
import dev.zt64.minkinator.util.ephemeralSubCommand
import dev.zt64.minkinator.util.success

object MemberLogExtension : Extension() {
    override val name = "member-log"

    @OptIn(PrivilegedIntent::class)
    override val intents: MutableSet<Intent> = mutableSetOf(Intent.GuildMembers)

    override suspend fun setup() {
        event<MemberJoinEvent> {
            check {
                failIf {
                    event.getGuild()

                    true
                }
            }

            action {
                event.getGuild()
            }
        }

        event<MemberLeaveEvent> {
            check {
                failIf {
                    event.getGuild()

                    true
                }
            }

            action {
                event.getGuild()
            }
        }

        ephemeralSlashCommand(
            name = Translations.Command.memberLog,
            description = Translations.Command.Description.memberLog
        ) {
            check {
                anyGuild()
                hasPermission(Permission.ManageChannels)
            }

            ephemeralSubCommand(
                name = Translations.Command.Subcommand.MemberLog.config,
                description = Translations.Command.Subcommand.MemberLog.Description.config
            ) {
                action {
                    // Implement database functionality eventually
                    val enabled = true

                    respond {
                        embed {
                            color = Color.success
                            title = "Member Log Configuration"
                        }

                        components {
                            ephemeralButton {
                                val (text, buttonStyle) = if (enabled) {
                                    "Disable" to ButtonStyle.Danger
                                } else {
                                    "Enable" to ButtonStyle.Primary
                                }

                                label = text.toKey()
                                style = buttonStyle

                                action {
                                    if (enabled) {
                                    } else {
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}