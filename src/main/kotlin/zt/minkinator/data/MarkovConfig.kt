package zt.minkinator.data

import dev.kord.common.entity.Snowflake
import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperOneToOne

@KomapperEntity
@KomapperOneToOne(targetEntity = DBGuild::class)
data class MarkovConfig(
    @KomapperId
    val id: Int = 0,
    val guildId: Snowflake,
    val enabled: Boolean = true,
    val frequency: Float = 0.5f,
    val handleMention: Boolean = true
)