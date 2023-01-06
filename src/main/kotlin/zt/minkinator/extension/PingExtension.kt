package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.respond
import zt.minkinator.util.publicSlashCommand

object PingExtension : Extension() {
    override val name = "ping"

    override suspend fun setup() {
        publicSlashCommand(
            name = "ping",
            description = "Retrieve the bots ping"
        ) {
            action {
                respond {
//                    embed {
//                        color = Color.success
//                        title = "Ping"
//                        description = this@PingExtension.kord.gateway.averagePing?.toString() ?: "Unknown"
//                    }
                }
            }
        }
    }
}