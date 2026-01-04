package dev.zt64.minkinator.util

import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.application.message.EphemeralMessageCommand
import dev.kordex.core.commands.application.slash.*
import dev.kordex.core.commands.application.user.EphemeralUserCommand
import dev.kordex.core.commands.chat.ChatCommand
import dev.kordex.core.commands.chat.ChatGroupCommand
import dev.kordex.core.components.forms.ModalForm
import dev.kordex.core.extensions.*
import dev.kordex.i18n.Key

suspend inline fun <T : Arguments> Extension.publicSlashCommand(
    name: Key,
    description: Key,
    noinline arguments: () -> T,
    crossinline body: suspend PublicSlashCommand<T, *>.() -> Unit
) = publicSlashCommand(arguments) {
    this.name = name
    this.description = description
    body()
}

suspend inline fun Extension.publicSlashCommand(
    name: Key,
    description: Key,
    crossinline body: suspend PublicSlashCommand<Arguments, *>.() -> Unit
): PublicSlashCommand<Arguments, ModalForm> {
    return publicSlashCommand {
        this.name = name
        this.description = description
        body()
    }
}

suspend inline fun Extension.ephemeralSlashCommand(
    name: Key,
    description: Key,
    crossinline body: suspend EphemeralSlashCommand<Arguments, *>.() -> Unit
): EphemeralSlashCommand<Arguments, ModalForm> {
    return ephemeralSlashCommand {
        this.name = name
        this.description = description
        body()
    }
}

suspend inline fun <T : Arguments> Extension.ephemeralSlashCommand(
    name: Key,
    description: Key,
    noinline arguments: () -> T,
    crossinline body: suspend EphemeralSlashCommand<T, *>.() -> Unit
) = ephemeralSlashCommand(arguments) {
    this.name = name
    this.description = description
    body()
}

suspend inline fun <T : Arguments> Extension.chatCommand(
    name: Key,
    description: Key? = null,
    noinline arguments: () -> T,
    crossinline body: suspend ChatCommand<T>.() -> Unit
) = chatCommand(arguments) {
    this.name = name
    if (description != null) this.description = description
    body()
}

suspend inline fun Extension.chatCommand(name: Key, description: Key? = null, crossinline body: suspend ChatCommand<Arguments>.() -> Unit) = chatCommand {
    this.name = name
    if (description != null) this.description = description
    body()
}

suspend inline fun Extension.chatGroupCommand(name: Key, description: Key? = null, crossinline body: suspend ChatGroupCommand<*>.() -> Unit) =
    chatGroupCommand {
        this.name = name
        if (description != null) this.description = description
        body()
    }

suspend inline fun <T : Arguments> Extension.chatGroupCommand(
    name: Key,
    description: Key? = null,
    noinline arguments: () -> T,
    crossinline body: suspend ChatGroupCommand<T>.() -> Unit
) = chatGroupCommand(arguments) {
    this.name = name
    if (description != null) this.description = description
    body()
}

suspend inline fun ChatGroupCommand<*>.chatCommand(name: Key, description: Key? = null, crossinline body: suspend ChatCommand<*>.() -> Unit) = chatCommand {
    this.name = name
    if (description != null) this.description = description
    body()
}

suspend inline fun <T : Arguments> ChatGroupCommand<T>.chatCommand(
    name: Key,
    description: Key? = null,
    noinline arguments: () -> T,
    crossinline body: suspend ChatCommand<T>.() -> Unit
) = chatCommand(arguments) {
    this.name = name
    if (description != null) this.description = description
    body()
}

suspend inline fun Extension.ephemeralUserCommand(name: Key, crossinline body: suspend EphemeralUserCommand<*>.() -> Unit) = ephemeralUserCommand {
    this.name = name
    body()
}

suspend inline fun Extension.ephemeralMessageCommand(
    name: Key,
    crossinline body: suspend EphemeralMessageCommand<*>.() -> Unit
): EphemeralMessageCommand<ModalForm> {
    return ephemeralMessageCommand {
        this.name = name
        body()
    }
}

suspend inline fun SlashCommand<*, *, *>.publicSubCommand(name: Key, description: Key, crossinline body: suspend PublicSlashCommand<Arguments, *>.() -> Unit) =
    publicSubCommand {
        this.name = name
        this.description = description
        body()
    }

suspend inline fun <T : Arguments> SlashCommand<*, *, *>.publicSubCommand(
    name: Key,
    description: Key,
    noinline arguments: () -> T,
    crossinline body: suspend PublicSlashCommand<T, *>.() -> Unit
) = publicSubCommand(arguments) {
    this.name = name
    this.description = description
    body()
}

suspend inline fun SlashCommand<*, *, *>.ephemeralSubCommand(
    name: Key,
    description: Key,
    crossinline body: suspend EphemeralSlashCommand<Arguments, *>.() -> Unit
) = ephemeralSubCommand {
    this.name = name
    this.description = description
    body()
}

suspend inline fun <T : Arguments> SlashCommand<*, *, *>.ephemeralSubCommand(
    name: Key,
    description: Key,
    noinline arguments: () -> T,
    crossinline body: suspend EphemeralSlashCommand<T, *>.() -> Unit
) = ephemeralSubCommand(arguments) {
    this.name = name
    this.description = description
    body()
}

suspend inline fun SlashCommand<*, *, *>.group(name: Key, description: Key, crossinline body: suspend SlashGroup.() -> Unit) = group(name) {
    this.description = description
    body()
}

suspend inline fun <T : Arguments> SlashGroup.ephemeralSubCommand(
    name: Key,
    description: Key,
    noinline arguments: () -> T,
    crossinline body: suspend EphemeralSlashCommand<T, *>.() -> Unit
) = ephemeralSubCommand(arguments) {
    this.name = name
    this.description = description
    body()
}

suspend inline fun <T : Arguments> SlashGroup.publicSubCommand(
    name: Key,
    description: Key,
    noinline arguments: () -> T,
    crossinline body: suspend PublicSlashCommand<T, *>.() -> Unit
) = publicSubCommand(arguments) {
    this.name = name
    this.description = description
    body()
}