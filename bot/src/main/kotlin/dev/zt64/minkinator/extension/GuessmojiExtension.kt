package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.common.entity.Snowflake
import dev.kord.rest.builder.message.embed
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.int
import dev.kordex.core.components.components
import dev.kordex.core.components.publicButton
import dev.kordex.core.components.types.emoji
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.kordex.core.time.TimestampType
import dev.zt64.minkinator.i18n.Translations
import dev.zt64.minkinator.util.*
import kotlinx.coroutines.delay
import kotlin.time.Duration.Companion.seconds

object GuessmojiExtension : Extension() {
    override val name = "guessmoji"

    private val duration = 10.seconds

    private object Emojis {
        private const val TORNADO = "\uD83C\uDF2A"
        private const val SNOWFLAKE = "\u2744\uFE0F"
        private const val FIRE = "\uD83D\uDD25"
        private const val CLOUD = "\u2601\uFE0F"
        private const val JOY = "\uD83D\uDE02"
        private const val SAD = "\uD83D\uDE14"
        private const val ANGRY = "\uD83D\uDE20"
        private const val CRY = "\uD83D\uDE22"
        private const val HEART = "\u2764\uFE0F"
        private const val CAT = "\uD83D\uDC31"
        private const val SUN = "\u2600\uFE0F"
        private const val MOON = "\uD83C\uDF19"
        private const val RAIN = "\uD83D\uDCA7"
        private const val EGG = "\uD83E\uDD5A"
        private const val CHEESE = "\uD83E\uDDC0"
        private const val BANANA = "\uD83C\uDF4C"
        private const val APPLE = "\uD83C\uDF4E"
        private const val PEACH = "\uD83C\uDF51"
        private const val CHERRY = "\uD83C\uDF52"
        private const val STRAWBERRY = "\uD83C\uDF53"
        private const val TOMATO = "\uD83C\uDF45"

        val all = listOf(
            TORNADO,
            SNOWFLAKE,
            FIRE,
            CLOUD,
            JOY,
            SAD,
            ANGRY,
            CRY,
            HEART,
            CAT,
            SUN,
            MOON,
            RAIN,
            EGG,
            CHEESE,
            BANANA,
            APPLE,
            PEACH,
            CHERRY,
            STRAWBERRY,
            TOMATO
        )
    }

    override suspend fun setup() {
        publicSlashCommand(
            name = Translations.Command.guess,
            description = Translations.Command.Description.guess,
            arguments = GuessmojiExtension::Args
        ) {
            locking = true

            check {
                failIfNot("A game is already running") {
                    mutex!!.isLocked
                }
            }

            action {
                val emojiCount = arguments.emojis
                val emojis = Emojis.all.shuffled().take(emojiCount)
                val winners = mutableListOf<Snowflake>()
                val randomEmoji = emojis.random()

                respond {
                    embed {
                        color = Color.success
                        title = "Guessmoji"
                        description = buildString {
                            appendLine("I'm thinking of an emoji, can you guess it?")
                            appendLine("Ending ${duration.toDiscord(TimestampType.RelativeTime)}")
                        }

                        footer("Choices: $emojiCount")
                    }

                    components {
                        emojis.forEach { emoji ->
                            var votes = 0

                            publicButton {
                                label = votes.toString().toKey()

                                emoji(emoji)

                                action {
                                    if (emoji == randomEmoji) {
                                        winners += user.id
                                        votes++
                                    } else {
                                        winners -= user.id
                                        votes--
                                    }

                                    edit {
                                        label = votes.toString().toKey()
                                    }
                                }
                            }
                        }
                    }
                }

                delay(duration)

                edit {
                    embed {
                        color = Color.success
                        title = "Times up!"
                        description = buildString {
                            if (winners.isEmpty()) {
                                appendLine("No one guessed correctly")
                            } else {
                                appendLine("${winners.joinToString { "<@!$it>" }} guessed correctly!")
                            }

                            appendLine()
                            appendLine("The emoji was $randomEmoji")
                        }
                    }

                    components { }
                }
            }
        }
    }

    private class Args : Arguments() {
        val emojis by int {
            name = Translations.Argument.emojis
            description = Translations.Argument.Description.emojis
            minValue = 2
            maxValue = 10
        }
    }
}