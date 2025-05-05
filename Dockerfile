
FROM node:18-alpine

WORKDIR /app

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

# Create data directory with correct permissions
RUN mkdir -p /app/data && chown -R node:node /app/data

# Switch to non-root user
USER node

# Start the server
CMD ["node", "server.js"]
