package zt.minkinator

import com.kotlindiscord.kord.extensions.ExtensibleBot
import com.kotlindiscord.kord.extensions.utils.env
import com.kotlindiscord.kord.extensions.utils.envOrNull
import com.kotlindiscord.kord.extensions.utils.loadModule
import dev.kord.core.kordLogger
import dev.kord.gateway.Intent
import dev.kord.gateway.builder.Shards
import io.ktor.client.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.koin.core.module.dsl.singleOf
import org.koin.ext.getFullName
import org.sqlite.JDBC
import zt.minkinator.extension.*
import zt.minkinator.extension.filter.FilterExtension

const val GPT_MODE = false

suspend fun main() {
    val bot = ExtensibleBot(env("TOKEN")) {
        intents(false) {
            +Intent.GuildMessages
        }

        extensions {
            add(::EventLogExtension)
            add(::FilterExtension)

            if (GPT_MODE) {
                envOrNull("OPENAI_KEY")?.let { key ->
                    add {
                        GptExtension(apiKey = key)
                    }
                }
            } else {
                add(::MarkovExtension)
            }

            add(::AvatarExtension)
            add(::NameNormalizerExtension)
            add(::AnimalsExtension)
            add(::SpotifyExtension)
            add(::PingExtension)
            add(::RestrictedExtension)
            add(::PurgeExtension)
            add(::StickerExtension)
            add(::GuildInfoExtension)
            add(::UserInfoExtension)
            add(::BanExtension)
            add(::CoinTossExtension)
            add(::EffectsExtension)
            add(::PollExtension)
            add(::KickExtension)
            add(::RoleBoardExtension)
            add(::MemberLogExtension)
            add(::CaptionExtension)
            add(::BigmojiExtension)

            // Games
            add(::TicTacToeExtension)
            add(::GuessmojiExtension)
            add(::TriviaExtension)
            add(::ConnectFourExtension)
        }

        chatCommands {
            enabled = true
            defaultPrefix = ">"
        }

        members {
            fillPresences = true

            all()
        }

        presence {
            playing("with Kotlin")
        }

        sharding(::Shards)

        errorResponse { message, type ->
            content = "> $message"
        }

        hooks {
            beforeKoinSetup {
                loadModule {
                    fun provideJson() = Json {
                        ignoreUnknownKeys = true
                        isLenient = true
                    }

                    fun provideHttpClient(json: Json) = HttpClient {
                        install(ContentNegotiation) {
                            json(json)
                        }
                    }

                    singleOf(::provideJson)
                    singleOf(::provideHttpClient)
                }
            }
        }
    }

    Database.connect(url = "jdbc:sqlite:./database.db", driver = JDBC::class.getFullName())

    transaction {
        SchemaUtils.createMissingTablesAndColumns(Guilds, Users, MarkovConfigs, Filters)
    }

    Runtime.getRuntime().addShutdownHook(
        Thread {
            kordLogger.info("Shutting down...")
        }
    )

    bot.start()
}