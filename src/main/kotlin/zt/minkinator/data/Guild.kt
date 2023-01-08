package zt.minkinator.data

import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.LongIdTable

object Guilds : LongIdTable() {
    val markovConfig = reference("markov_config", MarkovConfigs).clientDefault {
        MarkovConfig.new { }.id
    }
    val data = text("data").default("")
}

class Guild(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<Guild>(Guilds)

    var markovConfig by MarkovConfig referencedOn Guilds.markovConfig
    var data by Guilds.data
    val filters by Filter referrersOn Filters.guild
}