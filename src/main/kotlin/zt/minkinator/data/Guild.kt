package zt.minkinator.data

import dev.kord.common.entity.Snowflake
import org.komapper.annotation.*
import org.komapper.core.type.ClobString

@KomapperEntity
@KomapperAggregateRoot("guilds")
@KomapperOneToOne(targetEntity = MarkovConfig::class)
@KomapperOneToMany(targetEntity = Filter::class, navigator = "filters")
@KomapperOneToMany(targetEntity = DBMessage::class, navigator = "messages")
data class Guild(
    @KomapperId
    @KomapperColumn("GUILD_ID")
    val id: Snowflake
)

@KomapperEntity(["message"])
@KomapperTable("message")
@KomapperManyToOne(targetEntity = Guild::class)
data class DBMessage(
    @KomapperId
    @KomapperColumn("MESSAGE_ID")
    val id: Snowflake,
    @KomapperColumn("GUILD_ID")
    val guildId: Snowflake,
    @KomapperColumn(alternateType = ClobString::class)
    val content: String
)