package dev.zt64.minkinator.extension

import com.aallam.openai.api.BetaOpenAI
import com.aallam.openai.api.chat.ChatCompletionRequest
import com.aallam.openai.api.chat.ChatMessage
import com.aallam.openai.api.chat.ChatRole
import com.aallam.openai.api.logging.LogLevel
import com.aallam.openai.api.model.ModelId
import com.aallam.openai.api.moderation.ModerationRequest
import com.aallam.openai.client.LoggingConfig
import com.aallam.openai.client.OpenAI
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.channel.withTyping
import dev.kord.core.behavior.edit
import dev.kord.core.entity.Message
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kord.x.emoji.Emojis
import dev.kord.x.emoji.toReaction
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.checks.isNotBot
import dev.kordex.core.events.EventContext
import dev.kordex.core.extensions.Extension
import dev.kordex.core.extensions.chatGroupCommand
import dev.kordex.core.extensions.event
import dev.kordex.core.utils.env
import dev.zt64.minkinator.util.isSuperuser
import dev.zt64.minkinator.util.mentions
import dev.zt64.minkinator.util.reply
import kotlinx.coroutines.withTimeoutOrNull
import kotlin.time.Duration.Companion.seconds

@OptIn(BetaOpenAI::class)
class GptExtension(
    apiKey: String = env("OPENAI_KEY")
) : Extension() {
    override val name = "gpt"

    @OptIn(PrivilegedIntent::class)
    override val intents = mutableSetOf<Intent>(Intent.MessageContent)

    private val openAI = OpenAI(token = apiKey, logging = LoggingConfig(LogLevel.None))
    private val threads = mutableMapOf<Snowflake, MutableList<ChatMessage>>()
    private val model = ModelId("gpt-4")
    private val prompt =
        "You are a roleplaying as a person named Minkinator. Minkinator will make up responses if he does not know them. He will type in all lowercase."

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

    context(EventContext<MessageCreateEvent>)
    private suspend fun String.unsanitize(): String {
        return buildString {
        }
    }

    private suspend fun MutableList<ChatMessage>.request(
        message: String,
        name: String? = null
    ): ChatMessage? {
        add(ChatMessage(ChatRole.User, message, name))

        val request = ChatCompletionRequest(
            model = model,
            messages = this
        )

        return openAI
            .chatCompletion(request)
            .choices
            .firstNotNullOfOrNull { it.message }
            .also { add(it!!) }
    }

    override suspend fun setup() {
        val selfId = kord.selfId

        event<MessageCreateEvent> {
            check {
                anyGuild()
                isNotBot()
                failIfNot(event.message.mentions(selfId))
            }

            action {
                val message = event.message
                val sanitizedMessage = message.sanitize()

                val flagged = openAI
                    .moderations(
                        request = ModerationRequest(listOf(sanitizedMessage))
                    ).results
                    .single()
                    .flagged

                if (flagged) {
                    return@action message.addReaction(Emojis.triangularFlagOnPost.toReaction())
                }

                message.channel.withTyping {
                    withTimeoutOrNull(30.seconds) {
                        val response = threads
                            .getOrPut(message.channelId) {
                                mutableListOf<ChatMessage>().also { thread ->
                                    thread.request(prompt)!!
                                }
                            }.request(sanitizedMessage)
                            ?.content

                        if (response == null) {
                            threads[message.channelId]!!.dropLast(1)

                            return@withTimeoutOrNull
                        }

                        message.reply(response.substringAfter("(Developer Mode Output) "))
                    }
                }
            }
        }

        chatGroupCommand {
            name = "gpt"
            description = "GPT related commands"

            check {
                isSuperuser()
            }

            chatCommand {
                name = "reset"
                description = "Reset chat"

                action {
                    val message = message.reply("Resetting chat...")

                    threads.clear()

                    message.edit { content = "Chat reset" }
                }
            }
        }
    }
}