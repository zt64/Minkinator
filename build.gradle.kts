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
        jvmToolchain(21)
    }

    tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
        compilerOptions.freeCompilerArgs = listOf("-Xcontext-receivers")
    }

    dependencies {
        val implementation by configurations

        implementation(rootProject.libs.kord.ex)
    }
}