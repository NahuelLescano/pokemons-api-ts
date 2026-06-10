FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 4000
CMD ["pnpm", "dev"]