@file:Suppress("UnstableApiUsage")

enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")

pluginManagement {
    repositories {
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositories {
        mavenCentral()

        maven {
            name = "Sonatype Snapshots (Legacy)"
            url = uri("https://oss.sonatype.org/content/repositories/snapshots")
        }

        maven {
            name = "Sonatype Snapshots"
            url = uri("https://s01.oss.sonatype.org/content/repositories/snapshots")
        }

        // maven {
        //     name = "Kotlin Discord"
        //     url = uri("https://maven.kotlindiscord.com/repository/maven-public/")
        // }
        //
        // maven("https://repo.kotlin.link")
    }
}

rootProject.name = "Minkinator"

include("bot", "komapper", "util")