package dev.zt64.minkinator.extension

import dev.kord.common.Color
import dev.kord.rest.builder.message.embed
import dev.kordex.core.commands.Arguments
import dev.kordex.core.commands.application.slash.converters.ChoiceEnum
import dev.kordex.core.commands.application.slash.converters.impl.optionalEnumChoice
import dev.kordex.core.commands.converters.impl.string
import dev.kordex.core.extensions.Extension
import dev.kordex.core.i18n.toKey
import dev.kordex.i18n.Key
import dev.zt64.minkinator.util.*
import kotlin.io.encoding.Base64

object BinaryExtension : Extension() {
    override val name = "binary"

    override suspend fun setup() {
        publicSlashCommand(
            name = "binary".toKey(),
            description = "Various commands for dealing with binary data".toKey()
        ) {
            class ConvertArgs : Arguments() {
                val number by string {
                    name = "number".toKey()
                    description = "The number to convert".toKey()
                }
                val baseInput by optionalEnumChoice<Base> {
                    name = "input".toKey()
                    description = "The base to convert from".toKey()
                    typeName = "base".toKey()
                }

                val baseOutput by optionalEnumChoice<Base> {
                    name = "output".toKey()
                    description = "The base to convert to".toKey()
                    typeName = "base".toKey()
                }
            }

            publicSubCommand(
                name = "convert".toKey(),
                description = "Convert a number to a different base".toKey(),
                arguments = ::ConvertArgs
            ) {
                action {
                    respond {
                        embed {
                            color = Color.success

                            val baseInput = arguments.baseInput ?: when {
                                arguments.number.startsWith("0b") -> Base.BINARY
                                arguments.number.startsWith("0x") -> Base.HEXADECIMAL
                                arguments.number.startsWith("0") -> Base.OCTAL
                                else -> Base.DECIMAL
                            }

                            val decimal = try {
                                arguments.number.toInt(baseInput.radix)
                            } catch (_: Exception) {
                                error("Invalid number")
                            }

                            if (arguments.baseOutput != null) {
                                description = buildString {
                                    append(arguments.number)
                                    append(" (${baseInput.readableName.translate()}) = ")
                                    append(decimal.toString(arguments.baseOutput!!.radix))
                                    append(" (${arguments.baseOutput!!.readableName.translate()})")
                                }
                            } else {
                                Base.entries.forEach { base ->
                                    field {
                                        name = base.readableName.translate()
                                        value = decimal.toString(base.radix)
                                        inline = true
                                    }
                                }
                            }
                        }
                    }
                }
            }

            group("base64".toKey(), "Base64 encoding and decoding commands".toKey()) {
                class Base64Args : Arguments() {
                    val text by string {
                        name = "text".toKey()
                        description = "The text to encode/decode".toKey()
                    }
                }

                publicSubCommand(
                    name = "encode".toKey(),
                    description = "Encode text to Base64".toKey(),
                    arguments = ::Base64Args
                ) {
                    action {
                        respond {
                            embed {
                                color = Color.success
                                title = "Base64 Encoded"
                                description = Base64.encode(arguments.text.toByteArray())
                            }
                        }
                    }
                }

                publicSubCommand(
                    name = "decode".toKey(),
                    description = "Decode Base64 to text".toKey(),
                    arguments = ::Base64Args
                ) {
                    action {
                        respond {
                            embed {
                                color = Color.success
                                title = "Base64 Decoded"
                                description = try {
                                    Base64.decode(arguments.text.toByteArray()).decodeToString()
                                } catch (_: IllegalArgumentException) {
                                    "Invalid Base64 string"
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private enum class Base(override val readableName: Key, val radix: Int) : ChoiceEnum {
        BINARY("Binary".toKey(), 2),
        DECIMAL("Decimal".toKey(), 10),
        HEXADECIMAL("Hexadecimal".toKey(), 16),
        OCTAL("Octal".toKey(), 8),
        TERNARY("Ternary".toKey(), 3),
        QUATERNARY("Quaternary".toKey(), 4)
    }
}