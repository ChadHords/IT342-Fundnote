FROM maven:3.9.4-eclipse-temurin-20 as build
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:20-jdk-slim
COPY --from=build /target/*.jar fundnote.jar
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar fundnote.jar --server.port=${PORT}"]