# =====================================================================
#  Dockerfile = the recipe for packing our app into a "lunch box"
#  (a container image) that runs the same on any computer or cloud.
# =====================================================================

# ---- Stage 1: install the app's packages --------------------------
# Start from a small Linux that already has Node.js installed
FROM node:20-alpine AS deps
WORKDIR /app
# Copy only the package list first, so Docker can cache this step
COPY package.json package-lock.json ./
# Install only what production needs (no test tools)
RUN npm ci --omit=dev

# ---- Stage 2: the final, small image we ship ----------------------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# The pipeline passes these in, so the page can show which commit is live
ARG GIT_SHA=docker-local
ARG BUILD_TIME=unknown
ENV GIT_SHA=$GIT_SHA \
    BUILD_TIME=$BUILD_TIME

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

# Don't run as the all-powerful root user (security best practice)
USER node

# The app listens on port 3000 inside the container
EXPOSE 3000

# Docker checks every 30s that the app is still alive
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
