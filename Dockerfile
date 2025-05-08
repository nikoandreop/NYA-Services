
FROM node:18-alpine

WORKDIR /app

# Create data directory with correct permissions
RUN mkdir -p /app/data && chmod 777 /app/data

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Set production environment and build frontend
ENV NODE_ENV=production
RUN npm run build

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "server.js"]
