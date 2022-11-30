package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.checks.anyGuild
import com.kotlindiscord.kord.extensions.checks.hasPermission
import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.common.entity.Permission
import dev.kord.rest.builder.message.create.embed
import zt.minkinator.util.publicSlashCommand
import zt.minkinator.util.publicSubCommand
import zt.minkinator.util.warn

class RoleBoardExtension(override val name: String = "role-board") : Extension() {
    override suspend fun setup() {
        publicSlashCommand(
            name = "role-board",
            description = "Manage role-boards"
        ) {
            requireBotPermissions(Permission.ManageRoles)

            check {
                anyGuild()
                hasPermission(Permission.ManageRoles)
            }

            publicSubCommand(
                name = "create",
                description = "Create a role-board in the current channel",
                arguments = ::CreateArgs
            ) {
                action {
                    respond {
                        embed {
                            color = Color.warn
                            description = "WIP"
                        }
                    }
                }
            }
        }
    }

    private class CreateArgs : Arguments()
}