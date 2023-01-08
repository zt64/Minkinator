package zt.minkinator.data

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object MarkovConfigs : IntIdTable() {
    val frequency = float("frequency").default(0.5f)
    val handleMention = bool("handle_mention").default(true)
}

class MarkovConfig(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<MarkovConfig>(MarkovConfigs)

    var frequency by MarkovConfigs.frequency
    var handleMention by MarkovConfigs.handleMention
}