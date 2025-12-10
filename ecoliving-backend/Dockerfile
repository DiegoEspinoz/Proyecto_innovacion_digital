# Dockerfile optimizado
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# 1. Primero copia solo pom.xml (para mejor caching)
COPY pom.xml .

# 2. Copia los archivos del wrapper Maven
# Asegúrate de copiar mvnw.cmd también aunque sea para Windows
COPY mvnw mvnw
COPY mvnw.cmd mvnw.cmd
COPY .mvn/ .mvn/

# 3. Verifica que los archivos se copiaron correctamente (para debug)
RUN ls -la && echo "=== Contenido de .mvn ===" && ls -la .mvn/

# 4. Configura permisos y descarga dependencias
RUN chmod +x mvnw && \
    ./mvnw dependency:go-offline -B

# 5. Copiar código fuente
COPY src/ src/

# 6. Compilar proyecto
RUN ./mvnw clean package -DskipTests

# Etapa de ejecución
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar el JAR compilado
COPY --from=build /app/target/*.jar app.jar

# Exponer puerto
EXPOSE 8080

# Comando de inicio con mejoras para contenedores
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-jar", "app.jar"]