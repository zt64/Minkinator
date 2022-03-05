package zt.minkinator.extensions

import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.ephemeralSlashCommand
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.entity.Snowflake
import dev.kord.core.Kord
import zt.minkinator.config

class RestrictedExtension(override val name: String = "restricted") : Extension() {
    override suspend fun setup() {
        ephemeralSlashCommand {
            name = "stop"
            description = "Stop the bot"

            allowUser(Snowflake(config.superUserId))

            action {
                respond { content = "Stopping..." }

                getKoin().get<Kord>().shutdown()
            }
        }
    }
}