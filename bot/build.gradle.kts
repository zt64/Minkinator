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
    implementation("org.bytedeco:tesseract:5.3.4-1.5.10")
    implementation("org.bytedeco:tesseract-platform:5.3.4-1.5.10")
    implementation(libs.bundles.scrimmage)

    implementation("org.jetbrains.kotlin:kotlin-scripting-common")
    implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
    implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")

    implementation("org.jetbrains.lets-plot:lets-plot-batik:4.5.1")
    implementation("org.jetbrains.lets-plot:lets-plot-common:4.5.1")
    implementation("org.jetbrains.lets-plot:lets-plot-kotlin-jvm:4.9.0")

    implementation("org.bytedeco:ffmpeg-platform:7.1-1.5.11")

    implementation("com.twelvemonkeys.imageio:imageio-webp:3.12.0")
    implementation("com.twelvemonkeys.imageio:imageio-core:3.12.0")
}