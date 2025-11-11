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

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Copy shared schemas (needed by compiled backend)
COPY shared ./shared

# Copy drizzle config for database migrations
COPY drizzle.config.ts ./

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the application using the compiled server
CMD ["npm", "start"]
