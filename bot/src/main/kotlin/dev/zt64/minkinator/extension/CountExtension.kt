package dev.zt64.minkinator.extension

import dev.kord.core.event.message.MessageCreateEvent
import dev.kordex.core.extensions.Extension
import dev.kordex.core.extensions.event
import dev.kordex.core.i18n.toKey
import dev.zt64.minkinator.util.chatCommand
import dev.zt64.minkinator.util.chatGroupCommand
import org.koin.core.component.inject
import org.komapper.r2dbc.R2dbcDatabase

// Extension for adding a count command
object CountExtension : Extension() {
    override val name = "count"

    private val db: R2dbcDatabase by inject()

    override suspend fun setup() {
        chatGroupCommand("count".toKey(), "Count related commands".toKey()) {
            chatCommand("start".toKey(), "Configure and start channel for counting".toKey()) {
                action {
                }
            }

            chatCommand("stop".toKey(), "Stop counting in the current channel".toKey()) {
                action {
                }
            }

            chatCommand("score".toKey(), "Get the current score".toKey()) {
                action {
                }
            }
        }

        event<MessageCreateEvent> {
            check {
                failIf {
                    // Check if the message is in a counting channel
                    true
                }
            }
            action {
            }
        }
    }
}