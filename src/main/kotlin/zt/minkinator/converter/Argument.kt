package zt.minkinator.converter

import com.kotlindiscord.kord.extensions.commands.Arguments
import kotlin.reflect.KProperty

interface Argument<T> {
    val value: T
    val name: String
    val description: String

    fun validate()
}

class ArgumentDelegate<T>(
    override val name: String,
    override val description: String
) : Argument<T> {
    override val value: T
        get() = TODO("Not yet implemented")

    operator fun getValue(thisRef: Any?, property: KProperty<*>): T {
        TODO("Not yet implemented")
    }

    override fun validate() {
        TODO("Not yet implemented")
    }
}

fun <T : Any> Arguments.argument(
    name: String,
    description: String
): ArgumentDelegate<T> {
    val argument = ArgumentDelegate<T>(name, description)

    return argument
}

class Args : Arguments() {
    val a: String? by argument("a", "b")
}