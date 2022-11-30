plugins {
    application
    kotlin("jvm") version "1.8.0-Beta"
    kotlin("plugin.serialization") version "1.8.0-Beta"
}

application {
    mainClass.set("zt.minkinator.MainKt")
}

repositories {
    google()
    mavenCentral()

    maven {
        name = "Sonatype Snapshots"
        url = uri("https://oss.sonatype.org/content/repositories/snapshots")
    }

    maven {
        name = "Kotlin Discord"
        url = uri("https://maven.kotlindiscord.com/repository/maven-public/")
    }
}

dependencies {
    implementation("com.kotlindiscord.kord.extensions:kord-extensions:1.5.5-SNAPSHOT")
    implementation("dev.kord.x:emoji:0.5.0")
    implementation("com.aallam.openai:openai-client:2.0.0")
    implementation("ch.qos.logback:logback-classic:1.4.5")

    val scrimmageVersion = "4.0.32"
    implementation("com.sksamuel.scrimage:scrimage-core:$scrimmageVersion")
    implementation("com.sksamuel.scrimage:scrimage-filters:$scrimmageVersion")
    implementation("com.sksamuel.scrimage:scrimage-webp:$scrimmageVersion")

    // Exposed
    val exposedVersion = "0.41.1"
    implementation("org.jetbrains.exposed:exposed-core:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-dao:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-jdbc:$exposedVersion")
    implementation("org.xerial:sqlite-jdbc:3.39.4.1")
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
}

kotlin.target.compilations.all {
    kotlinOptions.jvmTarget = "11"
}