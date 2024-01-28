import org.jetbrains.kotlin.gradle.dsl.kotlinExtension
import org.jlleitschuh.gradle.ktlint.KtlintExtension

plugins {
    alias(libs.plugins.kotlin.jvm) apply false
    alias(libs.plugins.kotlin.serialization) apply false
    alias(libs.plugins.ksp) apply false
    alias(libs.plugins.ktlint)
}

subprojects {
    apply {
        plugin("kotlin")
        plugin("org.jlleitschuh.gradle.ktlint")
    }

    kotlinExtension.apply {
        jvmToolchain(17)

        sourceSets["main"].languageSettings {
            enableLanguageFeature("ContextReceivers")
        }
    }

    configure<KtlintExtension> {
        version = "1.1.0"
    }

    dependencies {
        val implementation by configurations

        implementation(rootProject.libs.kord.ex)
    }
}