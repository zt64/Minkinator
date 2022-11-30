package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalMember
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.time.TimestampType
import com.kotlindiscord.kord.extensions.time.toDiscord
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kord.rest.builder.message.create.embed
import zt.minkinator.util.*

class SpotifyExtension(override val name: String = "spotify") : Extension() {
    @OptIn(PrivilegedIntent::class)
    override val intents: MutableSet<Intent> = mutableSetOf(Intent.GuildPresences)

    override suspend fun setup() {
        publicSlashCommand(
            name = "spotify",
            description = "Get information on a users current Spotify status",
            arguments = ::SpotifyArguments
        ) {
            check {
                anyGuild()
            }

            action {
                val target = arguments.member ?: member!!.fetchMember()

                respond {
                    val activity = target.getPresenceOrNull()?.activities?.firstOrNull { activity -> activity.name == "Spotify" }

                    embed {
                        color = Color.success

                        author {
                            icon = target.avatar?.url
                            name = target.displayName
                        }

                        if (activity != null) {
                            description = "Listening to ${activity.details}"

                            field(
                                name = "${"Author".pluralize(activity.state!!.count(Char::isWhitespace))}:",
                                value = activity.state!!
                            )

                            field(
                                name = "Start:",
                                value = activity.start!!.toDiscord(TimestampType.RelativeTime)
                            )

                            field(
                                name = "End:",
                                value = activity.end!!.toDiscord(TimestampType.RelativeTime)
                            )

                            thumbnail(activity.assets.largeImage!!.replace("spotify:", "https://i.scdn.co/image/"))
                        } else {
                            description = "This user is not listening to Spotify!"
                        }
                    }
                }
            }
        }
    }

    private class SpotifyArguments : Arguments() {
        val member by optionalMember {
            name = "member"
            description = "The user to check spotify info"
        }
    }
}