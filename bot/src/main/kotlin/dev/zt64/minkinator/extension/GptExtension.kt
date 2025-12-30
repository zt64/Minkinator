package dev.zt64.minkinator.extension

import com.aallam.openai.api.BetaOpenAI
import com.aallam.openai.api.assistant.Assistant
import com.aallam.openai.api.assistant.AssistantId
import com.aallam.openai.api.assistant.AssistantRequest
import com.aallam.openai.api.audio.SpeechRequest
import com.aallam.openai.api.audio.Voice
import com.aallam.openai.api.chat.ChatCompletionRequest
import com.aallam.openai.api.chat.ChatMessage
import com.aallam.openai.api.chat.ChatRole
import com.aallam.openai.api.image.ImageCreation
import com.aallam.openai.api.image.ImageSize
import com.aallam.openai.api.logging.LogLevel
import com.aallam.openai.api.model.ModelId
import com.aallam.openai.client.LoggingConfig
import com.aallam.openai.client.OpenAI
import dev.kord.common.Color
import dev.kord.common.entity.Snowflake
import dev.kord.core.entity.Message
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kord.rest.NamedFile
import dev.kord.rest.builder.message.embed
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.defaultingString
import dev.kordex.core.commands.converters.impl.optionalString
import dev.kordex.core.commands.converters.impl.string
import dev.kordex.core.events.EventContext
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.kordex.core.utils.env
import dev.zt64.minkinator.util.*
import io.ktor.client.request.forms.*
import io.ktor.http.*
import io.ktor.utils.io.*
import org.koin.core.component.inject
import org.komapper.r2dbc.R2dbcDatabase

@OptIn(BetaOpenAI::class)
class GptExtension(apiKey: String = env("OPENAI_KEY")) : Extension() {
    override val name = "gpt"

    @OptIn(PrivilegedIntent::class)
    override val intents = mutableSetOf<Intent>(Intent.MessageContent)

    private val openAI = OpenAI(token = apiKey, logging = LoggingConfig(LogLevel.None))
    private lateinit var assistant: Assistant
    private val threads = mutableMapOf<Snowflake, MutableList<ChatMessage>>()
    private var model = ModelId("gpt-4o-mini")
    private val prompt = """You are a roleplaying as a bot named Minkinator. Minkinator will make up responses if he does
        |not know them. He will type in all lowercase. He will
        |sometimes respond with something that is not even a response to the question.
        |For example:
        |NOT ALLOWED:
        |Q: hi
        |A: hey there, zoot! how’s it going? what’s up?
        |ALLOWED:
        |Q: hi
        |A: hi
    """.trimMargin()

    private val db: R2dbcDatabase by inject()

    private suspend fun Message.sanitize() = buildString {
        append("${getAuthorAsMemberOrNull()!!.effectiveName}: ")
        append(content.trim())

        mentionedUsers.collect { user ->
            replace(user.mention.toRegex(), user.username)
        }

        attachments.forEach { attachment ->
            append(" ${attachment.url}")
        }
    }

    context(_: EventContext<MessageCreateEvent>)
    private suspend fun String.unsanitize(): String {
        return buildString {
        }
    }

    private suspend fun MutableList<ChatMessage>.request(message: String, name: String? = null): ChatMessage? {
        add(ChatMessage(ChatRole.User, message, name))

        val request = ChatCompletionRequest(model = model, messages = this)

        return openAI
            .chatCompletion(request)
            .choices
            .firstNotNullOfOrNull { it.message }
            .also { add(it!!) }
    }

