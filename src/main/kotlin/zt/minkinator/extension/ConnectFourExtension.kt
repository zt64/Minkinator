package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalUser
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.edit
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.rest.builder.message.create.embed
import zt.minkinator.util.footer
import zt.minkinator.util.publicSlashCommand

object ConnectFourExtension : Extension() {
    override val name = "connect-four"

    override suspend fun setup() {
        publicSlashCommand(
            name = "connect-four",
            description = "Play a game of connect four",
            arguments = ::Args
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