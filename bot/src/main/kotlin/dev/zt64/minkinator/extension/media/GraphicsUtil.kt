package dev.zt64.minkinator.extension.media

import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.nio.*
import io.ktor.utils.io.*
import io.ktor.utils.io.jvm.javaio.*
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream

fun mutateImage(
    byteArray: ByteArray,
    block: (image: ImmutableImage) -> ImmutableImage
): ByteReadChannel {
    val originalImage = ImmutableImage.loader().fromBytes(byteArray)

    return block(originalImage)
        .bytes(PngWriter.MinCompression)
        .inputStream()
        .toByteReadChannel()
}

internal fun mutateGif(
    byteArray: ByteArray,
    block: (frame: ImmutableImage) -> ImmutableImage
): ByteReadChannel {
    val gif = AnimatedGifReader.read(ImageSource.of(byteArray))

    val gifWriter = StreamingGifWriter(gif.getDelay(0), true, true)
    val outputStream = ByteArrayOutputStream()
    val stream = gifWriter.prepareStream(outputStream, BufferedImage.TYPE_INT_ARGB)

    stream.use {
        gif.frames.onEach { image -> stream.writeFrame(block(image)) }
    }

    return outputStream
        .toByteArray()
        .inputStream()
        .toByteReadChannel()
}