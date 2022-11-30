package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.guildFor
import com.kotlindiscord.kord.extensions.checks.hasPermission
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.attachment
import com.kotlindiscord.kord.extensions.commands.converters.impl.emoji
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalString
import com.kotlindiscord.kord.extensions.commands.converters.impl.string
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.entity.Permission
import dev.kord.common.entity.PremiumTier
import dev.kord.rest.NamedFile
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import kotlinx.coroutines.flow.count
import org.koin.core.component.inject
import zt.minkinator.util.ephemeralSlashCommand

class StickerExtension(override val name: String = "sticker") : Extension() {
    private val httpClient: HttpClient by inject()

    override suspend fun setup() {
        ephemeralSlashCommand(
            name = "create-sticker",
            description = "Create a sticker from an image or GIF",
            arguments = ::Args
        ) {
            requireBotPermissions(Permission.ManageEmojisAndStickers)

            check {
                anyGuild()
                hasPermission(Permission.ManageEmojisAndStickers)
                failIf("Maximum number of stickers reached") {
                    val guild = guildFor(event)!!.fetchGuild()

                    when (guild.premiumTier) {
                        PremiumTier.None -> 5
                        PremiumTier.One -> 15
                        PremiumTier.Three -> 30
                        PremiumTier.Two -> 60
                        is PremiumTier.Unknown -> 1000
                    } == guild.stickers.count()
                }
            }

            action {
                val guild = guild!!.fetchGuild()
                val attachment = arguments.attachment
                val channel = httpClient.get(attachment.url).bodyAsChannel()

                guild.createSticker(
                    name = arguments.name,
                    description = arguments.description.orEmpty(),
                    tags = arguments.relatedEmoji.mention,
                    file = NamedFile(
                        name = attachment.filename,
                        contentProvider = ChannelProvider { channel },
                    )
                )

                respond {
                    content = "Added new sticker!"
                }
            }
        }
    }

    private class Args : Arguments() {
        val name by string {
            name = "name"
            description = "The name of the sticker"
            maxLength = 30
        }
        val relatedEmoji by emoji {
            name = "related-emoji"
            description = "The emoji related to the sticker"
        }
        val attachment by attachment {
            name = "attachment"
            description = "The attachment to use"

            validate {
                failIfNot("Attachment must be either a PNG or APNG") {
                    value.filename.endsWith(".png") || value.filename.endsWith(".apng")
                }
                failIf("Attachment is too large, must be under 512kb") {
                    value.size >= 512 * 1024
                }
            }
        }
        val description by optionalString {
            name = "description"
            description = "The description of the sticker"
            maxLength = 100
        }
    }
}