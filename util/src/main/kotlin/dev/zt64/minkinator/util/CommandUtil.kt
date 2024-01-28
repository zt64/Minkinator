package dev.zt64.minkinator.util

import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.application.slash.*
import com.kotlindiscord.kord.extensions.commands.application.user.EphemeralUserCommand
import com.kotlindiscord.kord.extensions.commands.chat.ChatCommand
import com.kotlindiscord.kord.extensions.commands.chat.ChatGroupCommand
import com.kotlindiscord.kord.extensions.extensions.*

suspend inline fun <T : Arguments> Extension.publicSlashCommand(
    name: String,
    description: String,
    noinline arguments: () -> T,
    crossinline body: suspend PublicSlashCommand<T, *>.() -> Unit
) = publicSlashCommand(arguments) {
    this.name = name
    this.description = description
    body()
}

suspend inline fun Extension.publicSlashCommand(
    name: String,
    description: String,
    crossinline body: suspend PublicSlashCommand<Arguments, *>.() -> Unit
) = publicSlashCommand {
    this.name = name
    this.description = description
    body()
}

suspend inline fun Extension.ephemeralSlashCommand(
    name: String,
    description: String,
    crossinline body: suspend EphemeralSlashCommand<Arguments, *>.() -> Unit
) = ephemeralSlashCommand {
    this.name = name
    this.description = description
    body()
}

suspend inline fun <T : Arguments> Extension.ephemeralSlashCommand(
    name: String,
    description: String,
    noinline arguments: () -> T,
    crossinline body: suspend EphemeralSlashCommand<T, *>.() -> Unit
) = ephemeralSlashCommand(arguments) {
    this.name = name
    this.description = description
    body()
}

suspend inline fun <T : Arguments> Extension.chatCommand(
    name: String,
    description: String? = null,
    noinline arguments: () -> T,
    crossinline body: suspend ChatCommand<T>.() -> Unit
) = chatCommand(arguments) {
    this.name = name
    if (description != null) this.description = description
    body()
}

suspend inline fun Extension.chatCommand(
    name: String,
    description: String? = null,
    crossinline body: suspend ChatCommand<Arguments>.() -> Unit
) = chatCommand {
    this.name = name
    if (description != null) this.description = description
    body()
}

suspend inline fun Extension.chatGroupCommand(
    name: String,
    description: String? = null,
    crossinline body: suspend ChatGroupCommand<*>.() -> Unit
) = chatGroupCommand {
    this.name = name
    if (description != null) this.description = description
    body()
}

suspend inline fun <T : Arguments> Extension.chatGroupCommand(
    name: String,
    description: String? = null,
    noinline arguments: () -> T,
    crossinline body: suspend ChatGroupCommand<T>.() -> Unit
) = chatGroupCommand(arguments) {
    this.name = name
    if (description != null) this.description = description
    body()
}

suspend inline fun ChatGroupCommand<*>.chatCommand(
    name: String,
    description: String? = null,
    crossinline body: suspend ChatCommand<*>.() -> Unit
) = chatCommand {
    this.name = name
    if (description != null) this.description = description
    body()
}

suspend inline fun <T : Arguments> ChatGroupCommand<T>.chatCommand(
    name: String,
    description: String? = null,
    noinline arguments: () -> T,
    crossinline body: suspend ChatCommand<T>.() -> Unit
) = chatCommand(arguments) {
    this.name = name
    if (description != null) this.description = description
    body()
}

suspend inline fun Extension.ephemeralUserCommand(
    name: String,
    crossinline body: suspend EphemeralUserCommand<*>.() -> Unit
) = ephemeralUserCommand {
    this.name = name
    body()
}

suspend inline fun SlashCommand<*, *, *>.publicSubCommand(
    name: String,
    description: String,
    crossinline body: suspend PublicSlashCommand<Arguments, *>.() -> Unit
) = publicSubCommand {
    this.name = name
    this.description = description
    body()
}

suspend inline fun <T : Arguments> SlashCommand<*, *, *>.publicSubCommand(
    name: String,
    description: String,
    noinline arguments: () -> T,
    crossinline body: suspend PublicSlashCommand<T, *>.() -> Unit
) = publicSubCommand(arguments) {
    this.name = name
    this.description = description
    body()
}

suspend inline fun SlashCommand<*, *, *>.ephemeralSubCommand(
    name: String,
    description: String,
    crossinline body: suspend EphemeralSlashCommand<Arguments, *>.() -> Unit
) = ephemeralSubCommand {
    this.name = name
    this.description = description
    body()
}

suspend inline fun <T : Arguments> SlashCommand<*, *, *>.ephemeralSubCommand(
    name: String,
    description: String,
    noinline arguments: () -> T,
    crossinline body: suspend EphemeralSlashCommand<T, *>.() -> Unit
) = ephemeralSubCommand(arguments) {
    this.name = name
    this.description = description
    body()
}

suspend inline fun SlashCommand<*, *, *>.group(
    name: String,
    description: String,
    crossinline body: suspend SlashGroup.() -> Unit
) = group(name) {
    this.description = description
    body()
}

suspend inline fun <T : Arguments> SlashGroup.ephemeralSubCommand(
    name: String,
    description: String,
    noinline arguments: () -> T,
    crossinline body: suspend EphemeralSlashCommand<T, *>.() -> Unit
) = ephemeralSubCommand(arguments) {
    this.name = name
    this.description = description
    body()
}