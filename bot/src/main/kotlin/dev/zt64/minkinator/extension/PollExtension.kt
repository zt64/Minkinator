package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.interaction.followup.edit
import dev.kord.core.behavior.reply
import dev.kord.rest.builder.message.embed
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.defaultingDuration
import dev.kordex.core.commands.converters.impl.string
import dev.kordex.core.components.components
import dev.kordex.core.components.ephemeralStringSelectMenu
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.kordex.core.time.TimestampType
import dev.kordex.core.utils.toDuration
import dev.zt64.minkinator.util.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.sync.withLock
import kotlinx.datetime.DateTimePeriod
import kotlinx.datetime.TimeZone

object PollExtension : Extension() {
    override val name = "poll"

    override suspend fun setup() {
        publicSlashCommand(
            name = "poll".toKey(),
            description = "Create a poll".toKey(),
            arguments = PollExtension::PollArgs
        ) {
            locking = true

            check {
                failIf("A poll is already in progress") { mutex!!.isLocked }
            }

            action {
                this@publicSlashCommand.mutex!!.withLock {
                    val question = arguments.question
                    val choices = arguments.choices.split(",", ";")
                    val votes = mutableMapOf<Snowflake, Int>()
                    val duration = arguments.duration.toDuration(TimeZone.UTC)

                    val response = respond {
                        embed {
                            color = Color.success
                            title = question
                            description = "Ending ${duration.toDiscord(TimestampType.RelativeTime)}"
                        }

                        components(timeout = duration) {
                            ephemeralStringSelectMenu {
                                choices.forEachIndexed { index, choice ->
                                    option(choice.toKey(), "$index") {
                                        action {
                                            votes[user.id] = value.toInt()
                                        }
                                    }
                                }
                            }
                        }
                    }

                    delay(duration)

                    response.edit {
                        embed {
                            color = Color.success
                            title = question
                        }

                        components { }
                    }

                    response.message.reply {
                        embed {
                            color = Color.success
                            title = "Poll Results"
                            description = if (votes.isEmpty()) {
                                "No votes were cast"
                            } else {
                                buildString {
                                    choices.zip(votes.values).forEach { (choice, votes) ->
                                        val percentage = votes.toDouble() / choices.size * 100

                                        appendLine("$choice - ${"vote".pluralize(votes)} ($percentage%)")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private class PollArgs : Arguments() {
        val question by string {
            name = "question".toKey()
            description = "The question".toKey()
            maxLength = 256
        }

        val choices by string {
            name = "choices".toKey()
            description = "Choices to show".toKey()

            mutate { value -> value.replace(",", ", ") }

            validate {
                failIf("Maximum of 25 choices") {
                    value.split(", ", ",", ";").size > 25
                }
                failIf("Choices can only be 100 characters long") {
                    value.split(", ", ",", ";").any { it.length > 100 }
                }
            }
        }

        val duration by defaultingDuration {
            name = "duration".toKey()
            description = "How long should the poll last".toKey()
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