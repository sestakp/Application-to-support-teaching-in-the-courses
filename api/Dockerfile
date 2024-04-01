# Dockerfile for backend build
# author Vojtěch Kulíšek (xkulis03)
# since 22.12.2023

FROM maven:3.8.5-openjdk-17
workdir .
COPY pom.xml .
RUN mvn dependency:copy-dependencies
COPY . .
COPY application-docker.properties src/main/resources/application.properties
RUN mvn package -Dmaven.test.skip

FROM openjdk:17-slim AS base
EXPOSE 80
FROM base AS final
COPY --from=0 ./target/*.jar app.jar
CMD [ "java", "-jar", "app.jar" ]