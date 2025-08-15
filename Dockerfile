# Use official Node.js LTS Alpine image for small size and stability
FROM node:22.17.0-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package manifests first for better caching
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy all source files
COPY . .

# Expose the port your app runs on (default 3000)
EXPOSE 3000

# Use nodemon or similar for live reload if you want
# Or just run the dev start script directly
CMD ["pnpm", "run", "start:dev"]
