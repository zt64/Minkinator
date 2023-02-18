package zt.minkinator.data

import org.komapper.annotation.*
import zt.minkinator.extension.filter.FilterAction

@KomapperEntity
@KomapperManyToOne(targetEntity = Guild::class)
data class Filter(
    @KomapperAutoIncrement
    @KomapperId
    val id: Int = 0,
    val guildId: Long,
    @KomapperEnum(type = EnumType.NAME)
    val action: FilterAction,
    val pattern: String,
    val deleteMessage: Boolean = true,
    val response: String? = null
)