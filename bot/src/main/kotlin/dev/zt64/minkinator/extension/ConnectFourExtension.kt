package dev.zt64.minkinator.extension

import dev.kord.rest.builder.message.embed
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.optionalUser
import dev.kordex.core.extensions.Extension
import dev.zt64.minkinator.util.footer
import dev.zt64.minkinator.util.publicSlashCommand

object ConnectFourExtension : Extension() {
    override val name = "connect-four"

    override suspend fun setup() {
        publicSlashCommand(
            name = "connect-four",
            description = "Play a game of connect four",
            arguments = ConnectFourExtension::Args
        ) {
            locking = true

            check {
                anyGuild()
            }

            action {
                val player = arguments.player

                respond {
                    embed {
                        title = "Connect Four"
                        description = buildString {
                        }

                        footer("")
                    }
                }

                edit {
                }
            }
        }
    }

    private class Args : Arguments() {
        val player by optionalUser {
            name = "player"
            description = "The player to play against"
        }
    }
}