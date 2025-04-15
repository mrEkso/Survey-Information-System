# Build stage
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml and install dependencies
COPY ../pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY ../src src

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM openjdk:17-jdk

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Command to run the application
CMD ["java", "-jar", "app.jar"] 