package dev.zt64.minkinator.extension

import com.kotlindiscord.kord.extensions.DiscordRelayedException
import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.isNotBot
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.*
import com.kotlindiscord.kord.extensions.components.components
import com.kotlindiscord.kord.extensions.components.ephemeralButton
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import com.kotlindiscord.kord.extensions.utils.botHasPermissions
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
import dev.kord.core.kordLogger
import dev.kord.rest.builder.message.EmbedBuilder
import dev.kord.rest.builder.message.allowedMentions
import dev.kord.rest.builder.message.create.UserMessageCreateBuilder
import dev.kord.rest.builder.message.embed
import dev.zt64.minkinator.data.*
import dev.zt64.minkinator.util.*
import kotlinx.coroutines.flow.*
import org.koin.core.component.inject
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.singleOrNull
import org.komapper.r2dbc.R2dbcDatabase
import kotlin.random.Random

object MarkovExtension : Extension() {
    override val name = "markov"

    private val db: R2dbcDatabase by inject()

    private suspend fun getGuild(id: Snowflake): DBGuild {
        return db.runQuery {
            QueryDsl
                .from(Meta.guild)
                .where { Meta.guild.id eq id }
        }.singleOrNull() ?: db.runQuery {
            QueryDsl
                .insert(Meta.guild)
                .single(DBGuild(id))
        }
    }

    private val selfMention by lazy { "<@!${kord.selfId}>" }

    private fun Message.sanitizedContent() = buildString {
        append(content.replace(selfMention, "").trim())

        if (attachments.isNotEmpty()) {
            append(" ${attachments.joinToString(" ") { it.url }}")
        }
    }

    override suspend fun setup() {
        kordLogger.info("Generating dictionaries...")

        val dictionaries = runCatching {
            kord.guilds.toList().associate { guild ->
                guild.id to Dictionary.generate(guild.id)
            }
        }.onSuccess {
            kordLogger.info("Dictionaries generated")
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
                                content = message.sanitizedContent()
                            )
                        )
                }

                if (channel !is GuildChannel || !channel.botHasPermissions(Permission.SendMessages)) return@action

                val dictionary = dictionaries[guild.id] ?: return@action

                suspend fun generate(block: suspend (UserMessageCreateBuilder.() -> Unit) -> Message) {
                    val sentence = dictionary.generateString((1..100).random())
                        .takeUnless(String::isBlank) ?: return

                    block {
                        content = sentence

                        allowedMentions {
                            repliedUser = true
                            users += Snowflake(373833473091436546L)
                        }
                    }

                    kordLogger.info("${guild.name} ${message.author?.username} markov -> $sentence")
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
            name = "markov",
            description = "Markov commands"
        ) {
            check {
                anyGuild()
            }

            ephemeralSubCommand(
                name = "config",
                description = "Markov configuration",
                arguments = MarkovExtension::ConfigArguments
            ) {
                check {
                    isSuperuser()
                }

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
                                    .singleOrNull()
                            }

                            embed {
                                field(
                                    name = "Enabled",
                                    value = ""
                                )

                                field(
                                    name = "Frequency",
                                    value = ""
                                )

                                field(
                                    name = "Speak on mention",
                                    value = ""
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
                                    label = "Save"

                                    action {
                                        respond {
                                            content = "Saved!"
                                        }
                                    }
                                }

                                ephemeralButton {
                                    style = ButtonStyle.Secondary
                                    label = "Cancel"

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
                name = "channel"
                description = "Channel to train on"
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

        class TrainGuildArguments : Arguments() {
            val guild by guild {
                name = "guild"
                description = "Guild to train on"
            }
        }

        chatCommand(
            name = "train-markov",
            description = "Train markov on past messages",
            arguments = ::TrainGuildArguments
        ) {
            locking = true

            check {
                isSuperuser()
            }

            action {
                val channels = arguments.guild.channels
                    .filterIsInstance<TextChannel>()
                    .filter { it.botHasPermissions(Permission.ReadMessageHistory, Permission.ViewChannel) }
                    .filterNot { it.isNsfw }
                    .toList()

                if (channels.isEmpty()) {
                    throw DiscordRelayedException("Bot does not have permission to read message history in any channels in ${arguments.guild.name}.")
                }

                fun EmbedBuilder.configure(block: () -> Unit = {}) {
                    title = "Training with ${"channel".pluralize(channels.size)}"
                    block()
                }

                val msg = message.channel.createEmbed(EmbedBuilder::configure)
                val guildId = message.getGuild().id

                var i = 0

                channels.forEach { channel ->
                    val messages = mutableSetOf<DBMessage>()

                    try {
                        channel
                            .getMessagesBefore(channel.lastMessageId!!, null)
                            .retry()
                            .collectIndexed { index, message ->
                                messages.add(
                                    element = DBMessage(
                                        id = message.id,
                                        guildId = guildId,
                                        content = message.sanitizedContent()
                                    )
                                )

                                if (index % 100 == 0) {
                                    i += 100

                                    try {
                                        db.withTransaction {
                                            db.runQuery {
                                                QueryDsl
                                                    .insert(Meta.message)
                                                    .onDuplicateKeyIgnore(Meta.message.id)
                                                    .multiple(messages.toList())
                                            }
                                        }

                                        msg.edit {
                                            embed {
                                                configure()
                                                description = "Trained on $i messages"
                                            }
                                        }
                                    } catch (e: Exception) {
                                        e.printStackTrace()
                                    }
                                }

                                messages.clear()
                            }
                    } catch (e: Exception) {
                        print("Guh")
                        e.printStackTrace()
                    }
                }

                msg.edit {
                    embed {
                        configure {
                            description = "Finished training on ${"channel".pluralize(channels.size)} with $i messages"
                        }
                    }
                }
            }
        }
    }

    private class ConfigArguments : Arguments() {
        val enabled by optionalBoolean {
            name = "enabled"
            description = "Whether to store messages for generating strings"
        }
        val frequency by optionalInt {
            name = "frequency"
            description = "How often to speak"
            minValue = 0
            maxValue = 100
        }
        val speakOnMention by optionalBoolean {
            name = "mention"
            description = "Whether pinging the bot should trigger markov"
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

        fun generateString(outputSize: Int) = buildString {
            if (words.isEmpty()) return@buildString

            val random = words.indices.random()
            var key = listOf(words[random], words[random + 1])

            while (length < outputSize) {
                val w = chain[key]?.random() ?: break
                append(" $w")
                key = listOf(key[1], w)
            }
        }.trim()

        companion object {
            suspend fun generate(guildId: Snowflake) = Dictionary(guildId).also {
                it.reload()
            }
        }
    }
}

