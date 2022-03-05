package zt.minkinator.extensions.utility

import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalUser
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.publicSlashCommand

class EffectsExtension(override val name: String = "effects") : Extension() {
    override suspend fun setup() {
        publicSlashCommand(::InvertArgs) {
            name = "invert"
            description = "Inverts the colors of a user"

            action {
                val target = arguments.target ?: user.fetchUser()

                target.avatar?.getImage()
            }
        }
    }

    private inner class InvertArgs : Arguments() {
        val target by optionalUser {
            name = "target"
            description = "The user whose avatar to invert"
        }
    }
}