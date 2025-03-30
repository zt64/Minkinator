package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.common.entity.ButtonStyle
import dev.kord.common.entity.Permission
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.channel.createEmbed
import dev.kord.core.behavior.channel.createMessage
import dev.kord.core.behavior.edit
import dev.kord.core.behavior.reply
import dev.kord.core.entity.Message
import dev.kord.core.entity.channel.GuildChannel
import dev.kord.core.entity.channel.TextChannel
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.event.message.MessageDeleteEvent
import dev.kord.rest.builder.message.EmbedBuilder
import dev.kord.rest.builder.message.allowedMentions
import dev.kord.rest.builder.message.create.UserMessageCreateBuilder
import dev.kord.rest.builder.message.embed
import dev.kordex.core.DiscordRelayedException
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.checks.isNotBot
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.*
import dev.kordex.core.components.components
import dev.kordex.core.components.ephemeralButton
import dev.kordex.core.extensions.Extension
import dev.kordex.core.extensions.event
import dev.kordex.core.i18n.toKey
import dev.kordex.core.utils.botHasPermissions
import dev.zt64.minkinator.data.*
import dev.zt64.minkinator.util.*
import kotlinx.coroutines.flow.*
import org.koin.core.component.inject
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.single
import org.komapper.r2dbc.R2dbcDatabase
import kotlin.random.Random

object MarkovExtension : Extension() {
    override val name = "markov"

    private val db: R2dbcDatabase by inject()
    private val selfMention by lazy { "<@!${kord.selfId}>" }

    private suspend fun getGuild(id: Snowflake): DBGuild {
        return db
            .runQuery {
                QueryDsl
                    .from(Meta.guild)
                    .where { Meta.guild.id eq id }
            }.singleOrNull() ?: db.runQuery {
            QueryDsl
                .insert(Meta.guild)
                .single(DBGuild(id))
        }
    }

    private val Message.sanitizedContent
        get() = buildString {
            append(content.replace(selfMention, "").trim())

            if (attachments.isNotEmpty()) {
                append(" ${attachments.joinToString(" ") { it.url }}")
            }
        }

