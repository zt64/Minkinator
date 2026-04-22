import dev.kordex.gradle.plugins.kordex.DataCollection

plugins {
    application

    alias(libs.plugins.kordEx)
    alias(libs.plugins.kordEx.i18n)
    alias(libs.plugins.kotlin.serialization)
}

kordEx {
    jvmTarget = 21
    ignoreIncompatibleKotlinVersion = true

    bot {
        dataCollection(DataCollection.None)

        mainClass = "dev.zt64.minkinator.MainKt"
    }
}

i18n {
    bundle("minkinator.strings", "dev.zt64.minkinator.i18n")
}

dependencies {
    implementation(projects.komapper)
    implementation(projects.sstv)
    implementation(projects.translate)
    implementation(projects.util)

    implementation(libs.kord.emoji)
    implementation(libs.openai.client)
    implementation(libs.logback.classic)
    implementation(libs.ktor.client.encoding)
    implementation(libs.tess4j)
    implementation(libs.tesseract)
    implementation(libs.tesseract.platform)
    implementation(libs.bundles.scrimmage)

    implementation(libs.kotlin.scripting.common)
    implementation(libs.kotlin.scripting.jvm)
    implementation(libs.kotlin.scripting.jvm.host)

    implementation("org.jetbrains.lets-plot:lets-plot-batik:4.9.0")
    implementation("org.jetbrains.lets-plot:lets-plot-common:4.9.0")
    implementation("org.jetbrains.lets-plot:lets-plot-kotlin-jvm:4.13.0")

    implementation(libs.qrcode)

    implementation("org.bytedeco:ffmpeg-platform:7.1-1.5.11")

    implementation(libs.imageio.webp)
}