package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.common.entity.Snowflake
import dev.kord.core.Kord
import dev.kord.core.behavior.edit
import dev.kord.core.behavior.reply
import dev.kord.gateway.Intent
import dev.kord.rest.NamedFile
import dev.kord.rest.builder.message.EmbedBuilder
import dev.kord.rest.builder.message.embed
import dev.kordex.core.DiscordRelayedException
import dev.kordex.core.checks.userFor
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.chat.ChatCommand
import dev.kordex.core.commands.chat.ChatCommandContext
import dev.kordex.core.commands.converters.impl.string
import dev.kordex.core.extensions.Extension
import dev.kordex.core.utils.envOrNull
import dev.zt64.minkinator.util.*
import io.ktor.client.request.forms.*
import io.ktor.utils.io.*
import io.ktor.utils.io.jvm.javaio.*
import io.r2dbc.spi.R2dbcException
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.toList
import org.apache.batik.transcoder.TranscoderInput
import org.apache.batik.transcoder.TranscoderOutput
import org.apache.batik.transcoder.image.JPEGTranscoder
import org.jetbrains.letsPlot.awt.plot.PlotSvgExport
import org.jetbrains.letsPlot.core.util.MonolithicCommon
import org.jetbrains.letsPlot.geom.geomLine
import org.jetbrains.letsPlot.intern.toSpec
import org.jetbrains.letsPlot.label.labs
import org.jetbrains.letsPlot.letsPlot
import org.koin.core.component.inject
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import java.io.ByteArrayOutputStream
import java.io.StringReader
import java.net.InetAddress
import java.util.concurrent.TimeUnit
import kotlin.math.log
import kotlin.math.pow
import kotlin.script.experimental.api.*
import kotlin.script.experimental.host.toScriptSource
import kotlin.script.experimental.jvm.dependenciesFromCurrentContext
import kotlin.script.experimental.jvm.jvm
import kotlin.script.experimental.jvmhost.BasicJvmScriptingHost
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.DurationUnit
import kotlin.time.measureTime

object RestrictedExtension : Extension() {
    override val name = "restricted"
    override val intents = mutableSetOf<Intent>(Intent.Guilds)

    private val database: R2dbcDatabase by inject()
    private val testingGuildId = envOrNull("TESTING_GUILD_ID")?.let(::Snowflake)

    override suspend fun setup() {
        fun ChatCommand<*>.checkSuperuser() = check {
            failIfNot {
                userFor(event)!!.id.value.let {
                    it == 295190422244950017uL || it == 289556910426816513uL
                }
            }
        }

        suspend fun command(
            name: String,
            description: String? = null,
            block: suspend ChatCommandContext<out Arguments>.(input: String) -> Unit
        ) = chatCommand(name, description) {
            checkSuperuser()

            action { block(argString) }
        }

        suspend fun <T : Arguments> command(
            name: String,
            description: String? = null,
            arguments: () -> T,
            block: suspend ChatCommandContext<out T>.() -> Unit
        ) = chatCommand(name, description, arguments) {
            checkSuperuser()

            action(block)
        }

        command("stop", "Stop the bot") {
            message.reply("Stopping...")

            kord.shutdown()
        }

        command("stats", "Get bot information") {
            message.reply {
                embed {
                    color = Color.success
                    title = "Bot Stats"
                    description = buildString {
                        appendLine("IP: ${InetAddress.getLocalHost().hostAddress}")
                        appendLine("Uptime: ${System.currentTimeMillis().milliseconds}}")
                        appendLine("Hostname: ${InetAddress.getLocalHost().hostName}")
                    }
                }
            }
        }

        command("guilds", "Get guilds") {
            val guilds = kord.guilds.toList()

            paginator(targetMessage = message) {
                owner = message.author!!

                guilds.chunked(10).forEach { guilds ->
                    page {
                        color = Color.success
                        title = "Guilds (${guilds.size})"

                        guilds.forEach { guild ->
                            field(
                                name = "${guild.name} (${guild.id.value})",
                                value = "member".pluralize(guild.memberCount!!),
                                inline = true
                            )
                        }
                    }
                }
            }.send()
        }

        chatGroupCommand(
            name = "db",
            description = "Database related commands"
        ) {
            checkSuperuser()

            chatCommand {
                name = "reset"

                action {
                    database.runQuery {
                        QueryDsl.drop(Meta.all())
                    }
                }
            }

            chatCommand {
                name = "exec"

                action {
                    val sql = argString.substringAfter("exec")

                    try {
                        val ms = measureTime {
                            database.runQuery(QueryDsl.executeScript(sql.trim()))
                        }

                        message.reply {
                            embed {
                                color = Color.success
                                title = "Result"
                                description = buildString {
                                    appendLine("```sql")
                                    appendLine(sql)
                                    appendLine("```")
                                    appendLine(ms)
                                }
                            }
                        }
                    } catch (e: R2dbcException) {
                        message.reply {
                            embed {
                                color = Color.error
                                title = "Error"
                                description = "```${e.message}```"
                            }
                        }
                    }
                }
            }
        }

        command("exec", "Execute a command") {
            if (argString.isBlank()) throw IllegalArgumentException("No command provided")

            withContext(Dispatchers.IO) {
                val lines = mutableListOf<String>()

                val embed = message.reply {
                    embed {
                        description = "Executing command..."
                    }
                }

                fun editEmbed(block: EmbedBuilder.() -> Unit = {}) {
                    launch {
                        embed.edit {
                            embed {
                                description = lines.joinToString("\n")
                                block()
                            }
                        }
                    }
                }

                val process = ProcessBuilder("sh -c \"${argString}\"")
                    .redirectErrorStream(true)
                    .start()

                val job = launch {
                    while (isActive) {
                        editEmbed()
                        delay(1000)
                    }
                }

                process.inputStream.bufferedReader().use {
                    it.forEachLine { line -> lines += line }
                }

                process.waitFor(10, TimeUnit.MINUTES)

                job.cancelAndJoin()

                embed.edit {
                    embed {
                        title = "Command exited with code ${process.exitValue()}"
                        color = if (process.exitValue() == 0) Color.success else Color.error
                        description = lines.joinToString("\n")
                    }
                }
            }
        }

        class ExtensionArgs : Arguments() {
            val extension by string {
                name = "extension"
                description = "Extension to reload"

                validate {
                    failIf("Extension `$value` is not loaded") {
                        !bot.extensions.contains(value)
                    }
                }
            }
        }

        command("reload", "Reload an extension", ::ExtensionArgs) {
            val extension = arguments.extension
            val response = message.reply("Reloading extension `$extension`...")

            val duration = measureTime {
                bot.unloadExtension(extension)
                bot.loadExtension(extension)
            }

            response.edit {
                content = "Finished reloading extension `$extension` in ${
                    duration.toString(
                        unit = DurationUnit.SECONDS,
                        decimals = 2
                    )
                }"
            }
        }

