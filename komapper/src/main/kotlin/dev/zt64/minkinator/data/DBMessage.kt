package dev.zt64.minkinator.data

import dev.kord.common.entity.Snowflake
import org.komapper.annotation.*
import org.komapper.core.type.ClobString

@KomapperEntity(["message"])
@KomapperTable("message")
@KomapperManyToOne(targetEntity = DBGuild::class)
data class DBMessage(
    @KomapperId
    @KomapperColumn("MESSAGE_ID")
    val id: Snowflake,
    @KomapperColumn("GUILD_ID")
    val guildId: Snowflake,
    @KomapperColumn(alternateType = ClobString::class)
    val content: String
)