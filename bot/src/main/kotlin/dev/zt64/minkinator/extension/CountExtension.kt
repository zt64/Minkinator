package dev.zt64.minkinator.extension

import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import dev.kord.core.event.message.MessageCreateEvent
import dev.zt64.minkinator.util.chatCommand
import dev.zt64.minkinator.util.chatGroupCommand
import org.koin.core.component.inject
import org.komapper.r2dbc.R2dbcDatabase

// Extension for adding a count command
object CountExtension : Extension() {
    override val name = "count"

    private val db: R2dbcDatabase by inject()

    override suspend fun setup() {
        chatGroupCommand("count", "Count related commands") {
            chatCommand("start", "Configure and start channel for counting") {
                action {
                }
            }

            chatCommand("stop", "Stop counting in the current channel") {
                action {
                }
            }

            chatCommand("score", "Get the current score") {
                action {
                }
            }
        }

        event<MessageCreateEvent> {
            action {
            }
        }
    }
}