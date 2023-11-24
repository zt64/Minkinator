plugins {
    alias(libs.plugins.ksp)
}

kotlin {
    sourceSets.main {
        kotlin.srcDir("build/generated/ksp/main/kotlin")

        languageSettings {
            enableLanguageFeature("ContextReceivers")
            optIn("org.komapper.annotation.KomapperExperimentalAssociation")
        }
    }
}

ksp {
    arg("komapper.enableEntityStoreContext", "true")
}

dependencies {
    api(libs.komapper.dialect.h2.r2dbc)
    implementation(libs.komapper.starter.r2dbc)
    ksp(libs.komapper.processor)
}