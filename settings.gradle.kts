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
        maven("https://s01.oss.sonatype.org/content/repositories/snapshots")
        maven("https://oss.sonatype.org/content/repositories/snapshots")

        maven {
            name = "Kotlin Discord"
            url = uri("https://maven.kotlindiscord.com/repository/maven-public/")
        }

        maven("https://repo.kotlin.link")
    }
}

rootProject.name = "Minkinator"

include(":bot")
include(":komapper")
include("util")
