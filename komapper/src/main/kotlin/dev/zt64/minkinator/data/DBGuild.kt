package dev.zt64.minkinator.data

import dev.kord.common.entity.Snowflake
import org.komapper.annotation.*

@KomapperEntity(["guild"])
@KomapperAggregateRoot("guilds")
@KomapperOneToOne(targetEntity = MarkovConfig::class)
@KomapperOneToMany(targetEntity = DBFilter::class, navigator = "filters")
@KomapperOneToMany(targetEntity = DBMessage::class, navigator = "messages")
data class DBGuild(
    @KomapperId
    @KomapperColumn("GUILD_ID")
    val id: Snowflake
)