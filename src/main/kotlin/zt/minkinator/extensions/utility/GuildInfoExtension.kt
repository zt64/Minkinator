package zt.minkinator.extensions.utility

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.ephemeralSlashCommand
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.rest.Image
import dev.kord.rest.builder.message.create.embed
import kotlinx.coroutines.flow.count
import kotlinx.coroutines.flow.toList
import zt.minkinator.util.success

class GuildInfoExtension(override val name: String = "guildInfo") : Extension() {
    override suspend fun setup() {
        ephemeralSlashCommand {
            name = "guild-info"
            description = "Get information about the current guild"

            check {
                anyGuild()
            }

            action {
                val guild = guild!!.asGuild()

                respond {
                    embed {
                        color = Color.success
                        description = guild.description

                        author {
                            name = guild.name

                            guild.iconHash?.let { iconHash ->
                                icon = guild.getIconUrl(
                                    if (iconHash.startsWith("a_")) Image.Format.GIF else Image.Format.PNG
                                )
                            }
                        }

                        guild.bannerHash?.let { bannerHash ->
                            thumbnail {
                                url = guild.getBannerUrl(
                                    if (bannerHash.startsWith("a_")) Image.Format.GIF else Image.Format.PNG
                                )!!
                            }
                        }

                        guild.vanityUrl?.let { vanityUrl ->
                            field {
                                name = "Vanity URL: "
                                value = "[${vanityUrl}](${vanityUrl})"
                            }
                        }

                        field {
                            name = "Owner: "
                            value = guild.owner.mention
                            inline = true
                        }

                        guild.premiumTier.takeIf { it.value > 0 }?.let { premiumTier ->
                            field {
                                name = "Boost Level:"
                                value = premiumTier::class.simpleName!!
                                inline = true
                            }
                        }

                        field {
                            name = "Channels: "
                            value = guild.channels.count().toString()
                            inline = true
                        }

                        guild.approximateMemberCount?.let { memberCount ->
                            field {
                                name = "Member Count (approximate): "
                                value = memberCount.toString()
                                inline = true
                            }
                        }

                        field {
                            name = "Roles (${guild.roles.count()}): "
                            value = guild.roles.toList().take(12).joinToString { role -> role.mention }
                        }


                        //                        field {
                        //                            name = "Emojis: "
                        //                            value = guild.emojis.take(25).toList().joinToString { emoji -> emoji.mention }
                        //                        }
                    }
                }
            }
        }
    }
}