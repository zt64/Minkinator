package dev.zt64.minkinator.util

import dev.kord.common.entity.Snowflake
import dev.kord.core.event.Event
import dev.kordex.core.checks.types.CheckContext
import dev.kordex.core.checks.userFor
import dev.kordex.core.utils.env

suspend fun <T : Event> CheckContext<T>.isSuperuser() {
    failIf {
        userFor(event)!!.id != Snowflake(env("SUPER_USER_ID"))
    }
}