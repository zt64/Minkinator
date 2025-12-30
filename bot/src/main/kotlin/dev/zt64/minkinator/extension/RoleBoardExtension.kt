package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.common.entity.Permission
import dev.kord.rest.builder.message.embed
import dev.kordex.core.checks.anyGuild
import dev.kordex.core.checks.hasPermission
import dev.kordex.core.commands.Arguments
import dev.kordex.core.extensions.Extension
import dev.zt64.minkinator.i18n.Translations
import dev.zt64.minkinator.util.publicSlashCommand
import dev.zt64.minkinator.util.publicSubCommand
import dev.zt64.minkinator.util.warn

object RoleBoardExtension : Extension() {
    override val name = "role-board"

    override suspend fun setup() {
        publicSlashCommand(
            name = Translations.Command.roleBoard,
            description = Translations.Command.Description.roleBoard
        ) {
            requireBotPermissions(Permission.ManageRoles)

            check {
                anyGuild()
                hasPermission(Permission.ManageRoles)
            }

            publicSubCommand(
                name = Translations.Command.Subcommand.RoleBoard.create,
                description = Translations.Command.Subcommand.RoleBoard.Description.create,
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