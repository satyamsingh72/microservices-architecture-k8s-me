# --- Build Stage ---
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --production

# --- Production Stage ---
FROM node:18-alpine

WORKDIR /app
# Copy dependencies from build stage
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

# Security: Run as non-root user
USER node

EXPOSE 5002

CMD ["node", "server.js"]