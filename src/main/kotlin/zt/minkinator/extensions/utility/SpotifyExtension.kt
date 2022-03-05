package zt.minkinator.extensions.utility

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalMember
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.ephemeralSlashCommand
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.common.toMessageFormat
import dev.kord.core.behavior.requestMembers
import dev.kord.core.kordLogger
import dev.kord.gateway.PrivilegedIntent
import dev.kord.rest.builder.message.create.embed
import zt.minkinator.util.pluralize
import zt.minkinator.util.success

class SpotifyExtension(override val name: String = "spotify") : Extension() {
    @OptIn(PrivilegedIntent::class)
    override suspend fun setup() {
        ephemeralSlashCommand(::SpotifyArguments) {
            name = "spotify"
            description = "Get information on a users current Spotify status"

            check {
                anyGuild()
            }

            action {
                val target = arguments.target?.fetchMember() ?: member?.fetchMember()!!

                guild!!.requestMembers {
                    presences = true
                    userIds = mutableSetOf(target.id)
                }

                respond {
                    val activity = target.getPresenceOrNull()?.let { presence ->
                        kordLogger.info { presence.toString() }
                        presence.activities.firstOrNull { activity -> activity.name == "Spotify" }
                    }

                    embed {
                        color = Color.success

                        author {
                            icon = target.avatar?.url
                            name = target.displayName
                        }

                        if (activity != null) {
                            description = "Listening to ${activity.details}"

                            activity.state?.let { authors ->
                                field {
                                    name = "${"Author".pluralize(authors.count(Char::isWhitespace))}:"
                                    value = authors
                                }
                            }


                            activity.start?.let { start ->
                                field {
                                    name = "Start:"
                                    value = start.toMessageFormat()
                                }
                            }

                            activity.end?.let { end ->
                                field {
                                    name = "End:"
                                    value = end.toMessageFormat()
                                }
                            }
                        } else {
                            description = "This user is not listening to Spotify!"
                        }
                    }
                }
            }
        }
    }

    private inner class SpotifyArguments : Arguments() {
        val target by optionalMember {
            name = "target"
            description = "The user to check spotify info"
        }
    }
}