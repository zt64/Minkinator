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
            name = "KordEx (Releases)"
            url = uri("https://repo.kordex.dev/releases")
        }

        maven {
            name = "KordEx (Snapshots)"
            url = uri("https://repo.kordex.dev/snapshots")
        }

        maven {
            name = "Sonatype Snapshots (Legacy)"
            url = uri("https://oss.sonatype.org/content/repositories/snapshots")
        }
    }
}

rootProject.name = "Minkinator"

include("bot", "komapper", "util")