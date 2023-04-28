package zt.minkinator.data

import dev.kord.common.entity.Snowflake
import org.komapper.core.spi.DataTypeConverter

class SnowflakeTypeConverter : DataTypeConverter<Snowflake, Long> {
    override val exteriorClass = Snowflake::class
    override val interiorClass = Long::class

    override fun unwrap(exterior: Snowflake) = exterior.value.toLong()
    override fun wrap(interior: Long) = Snowflake(interior)
}