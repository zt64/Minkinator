package zt.minkinator.extension

import com.aallam.openai.api.BetaOpenAI
import com.aallam.openai.api.chat.ChatCompletionRequest
import com.aallam.openai.api.chat.ChatMessage
import com.aallam.openai.api.chat.ChatRole
import com.aallam.openai.api.logging.LogLevel
import com.aallam.openai.api.model.ModelId
import com.aallam.openai.client.OpenAI
import com.aallam.openai.client.OpenAIConfig
import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.isNotBot
import com.kotlindiscord.kord.extensions.events.EventContext
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.chatGroupCommand
import com.kotlindiscord.kord.extensions.extensions.event
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.channel.withTyping
import dev.kord.core.behavior.edit
import dev.kord.core.entity.Message
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import kotlinx.coroutines.withTimeoutOrNull
import zt.minkinator.util.isSuperuser
import zt.minkinator.util.mentions
import zt.minkinator.util.reply
import kotlin.time.Duration.Companion.seconds

@OptIn(BetaOpenAI::class)
class GptExtension(apiKey: String) : Extension() {
    override val name = "gpt"

    @OptIn(PrivilegedIntent::class)
    override val intents = mutableSetOf<Intent>(Intent.MessageContent)

    private val openAI = OpenAI(OpenAIConfig(apiKey, LogLevel.None))
    private val threads = mutableMapOf<Snowflake, MutableList<ChatMessage>>()
    private val model = ModelId("gpt-3.5-turbo")
    private val prompt =
        "You are a roleplaying as a person named Minkinator. Minkinator will make up responses if he does not know them. He will type in all lowercase."

    private suspend fun Message.sanitize() = buildString {
        append("${getAuthorAsMember()!!.displayName}: ")
        append(content.trim())

        mentionedUsers.collect { user ->
            replace(user.mention.toRegex(), user.username)
        }

        attachments.forEach { attachment ->
            append(" ${attachment.url}")
        }
    }

    context(EventContext<MessageCreateEvent>)
    private suspend fun String.unsanitize() = buildString {

    }

    private suspend fun MutableList<ChatMessage>.request(message: String): ChatMessage? {
        add(ChatMessage(ChatRole.User, message))

        val request = ChatCompletionRequest(
            model = model,
            messages = this
        )

        return openAI
            .chatCompletion(request).choices
            .firstNotNullOfOrNull { it.message }
            .also { add(it!!) }
    }

    private suspend fun request(channelId: Snowflake, message: String): String? {
        val thread = threads.getOrPut(channelId) {
            mutableListOf<ChatMessage>().also { thread ->
                thread.request(prompt)!!
            }
        }

        return thread.request(message)?.content
    }

    override suspend fun setup() {
        val selfId = kord.selfId
        var enabled = true

        event<MessageCreateEvent> {
            check {
                anyGuild()
                isNotBot()
                failIfNot(enabled)
                failIfNot(event.message.mentions(selfId))
            }

            action {
                val message = event.message
                val sanitizedMessage = message.sanitize()

//                val flagged = openAI.moderations(
//                    request = ModerationRequest(listOf(sanitizedMessage))
//                ).results.single().flagged
//
//                if (flagged) {
//                    return@action message.addReaction(Emojis.triangularFlagOnPost.toReaction())
//                }

                message.channel.withTyping {
                    withTimeoutOrNull(30.seconds) {
                        val response = request(message.channelId, sanitizedMessage)

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

            chatCommand {
                name = "toggle"
                description = "Toggle GPT"

                action {
                    enabled = !enabled

                    message.reply("GPT is now ${if (enabled) "enabled" else "disabled"}")
                }
            }
        }
    }
}