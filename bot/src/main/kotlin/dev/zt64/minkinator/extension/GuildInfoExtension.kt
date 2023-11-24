package dev.zt64.minkinator.extension

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.extensions.Extension
import dev.kord.common.Color
import dev.kord.rest.Image
import dev.kord.rest.builder.message.embed
import dev.zt64.minkinator.util.*

object GuildInfoExtension : Extension() {
    override val name = "guild-info"

    override suspend fun setup() {
        ephemeralSlashCommand(
            name = "guild-info",
            description = "Get information about the current guild"
        ) {
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
                                icon = guild.icon?.cdnUrl?.toUrl {
                                    format = if (iconHash.startsWith("a_")) Image.Format.GIF else Image.Format.PNG
                                }
                            }
                        }

                        guild.bannerHash?.let { bannerHash ->
                            thumbnail(
                                guild.banner?.cdnUrl?.toUrl {
                                    format = if (bannerHash.startsWith("a_")) Image.Format.GIF else Image.Format.PNG
                                }!!
                            )
                        }

                        guild.vanityUrl?.let { vanityUrl ->
                            field(
                                name = "Vanity URL:",
                                value = "[$vanityUrl]($vanityUrl)"
                            )
                        }

                        field(
                            name = "Owner:",
                            value = guild.owner.mention,
                            inline = true
                        )

                        guild.premiumTier.takeIf { it.value > 0 }?.let { premiumTier ->
                            field(
                                name = "Boost Level:",
                                value = premiumTier.value.toString(),
                                inline = true
                            )
                        }

                        field(
                            name = "Channels:",
                            value = guild.channelBehaviors.size.toString(),
                            inline = true
                        )

                        guild.approximateMemberCount?.let { memberCount ->
                            field(
                                name = "Member Count (approximate):",
                                value = memberCount.toString(),
                                inline = true
                            )
                        }
                    }
                }
            }
        }
    }
}