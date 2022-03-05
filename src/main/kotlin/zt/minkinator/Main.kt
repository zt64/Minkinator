package zt.minkinator

import com.akuleshov7.ktoml.file.TomlFileReader
import com.kotlindiscord.kord.extensions.ExtensibleBot
import dev.kord.core.kordLogger
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import io.ktor.client.*
import io.ktor.client.features.json.*
import io.ktor.client.features.json.serializer.*
import kotlinx.serialization.serializer
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.transaction
import zt.minkinator.data.Config
import zt.minkinator.extensions.*
import zt.minkinator.extensions.utility.*

val config = TomlFileReader.decodeFromFile<Config>(serializer(), "./config.toml")
val httpClient = HttpClient {
    install(JsonFeature) {
        serializer = KotlinxSerializer(kotlinx.serialization.json.Json {
            prettyPrint = true
            ignoreUnknownKeys = true
        })
    }
}

@OptIn(PrivilegedIntent::class)
suspend fun main() {
    Database.connect("jdbc:sqlite:./database.db", driver = "org.sqlite.JDBC")

    transaction {
        //        SchemaUtils.createMissingTablesAndColumns(Guild, MarkovConfig, Filter)
    }

    val bot = ExtensibleBot(config.token) {
        intents(false) {
            +Intent.GuildMessages
            +Intent.GuildPresences
        }

        extensions {
            add(::EventLogExtension)
            add(::FilterExtension)
            add(::GptExtension)
            add(::MarkovExtension)
            add(::NameNormalizerExtension)
            add(::AnimalsExtension)
            add(::TriviaExtension)
            add(::SpotifyExtension)
            add(::PingExtension)
            add(::RestrictedExtension)
            add(::PurgeExtension)
            add(::GuildInfoExtension)
            add(::UserInfoExtension)
            add(::BanExtension)
            add(::CoinTossExtension)
            add(::EffectsExtension)
            add(::PollExtension)
        }

        members {
            fillPresences = true
        }

        presence {
            playing("with Kotlin")
        }
    }

    Runtime.getRuntime().addShutdownHook(Thread {
        kordLogger.info("Shutting down...")
    })

    bot.start()
}