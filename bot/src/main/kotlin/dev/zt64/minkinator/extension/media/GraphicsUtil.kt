package dev.zt64.minkinator.extension.media

import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.nio.*
import io.ktor.utils.io.*
import io.ktor.utils.io.jvm.javaio.*
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.time.Duration

fun mutateImage(byteArray: ByteArray, block: (image: ImmutableImage) -> ImmutableImage): ByteReadChannel {
    val originalImage = ImmutableImage.loader().fromBytes(byteArray)

    return block(originalImage)
        .bytes(PngWriter.MinCompression)
        .inputStream()
        .toByteReadChannel()
}

fun mutateGif(byteArray: ByteArray, block: (frame: ImmutableImage) -> ImmutableImage): ByteReadChannel {
    val gif = AnimatedGifReader.read(ImageSource.of(byteArray))

    val gifWriter = StreamingGifWriter(gif.getDelay(0), true, true)
    val outputStream = ByteArrayOutputStream()
    val stream = gifWriter.prepareStream(outputStream, BufferedImage.TYPE_INT_ARGB)

    stream.use {
        gif.frames.onEach { image -> stream.writeFrame(block(image)) }
    }

    return ByteReadChannel(outputStream.toByteArray())
}

fun mutateGifFormat(byteArray: ByteArray, delay: Int? = null, loop: Int? = null): ByteReadChannel {
    val gif = AnimatedGifReader.read(ImageSource.of(byteArray))

    val gifWriter = StreamingGifWriter(
        delay?.let { Duration.ofMillis(it.toLong()) } ?: gif.getDelay(0),
        true, // Enable looping if loop count specified
        loop == -1 // Infinite loop if loop count is -1
    )
    val outputStream = ByteArrayOutputStream()
    val stream = gifWriter.prepareStream(outputStream, BufferedImage.TYPE_INT_ARGB)

    stream.use {
        gif.frames.forEach { frame ->
            stream.writeFrame(frame)
        }
    }

    return ByteReadChannel(outputStream.toByteArray())
}