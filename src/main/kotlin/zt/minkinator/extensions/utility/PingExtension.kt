package zt.minkinator.extensions.utility

import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.ephemeralSlashCommand
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.rest.builder.message.create.embed
import zt.minkinator.util.success

class PingExtension(override val name: String = "ping") : Extension() {
    override suspend fun setup() {
        ephemeralSlashCommand {
            name = "Ping"
            description = "Retrieve the bots ping"

            action {
                respond {
                    embed {
                        color = Color.success
                        title = "Ping"
                        description = "pong"
                    }
                }
            }
        }
    }
}