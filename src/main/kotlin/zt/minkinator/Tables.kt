package zt.minkinator

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.dao.id.LongIdTable
import zt.minkinator.extension.filter.FilterAction

object Guilds : LongIdTable() {
    //    override val id = varchar("id", 18).entityId()
    val markovConfig = reference("markov_config", MarkovConfigs).clientDefault {
        MarkovConfig.new { }.id
    }
    val data = text("data").default("")

    //    override val primaryKey = PrimaryKey(id)
}

class Guild(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<Guild>(Guilds)

    var markovConfig by MarkovConfig referencedOn Guilds.markovConfig
    var data by Guilds.data
    val filters by Filter referrersOn Filters.guild
}

object Users : IntIdTable() {
    val guild = reference("guild", Guilds)
}

class User(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<User>(Users)

    var guild by Guild referencedOn Users.guild
}

object MarkovConfigs : IntIdTable() {
    val frequency = float("frequency").default(0.5f)
    val handleMention = bool("handle_mention").default(true)
}

class MarkovConfig(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<MarkovConfig>(MarkovConfigs)

    var frequency by MarkovConfigs.frequency
    var handleMention by MarkovConfigs.handleMention
}

object Filters : IntIdTable() {
    val guild = reference("guild", Guilds)
    val action = enumeration<FilterAction>("action")
    val pattern = text("pattern")
    val deleteMessage = bool("delete_message").default(true)
    val response = text("response").nullable().default(null)
}

class Filter(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Filter>(Filters)

    var guild by Guild referencedOn Filters.guild
    var action by Filters.action
    var pattern by Filters.pattern
    var deleteMessage by Filters.deleteMessage
    var response by Filters.response

    override fun toString(): String {
        return buildString {
            appendLine()
        }
    }
}