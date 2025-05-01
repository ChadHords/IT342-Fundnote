FROM maven:3.9.4-eclipse-temurin-20-alpine as build
COPY . .
RUN mvn clean package -Dskiptests

FROM eclipse-temurin:20-jdk-alpine
COPY --from=build /target/*.jar fundnote.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "fundnote.jar"]