# Multi-stage Dockerfile for Node.js Backend
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache dumb-init curl

WORKDIR /app

# Stage 2: Dependencies
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 3: Production
FROM base AS production

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads && addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

CMD ["dumb-init", "node", "server.js"]
