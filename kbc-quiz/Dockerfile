# # Use official PostgreSQL image from Docker Hub
# FROM postgres:latest

# # Set environment variables
# ENV POSTGRES_USER KbC120
# ENV POSTGRES_PASSWORD kBc#1357
# ENV POSTGRES_DB kbc_quiz

# # Expose PostgreSQL port
# EXPOSE 5432

# # Copy custom initialization scripts
# COPY init.sql /docker-entrypoint-initdb.d/

# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install app dependencies using the `npm ci` command instead of `npm install`
# for a clean install of all dependencies.
COPY package*.json ./
RUN npm i

# Copy the local code to the container image.
COPY . .

# Inform Docker that the container is listening on port 3000.
EXPOSE 3000

# Run the web service on container startup.
CMD ["npm", "run", "start:dev"]
