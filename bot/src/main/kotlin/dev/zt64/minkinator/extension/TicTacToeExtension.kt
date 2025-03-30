package dev.zt64.minkinator.extension

import dev.kord.rest.builder.message.embed
import dev.kord.x.emoji.Emojis
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.optionalMember
import dev.kordex.core.components.components
import dev.kordex.core.components.ephemeralButton
import dev.kordex.core.components.types.emoji
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.zt64.minkinator.util.footer
import dev.zt64.minkinator.util.publicSlashCommand
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.withTimeoutOrNull
import kotlin.time.Duration.Companion.seconds

object TicTacToeExtension : Extension() {
    override val name = "tic-tac-toe"

    private val timeoutDuration = 30.seconds

    override suspend fun setup() {
        publicSlashCommand(
            name = "tic-tac-toe".toKey(),
            description = "Play a game of tic-tac-toe".toKey(),
            arguments = TicTacToeExtension::Args
        ) {
            locking = true

            check {
                anyGuild()
            }

            action {
                this@publicSlashCommand.unlock()

                arguments.player

                Mutex()
                respond {
                    embed {
                        title = "Tic Tac Toe"
                        description =
                            buildString {
                            }

                        footer("")
                    }

                    components {
                        ephemeralButton {
                            label = "Cancel".toKey()

                            emoji(Emojis.x.unicode)

                            action {
                            }
                        }
                    }
                }

                try {
                    withTimeoutOrNull(timeoutDuration) {
                    }
                } catch (e: TimeoutCancellationException) {
                    edit {
                        embed {
                            title = "Tic Tac Toe"
                            description = "Game timed out"

                            footer("")
                        }
                    }
                }
            }
        }
    }

    private class Args : Arguments() {
        val player by optionalMember {
            name = "player".toKey()
            description = "The user to play against".toKey()
        }
    }
}