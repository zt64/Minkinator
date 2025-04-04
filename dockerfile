FROM eclipse-temurin:21-jdk-alpine AS builder

COPY . /repo
WORKDIR /repo
RUN ./gradlew :bot:installDist --no-daemon --no-configuration-cache

FROM eclipse-temurin:21-jre-alpine AS runner

COPY --from=builder /repo/bot/build/install/bot /app/
ENTRYPOINT ["/app/bin/bot"]