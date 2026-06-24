# Etapa 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Dar permisos de ejecución al wrapper de Maven y construir el JAR omitiendo tests
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# Etapa 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copiar el JAR generado desde la etapa de build
COPY --from=builder /app/target/*.jar app.jar

# Exponer el puerto configurado (8080 por defecto)
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]