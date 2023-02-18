package zt.minkinator.data

import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperOneToOne

@KomapperEntity
@KomapperOneToOne(targetEntity = Guild::class)
data class MarkovConfig(
    @KomapperId
    val id: Int = 0,
    val enabled: Boolean = true,
    val frequency: Float = 0.5f,
    val handleMention: Boolean = true
)