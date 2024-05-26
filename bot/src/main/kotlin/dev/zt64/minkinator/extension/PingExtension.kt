package dev.zt64.minkinator.extension

import com.kotlindiscord.kord.extensions.extensions.Extension
import dev.kord.common.Color
import dev.kord.rest.builder.message.embed
import dev.zt64.minkinator.util.publicSlashCommand
import dev.zt64.minkinator.util.success

object PingExtension : Extension() {
    override val name = "ping"

    override suspend fun setup() {
        publicSlashCommand(
            name = "ping",
            description = "Retrieve the bots ping"
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