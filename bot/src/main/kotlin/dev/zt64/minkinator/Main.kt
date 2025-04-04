package dev.zt64.minkinator

import dev.kord.common.Color
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kord.gateway.builder.Shards
import dev.kord.rest.builder.message.embed
import dev.kordex.core.ExtensibleBot
import dev.kordex.core.checks.userFor
import dev.kordex.core.extensions.Extension
import dev.kordex.core.utils.env
import dev.kordex.core.utils.envOrNull
import dev.kordex.core.utils.loadModule
import dev.zt64.minkinator.extension.*
import dev.zt64.minkinator.extension.filter.FilterExtension
import dev.zt64.minkinator.extension.media.EffectsExtension
import dev.zt64.minkinator.extension.media.SvgExtension
import dev.zt64.minkinator.util.error
import io.ktor.client.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import org.koin.core.module.dsl.singleOf

@OptIn(PrivilegedIntent::class)
suspend fun main() {
    val db = createDatabase(envOrNull("DB_LOCATION") ?: "./minkinator")

    val bot = ExtensibleBot(env("TOKEN")) {
        intents(addDefaultIntents = false) {
            +Intent.GuildMessages
            +Intent.GuildPresences
            +Intent.MessageContent
        }

        kord {
            stackTraceRecovery = true
        }

        extensions {
            operator fun Extension.unaryPlus() = add { this@unaryPlus }

            +GeneralExtension
            +BinaryExtension
            +SvgExtension
            +EventLogExtension
            +FilterExtension
            // add { GptExtension() }
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
            +CountExtension

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
                description = message.translate()
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
            bot.logger.info { "Shutting down..." }
        }
    )

    bot.start()
}