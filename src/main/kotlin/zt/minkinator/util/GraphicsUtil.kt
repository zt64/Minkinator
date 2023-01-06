package zt.minkinator.util

import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.nio.*
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.io.InputStream

fun mutateImage(
    inputStream: InputStream,
    writer: ImageWriter = PngWriter.MinCompression,
    block: (image: ImmutableImage) -> ImmutableImage
): InputStream {
    val originalImage = ImmutableImage.loader().fromStream(inputStream)

    return block(originalImage).bytes(writer).inputStream()
}

fun mutateGif(
    inputStream: InputStream,
    block: (frame: ImmutableImage) -> ImmutableImage
): InputStream {
    val gif = AnimatedGifReader.read(ImageSource.of(inputStream))

    val gifWriter = StreamingGifWriter(gif.getDelay(0), true)
    val outputStream = ByteArrayOutputStream()
    val stream = gifWriter.prepareStream(outputStream, BufferedImage.TYPE_INT_ARGB)

    stream.use {
        gif.frames.onEach { image ->
            stream.writeFrame(block(image))
        }
    }

    return outputStream.toByteArray().inputStream()
}