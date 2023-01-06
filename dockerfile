# syntax=docker/dockerfile:1
FROM eclipse-temurin:19-jdk-jammy
COPY src .
COPY gradle .
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY gradlew .
CMD ["./gradlew", "installDist"]
CMD ["./build/install/Minkinator/bin/Minkinator"]