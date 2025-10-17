ARG BASE_IMAGE=node:22-slim
FROM ${BASE_IMAGE} AS builder
WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y --no-install-recommends python3 build-essential ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy manifest files first for better caching
COPY package.json pnpm-lock.yaml* package-lock.json* ./

# Install all dependencies but skip lifecycle scripts (postinstall will run after build)
# This prevents postinstall (which runs `npm run build`) from running before source files
COPY .npmrc* ./
RUN npm install --ignore-scripts --no-audit --no-fund

# Copy project files and build TypeScript output, then run postinstall steps
COPY . .
RUN npm run build && node postinstall.js

# Runtime image
FROM ${BASE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed to run the app
COPY package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/bin ./bin
COPY --from=builder /app/.env.example ./.env.example
# Use an unprivileged user for running the container
USER node

# Default command to run the MCP server
CMD ["node", "dist/index.js"]
