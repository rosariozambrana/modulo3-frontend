# ── Stage 1: Build the application ───────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# VITE_API_URL is embedded in the build at compile-time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2: Production runtime ──────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV PORT=8080
ENV HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 8080

# Seguridad: Ejecutamos como usuario no-root
USER node

CMD ["node", ".output/server/index.mjs"]
