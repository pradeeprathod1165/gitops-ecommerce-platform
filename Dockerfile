# Use a lightweight, secure Linux base image with Node.js pre-installed
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker's layer cache
COPY package*.json ./

# Install dependencies (none yet, but prepares for the future work)
RUN npm install --omit=dev

# Copy the rest of the application source code
COPY . .

# EXpose the port the aoo runs on
EXPOSE 8080

# Run the application directly (avoids npm process wrapper issues)
CMD ["node", "server.js"] 
