# ============================================
# Stage 1: Install Dependencies
# ============================================
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    cp -R node_modules /prod_node_modules && \
    npm ci

# ============================================
# Stage 2: Build the Application
# ============================================
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ============================================
# Stage 3: Production Runner (Minimal Image)
# ============================================
FROM node:18-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

# Set hostname
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]
