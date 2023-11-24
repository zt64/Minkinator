package dev.zt64.minkinator

import com.kotlindiscord.kord.extensions.ExtensibleBot
import com.kotlindiscord.kord.extensions.checks.userFor
import com.kotlindiscord.kord.extensions.utils.env
import com.kotlindiscord.kord.extensions.utils.envOrNull
import com.kotlindiscord.kord.extensions.utils.loadModule
import dev.kord.common.Color
import dev.kord.core.kordLogger
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kord.gateway.builder.Shards
import dev.kord.rest.builder.message.embed
import dev.zt64.minkinator.extension.*
import dev.zt64.minkinator.extension.filter.FilterExtension
import dev.zt64.minkinator.extension.media.EffectsExtension
import dev.zt64.minkinator.util.error
import dev.zt64.minkinator.util.unaryPlus
import io.ktor.client.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import org.koin.core.module.dsl.singleOf

@OptIn(PrivilegedIntent::class)
suspend fun main() {
    val db = createDatabase(envOrNull("DB_LOCATION") ?: "./minkinator")

    val bot = ExtensibleBot(env("TOKEN")) {
        intents(false) {
            +Intent.GuildMessages
            +Intent.GuildPresences
            +Intent.MessageContent
        }

        kord {
            stackTraceRecovery = true
        }

        extensions {
            +EventLogExtension
            +FilterExtension
            // +MarkovExtension
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

            helpExtensionBuilder.enableBundledExtension = true
            sentryExtensionBuilder.enable = false
        }

        pluginBuilder.enabled = false

        chatCommands {
            enabled = true
            invokeOnMention = false
            defaultPrefix = ">"

            check {
                if (userFor(event)!!.asUser().isBot) fail()
            }
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

                    single { db }
                    singleOf(::provideJson)
                    singleOf(::provideHttpClient)
                }
            }
        }
    }

    Runtime.getRuntime().addShutdownHook(
        Thread {
            kordLogger.info("Shutting down...")
        }
    )

    bot.start()
}