# Use the official Maven image as the base image
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml and any other necessary configuration files
COPY ./pom.xml .

COPY src src

# Build the application
RUN mvn clean package -DskipTests

# Run the app in a minimal java container

# Create a new image for running the application
FROM openjdk:17-jdk

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Command to run the application
CMD ["java", "-jar", "app.jar"]