package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.core.entity.Member
import dev.kord.core.entity.effectiveName
import dev.kord.rest.Image
import dev.kord.rest.builder.message.embed
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.optionalMember
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.zt64.minkinator.util.*

object AvatarExtension : Extension() {
    override val name = "avatar"

    override suspend fun setup() {
        fun Member.getAvatarUrl(): String {
            return displayAvatar.cdnUrl.toUrl {
                size = Image.Size.Size512
            }
        }

        class Args : Arguments() {
            val member by optionalMember {
                name = "member".toKey()
                description = "The member to get the avatar of".toKey()
            }
        }

        publicSlashCommand(
            name = "avatar".toKey(),
            description = "Get the users avatar".toKey(),
            arguments = ::Args
        ) {
            action {
                val member = arguments.member ?: getMember()?.fetchMember() ?: getUser().fetchUser()
                val url = member.displayAvatar.cdnUrl.toUrl()

                respond {
                    embed {
                        color = Color.success
                        title = member.effectiveName
                        this.url = url
                        image = url
                    }
                }
            }
        }

        ephemeralUserCommand("avatar".toKey()) {
            action {
                val member = targetUsers.first().fetchMember(guild!!.id)
                val url = member.getAvatarUrl()

                respond {
                    embed {
                        color = Color.success
                        title = member.effectiveName
                        this.url = url
                        image = url
                    }
                }
            }
        }
    }
}