    override suspend fun setup() {
        bot.logger.info { "Generating dictionaries..." }

        val dictionaries = runCatching {
            kord.guilds.toList().associate { guild ->
                guild.id to Dictionary.generate(guild.id)
            }
        }.onSuccess {
            bot.logger.info { "Dictionaries generated" }
        }.getOrDefault(emptyMap())

        event<MessageCreateEvent> {
            check {
                anyGuild()
                isNotBot()
            }

            action {
                val message = event.message
                val channel = message.channel.asChannel()
                val guild = event.getGuildOrNull()!!

                val dbGuild = getGuild(event.guildId!!)

                db.runQuery {
                    QueryDsl
                        .insert(Meta.message)
                        .single(
                            DBMessage(
                                id = message.id,
                                guildId = dbGuild.id,
                                content = message.sanitizedContent
                            )
                        )
                }

                if (channel !is GuildChannel || !channel.botHasPermissions(Permission.SendMessages)) return@action

                val dictionary = dictionaries[guild.id] ?: return@action

                suspend fun generate(block: suspend (UserMessageCreateBuilder.() -> Unit) -> Message) {
                    val sentence = dictionary
                        .generateString((1..100).random())
                        .takeUnless(String::isBlank) ?: return

                    block {
                        content = sentence

                        allowedMentions {
                            repliedUser = true
                            users += Snowflake(373833473091436546L)
                        }
                    }

                    bot.logger.info { "${guild.name} ${message.author?.username} markov -> $sentence" }
                }

                when {
                    message.mentions(kord.selfId) -> generate(message::reply)
                    Random.nextFloat() < 0.008 -> generate(message.channel::createMessage)
                }
            }
        }

        event<MessageDeleteEvent> {
            check {
                anyGuild()
            }

            action {
                val messageId = event.message?.id ?: return@action

                db.runQuery {
                    QueryDsl
                        .delete(Meta.message)
                        .where { Meta.message.id eq messageId }
                }

                Unit
            }
        }

        publicSlashCommand(
            name = "markov".toKey(),
            description = "Markov commands".toKey()
        ) {
            check {
                anyGuild()
            }

            ephemeralSubCommand(
                name = "config".toKey(),
                description = "Markov configuration".toKey(),
                arguments = MarkovExtension::ConfigArguments
            ) {
                action {
                    val enabled = arguments.enabled
                    val frequency = arguments.frequency
                    val speakOnMention = arguments.speakOnMention

                    respond {
                        if (enabled == null && frequency == null && speakOnMention == null) {
                            val config = db.runQuery {
                                QueryDsl
                                    .from(Meta.markovConfig)
                                    .where { Meta.markovConfig.guildId eq guild!!.id }
                                    .single()
                            }

                            embed {
                                field(
                                    name = "Enabled",
                                    value = config.enabled.toString()
                                )

                                field(
                                    name = "Frequency",
                                    value = config.frequency.toString()
                                )

                                field(
                                    name = "Speak on mention",
                                    value = config.handleMention.toString()
                                )
                            }
                        } else {
                            fun configureEmbed() {
                                embed {
                                    color = Color.success
                                    title = "Markov Configuration"

                                    description = buildString {
                                        appendLine("Save changes?")

                                        if (enabled != null) {
                                            appendLine("Enabled: $enabled")
                                        }

                                        if (frequency != null) {
                                            appendLine("Frequency: $frequency")
                                        }

                                        if (speakOnMention != null) {
                                            appendLine("Speak on mention: $speakOnMention")
                                        }
                                    }
                                }
                            }

                            configureEmbed()

                            components {
                                ephemeralButton {
                                    style = ButtonStyle.Primary
                                    label = "Save".toKey()

                                    action {
                                        respond {
                                            content = "Saved!"
                                        }
                                    }
                                }

                                ephemeralButton {
                                    style = ButtonStyle.Secondary
                                    label = "Cancel".toKey()

                                    action {
                                        interactionResponse.delete()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        class TrainArguments : Arguments() {
            val channel by channel {
                name = "channel".toKey()
                description = "Channel to train on".toKey()
            }
        }

        // chatCommand(
        //     name = "train-markov",
        //     description = "Train markov on past messages",
        //     arguments = ::TrainArguments
        // ) {
        //     locking = true
        //
        //     check {
        //         isSuperuser()
        //     }
        //
        //     action {
        //         this@chatCommand.mutex!!.withLock {
        //             val channel = arguments.channel.asChannelOfOrNull<GuildMessageChannel>()
        //                 ?: throw DiscordRelayedException("Channel must be a text channel.")
        //             if (!channel.botHasPermissions(Permission.ReadMessageHistory, Permission.ViewChannel)) {
        //                 throw DiscordRelayedException("Bot does not have permission to read message history in ${channel.mention}.")
        //             }
        //
        //             if (channel is TextChannel && channel.isNsfw) {
        //                 throw DiscordRelayedException("NSFW channels are prohibited.")
        //             }
        //
        //             val msg = message.channel.createMessage("Training...")
        //             val messages = channel.getMessagesBefore(channel.lastMessageId!!, null).toList()
        //             val newData = messages.joinToString("\n", transform = Message::content)
        //             val guild = getGuild(channel.guildId.value)
        //
        //             db.runQuery {
        //                 QueryDsl
        //                     .update(Meta.guild)
        //                     .set { Meta.guild.data eq guild.data + "\n$newData" }
        //                     .where { Meta.guild.id eq guild.id }
        //             }
        //
        //             msg.edit {
        //                 content = "Trained using ${messages.size} ${"message".pluralize(messages.size)}"
        //             }
        //         }
        //     }
        // }

        chatGroupCommand(
            "markov".toKey(),
            "Markov commands".toKey()
        ) {
            checkSuperuser()

            class TrainGuildArguments : Arguments() {
                val guild by optionalGuild {
                    name = "guild".toKey()
                    description = "Guild to train on".toKey()
                }
            }

            chatCommand(
                name = "train".toKey(),
                description = "Train markov on past messages".toKey(),
                arguments = ::TrainGuildArguments
            ) {
                locking = true

                action {
                    val guild = arguments.guild ?: message.getGuild()

                    val channels = guild
                        .channels
                        .filterIsInstance<TextChannel>()
                        .filter { it.botHasPermissions(Permission.ReadMessageHistory, Permission.ViewChannel) && !it.isNsfw }
                        .onEmpty {
                            throw DiscordRelayedException("Bot does not have permission to read message history in any channels in ${guild.name}.".toKey())
                        }.toList()

                    var trainedMessages = 0
                    var line1 = ""
                    var line2 = ""

                    fun EmbedBuilder.configure(block: () -> Unit = {}) {
                        title = "Training with ${"channel".pluralize(channels.size)}"
                        description = buildString {
                            appendLine("Trained on $trainedMessages messages")

                            if (line1.isNotBlank()) {
                                appendLine(line1)
                            }

                            if (line2.isNotBlank()) {
                                appendLine(line2)
                            }
                        }
                        block()
                    }

                    val msg = message.channel.createEmbed(EmbedBuilder::configure)

                    suspend fun updateEmbed() {
                        msg.edit {
                            embed(EmbedBuilder::configure)
                        }
                    }

                    channels.forEach { channel ->
                        line1 = "Training on ${channel.mention}"
                        updateEmbed()

                        try {
                            channel
                                .getMessagesBefore(channel.lastMessageId!!)
                                .retry()
                                .map { message ->
                                    DBMessage(
                                        id = message.id,
                                        guildId = guild.id,
                                        content = message.sanitizedContent
                                    )
                                }.chunked(100)
                                .collect { messages ->
                                    bot.logger.info { messages.joinToString(",") { it.id.toString() } }

                                    try {
                                        db.runQuery {
                                            QueryDsl
                                                .insert(Meta.message)
                                                .onDuplicateKeyIgnore(Meta.message.id)
                                                .multiple(messages)
                                        }

                                        trainedMessages += 100

                                        updateEmbed()
                                    } catch (e: Exception) {
                                        e.printStackTrace()
                                    }
                                }
                        } catch (e: Exception) {
                            println("Guh")
                            e.printStackTrace()
                        }
                    }

                    msg.edit {
                        embed {
                            configure {
                                description = "Finished training on ${"channel".pluralize(channels.size)} with $trainedMessages messages"
                            }
                        }
                    }
                }
            }
        }
    }

    private class ConfigArguments : Arguments() {
        val enabled by optionalBoolean {
            name = "enabled".toKey()
            description = "Whether to store messages for generating strings".toKey()
        }
        val frequency by optionalInt {
            name = "frequency".toKey()
            description = "How often to speak".toKey()
            minValue = 0
            maxValue = 100
        }
        val speakOnMention by optionalBoolean {
            name = "mention".toKey()
            description = "Whether pinging the bot should trigger markov".toKey()
        }
    }

    private class Dictionary private constructor(private val guildId: Snowflake) {
        var words = listOf<String>()
        var chain = mutableMapOf<List<String>, MutableList<String>>()

        suspend fun reload() {
            val messages = db.runQuery {
                QueryDsl
                    .from(Meta.message)
                    .where { Meta.message.guildId eq guildId }
            }

            words = messages.flatMap { line ->
                line.content.split(" ").filter(String::isNotBlank)
            }

            chain.clear()

            for ((index, key1) in words.withIndex()) {
                if (words.size <= index + 2) continue

                val key2 = words[index + 1]
                val word = words[index + 2]

                if (listOf(key1, key2) !in chain) {
                    chain[listOf(key1, key2)] = mutableListOf(word)
                } else {
                    chain[listOf(key1, key2)]!! += word
                }
            }
        }

        fun generateString(outputSize: Int): String {
            return buildString {
                if (words.isEmpty()) return@buildString

                val random = words.indices.random()
                var key = listOf(words[random], words[random + 1])

                while (length < outputSize) {
                    val w = chain[key]?.random() ?: break
                    append(" $w")
                    key = listOf(key[1], w)
                }
            }.trim()
        }

        companion object {
            suspend fun generate(guildId: Snowflake): Dictionary {
                return Dictionary(guildId).also {
                    it.reload()
                }
            }
        }
    }
}

private fun <T> Flow<T>.chunked(chunkSize: Int): Flow<List<T>> {
    val buffer = ArrayList<T>(chunkSize)
    return flow {
        this@chunked.collect {
            buffer += it
            if (buffer.size == chunkSize) {
                emit(buffer.toList())
                buffer.clear()
            }
        }

        if (buffer.isNotEmpty()) emit(buffer.toList())
    }
}