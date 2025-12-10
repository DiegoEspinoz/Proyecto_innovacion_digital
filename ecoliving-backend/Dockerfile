# Etapa de construcción
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# 1. Copiar archivos de Maven primero (para mejor caché)
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# 2. Hacer ejecutable mvnw y descargar dependencias
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# 3. Copiar código fuente
COPY src src

# 4. Compilar el proyecto
RUN ./mvnw clean package -DskipTests

# Etapa de producción
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# 5. Copiar el JAR compilado desde la etapa de construcción
COPY --from=build /app/target/*.jar app.jar

# 6. Crear usuario no-root para seguridad
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# 7. Exponer puerto
EXPOSE 8080

# 8. Comando de inicio optimizado para contenedores
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-XX:+UseG1GC", \
    "-XX:+UseStringDeduplication", \
    "-jar", \
    "app.jar"]