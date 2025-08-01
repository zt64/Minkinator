package dev.zt64.minkinator.extension

import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.nio.AnimatedGifReader
import com.sksamuel.scrimage.nio.ImageSource
import com.sksamuel.scrimage.nio.PngWriter
import com.sksamuel.scrimage.webp.Gif2WebpWriter
import dev.kord.core.entity.ApplicationEmoji
import dev.kord.core.entity.GuildEmoji
import dev.kord.core.entity.StandardEmoji
import dev.kord.gateway.Intent
import dev.kord.rest.NamedFile
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.converters.impl.emoji
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.zt64.minkinator.i18n.Translations
import dev.zt64.minkinator.util.publicSlashCommand
import io.ktor.client.request.forms.*
import io.ktor.utils.io.jvm.javaio.*

object EmojiExtension : Extension() {
    override val name = "emoji"
    override val intents = mutableSetOf<Intent>(Intent.GuildEmojis)

    private const val SCALE_FACTOR = 2.0

    override suspend fun setup() {
        class Args : Arguments() {
            val emoji by emoji {
                name = Translations.Common.emoji
                description = "The emoji".toKey()
            }
        }

        publicSlashCommand(
            name = Translations.Command.bigmoji,
            description = Translations.Command.Description.bigmoji,
            arguments = ::Args
        ) {
            action {
                when (val emoji = arguments.emoji) {
                    is GuildEmoji -> {
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

                    is StandardEmoji -> {
                        respond { content = emoji.mention }
                    }

                    is ApplicationEmoji -> {
                        respond {
                            content = emoji.mention
                        }
                    }
                }
            }
        }
    }
}