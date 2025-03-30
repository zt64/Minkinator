package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.common.entity.Permission
import dev.kord.rest.builder.message.embed
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.checks.hasPermission
import dev.kordex.core.commands.Arguments
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.zt64.minkinator.util.publicSlashCommand
import dev.zt64.minkinator.util.publicSubCommand
import dev.zt64.minkinator.util.warn

object RoleBoardExtension : Extension() {
    override val name = "role-board"

    override suspend fun setup() {
        publicSlashCommand(
            name = "role-board".toKey(),
            description = "Manage role-boards".toKey()
        ) {
            requireBotPermissions(Permission.ManageRoles)

            check {
                anyGuild()
                hasPermission(Permission.ManageRoles)
            }

            publicSubCommand(
                name = "create".toKey(),
                description = "Create a role-board in the current channel".toKey(),
                arguments = RoleBoardExtension::CreateArgs
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