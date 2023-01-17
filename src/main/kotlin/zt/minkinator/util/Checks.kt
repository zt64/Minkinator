package zt.minkinator.util

import com.kotlindiscord.kord.extensions.checks.types.CheckContext
import com.kotlindiscord.kord.extensions.checks.userFor
import com.kotlindiscord.kord.extensions.utils.env
import dev.kord.common.entity.Snowflake
import dev.kord.core.event.Event

suspend fun <T : Event> CheckContext<T>.isSuperuser() {
    failIf("You must be superuser to use this command.") {
        userFor(event)!!.id != Snowflake(env("SUPER_USER_ID"))
    }
}