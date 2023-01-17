package zt.minkinator

import com.kotlindiscord.kord.extensions.ExtensibleBot
import com.kotlindiscord.kord.extensions.utils.env
import com.kotlindiscord.kord.extensions.utils.envOrNull
import com.kotlindiscord.kord.extensions.utils.loadModule
import dev.kord.common.Color
import dev.kord.core.kordLogger
import dev.kord.gateway.Intent
import dev.kord.gateway.builder.Shards
import dev.kord.rest.builder.message.create.embed
import io.ktor.client.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.koin.core.module.dsl.singleOf
import zt.minkinator.data.Filters
import zt.minkinator.data.Guilds
import zt.minkinator.data.MarkovConfigs
import zt.minkinator.extension.*
import zt.minkinator.extension.filter.FilterExtension
import zt.minkinator.util.error
import zt.minkinator.util.unaryPlus

const val GPT_MODE = false

suspend fun main() {
    val bot = ExtensibleBot(env("TOKEN")) {
        intents(false) {
            +Intent.GuildMessages
        }

        kord {
            stackTraceRecovery = true
        }

        extensions {
            +EventLogExtension
            +FilterExtension

            if (GPT_MODE) {
                envOrNull("OPENAI_KEY")?.let { key ->
                    add {
                        GptExtension(apiKey = key)
                    }
                }
            } else {
                +MarkovExtension
            }

            +AvatarExtension
            +NameNormalizerExtension
            +AnimalsExtension
            +SpotifyExtension
            +PingExtension
            +RestrictedExtension
            +PurgeExtension
            +StickerExtension
            +GuildInfoExtension
            +UserInfoExtension
            +BanExtension
            +CoinTossExtension
            +EffectsExtension
            +PollExtension
            +KickExtension
            +RoleBoardExtension
            +MemberLogExtension
            +CaptionExtension
            +BigmojiExtension

            // Games
            +TicTacToeExtension
            +GuessmojiExtension
            +TriviaExtension
            +ConnectFourExtension
        }

        pluginBuilder.enabled = false

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

        errorResponse { message, _ ->
            embed {
                color = Color.error
                title = "Error"
                description = message
            }
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

    Database.connect(url = "jdbc:sqlite:./database.db", driver = "org.sqlite.JDBC")

    transaction {
        SchemaUtils.createMissingTablesAndColumns(Guilds, MarkovConfigs, Filters)
    }

    Runtime.getRuntime().addShutdownHook(
        Thread {
            kordLogger.info("Shutting down...")
        }
    )

    bot.start()
}