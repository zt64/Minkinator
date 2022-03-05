package zt.minkinator.data

import kotlinx.serialization.Serializable

@Serializable
data class Config(
    val superUserId: Long,
    val token: String,
    val openAI: String
)