import org.jetbrains.kotlin.gradle.dsl.kotlinExtension

plugins {
    alias(libs.plugins.kotlin.jvm) apply false
    alias(libs.plugins.kotlin.serialization) apply false
    alias(libs.plugins.ksp) apply false
}

subprojects {
    apply {
        plugin("kotlin")
    }

    kotlinExtension.apply {
        jvmToolchain(17)

        sourceSets["main"].languageSettings {
            enableLanguageFeature("ContextReceivers")
        }
    }

    dependencies {
        val implementation by configurations

        implementation(rootProject.libs.kord.ex)
    }
}