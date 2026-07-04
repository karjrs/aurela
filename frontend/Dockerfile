# Build context for this Dockerfile is the repo root (not frontend/), because
# frontend/codegen.ts reads ../backend/schema.graphql as a plain SDL file.
# All COPY paths below are relative to the repo root.

FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

FROM base AS dev
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY backend/schema.graphql /app/backend/schema.graphql
COPY frontend/. .
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM base AS build
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY backend/schema.graphql /app/backend/schema.graphql
COPY frontend/. .
ARG NEXT_PUBLIC_GRAPHQL_ENDPOINT
ENV NEXT_PUBLIC_GRAPHQL_ENDPOINT=$NEXT_PUBLIC_GRAPHQL_ENDPOINT
RUN pnpm build

FROM node:24-alpine AS prod
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/frontend/public ./public
COPY --from=build /app/frontend/.next/standalone ./
COPY --from=build /app/frontend/.next/static ./.next/static
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
