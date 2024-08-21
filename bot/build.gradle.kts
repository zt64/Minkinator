plugins {
    application

    alias(libs.plugins.kotlin.serialization)
}

application {
    mainClass = "dev.zt64.minkinator.MainKt"
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

    implementation("org.jetbrains.lets-plot:lets-plot-batik:4.4.1")
    implementation("org.jetbrains.lets-plot:lets-plot-common:4.4.0")
    implementation("org.jetbrains.lets-plot:lets-plot-kotlin-jvm:4.8.0")

    implementation("space.kscience:kmath-ast:0.3.1")
    implementation("org.bytedeco:ffmpeg-platform:6.1.1-1.5.10")
}