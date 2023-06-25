package zt.minkinator.data

import dev.kord.common.entity.Snowflake
import org.komapper.annotation.*
import org.komapper.core.type.ClobString

@KomapperEntity(["guild"])
@KomapperAggregateRoot("guilds")
@KomapperOneToOne(targetEntity = MarkovConfig::class)
@KomapperOneToMany(targetEntity = Filter::class, navigator = "filters")
@KomapperOneToMany(targetEntity = DBMessage::class, navigator = "messages")
data class DBGuild(
    @KomapperId
    @KomapperColumn("GUILD_ID")
    val id: Snowflake
)

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