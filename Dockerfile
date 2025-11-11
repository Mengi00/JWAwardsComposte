# Multi-stage build for Johnnie Walker DJ Awards voting platform

# Stage 1: Build frontend and backend
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build both frontend (Vite) and backend (esbuild)
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS production
WORKDIR /app

# Install PostgreSQL client for healthchecks and migrations
RUN apk add --no-cache postgresql-client

# Install dependencies including drizzle-kit for migrations
COPY package*.json ./
RUN npm ci

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Copy shared schemas (needed by compiled backend)
COPY shared ./shared

# Copy server code (needed for seed script)
COPY server ./server

# Copy drizzle config for database migrations
COPY drizzle.config.ts ./
COPY tsconfig.json ./

# Copy entrypoint script
COPY scripts/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port (configurable via PORT env var)
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Use entrypoint script that runs migrations before starting app
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
