package zt.minkinator.extensions

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.commands.application.slash.ephemeralSubCommand
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.ephemeralSlashCommand

class DatabaseExtension(override val name: String = "database") : Extension() {
    override suspend fun setup() {
        ephemeralSlashCommand {
            name = "database"
            description = "Commands relating to database interactions"

            check {
                anyGuild()
            }

            ephemeralSubCommand {
                name = "Reset"
                description = "Reset the guild database"

                check {

                }

                action { }
            }
        }
    }
}