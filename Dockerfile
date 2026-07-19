# ── Stage 1: Build the application ───────────────────────────
FROM node:20-bullseye-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# VITE_API_URL is embedded in the build at compile-time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2: Production runtime ──────────────────────────────
FROM node:20-bullseye-slim AS production

WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV PORT=8080
ENV HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", ".output/server/index.mjs"]
