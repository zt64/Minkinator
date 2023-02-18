package zt.minkinator.data

import org.komapper.annotation.*
import org.komapper.core.type.ClobString

@KomapperEntity
@KomapperAggregateRoot("guilds")
@KomapperOneToOne(targetEntity = MarkovConfig::class)
@KomapperOneToMany(targetEntity = Filter::class, navigator = "filters")
data class Guild(
    @KomapperId
    @KomapperColumn("GUILD_ID")
    val id: Long,
    @KomapperColumn(alternateType = ClobString::class)
    val data: String = ""
)