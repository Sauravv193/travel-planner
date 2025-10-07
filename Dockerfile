# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY backend/WarderGen/mvnw backend/WarderGen/mvnw.cmd backend/WarderGen/pom.xml ./
COPY backend/WarderGen/.mvn ./.mvn

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY backend/WarderGen/src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=production

# Run the application
CMD ["java", "-Dserver.port=${PORT:-8080}", "-Dspring.profiles.active=production", "-jar", "target/*.jar"]