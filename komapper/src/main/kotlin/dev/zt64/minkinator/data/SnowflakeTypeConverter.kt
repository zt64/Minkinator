package dev.zt64.minkinator.data

import dev.kord.common.entity.Snowflake
import org.komapper.core.spi.DataTypeConverter
import kotlin.reflect.KType
import kotlin.reflect.typeOf

internal class SnowflakeTypeConverter : DataTypeConverter<Snowflake, Long> {
    override val exteriorType: KType = typeOf<Snowflake>()
    override val interiorType: KType = typeOf<Long>()

    override fun unwrap(exterior: Snowflake) = exterior.value.toLong()

    override fun wrap(interior: Long) = Snowflake(interior)
}