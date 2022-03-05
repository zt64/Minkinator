package zt.minkinator.extensions.utility

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.defaultingDuration
import com.kotlindiscord.kord.extensions.commands.converters.impl.string
import com.kotlindiscord.kord.extensions.components.components
import com.kotlindiscord.kord.extensions.components.publicButton
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.publicSlashCommand
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.core.behavior.reply
import dev.kord.rest.builder.message.create.embed
import kotlinx.coroutines.delay
import kotlinx.datetime.DateTimePeriod
import zt.minkinator.util.success

class PollExtension(override val name: String = "poll") : Extension() {
    override suspend fun setup() {
        publicSlashCommand(::PollArgs) {
            name = "poll"
            description = "Create a poll"

            check {
                anyGuild()
            }

            action {
                val choices = arguments.choices.split(", ")
                val response = respond {
                    embed {
                        color = Color.success
                        title = "Poll"
                        description = arguments.poll
                    }

                    components {
                        choices.forEach { choice ->
                            publicButton {
                                id = choice
                                label = choice

                                action {

                                }
                            }
                        }
                    }
                }

                delay((arguments.duration.seconds * 1000).toLong())

                response.message.reply {
                    embed {
                        color = Color.success
                        title = "Poll Results"
                    }
                }
            }
        }
    }

    private inner class PollArgs : Arguments() {
        val poll by string {
            name = "poll"
            description = "The poll"
        }

        val choices by string {
            name = "choices"
            description = "Choices to show"
        }

        val duration by defaultingDuration {
            name = "duration"
            description = "How long should the poll last"
            defaultValue = DateTimePeriod(seconds = 60)
        }
    }
}