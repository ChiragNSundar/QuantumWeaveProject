# Multi-stage Dockerfile for Quantum Weave AI Intelligence System
FROM node:22-alpine AS runner

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application source
COPY . .

# Build client production bundle
RUN npx vite build --config client/vite.config.js client

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose server port
EXPOSE 5000

# Ensure data directory exists for database persistence
RUN mkdir -p /app/data

# Run production server
CMD ["node", "server/index.js"]
