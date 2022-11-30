package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalMember
import com.kotlindiscord.kord.extensions.components.components
import com.kotlindiscord.kord.extensions.components.ephemeralButton
import com.kotlindiscord.kord.extensions.components.types.emoji
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.edit
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.rest.builder.message.create.embed
import dev.kord.rest.builder.message.modify.embed
import dev.kord.x.emoji.Emojis
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.withTimeoutOrNull
import zt.minkinator.util.footer
import zt.minkinator.util.publicSlashCommand
import kotlin.time.Duration.Companion.seconds

class TicTacToeExtension(override val name: String = "tic-tac-toe") : Extension() {
    private companion object {
        private val timeoutDuration = 30.seconds

        private val X_EMOJI = Emojis.x
        private val O_EMOJI = Emojis.o
    }

    override suspend fun setup() {
        publicSlashCommand(
            name = "tic-tac-toe",
            description = "Play a game of tic-tac-toe",
            arguments = ::Args
        ) {
            locking = true

            check {
                anyGuild()
            }

            action {
                this@publicSlashCommand.unlock()

                val opponent = arguments.player

                val mutex = Mutex()
                respond {
                    embed {
                        title = "Tic Tac Toe"
                        description = buildString {

                        }

                        footer("")
                    }

                    components {
                        ephemeralButton {
                            label = "Cancel"

                            emoji(Emojis.x.unicode)

                            action {

                            }
                        }
                    }
                }

                try {
                    val opp = withTimeoutOrNull(timeoutDuration) {

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
            name = "player"
            description = "The user to play against"
        }
    }
}