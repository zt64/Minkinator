package dev.zt64.minkinator.extension

import dev.kord.rest.builder.message.embed
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.int
import dev.kordex.core.extensions.Extension
import dev.kordex.i18n.toKey
import dev.zt64.minkinator.util.publicSlashCommand

object HttpCatExtension : Extension() {
    override val name: String = "httpcat"

    private const val BASE_URL = "https://http.cat"

    private val VALID_STATUS_CODES = buildSet {
        addAll(100..103)
        addAll(200..208)
        add(226)
        addAll(300..305)
        addAll(307..308)
        addAll(400..418)
        addAll(420..426)
        addAll(428..429)
        add(431)
        add(444)
        add(450)
        add(451)
        addAll(497..499)
        addAll(500..511)
        addAll(521..527)
        add(529)
        add(530)
        add(599)
    }

    override suspend fun setup() {
        class HttpCatArgs : Arguments() {
            val code by int {
                name = "code".toKey()
                description = "The HTTP status code".toKey()

                validate {
                    failIf("Invalid status code".toKey()) {
                        value !in VALID_STATUS_CODES
                    }
                }
            }
        }

        publicSlashCommand("httpcat".toKey(), "Get an httpcat image".toKey(), ::HttpCatArgs) {
            action {
                respond {
                    embed {
                        image = "$BASE_URL/${arguments.code}"
                    }
                }
            }
        }
    }
}