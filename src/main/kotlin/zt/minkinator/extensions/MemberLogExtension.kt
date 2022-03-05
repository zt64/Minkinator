package zt.minkinator.extensions

import com.kotlindiscord.kord.extensions.commands.application.slash.ephemeralSubCommand
import com.kotlindiscord.kord.extensions.components.components
import com.kotlindiscord.kord.extensions.components.ephemeralButton
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.ephemeralSlashCommand
import com.kotlindiscord.kord.extensions.extensions.event
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.common.entity.ButtonStyle
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.channel.createEmbed
import dev.kord.core.entity.channel.TextChannel
import dev.kord.core.event.guild.MemberJoinEvent
import dev.kord.core.event.guild.MemberLeaveEvent
import dev.kord.core.supplier.EntitySupplyStrategy
import dev.kord.rest.builder.message.create.embed
import zt.minkinator.util.success

class MemberLogExtension(override val name: String = "member-log") : Extension() {
    override suspend fun setup() {
        event<MemberJoinEvent> {
            action {

            }
        }

        event<MemberLeaveEvent> {
            check {
                failIfNot {
                    // Check if member log is enabled
                    true
                }
            }

            action {
                val channel: TextChannel = kord.getChannelOf(Snowflake(2), EntitySupplyStrategy.cacheWithCachingRestFallback) ?: return@action
                val user = event.user

                channel.createEmbed {
                    color = Color.success

                    author {
                        icon = user.avatar?.url
                        name = "${user.username}#${user.discriminator}"
                    }

                    footer {
                        text = "Member Left"
                    }
                }
            }
        }

        ephemeralSlashCommand {
            name = "member-log"
            description = "Commands relating to the member-log feature"

            ephemeralSubCommand {
                name = "config"
                description = "Change member log options"

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