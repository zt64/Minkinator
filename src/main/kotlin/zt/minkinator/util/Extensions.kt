package zt.minkinator.util

import com.kotlindiscord.kord.extensions.DISCORD_GREEN
import com.kotlindiscord.kord.extensions.DISCORD_RED
import com.kotlindiscord.kord.extensions.DISCORD_YELLOW
import dev.kord.common.Color
import dev.kord.common.entity.DiscordPartialEmoji
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.reply
import dev.kord.core.entity.Member
import dev.kord.core.entity.Message
import dev.kord.core.entity.User
import dev.kord.rest.Image
import dev.kord.rest.builder.message.EmbedBuilder
import dev.kord.x.emoji.DiscordEmoji
import kotlinx.coroutines.flow.toList

val Color.Companion.success get() = DISCORD_GREEN
val Color.Companion.warn get() = DISCORD_YELLOW
val Color.Companion.error get() = DISCORD_RED

val DiscordEmoji.Generic.partial get() = DiscordPartialEmoji(name = unicode)

fun String.pluralize(count: Int) = if (count > 1) this + "s" else this

fun User.displayAvatar(size: Image.Size = Image.Size.Size64, format: Image.Format = Image.Format.PNG) = (avatar ?: defaultAvatar).cdnUrl.toUrl {
    this.size = size
    this.format = format
}

fun Member.displayAvatar(size: Image.Size = Image.Size.Size64, format: Image.Format = Image.Format.PNG) =
    (memberAvatar ?: avatar ?: defaultAvatar).cdnUrl.toUrl {
        this.size = size
        this.format = format
    }

fun EmbedBuilder.configureAuthor(member: Member) = configureAuthor(member.displayAvatar(), member.displayName)
fun EmbedBuilder.configureAuthor(user: User) = configureAuthor(user.displayAvatar(), user.username)

private fun EmbedBuilder.configureAuthor(icon: String, name: String) {
    author {
        this.icon = icon
        this.name = name
    }
}

fun String.decodeEntities() = toByteArray().decodeToString()

fun Message.mentions(id: Snowflake) = mentionedUserIds.contains(id)
suspend fun Message.mentions(user: User) = mentionedUsers.toList().contains(user)

suspend fun Message.reply(content: String) = reply { this.content = content }