import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

val ktomlVersion = "0.2.11"
val ktorVersion = "1.6.7"
val exposedVersion = "0.37.3"

plugins {
    kotlin("jvm") version "1.6.10"
    kotlin("plugin.serialization") version "1.6.10"
}

repositories {
    maven("https://maven.kotlindiscord.com/repository/maven-public/")
    mavenCentral()
}

dependencies {
    implementation("com.aallam.openai:openai-client:1.0.0")

    implementation("com.kotlindiscord.kord.extensions:kord-extensions:1.5.2-RC1")
    implementation("dev.kord.x:emoji:0.5.0")

    implementation("org.codehaus.groovy:groovy:3.0.8")
    implementation("ch.qos.logback:logback-classic:1.2.5")
    implementation("io.github.microutils:kotlin-logging:2.1.21")

    // ktoml
    implementation("com.akuleshov7:ktoml-core:$ktomlVersion")
    implementation("com.akuleshov7:ktoml-file:$ktomlVersion")

    // Ktor
    implementation("io.ktor:ktor-client-core:$ktorVersion")
    implementation("io.ktor:ktor-client-cio:$ktorVersion")

    // Exposed
    implementation("org.jetbrains.exposed:exposed-core:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-dao:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-jdbc:$exposedVersion")
    implementation("org.xerial:sqlite-jdbc:3.36.0.3")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        jvmTarget = "11"
        freeCompilerArgs = freeCompilerArgs + "-opt-in=kotlin.RequiresOptIn"
    }
}