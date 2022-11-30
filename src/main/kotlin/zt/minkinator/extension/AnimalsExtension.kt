package zt.minkinator.extension

import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.rest.builder.message.create.embed
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import org.koin.core.component.inject
import zt.minkinator.util.footer
import zt.minkinator.util.publicSlashCommand
import zt.minkinator.util.success

class AnimalsExtension(override val name: String = "animals") : Extension() {
    private val httpClient: HttpClient by inject()

    @Serializable
    private data class Cat(
        val url: String,
        val breeds: List<String> = emptyList()
    )

    @Serializable
    private data class Dog(@SerialName("message") val url: String)

    override suspend fun setup() {
        publicSlashCommand(
            name = "cat",
            description = "Gets an image of a cat"
        ) {
            action {
                val cat = httpClient.get("https://api.thecatapi.com/v1/images/search") {
                    parameter("size", "small")
                }.body<List<Cat>>().single()

                respond {
                    embed {
                        color = Color.success
                        url = cat.url
                        image = cat.url

                        cat.breeds.firstOrNull()?.let { breed ->
                            footer(breed)
                        }
                    }
                }
            }
        }

        publicSlashCommand(
            name = "dog",
            description = "Gets an image of a dog"
        ) {
            action {
                val response: Dog = httpClient.get("https://dog.ceo/api/breeds/image/random").body()

                respond {
                    embed {
                        color = Color.success
                        url = response.url
                        image = response.url
                    }
                }
            }
        }
    }
}