# Dockerfile = the recipe for packing our app into a container image

# 1. Start from a small Linux that already has Node.js installed
FROM node:20-alpine

# 2. Create a folder for the app and work inside it
WORKDIR /app

# 3. Copy the package list and install the packages
COPY package*.json ./
RUN npm ci --omit=dev

# 4. Copy our code
COPY src ./src

# 5. The app listens on port 3000
EXPOSE 3000

# 6. Command to start the app
CMD ["node", "src/server.js"]
