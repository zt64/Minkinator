package zt.minkinator.util

import com.kotlindiscord.kord.extensions.DISCORD_GREEN
import com.kotlindiscord.kord.extensions.DISCORD_RED
import com.kotlindiscord.kord.extensions.DISCORD_YELLOW
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.application.slash.*
import com.kotlindiscord.kord.extensions.commands.application.user.EphemeralUserCommand
import com.kotlindiscord.kord.extensions.commands.chat.ChatCommand
import com.kotlindiscord.kord.extensions.extensions.*
import com.kotlindiscord.kord.extensions.time.TimestampType
import com.kotlindiscord.kord.extensions.time.toDiscord
import dev.kord.common.Color
import dev.kord.common.entity.DiscordPartialEmoji
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.reply
import dev.kord.core.entity.Icon
import dev.kord.core.entity.Member
import dev.kord.core.entity.Message
import dev.kord.core.entity.User
import dev.kord.x.emoji.DiscordEmoji
import kotlinx.coroutines.flow.toList
import kotlinx.datetime.Clock
import kotlin.time.Duration

val Color.Companion.success
    get() = DISCORD_GREEN
val Color.Companion.warn
    get() = DISCORD_YELLOW
val Color.Companion.error
    get() = DISCORD_RED

val DiscordEmoji.Generic.partial: DiscordPartialEmoji
    get() = DiscordPartialEmoji(name = unicode)

fun String.pluralize(count: Int) = if (count > 1) this + "s" else this

fun User.displayAvatar(): Icon = avatar ?: defaultAvatar
fun Member.displayAvatar(): Icon = memberAvatar ?: avatar ?: defaultAvatar

fun String.decodeEntities() = replace("&amp;", "&")
    .replace("&lt;", "<")
    .replace("&gt;", ">")
    .replace("&quot;", "\"")
    .replace("&#039;", "'")
    .replace("&#39;", "'")
    .replace("&divide;", "÷")

fun Message.mentions(id: Snowflake) = mentionedUserIds.contains(id)
suspend fun Message.mentions(user: User) = mentionedUsers.toList().contains(user)

suspend fun Message.reply(content: String) = reply { this.content = content }

fun Duration.toDiscord(format: TimestampType) = (Clock.System.now() + this).toDiscord(format)

suspend fun <T : Arguments> Extension.publicSlashCommand(
    name: String,
    description: String,
    arguments: () -> T,
    body: suspend PublicSlashCommand<T>.() -> Unit
): PublicSlashCommand<T> {
    val commandObj = PublicSlashCommand(this, arguments, null, null).apply {
        this.name = name
        this.description = description
    }
    body(commandObj)

    return publicSlashCommand(commandObj)
}

suspend fun Extension.publicSlashCommand(
    name: String,
    description: String,
    body: suspend PublicSlashCommand<Arguments>.() -> Unit
): PublicSlashCommand<Arguments> {
    val commandObj = PublicSlashCommand<Arguments>(this, null, null, null).apply {
        this.name = name
        this.description = description
    }

    body(commandObj)

    return publicSlashCommand(commandObj)
}

suspend fun Extension.ephemeralSlashCommand(
    name: String,
    description: String,
    body: suspend EphemeralSlashCommand<Arguments>.() -> Unit
): EphemeralSlashCommand<Arguments> {
    val commandObj = EphemeralSlashCommand<Arguments>(this, null, null, null).apply {
        this.name = name
        this.description = description
    }
    body(commandObj)

    return ephemeralSlashCommand(commandObj)
}

suspend fun <T : Arguments> Extension.ephemeralSlashCommand(
    name: String,
    description: String,
    arguments: () -> T,
    body: suspend EphemeralSlashCommand<T>.() -> Unit
): EphemeralSlashCommand<T> {
    val commandObj = EphemeralSlashCommand(this, arguments, null, null).apply {
        this.name = name
        this.description = description
    }
    body(commandObj)

    return ephemeralSlashCommand(commandObj)
}

suspend fun <T : Arguments> Extension.chatCommand(
    name: String,
    description: String,
    arguments: () -> T,
    body: suspend ChatCommand<T>.() -> Unit
): ChatCommand<T> {
    val commandObj = ChatCommand(this, arguments).apply {
        this.name = name
        this.description = description
    }
    body(commandObj)

    return chatCommand(commandObj)
}

suspend fun Extension.ephemeralUserCommand(
    name: String,
    body: suspend EphemeralUserCommand.() -> Unit
): EphemeralUserCommand {
    val commandObj = EphemeralUserCommand(this).apply {
        this.name = name
    }
    body(commandObj)

    return ephemeralUserCommand(commandObj)
}

suspend fun SlashCommand<*, *>.publicSubCommand(
    name: String,
    description: String,
    body: suspend PublicSlashCommand<Arguments>.() -> Unit
): PublicSlashCommand<Arguments> {
    val commandObj = PublicSlashCommand<Arguments>(extension, null, this, parentGroup).apply {
        this.name = name
        this.description = description
    }
    body(commandObj)

    return publicSubCommand(commandObj)
}

suspend fun <T : Arguments> SlashCommand<*, *>.publicSubCommand(
    name: String,
    description: String,
    arguments: () -> T,
    body: suspend PublicSlashCommand<T>.() -> Unit
): PublicSlashCommand<T> {
    val commandObj = PublicSlashCommand(extension, arguments, this, parentGroup).apply {
        this.name = name
        this.description = description
    }
    body(commandObj)

    return publicSubCommand(commandObj)
}

suspend fun SlashCommand<*, *>.ephemeralSubCommand(
    name: String,
    description: String,
    body: suspend EphemeralSlashCommand<Arguments>.() -> Unit
): EphemeralSlashCommand<Arguments> {
    val commandObj = EphemeralSlashCommand<Arguments>(extension, null, this, parentGroup).apply {
        this.name = name
        this.description = description
    }
    body(commandObj)

    return ephemeralSubCommand(commandObj)
}

suspend fun <T : Arguments> SlashCommand<*, *>.ephemeralSubCommand(
    name: String,
    description: String,
    arguments: () -> T,
    body: suspend EphemeralSlashCommand<T>.() -> Unit
): EphemeralSlashCommand<T> {
    val commandObj = EphemeralSlashCommand<T>(extension, arguments, this, parentGroup).apply {
        this.name = name
        this.description = description
    }
    body(commandObj)

    return ephemeralSubCommand(commandObj)
}

suspend fun SlashCommand<*, *>.group(
    name: String,
    description: String,
    body: suspend SlashGroup.() -> Unit
): SlashGroup = group(name) {
    this.description = description
    body()
}

suspend fun <T : Arguments> SlashGroup.ephemeralSubCommand(
    name: String,
    description: String,
    arguments: () -> T,
    body: suspend EphemeralSlashCommand<T>.() -> Unit
): EphemeralSlashCommand<T> {
    val commandObj = EphemeralSlashCommand(parent.extension, arguments, parent, this).apply {
        this.name = name
        this.description = description
    }
    body(commandObj)

    return ephemeralSubCommand(commandObj)
}