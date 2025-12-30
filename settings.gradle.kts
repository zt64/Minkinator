@file:Suppress("UnstableApiUsage")

enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")

pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()

        maven("https://snapshots-repo.kordex.dev")
        maven("https://releases-repo.kordex.dev")
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
            name = "Kord (Snapshots)"
            url = uri("https://oss.sonatype.org/content/repositories/snapshots")
        }

        maven {
            name = "Sonatype Snapshots (Legacy)"
            url = uri("https://oss.sonatype.org/content/repositories/snapshots")
        }
    }
}

rootProject.name = "Minkinator"

include("bot", "komapper", "sstv", "translate", "util")