package dev.zt64.minkinator

import dev.zt64.minkinator.data.*
import io.r2dbc.spi.ConnectionFactoryOptions
import io.r2dbc.spi.Option
import io.r2dbc.spi.R2dbcException
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase

suspend fun createDatabase(path: String): R2dbcDatabase {
    val options = ConnectionFactoryOptions.builder()
        .option(ConnectionFactoryOptions.DRIVER, "h2")
        .option(ConnectionFactoryOptions.PROTOCOL, "file")
        .option(ConnectionFactoryOptions.DATABASE, path)
        .option(Option.valueOf("DB_CLOSE_DELAY"), "-1")
        .build()

    val db = R2dbcDatabase(options)

    try {
        db.runQuery(QueryDsl.create(Meta.guild, Meta.filter, Meta.markovConfig, Meta.message))
    } catch (e: R2dbcException) {
        e.printStackTrace()
    }

    return db
}