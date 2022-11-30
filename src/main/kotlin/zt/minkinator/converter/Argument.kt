package zt.minkinator.converter

import kotlin.reflect.KProperty

open class Arguments {
    val args: MutableList<Argument<*>> = mutableListOf()
}

interface Argument<T> {
    val value: T
    val name: String
    val description: String
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
}

fun <T : Any> Arguments.argument(
    name: String,
    description: String
) = ArgumentDelegate<T>(name, description)

class Args : Arguments() {
    val a: String? by argument("a", "b")
}