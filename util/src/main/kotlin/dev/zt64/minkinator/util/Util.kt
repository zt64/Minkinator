package dev.zt64.minkinator.util

import com.kotlindiscord.kord.extensions.DISCORD_GREEN
import com.kotlindiscord.kord.extensions.DISCORD_RED
import com.kotlindiscord.kord.extensions.DISCORD_YELLOW
import com.kotlindiscord.kord.extensions.builders.ExtensibleBotBuilder
import com.kotlindiscord.kord.extensions.events.EventContext
import com.kotlindiscord.kord.extensions.events.EventHandler
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.time.TimestampType
import com.kotlindiscord.kord.extensions.time.toDiscord
import com.kotlindiscord.kord.extensions.utils.any
import dev.kord.common.Color
import dev.kord.common.entity.DiscordPartialEmoji
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.reply
import dev.kord.core.entity.*
import dev.kord.core.event.Event
import dev.kord.x.emoji.DiscordEmoji
import kotlinx.datetime.Clock
import kotlin.time.Duration
import com.kotlindiscord.kord.extensions.extensions.event as event1

val Color.Companion.success
    get() = DISCORD_GREEN
val Color.Companion.warn
    get() = DISCORD_YELLOW
val Color.Companion.error
    get() = DISCORD_RED

val DiscordEmoji.Generic.partial: DiscordPartialEmoji
    get() = DiscordPartialEmoji(name = unicode)

fun String.pluralize(
    count: Int,
    plural: String = this + "s",
    inclusive: Boolean = true
) = (if (count > 1) plural else this).let { if (inclusive) "$count $it" else it }

fun User.displayAvatar(): Asset = avatar ?: defaultAvatar

val Member.displayAvatar: Asset
    get() = memberAvatar ?: avatar ?: defaultAvatar

fun String.decodeEntities() = replace("&amp;", "&")
    .replace("&lt;", "<")
    .replace("&gt;", ">")
    .replace("&quot;", "\"")
    .replace("&#039;", "'")
    .replace("&#39;", "'")
    .replace("&divide;", "÷")

fun Message.mentions(id: Snowflake) = mentionedUserIds.contains(id)

suspend fun Message.mentions(user: User) = mentionedUsers.any { it.id == user.id }

suspend fun Message.reply(content: String) = reply { this.content = content }

fun Duration.toDiscord(format: TimestampType) = (Clock.System.now() + this).toDiscord(format)

suspend inline fun <reified T : Event> Extension.event(noinline actionBody: suspend EventContext<T>.() -> Unit): EventHandler<T> = event1 {
    action {
        actionBody()
    }
}

context(ExtensibleBotBuilder.ExtensionsBuilder)
operator fun Extension.unaryPlus() = extensions.add { this }