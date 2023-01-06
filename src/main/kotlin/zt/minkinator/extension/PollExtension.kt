package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.defaultingDuration
import com.kotlindiscord.kord.extensions.commands.converters.impl.string
import com.kotlindiscord.kord.extensions.components.components
import com.kotlindiscord.kord.extensions.components.ephemeralSelectMenu
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.time.TimestampType
import com.kotlindiscord.kord.extensions.types.respond
import com.kotlindiscord.kord.extensions.utils.toDuration
import dev.kord.common.Color
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.interaction.followup.edit
import dev.kord.core.behavior.reply
import dev.kord.rest.builder.message.create.embed
import dev.kord.rest.builder.message.modify.embed
import kotlinx.coroutines.delay
import kotlinx.datetime.DateTimePeriod
import kotlinx.datetime.TimeZone
import zt.minkinator.util.publicSlashCommand
import zt.minkinator.util.success
import zt.minkinator.util.toDiscord
import kotlin.time.Duration

object PollExtension : Extension() {
    override val name = "poll"

    private val polls: MutableMap<Snowflake, Poll> = mutableMapOf()

    private data class Poll(
        val question: String,
        val duration: Duration,
        val choices: List<String>,
        val votes: MutableMap<Int, Int>
    )

    override suspend fun setup() {
        publicSlashCommand(
            name = "poll",
            description = "Create a poll",
            arguments = ::PollArgs
        ) {
            action {
                val question = arguments.question
                val choices = arguments.choices.split(", ")
                val votes = mutableMapOf<Snowflake, String>()
                val duration = arguments.duration.toDuration(TimeZone.UTC)

                val response = respond {
                    embed {
                        color = Color.success
                        title = question

                        description = "Ending ${duration.toDiscord(TimestampType.RelativeTime)}"
                    }

                    components(timeout = duration) {
                        ephemeralSelectMenu {
                            choices.forEachIndexed { index, choice ->
                                option(choice, "$index") {
                                    action {
                                        votes[user.id] = choice
                                    }
                                }
                            }
                        }
                    }
                }

                val poll = Poll(
                    question = question,
                    duration = duration,
                    choices = choices,
                    votes = mutableMapOf()
                )

                polls[response.id] = poll

                delay(duration)

                response.edit {
                    embed {
                        color = Color.success
                        title = question
                    }
                }

                response.message.reply {
                    embed {
                        color = Color.success
                        title = "Poll Results"

                        votes.map { (snowflake, vote) ->

                        }

                        description = choices.joinToString(separator = "\n") { choice ->
                            "$choice: 0"
                        }
                    }
                }
            }
        }
    }

    private class PollArgs : Arguments() {
        val question by string {
            name = "question"
            description = "The question"
            maxLength = 256
        }

        val choices by string {
            name = "choices"
            description = "Choices to show"

            mutate { value -> value.replace(",", ", ") }

            validate {
                failIf("Maximum of 25 choices") {
                    value.split(", ", ",").size > 25
                }
            }
        }

        val duration by defaultingDuration {
            name = "duration"
            description = "How long should the poll last"
            defaultValue = DateTimePeriod(seconds = 60)
            positiveOnly = true
            longHelp = true

            validate {
                failIf("Entered duration is too short") {
                    value.toDuration(TimeZone.UTC).inWholeSeconds < 10
                }

                failIf("Entered duration is too long") {
                    value.toDuration(TimeZone.UTC).inWholeDays > 7
                }
            }
        }
    }
}