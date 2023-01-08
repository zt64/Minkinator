package zt.minkinator.data

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import zt.minkinator.extension.filter.FilterAction

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
}