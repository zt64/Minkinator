package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.optionalMember
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.core.entity.Member
import dev.kord.rest.Image
import dev.kord.rest.builder.message.create.embed
import zt.minkinator.util.displayAvatar
import zt.minkinator.util.ephemeralUserCommand
import zt.minkinator.util.publicSlashCommand
import zt.minkinator.util.success

object AvatarExtension : Extension() {
    override val name = "avatar"

    override suspend fun setup() {
        fun Member.getAvatarUrl() = displayAvatar().cdnUrl.toUrl {
            size = Image.Size.Size512
        }

        class Args : Arguments() {
            val member by optionalMember {
                name = "member"
                description = "The member to get the avatar of"
            }
        }

        publicSlashCommand(
            name = "avatar",
            description = "Get the users avatar",
            arguments = ::Args
        ) {
            action {
                val member = arguments.member ?: getMember()!!.fetchMember()
                val url = member.getAvatarUrl()

                respond {
                    embed {
                        color = Color.success
                        title = member.displayName
                        this.url = url
                        image = url
                    }
                }
            }
        }

        ephemeralUserCommand("avatar") {
            action {
                val member = targetUsers.first().fetchMember(guild!!.id)
                val url = member.getAvatarUrl()

                respond {
                    embed {
                        color = Color.success
                        title = member.displayName
                        this.url = url
                        image = url
                    }
                }
            }
        }
    }
}