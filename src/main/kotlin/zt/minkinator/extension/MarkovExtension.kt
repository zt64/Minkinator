package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.DiscordRelayedException
import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.isNotBot
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.channel
import com.kotlindiscord.kord.extensions.commands.converters.impl.guild
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalBoolean
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalInt
import com.kotlindiscord.kord.extensions.components.components
import com.kotlindiscord.kord.extensions.components.ephemeralButton
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.event
import com.kotlindiscord.kord.extensions.types.respond
import com.kotlindiscord.kord.extensions.utils.botHasPermissions
import com.kotlindiscord.kord.extensions.utils.selfMember
import dev.kord.common.Color
import dev.kord.common.entity.ButtonStyle
import dev.kord.common.entity.Permission
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.channel.asChannelOf
import dev.kord.core.behavior.channel.asChannelOfOrNull
import dev.kord.core.behavior.channel.createEmbed
import dev.kord.core.behavior.channel.createMessage
import dev.kord.core.behavior.edit
import dev.kord.core.behavior.reply
import dev.kord.core.entity.Message
import dev.kord.core.entity.channel.GuildMessageChannel
import dev.kord.core.entity.channel.TextChannel
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.event.message.MessageDeleteEvent
import dev.kord.core.kordLogger
import dev.kord.rest.builder.message.EmbedBuilder
import dev.kord.rest.builder.message.create.UserMessageCreateBuilder
import dev.kord.rest.builder.message.create.allowedMentions
import dev.kord.rest.builder.message.create.embed
import dev.kord.rest.builder.message.modify.embed
import kotlinx.coroutines.flow.*
import org.koin.core.component.inject
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import zt.minkinator.data.Guild
import zt.minkinator.data.guild
import zt.minkinator.util.*
import kotlin.random.Random


object MarkovExtension : Extension() {
    override val name = "markov"

    private val db: R2dbcDatabase by inject()

    private suspend fun getGuild(id: ULong) = db.runQuery {
        QueryDsl
            .from(Meta.guild)
            .where { Meta.guild.id eq id.toLong() }
    }.singleOrNull() ?: db.runQuery {
        QueryDsl
            .insert(Meta.guild)
            .single(Guild(id.toLong()))
    }

    override suspend fun setup() {
        kordLogger.info("Generating dictionaries...")

        val dictionaries = kord.guilds.toList().associate { guild ->
            guild.id to Dictionary.generate(guild.id)
        }

        kordLogger.info("Dictionaries generated")

        event<MessageCreateEvent> {
            check {
                anyGuild()
                isNotBot()
            }

            action {
                val message = event.message
                val guild = event.getGuildOrNull()!!
                val self = guild.selfMember()

                val dbGuild = getGuild(event.guildId!!.value)

                db.runQuery {
                    QueryDsl
                        .update(Meta.guild)
                        .set {
                            Meta.guild.data eq dbGuild.data + buildString {
                                append(message.content.replace(self.mention, "").trim())

                                if (message.attachments.isNotEmpty()) {
                                    append(" ${message.attachments.joinToString(" ") { it.url }}")
                                }

                                appendLine()
                            }
                        }
                        .where { Meta.guild.id eq dbGuild.id }
                }

                if (
                    !message.channel
                        .asChannelOf<GuildMessageChannel>()
                        .botHasPermissions(Permission.SendMessages)
                ) return@action

                val dictionary = dictionaries[guild.id] ?: return@action
                suspend fun generate(block: suspend (UserMessageCreateBuilder.() -> Unit) -> Message) {
                    val sentence = dictionary.generateString((1..100).random()).takeUnless(String::isBlank)
                        ?: return

                    block {
                        content = sentence

                        allowedMentions {
                            repliedUser = true
                            users += Snowflake(373833473091436546L)
                        }
                    }

                    kordLogger.info("${guild.name} ${message.author?.username}#${message.author?.discriminator} markov -> $sentence")
                }

                if (message.mentions(kord.selfId)) {
                    generate(message::reply)
                } else if (Random.nextFloat() < 0.008) {
                    generate(message.channel::createMessage)
                }
            }
        }

        event<MessageDeleteEvent> {
            check {
                anyGuild()
            }

            action {
                val dbGuild = getGuild(event.guildId!!.value)
                val message = event.message ?: return@action

                db.runQuery {
                    QueryDsl
                        .update(Meta.guild)
                        .set { Meta.guild.data eq dbGuild.data.replaceFirst(message.content, "") }
                        .where { Meta.guild.id eq dbGuild.id }
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
                arguments = ::ConfigArguments
            ) {
                check {
                    // Check if user has role to configure commands
                }

                action {
                    val enabled = arguments.enabled
                    val frequency = arguments.frequency
                    val speakOnMention = arguments.speakOnMention

                    if (enabled == null && frequency == null && speakOnMention == null) {
                        throw DiscordRelayedException("You must specify at least one argument to change.")
                    }

                    respond {
                        fun configureEmbed() = embed {
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

        chatCommand(
            name = "train-markov",
            description = "Train markov on past messages",
            arguments = ::TrainArguments
        ) {
            locking = true

            check {
                isSuperuser()
            }

            action {
                val channel = arguments.channel.asChannelOfOrNull<GuildMessageChannel>()
                    ?: throw DiscordRelayedException("Channel must be a text channel.")
                if (!channel.botHasPermissions(Permission.ReadMessageHistory, Permission.ViewChannel)) {
                    throw DiscordRelayedException("Bot does not have permission to read message history in ${channel.mention}.")
                }

                if (channel is TextChannel && channel.isNsfw) {
                    throw DiscordRelayedException("NSFW channels are not allowed.")
                }

                val msg = message.channel.createMessage("Training...")
                val messages = channel.getMessagesBefore(channel.lastMessageId!!, null).toList()
                val newData = messages.joinToString("\n", transform = Message::content)
                val guild = getGuild(channel.guildId.value)

                db.runQuery {
                    QueryDsl
                        .update(Meta.guild)
                        .set { Meta.guild.data eq guild.data + "\n$newData" }
                        .where { Meta.guild.id eq guild.id }
                }

                msg.edit {
                    content = "Trained using ${messages.size} ${"message".pluralize(messages.size)}"
                }
            }
        }

        class TrainGuildArguments : Arguments() {
            val guild by guild {
                name = "guild"
                description = "Guild to train on"
            }
        }

        chatCommand(
            name = "train-markov-guild",
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
                val guild = getGuild(guildId.value)

                var i = 0

                channels.forEach { channel ->
                    var buffer = ""

                    channel
                        .getMessagesBefore(channel.lastMessageId!!, null)
                        .retry()
                        .collectIndexed { index, message ->
                            buffer += "${message.content}\n"

                            if (index % 100 == 0) {
                                i += 100

                                try {
                                    db.runQuery {
                                        QueryDsl
                                            .update(Meta.guild)
                                            .set { Meta.guild.data eq guild.data + "\n$buffer" }
                                            .where { Meta.guild.id eq guild.id }
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

    private class Dictionary private constructor(
        private val guildId: Snowflake
    ) {
        var words = listOf<String>()
        var chain = mutableMapOf<List<String>, MutableList<String>>()

        suspend fun reload() {
            val messages = getGuild(guildId.value).data

            words = messages.lines().flatMap { line ->
                line.split(" ").filter(String::isNotBlank)
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

