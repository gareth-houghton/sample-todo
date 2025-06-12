FROM node:24-alpine AS base

# Install dependencies when required
FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild source when required
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PRIVATE_STANDALONE=true

RUN echo 'PGDB_URL="postgres://postgres:V3nd4V0@host.docker.internal:5432/tododb"' > .env

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_MODE=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system -g 1001 nodejs
RUN adduser --system -u 1001 nextjs

RUN echo 'PGDB_URL="postgres://postgres:V3nd4V0@postgres:5432/tododb"' > .env

# RUN addgroup nodejs
# RUN adduser -SDH -G nodejs nextjs
# RUN mkdir .next
# RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]