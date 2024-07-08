import org.jetbrains.kotlin.config.LanguageFeature
import org.jetbrains.kotlin.gradle.dsl.kotlinExtension
import org.jlleitschuh.gradle.ktlint.KtlintExtension

plugins {
    alias(libs.plugins.kotlin.jvm) apply false
    alias(libs.plugins.kotlin.serialization) apply false
    alias(libs.plugins.ksp) apply false
    alias(libs.plugins.ktlint) apply false
}

allprojects {
    apply {
        plugin("org.jlleitschuh.gradle.ktlint")
    }

    configure<KtlintExtension> {
        version = rootProject.libs.versions.ktlint
        ignoreFailures = true
    }
}

subprojects {
    apply {
        plugin("kotlin")
    }

    kotlinExtension.apply {
        jvmToolchain(17)

        sourceSets["main"].languageSettings {
            enableLanguageFeature(LanguageFeature.ContextReceivers.name)
        }
    }

    dependencies {
        val implementation by configurations

        implementation(rootProject.libs.kord.ex)
    }
}