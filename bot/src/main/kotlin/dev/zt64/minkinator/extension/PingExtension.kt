package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.rest.builder.message.embed
import dev.kordex.core.extensions.Extension
import dev.zt64.minkinator.i18n.Translations
import dev.zt64.minkinator.util.publicSlashCommand
import dev.zt64.minkinator.util.success

object PingExtension : Extension() {
    override val name = "ping"

    override suspend fun setup() {
        publicSlashCommand(
            name = Translations.Command.ping,
            description = Translations.Command.Description.ping
        ) {
            action {
                respond {
                    embed {
                        color = Color.success
                        title = "Pong!"
                        description = bot
                            .kordRef
                            .gateway
                            .averagePing
                            ?.let { "${it.inWholeMilliseconds} ms" } ?: "Unknown"
                    }
                }
            }
        }
    }
}