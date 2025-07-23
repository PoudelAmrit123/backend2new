FROM node:18 AS base

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

# === Production stage ===
FROM node:18-alpine AS prod

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copy compiled app and deps
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json


# Expose the app port
EXPOSE 3001

# Healthcheck - update URL path if different
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the app
CMD ["node", "dist/index.js"]
