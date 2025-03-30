package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kord.rest.builder.message.embed
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.optionalMember
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.kordex.core.time.TimestampType
import dev.kordex.core.time.toDiscord
import dev.zt64.minkinator.util.*

object SpotifyExtension : Extension() {
    override val name = "spotify"

    @OptIn(PrivilegedIntent::class)
    override val intents = mutableSetOf<Intent>(Intent.GuildPresences)

    override suspend fun setup() {
        publicSlashCommand(
            name = "spotify".toKey(),
            description = "Get information on a users current Spotify status".toKey(),
            arguments = SpotifyExtension::SpotifyArguments
        ) {
            check {
                anyGuild()
            }

            action {
                val target = arguments.member ?: member!!.fetchMember()

                respond {
                    val activity = target.getPresenceOrNull()?.activities?.firstOrNull { activity ->
                        activity.name == "Spotify"
                    }

                    embed {
                        color = Color.success

                        author {
                            icon = target.avatar?.cdnUrl?.toUrl()
                            name = target.effectiveName
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
            name = "member".toKey()
            description = "The user to check spotify info".toKey()
        }
    }
}