package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.rest.builder.message.embed
import dev.kordex.core.extensions.Extension
import dev.zt64.minkinator.util.publicSlashCommand
import dev.zt64.minkinator.util.success

object CoinTossExtension : Extension() {
    override val name = "coin-toss"

    private enum class CoinState {
        HEADS,
        TAILS
    }

    override suspend fun setup() {
        publicSlashCommand(
            name = "coin-toss",
            description = "Toss a coin, and see if it lands on heads, or tails"
        ) {
            action {
                respond {
                    embed {
                        color = Color.success
                        title = "\uD83E\uDE99 The coin landed on ${CoinState.entries.random().name.lowercase()}!"
                    }
                }
            }
        }
    }
}