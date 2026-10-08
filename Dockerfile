FROM node:24-bookworm-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@11.25.0
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend
WORKDIR /app/backend
RUN pnpm install --frozen-lockfile && pnpm db:generate && pnpm typecheck
WORKDIR /app/frontend
RUN npm ci && npm run build
WORKDIR /app/backend
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["pnpm", "start"]
