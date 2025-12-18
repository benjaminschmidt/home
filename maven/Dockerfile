FROM docker.io/library/maven:3.9.12-eclipse-temurin-25-alpine

RUN apk add --no-cache git

RUN adduser -D runner

ENV MAVEN_CONFIG=/home/runner/.m2

WORKDIR /home/runner

USER runner
