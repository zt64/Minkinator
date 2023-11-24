package dev.zt64.minkinator.extension

import com.kotlindiscord.kord.extensions.commands.Arguments
import com.kotlindiscord.kord.extensions.commands.converters.impl.emoji
import com.kotlindiscord.kord.extensions.extensions.Extension
import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.nio.AnimatedGifReader
import com.sksamuel.scrimage.nio.ImageSource
import com.sksamuel.scrimage.nio.PngWriter
import com.sksamuel.scrimage.webp.Gif2WebpWriter
import dev.kord.gateway.Intent
import dev.kord.rest.NamedFile
import dev.zt64.minkinator.util.publicSlashCommand
import io.ktor.client.request.forms.*
import io.ktor.utils.io.jvm.javaio.*

object BigmojiExtension : Extension() {
    override val name = "bigmoji"
    override val intents = mutableSetOf<Intent>(Intent.GuildEmojis)

    private const val SCALE_FACTOR = 2.0

    override suspend fun setup() {
        class Args : Arguments() {
            val emoji by emoji {
                name = "emoji"
                description = "The emoji"
            }
        }

        publicSlashCommand(
            name = "bigmoji",
            description = "Resize an emoji to a bigger size",
            arguments = ::Args
        ) {
            action {
                val emoji = arguments.emoji
                val data = emoji.image.getImage().data

                val file = if (emoji.isAnimated) {
                    val gif = AnimatedGifReader.read(ImageSource.of(data))

                    gif.frames.onEach { frame -> frame.scale(SCALE_FACTOR) }

                    NamedFile(
                        name = "${emoji.name}.webp",
                        contentProvider = ChannelProvider { gif.bytes(Gif2WebpWriter.DEFAULT).inputStream().toByteReadChannel() }
                    )
                } else {
                    val image = ImmutableImage.loader().fromBytes(data)

                    image.scale(SCALE_FACTOR)

                    NamedFile(
                        name = "${emoji.name}.png",
                        contentProvider = ChannelProvider { image.bytes(PngWriter.MinCompression).inputStream().toByteReadChannel() }
                    )
                }

                respond {
                    files += file
                }
            }
        }
    }
}