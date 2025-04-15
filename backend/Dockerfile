# Development stage
FROM maven:3.8.4-openjdk-17

# Set the working directory
WORKDIR /app

# Copy the pom.xml and install dependencies
COPY ./pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src src

# Run the app with DevTools enabled
CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.jvmArguments='-Dspring.devtools.restart.enabled=true'"]

# Create a new image for running the application
FROM openjdk:17-jdk

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Command to run the application
CMD ["java", "-Dspring.devtools.restart.enabled=true", "-jar", "app.jar"]
