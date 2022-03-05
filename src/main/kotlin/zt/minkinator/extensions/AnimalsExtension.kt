package zt.minkinator.extensions

import com.kotlindiscord.kord.extensions.extensions.Extension
import com.kotlindiscord.kord.extensions.extensions.publicSlashCommand
import com.kotlindiscord.kord.extensions.types.respond
import dev.kord.common.Color
import dev.kord.rest.builder.message.create.embed
import io.ktor.client.request.*
import kotlinx.serialization.Serializable
import zt.minkinator.httpClient
import zt.minkinator.util.success

class AnimalsExtension(override val name: String = "animals") : Extension() {
    @Serializable
    private data class Cat(val url: String, val breeds: List<Breed>) {
        @Serializable
        data class Breed(val name: String)
    }

    @Serializable
    private data class Dog(val url: String, val breeds: List<Breed>) {
        @Serializable
        data class Breed(val name: String)
    }

    override suspend fun setup() {
        publicSlashCommand {
            name = "cat"
            description = "Gets an image of a cat"

            action {
                val (cat) = httpClient.get<List<Cat>>("https://api.thecatapi.com/v1/images/search") {
                    parameter("size", "small")
                }

                respond {
                    embed {
                        url = cat.url
                        image = cat.url
                        color = Color.success

                        footer {
                            text = cat.breeds.firstOrNull()?.name ?: ""
                        }
                    }
                }
            }
        }

        //        publicSlashCommand {
        //            name = "dog"
        //            description = "Gets an image of a dog"
        //
        //            action {
        //                val response: HttpResponse = httpClient.get("https://dog.ceo/api/breeds/image/random")
        //
        //                respond {
        //                    embed {
        //                        color = Color.success
        //                        title = "Dog"
        //                    }
        //                }
        //            }
        //        }
    }
}