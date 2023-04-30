import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    application
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.ksp)
}

application {
    mainClass.set("zt.minkinator.MainKt")
}

repositories {
    google()
    mavenCentral()

    maven("https://s01.oss.sonatype.org/content/repositories/snapshots")
    maven("https://oss.sonatype.org/content/repositories/snapshots")

    maven {
        name = "Kotlin Discord"
        url = uri("https://maven.kotlindiscord.com/repository/maven-public/")
    }
}

kotlin {
    jvmToolchain(17)

    sourceSets.main {
        kotlin.srcDir("build/generated/ksp/main/kotlin")
    }
}

ksp {
    arg("komapper.enableEntityStoreContext", "true")
}

dependencies {
    implementation(libs.kord.ex)
    implementation(libs.kord.emoji)
    implementation(libs.openai.client)
    implementation(libs.logback.classic)
    implementation(libs.ktor.client.encoding)

    ksp(libs.komapper.processor)

    implementation(libs.bundles.scrimmage)
    // implementation(libs.bundles.kotlin.dl)

    implementation(libs.komapper.starter.r2dbc)
    implementation(libs.komapper.dialect.h2.r2dbc)
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs += listOf(
            "-Xcontext-receivers",
            "-opt-in=org.komapper.annotation.KomapperExperimentalAssociation"
        )
    }
}