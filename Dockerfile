FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Ensure these paths exactly match your GitHub structure
# Note: No leading slash '/'
COPY backend/WarderGen/mvnw .
COPY backend/WarderGen/mvnw.cmd .
COPY backend/WarderGen/pom.xml .
COPY backend/WarderGen/.mvn ./.mvn

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy the rest of the source code
COPY backend/WarderGen/src ./src

# Build
RUN ./mvnw clean package -DskipTests

# The JAR file will be in target/
# Ensure the wildcard matches your actual output JAR filename
CMD ["sh", "-c", "java -Dserver.port=${PORT:-10000} -Dserver.address=0.0.0.0 -Dspring.profiles.active=production -jar target/*.jar"]
