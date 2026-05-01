# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy built dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .
COPY ../frontend/build ./frontend/build

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 8080) + '/ping', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application (without nodemon for production)
CMD ["node", "index.js"]
