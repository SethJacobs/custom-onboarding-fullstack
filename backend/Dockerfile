# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy the backend module files into the image
COPY pom.xml .
# (If your pom has modules, adjust; here it's a single module)
COPY src ./src

# Build the jar (skip tests for faster builds)
RUN mvn -q -DskipTests package

# ---------- Run stage ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

# copy the built JAR
COPY --from=build /workspace/target/onboarding-backend-0.0.1-SNAPSHOT.jar /app/app.jar

# Render provides $PORT; Spring must bind to it
ENV PORT=8080
EXPOSE 8080

# Use the port env and turn down Spring banner noise (optional)
ENTRYPOINT ["java","-Dserver.port=${PORT}","-jar","/app/app.jar"]
