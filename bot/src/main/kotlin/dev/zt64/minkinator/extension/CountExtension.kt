package dev.zt64.minkinator.extension

import dev.kord.core.event.message.MessageCreateEvent
import dev.kordex.core.extensions.Extension
import dev.kordex.core.extensions.event
import dev.zt64.minkinator.i18n.Translations
import dev.zt64.minkinator.util.chatCommand
import dev.zt64.minkinator.util.chatGroupCommand
import org.koin.core.component.inject
import org.komapper.r2dbc.R2dbcDatabase

// Extension for adding a count command
object CountExtension : Extension() {
    override val name = "count"

    private val db: R2dbcDatabase by inject()

    override suspend fun setup() {
        chatGroupCommand(Translations.Command.count, Translations.Command.Description.count) {
            chatCommand(Translations.Command.Subcommand.Count.start, Translations.Command.Subcommand.Count.Description.start) {
                action {
                }
            }

            chatCommand(Translations.Command.Subcommand.Count.stop, Translations.Command.Subcommand.Count.Description.stop) {
                action {
                }
            }

            chatCommand(Translations.Command.Subcommand.Count.score, Translations.Command.Subcommand.Count.Description.score) {
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