package dev.zt64.minkinator.util

import dev.kord.core.entity.Asset
import dev.kord.core.entity.Member
import dev.kord.core.entity.User
import dev.kord.rest.builder.message.EmbedBuilder

fun EmbedBuilder.author(member: Member) = author(member.displayAvatar, member.effectiveName)

fun EmbedBuilder.author(user: User) = author(user.displayAvatar, user.username)

fun EmbedBuilder.author(icon: Asset? = null, name: String) {
    author {
        this.icon = icon?.cdnUrl?.toUrl()
        this.name = name
    }
}

fun EmbedBuilder.footer(text: String) {
    footer {
        this.text = text
    }
}

fun EmbedBuilder.thumbnail(url: String) {
    thumbnail {
        this.url = url
    }
}

fun EmbedBuilder.field(name: String, value: String, inline: Boolean = false) {
    field {
        this.name = name
        this.value = value
        this.inline = inline
    }
}