    override suspend fun setup() {
        kord.selfId

        assistant = openAI.assistant(AssistantId("asst_9LHtp1UtVO0myatfKErzsNXq")) ?: run {
            openAI
                .assistant(
                    request = AssistantRequest(
                        name = "minkinator",
                        instructions = prompt,
                        model = model
                    )
                ).also {
                    // store ID in database
                }
        }

        // assistant = openAI.assistant(
        //     request = AssistantRequest(
        //         id = "minkinator",
        //         instructions = prompt,
        //         model = model
        //     )
        // )

        // event<MessageCreateEvent> {
        //     check {
        //         anyGuild()
        //         isNotBot()
        //         failIfNot(event.message.mentions(selfId))
        //     }
        //
        //     action {
        //         val message = event.message
        //         val sanitizedMessage = message.sanitize()
        //
        //         val flagged = openAI
        //             .moderations(ModerationRequest(listOf(sanitizedMessage)))
        //             .results
        //             .single()
        //             .flagged
        //
        //         if (flagged) {
        //             return@action message.addReaction(Emojis.triangularFlagOnPost.toReaction())
        //         }
        //
        //         message.channel.withTyping {
        //             withTimeoutOrNull(30.seconds) {
        //                 val response = threads
        //                     .getOrPut(message.channelId) {
        //                         mutableListOf<ChatMessage>().also { thread ->
        //                             thread.request(prompt)!!
        //                         }
        //                     }.request(sanitizedMessage)
        //                     ?.content
        //
        //                 if (response == null) {
        //                     threads[message.channelId]!!.dropLast(1)
        //
        //                     return@withTimeoutOrNull
        //                 }
        //
        //                 message.reply(response.substringAfter("(Developer Mode Output) "))
        //             }
        //         }
        //     }
        // }

        publicSlashCommand(
            name = "gpt".toKey(),
            description = "GPT related commands".toKey()
        ) {
            checkSuperuser()

            publicSubCommand(
                name = "reset".toKey(),
                description = "Reset chat".toKey()
            ) {
                action {
                    respond {
                        content = "Resetting chat..."
                    }

                    threads.clear()

                    edit {
                        content = "Chat reset"
                    }
                }
            }

            class ModelArgs : Arguments() {
                val model by optionalString {
                    name = "model".toKey()
                    description = "The model to use".toKey()
                }
            }

            publicSubCommand(
                name = "model".toKey(),
                description = "Set the model".toKey(),
                ::ModelArgs
            ) {
                action {
                    val models = openAI.models()

                    respond {
                        embed {
                            if (arguments.model == null) {
                                color = Color.success

                                title = "Available models"
                                description = buildString {
                                    appendLine("Current model: ${model.id}")
                                    appendLine()

                                    appendLine("```")
                                    models
                                        .sortedBy { it.id.id }
                                        .joinToString("\n") { it.id.id }
                                        .also { append(it) }
                                    appendLine("```")
                                }
                            } else {
                                if (models.any { it.id.id == arguments.model }) {
                                    model = ModelId(arguments.model!!)
                                    color = Color.success
                                    title = "Model set"
                                    description = "Model set to ${model.id}"
                                } else {
                                    color = Color.error
                                    title = "Model not found"
                                    description = "Model ${arguments.model} not found"
                                }
                            }
                        }
                    }
                }
            }

            class TtsArgs : Arguments() {
                val text by defaultingString {
                    name = "text".toKey()
                    description = "The text to convert to speech".toKey()
                    maxLength = 200
                    defaultValue = "The slow brown worm writhed in the cold, damp soil."
                }
            }

            publicSubCommand(
                name = "tts".toKey(),
                description = "Text to speech".toKey(),
                ::TtsArgs
            ) {
                action {
                    val response = openAI.speech(
                        request = SpeechRequest(
                            model = ModelId("gpt-4o-mini-tts"),
                            input = arguments.text,
                            voice = Voice("cedar")
                        )
                    )

                    respond {
                        files += NamedFile(
                            name = "speech.mp3",
                            contentProvider = ChannelProvider { ByteReadChannel(response) }
                        )
                    }
                }
            }

            class MessageArgs : Arguments() {
                val text by string {
                    name = "text".toKey()
                    description = "The message to send".toKey()
                    maxLength = 200
                }
            }

            publicSubCommand(
                name = "message".toKey(),
                description = "Chat".toKey(),
                ::MessageArgs
            ) {
                action {
                    respond {
                    }
                }
            }

            class ImageArgs : Arguments() {
                val text by string {
                    name = "text".toKey()
                    description = "The image prompt".toKey()
                    maxLength = 200
                }
            }

            publicSubCommand(
                name = "image".toKey(),
                description = "Generate an image from text".toKey(),
                ::ImageArgs
            ) {
                action {
                    respond {
                        content = "Generating image..."
                    }

                    val generatedImage = openAI
                        .imageURL(
                            creation = ImageCreation(
                                prompt = arguments.text,
                                model = ModelId("dall-e-3"),
                                n = 1,
                                size = ImageSize.is1024x1024
                            )
                        ).single()

                    edit {
                        content = ""

                        embed {
                            color = Color.success
                            title = "Image generated"
                            image = generatedImage.url
                        }
                    }
                }
            }
        }
    }
}