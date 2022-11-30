package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.hasPermission
import com.kotlindiscord.kord.extensions.components.components
import com.kotlindiscord.kord.extensions.components.ephemeralButton
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.common.entity.ButtonStyle
import dev.kord.common.entity.Permission
import dev.kord.core.event.guild.MemberJoinEvent
import dev.kord.core.event.guild.MemberLeaveEvent
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kord.rest.builder.message.create.embed
import zt.minkinator.util.ephemeralSlashCommand
import zt.minkinator.util.ephemeralSubCommand
import zt.minkinator.util.success

class MemberLogExtension(override val name: String = "member-log") : Extension() {
    @OptIn(PrivilegedIntent::class)
    override val intents: MutableSet<Intent> = mutableSetOf(Intent.GuildMembers)

    override suspend fun setup() {
        event<MemberJoinEvent> {
            check {
                failIf {
                    val guild = event.getGuild()

                    true
                }
            }

            action {
                val guild = event.getGuild()
            }
        }

        event<MemberLeaveEvent> {
            check {
                failIf {
                    val guild = event.getGuild()

                    true
                }
            }

            action {
                val guild = event.getGuild()
            }
        }

        ephemeralSlashCommand(
            name = "member-log",
            description = "Commands relating to the member-log feature"
        ) {
            check {
                anyGuild()
                hasPermission(Permission.ManageChannels)
            }

            ephemeralSubCommand(
                name = "config",
                description = "Change member log options"
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

                                label = text
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