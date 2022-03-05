package zt.minkinator.data

import org.jetbrains.exposed.dao.id.IdTable
import org.jetbrains.exposed.dao.id.IntIdTable
import zt.minkinator.enum.FilterAction


object Guild : IdTable<String>() {
    override val id = varchar("id", 18).entityId()

    val data = text("data").default("")

    //    val filters = reference("filters", Filter)
    val markovConfig = reference("markov_config", MarkovConfig)

    override val primaryKey = PrimaryKey(id)
}

object MarkovConfig : IntIdTable() {
    val enabled = bool("enabled").default(false)
    val frequency = float("frequency").default(2f)
    val messageOnMention = bool("message_on_mention").default(false)
}

object Filter : IntIdTable() {
    val filter = text("filter").nullable()
    val action = enumeration("action", FilterAction::class).nullable()
    val deleteMessage = bool("delete_message").nullable()
}