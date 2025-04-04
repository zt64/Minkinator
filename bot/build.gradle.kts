import dev.kordex.gradle.plugins.kordex.DataCollection

plugins {
    application

    alias(libs.plugins.kordEx)
    alias(libs.plugins.kotlin.serialization)
}

kordEx {
    jvmTarget = 21
    ignoreIncompatibleKotlinVersion = true

    bot {
        dataCollection(DataCollection.None)

        mainClass = "dev.zt64.minkinator.MainKt"
    }

    i18n {
        classPackage = "dev.zt64.minkinator.i18n"
        translationBundle = "minkinator.strings"
    }
}

dependencies {
    implementation(projects.komapper)
    implementation(projects.util)

    implementation(libs.kord.emoji)
    implementation(libs.openai.client)
    implementation(libs.logback.classic)
    implementation(libs.ktor.client.encoding)

    implementation(libs.bundles.scrimmage)

    // implementation(libs.bundles.kotlin.dl)

    implementation("org.jetbrains.kotlin:kotlin-scripting-common")
    implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
    implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")

    implementation("org.jetbrains.lets-plot:lets-plot-batik:4.5.1")
    implementation("org.jetbrains.lets-plot:lets-plot-common:4.6.2")
    implementation("org.jetbrains.lets-plot:lets-plot-kotlin-jvm:4.9.0")

    implementation("space.kscience:kmath-ast:0.3.1")
    implementation("org.bytedeco:ffmpeg-platform:7.1-1.5.11")

    implementation("com.twelvemonkeys.imageio:imageio-webp:3.12.0")
    implementation("com.twelvemonkeys.imageio:imageio-core:3.12.0")
}