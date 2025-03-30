package dev.zt64.minkinator.util

import dev.kord.common.entity.Snowflake
import dev.kord.core.event.Event
import dev.kordex.core.checks.types.CheckContext
import dev.kordex.core.checks.userFor
import dev.kordex.core.commands.application.slash.SlashCommand
import dev.kordex.core.commands.chat.ChatCommand
import dev.kordex.core.utils.env

suspend fun <T : Event> CheckContext<T>.isSuperuser() {
    failIf {
        userFor(event)!!.id !in env("SUPER_USER_IDS").split(",").map { Snowflake(it) }
    }
}

fun ChatCommand<*>.checkSuperuser() = check {
    isSuperuser()
}

fun SlashCommand<*, *, *>.checkSuperuser() = check {
    isSuperuser()
}