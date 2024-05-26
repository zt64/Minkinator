package dev.zt64.minkinator.data

import dev.kord.common.entity.Snowflake
import org.komapper.annotation.*

@KomapperEntity(["filter"])
@KomapperTable("filter")
@KomapperManyToOne(targetEntity = DBGuild::class)
data class DBFilter(
    @KomapperAutoIncrement
    @KomapperId
    val id: Int = 0,
    val guildId: Snowflake,
    @KomapperEnum(type = EnumType.NAME)
    val action: FilterAction,
    val pattern: String,
    val deleteMessage: Boolean = true,
    val response: String? = null
)

enum class FilterAction {
    REPLY,
    WARN,
    TIMEOUT,
    KICK,
    BAN
}