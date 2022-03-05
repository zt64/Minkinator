package zt.minkinator.extensions

import com.kotlindiscord.kord.extensions.DiscordRelayedException
import com.kotlindiscord.kord.extensions.checks.isNotBot
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import com.kotlindiscord.kord.extensions.utils.selfMember
import dev.kord.core.event.message.MessageCreateEvent
import io.ktor.client.request.*
import kotlinx.serialization.Serializable
import zt.minkinator.httpClient
import zt.minkinator.util.mentions
import zt.minkinator.util.reply

class GptExtension(override val name: String = "gpt") : Extension() {
    private val startingPrompt = "The following is a conversation with an AI assistant named Minkinator. The assistant is helpful, creative, clever, and very friendly.\n\n" +
        "Human (zt): how are you?\n" +
        "Minkinator: im doing fine\n" +
        "Human (zt): who made you?\n" +
        "Minkinator: zt made me\n" +
        "Human (ven): hi\n" +
        "Minkinator: hello\n" +
        "Human (james): What do you think of Discord?\n" +
        "Minkinator: its a pretty cool platform. I get to talk to a bunch of my friends and we hangout a lot, its really fun" +
        "Human (zt): I use discord too, all of us here use Discord\n" +
        "Minkinator: Lets be friends!"
    private val prompt = StringBuilder(startingPrompt)

    override suspend fun setup() {
        //        event<MessageCreateEvent> {
        //            check {
        //                anyGuild()
        //                isNotBot()
        //                failIfNot(event.message.mentions(event.getGuild()!!.selfMember()))
        //            }
        //
        //            action {
        //                val selfId = event.kord.selfId
        //                val message = messageFor(event)?.asMessage() ?: return@action
        //                val authorName = message.getAuthorAsMember()?.displayName ?: message.author!!.username
        //                val query = buildString {
        //                    append("Human (${authorName}): ")
        //                    append(message.content.removePrefix("<@!$selfId>").removePrefix("<@$selfId>").trim())
        //                }
        //
        //                prompt.append("$query\nMinkinator:")
        //
        //                val openAI = OpenAI(OpenAIConfig(token = config.openAI, logLevel = LogLevel.None))
        //
        //                val completionRequest = CompletionRequest(
        //                    maxTokens = 75,
        //                    temperature = 0.9,
        //                    presencePenalty = 0.6,
        //                    frequencyPenalty = 0.0,
        //                    topP = 1.0,
        //                    stop = listOf("Human (${authorName}):", "Minkinator:", "\n"),
        //                    prompt = prompt.toString()
        //                )
        //
        //                val response = openAI.completion(Curie, completionRequest).choices.first().text.takeIf { it.isNotEmpty() }
        //                    ?: "Minkinator: I don't know what to say."
        //
        //                prompt.append("$response\n")
        //
        //                kordLogger.info(prompt.toString())
        //                message.reply { content = response.removePrefix("Minkinator:") }
        //            }
        //        }

        event<MessageCreateEvent> {
            val prompt = StringBuilder().apply {
                appendLine("The following is a conversation with an AI known as Minkinator")
                appendLine("Human: Hi, how are you?")
                appendLine("Minkinator: I'm doing well!")
                appendLine("Human: What's your name?")
                appendLine("Minkinator: My name is Minkinator")
            }

            check {
                isNotBot()
                failIfNot(event.message.mentions(event.getGuild()!!.selfMember()))
            }

            action {
                val selfId = event.kord.selfId
                val message = event.message

                prompt.appendLine("Human: ${message.content.removePrefix("<@!$selfId>").removePrefix("<@$selfId>").trim()}")

                val response = try {
                    httpClient.post<GptJResponse>("http://api.vicgalle.net:5000/generate") {
                        parameter("context", prompt)
                        parameter("token_max_length", 50)
                        parameter("temperature", 1.0f)
                        parameter("top_p", 0.9f)
                        parameter("stop_sequence", "\n")
                    }
                } catch (e: Throwable) {
                    throw DiscordRelayedException("Failed to generate GPT: ```$e```")
                }

                val returnedString = response.text.take(2000)

                prompt.appendLine(returnedString)

                message.reply(returnedString.removePrefix("Minkinator: "))
            }
        }
    }
}

@Serializable
data class GptJResponse(
    val text: String
)