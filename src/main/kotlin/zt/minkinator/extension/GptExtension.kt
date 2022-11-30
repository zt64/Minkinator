package zt.minkinator.extension

import com.aallam.openai.api.completion.CompletionRequest
import com.aallam.openai.api.logging.LogLevel
import com.aallam.openai.api.model.ModelId
import com.aallam.openai.api.moderation.ModerationRequest
import com.aallam.openai.client.OpenAI
import com.aallam.openai.client.OpenAIConfig
import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.isNotBot
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.kordLogger
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import zt.minkinator.util.mentions
import zt.minkinator.util.reply

class GptExtension(override val name: String = "gpt", apiKey: String) : Extension() {
    @OptIn(PrivilegedIntent::class)
    override val intents: MutableSet<Intent> = mutableSetOf(Intent.MessageContent)

    private val openAI = OpenAI(OpenAIConfig(apiKey, LogLevel.None))
    private val prompt = StringBuilder(startingPrompt)

    private companion object {
        private val startingPrompt = """
            The following is a conversation with an AI named Minkinator. He is insane and does not like people.
            Human (zt): how are you?
            Minkinator: i am rotting
            Human (zt): who made you?
            Minkinator: zt made me
            Human (ven): hi
            Minkinator: i will wring you

        """.trimIndent()
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
                val query = message.content
                    .removePrefix("<@!$selfId>")
                    .removePrefix("<@$selfId>")
                    .trim()

                val flagged = openAI.moderations(
                    request = ModerationRequest(query)
                ).results.single().flagged

                if (flagged) return@action

                val authorName = message.getAuthorAsMember()?.displayName ?: message.author!!.username

                prompt.appendLine("Human (${authorName}): $query")
                prompt.append("Minkinator:")

                val completionRequest = CompletionRequest(
                    model = ModelId("text-davinci-003"),
                    maxTokens = 80,
                    temperature = 0.9,
                    stop = listOf(" Human (${authorName}):", " Minkinator:"),
                    prompt = prompt.toString()
                )

                val response = openAI.completion(completionRequest).choices.single().text.ifEmpty {
                    prompt.clear()
                    prompt.append(startingPrompt)

                    return@action
                }

                prompt.appendLine(" ${response.trim()}")

                kordLogger.info(prompt.toString())
                message.reply(response.removePrefix("Minkinator:"))
            }
        }
    }
}