        command("unload", "Unload an extension", ::ExtensionArgs) {
            val extension = arguments.extension

            if (extension !in bot.extensions) throw DiscordRelayedException("Extension `$extension` not loaded")

            val response = message.reply("Unloading extension `$extension`...")

            bot.unloadExtension(extension)

            response.edit {
                content = "Finished unloading extension `$extension`"
            }
        }

        command("load", "Load an extension", ::ExtensionArgs) {
            val extension = arguments.extension

            if (extension in bot.extensions) throw DiscordRelayedException("Extension `$extension` already loaded")

            val response = message.reply("Loading extension `$extension`...")

            bot.loadExtension(extension)

            response.edit {
                content = "Finished loading extension `$extension`"
            }
        }

        command("plot") { input ->
            val data = mapOf<String, Any>(
                "x" to List(100) { x -> x },
                "y" to List(100) { x -> log((x.toFloat().pow(2)), 2f) }
            )

            val plot = letsPlot(data) +
                geomLine(
                    color = "dark-green",
                    alpha = .3,
                    size = 2.0
                ) {
                    x = "x"
                    y = "y"
                } + labs(
                title = "Insanity over time",
                x = "Week",
                y = "Insanity"
            )

            val rawSpec = plot.toSpec()
            val processedSpec = MonolithicCommon.processRawSpecs(rawSpec, frontendOnly = false)

            val t = JPEGTranscoder()

            // Set the transcoding hints.
            t.addTranscodingHint(JPEGTranscoder.KEY_QUALITY, 0.8f)

            val svg = PlotSvgExport.buildSvgImageFromRawSpecs(processedSpec)
            val baos = ByteArrayOutputStream()
            val output = TranscoderOutput(baos)
            val input = TranscoderInput(StringReader(svg))

            t.transcode(input, output)
            message.reply {
                addFile(
                    "guh.jpg",
                    ChannelProvider {
                        ByteReadChannel(baos.toByteArray())
                    }
                )
            }
        }

        val scriptingHost = BasicJvmScriptingHost()

        command("eval", "Evaluate Kotlin code") { input ->
            if (input.isEmpty()) throw DiscordRelayedException("Input cannot be empty")

            val code = input.removeSurrounding(prefix = "```kt", suffix = "```").trim()

            val source = code.toScriptSource()
            val res: ResultWithDiagnostics<EvaluationResult>

            val reply = message.reply {
                content = "Processing..."
            }

            val duration = measureTime {
                res = scriptingHost.eval(
                    script = source,
                    compilationConfiguration = ScriptCompilationConfiguration {
                        defaultImports(
                            "dev.kord.core.behavior.*",
                            "dev.kord.core.entity.*",
                            "dev.kord.core.event.*",
                            "kotlinx.coroutines.*",
                            "zt.minkinator.util.*"
                        )
                        implicitReceivers(ChatCommandContext::class)
                        providedProperties(
                            "kord" to Kord::class
                        )

                        jvm {
                            dependenciesFromCurrentContext(wholeClasspath = true)
                        }
                        compilerOptions("-language-version=1.9")
                    },
                    evaluationConfiguration = ScriptEvaluationConfiguration {
                        implicitReceivers(this@command)
                        providedProperties("kord" to kord)
                    }
                )
            }

            val returnValue = res.valueOrNull()?.returnValue

            reply.edit {
                content = ""
                embed {
                    footer("Finished in ${duration.toComponents { s, ns -> "${s}s ${ns / 1e+6}ms" }}")

                    description = when (returnValue) {
                        is ResultValue.Error -> {
                            color = Color.error

                            res
                                .reports
                                .filter { it.severity > ScriptDiagnostic.Severity.WARNING }
                                .joinToString("\n", transform = ScriptDiagnostic::render)
                        }

                        is ResultValue.Value -> {
                            color = Color.success

                            val str = returnValue.value.toString()

                            if (str.length > 3994) {
                                this@edit.files += NamedFile("output.txt", ChannelProvider { str.byteInputStream().toByteReadChannel() })

                                "Output uploaded as file"
                            } else {
                                "```\n$str\n``` "
                            }
                        }

                        else -> "No output"
                    }
                }
            }
        }
    }
}