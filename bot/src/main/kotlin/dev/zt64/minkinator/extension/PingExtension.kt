package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.rest.builder.message.embed
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.zt64.minkinator.util.publicSlashCommand
import dev.zt64.minkinator.util.success

object PingExtension : Extension() {
    override val name = "ping"

    override suspend fun setup() {
        publicSlashCommand(
            name = "ping".toKey(),
            description = "Retrieve the bots ping".toKey()
        ) {
            action {
                respond {
                    embed {
                        color = Color.success
                        title = "Ping"
                        description = bot
                            .kordRef
                            .gateway
                            .averagePing
                            ?.toString() ?: "Unknown"
                    }
                }
            }
        }
    }
}