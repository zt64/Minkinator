package zt.minkinator.extensions.utility

import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.publicSlashCommand
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.rest.builder.message.create.embed
import zt.minkinator.util.success

class CoinTossExtension(override val name: String = "coin-toss") : Extension() {
    private enum class CoinState(val displayName: String) {
        HEADS("Heads"),
        TAILS("Tails");

        override fun toString() = displayName
    }

    override suspend fun setup() {
        publicSlashCommand {
            name = "coin-toss"
            description = "Toss a coin, and see if it lands on heads, or tails"

            action {
                respond {
                    embed {
                        color = Color.success
                        title = "The coin landed on ${CoinState.values().random()}!"
                    }
                }
            }
        }
    }
}