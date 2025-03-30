package dev.zt64.minkinator.extension

import dev.kord.common.entity.Permission
import dev.kord.common.entity.PremiumTier
import dev.kord.rest.NamedFile
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.checks.guildFor
import dev.kordex.core.checks.hasPermission
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.*
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.zt64.minkinator.util.ephemeralSlashCommand
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import kotlinx.coroutines.flow.count
import org.koin.core.component.inject

object StickerExtension : Extension() {
    override val name = "sticker"

    private val httpClient: HttpClient by inject()

    override suspend fun setup() {
        ephemeralSlashCommand(
            name = "create-sticker".toKey(),
            description = "Create a sticker from an image or GIF".toKey(),
            arguments = StickerExtension::Args
        ) {
            requireBotPermissions(Permission.ManageGuildExpressions)

            check {
                anyGuild()
                hasPermission(Permission.ManageGuildExpressions)
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
                        contentProvider = ChannelProvider { channel }
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
            name = "name".toKey()
            description = "The name of the sticker".toKey()
            maxLength = 30
        }
        val relatedEmoji by emoji {
            name = "related-emoji".toKey()
            description = "The emoji related to the sticker".toKey()
        }
        val attachment by attachment {
            name = "attachment".toKey()
            description = "The attachment to use".toKey()

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
            name = "description".toKey()
            description = "The description of the sticker".toKey()
            maxLength = 100
        }
    }
}