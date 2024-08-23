package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.common.entity.ButtonStyle
import dev.kord.common.entity.Permission
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.interaction.followup.edit
import dev.kord.core.entity.User
import dev.kord.rest.builder.message.EmbedBuilder
import dev.kord.rest.builder.message.embed
import dev.kord.x.emoji.DiscordEmoji
import dev.kord.x.emoji.Emojis
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.application.slash.converters.impl.optionalStringChoice
import dev.kordex.core.commands.converters.impl.defaultingInt
import dev.kordex.core.components.components
import dev.kordex.core.components.publicButton
import dev.kordex.core.extensions.Extension
import dev.kordex.core.time.TimestampType
import dev.zt64.minkinator.util.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.coroutines.*
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import org.koin.core.component.inject
import kotlin.collections.set
import kotlin.time.Duration.Companion.seconds

object TriviaExtension : Extension() {
    override val name = "trivia"

    private val httpClient: HttpClient by inject()

    private enum class Emoji(
        val emoji: DiscordEmoji.Generic
    ) {
        A(Emojis.regionalIndicatorA),
        B(Emojis.regionalIndicatorB),
        C(Emojis.regionalIndicatorC),
        D(Emojis.regionalIndicatorD)
    }

    @Serializable
    private enum class QuestionType {
        @SerialName("multiple")
        MULTIPLE,

        @SerialName("boolean")
        BOOLEAN
    }

    @Serializable
    private data class TriviaDBResponse(
        @SerialName("results")
        val questions: List<Question>
    ) {
        @Serializable
        data class Question(
            val type: QuestionType,
            val category: String,
            val question: String,
            @SerialName("correct_answer")
            val correctAnswer: String,
            @SerialName("incorrect_answers")
            val incorrectAnswers: List<String>
        )
    }

    override suspend fun setup() {
        val games = mutableMapOf<Snowflake, Job>()

        publicSlashCommand(
            name = "trivia",
            description = "Play a game of trivia!"
        ) {
            publicSubCommand(
                name = "start",
                description = "Start the trivia game",
                arguments = TriviaExtension::StartArguments
            ) {
                locking = true

                requireBotPermissions(Permission.SendMessages)

                check {
                    failIf("Trivia is already active in this channel!") {
                        games.contains(event.interaction.channelId)
                    }
                }

                action {
                    this@publicSlashCommand.withLock {
                        val duration = 10.seconds

                        games[channel.id] =
                            channel.kord.launch {
                                val totalQuestions = arguments.questions

                                val response: TriviaDBResponse = httpClient
                                    .get("https://opentdb.com/api.php") {
                                        parameter("amount", totalQuestions)
                                        parameter("category", arguments.category)
                                        parameter("difficulty", arguments.difficulty)
                                    }.body()

                                val score = mutableMapOf<User, Int>()

                                response.questions.forEachIndexed { index, question ->
                                    val category = question.category
                                    val formattedQuestion = question.question.decodeEntities()
                                    val incorrectAnswers = question.incorrectAnswers.map(String::decodeEntities)
                                    val correctAnswer = question.correctAnswer.decodeEntities()
                                    val participants = mutableMapOf<User, Boolean>()

                                    val embedBuilder: EmbedBuilder.() -> Unit = {
                                        color = Color.success
                                        title = category
                                        description = """
                                            $formattedQuestion

                                            Ending ${duration.toDiscord(TimestampType.RelativeTime)}
                                        """.trimIndent()

                                        footer("Question ${index + 1} of $totalQuestions")
                                    }

                                    val message =
                                        respond {
                                            embed(embedBuilder)

                                            components(timeout = 10.seconds) {
                                                if (question.type == QuestionType.BOOLEAN) {
                                                    publicButton {
                                                        style = ButtonStyle.Primary
                                                        label = "True"

                                                        action {
                                                            participants[user.asUser()] = (correctAnswer == "True")
                                                        }
                                                    }

                                                    publicButton {
                                                        style = ButtonStyle.Danger
                                                        label = "False"

                                                        action {
                                                            participants[user.asUser()] = (correctAnswer == "False")
                                                        }
                                                    }
                                                } else {
                                                    val choices = incorrectAnswers + correctAnswer

                                                    choices.forEachIndexed { index, choice ->
                                                        publicButton {
                                                            style = ButtonStyle.Secondary
                                                            label = choice
                                                            partialEmoji = Emoji.entries[index].emoji.partial

                                                            action {
                                                                participants[user.asUser()] = (correctAnswer == choice)
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                    delay(10000)

                                    message.edit {
                                        embed {
                                            embedBuilder()
                                            description = """
                                                $formattedQuestion

                                                The correct answer was ${correctAnswer.decodeEntities()}
                                            """.trimIndent()

                                            if (participants.isNotEmpty()) {
                                                field {
                                                    name = "Participants:"
                                                    value = participants
                                                        .map { (user, correct) ->
                                                            "${if (correct) Emojis.whiteCheckMark else Emojis.x} - ${user.mention}"
                                                        }.joinToString("\n")
                                                }
                                            }
                                        }

                                        components { }
                                    }
                                }

                                games.remove(channel.id)

                                respond {
                                    embed {
                                        color = Color.success
                                        title = "Trivia Results"
                                    }
                                }
                            }
                    }
                }
            }

            publicSubCommand(
                name = "stop",
                description = "Stops any ongoing trivia game in the current channel"
            ) {
                check {
                    failIf("No trivia game is currently running in this channel!") {
                        !games.contains(event.interaction.channelId)
                    }
                }

                action {
                    val game = games[channel.id]!!

                    game.cancelAndJoin()

                    games.remove(channel.id)

                    respond {
                        embed {
                            color = Color.success
                            description = "Stopped trivia for current channel"
                        }
                    }
                }
            }

            ephemeralSubCommand(
                name = "config",
                description = "Change trivia game config"
            ) {
                check {
                    anyGuild()
                }

                action {
                    respond {
                        embed {
                            color = Color.success
                            title = "Trivia Config"

                            field(
                                name = "${Emojis.stopwatch} Question Duration: ",
                                value = "20s"
                            )
                        }

                        components {
                            publicButton {
                                style = ButtonStyle.Danger
                                label = "Reset"

                                action {
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private class StartArguments : Arguments() {
        val questions by defaultingInt {
            name = "questions"
            description = "The number of questions to ask"
            minValue = 1
            maxValue = 50
            defaultValue = 10
        }
        val category by optionalStringChoice {
            name = "category"
            description = "The category of questions"
            choices = mutableMapOf(
                "General Knowledge" to "9",
                "Entertainment: Books" to "10",
                "Entertainment: Film" to "11",
                "Entertainment: Music" to "12",
                "Entertainment: Musicals & Theatres" to "13",
                "Entertainment: Television" to "14",
                "Entertainment: Video Games" to "15",
                "Entertainment: Board Games" to "16",
                "Science & Nature" to "17",
                "Science: Computers" to "18",
                "Science: Mathematics" to "19",
                "Mythology" to "20",
                "Sports" to "21",
                "Geography" to "22",
                "History" to "23",
                "Politics" to "24",
                "Art" to "25",
                "Celebrities" to "26",
                "Animals" to "27",
                "Vehicles" to "28",
                "Entertainment: Comics" to "29",
                "Science: Gadgets" to "30",
                "Entertainment: Cartoon & Animations" to "32"
            )
        }
        val difficulty by optionalStringChoice {
            name = "difficulty"
            description = "The difficulty of the questions"
            choices = mutableMapOf(
                "Easy" to "easy",
                "Medium" to "medium",
                "Hard" to "hard"
            )
        }
    }
}