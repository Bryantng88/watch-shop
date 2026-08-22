# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
COPY . .
RUN npx prisma generate
# NEXT_PUBLIC values are inlined by Next.js during this step. A dedicated build
# environment keeps unrelated runtime credentials out of the build process.
RUN --mount=type=secret,id=env_build,target=/app/.env.production,required=true \
    npm run build

FROM base AS runtime
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Next's standalone tracer retains the crc32c package metadata but can omit its
# dynamically resolved CommonJS build. S3-backed admin routes need that build at
# runtime, so copy the complete package into the otherwise-minimal image.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@aws-crypto/crc32c ./node_modules/@aws-crypto/crc32c
RUN node -e "require('@aws-crypto/crc32c')"

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"]
CMD ["node", "server.js"]

# One-shot operational image. It retains Prisma CLI and project scripts, while the
# web service above stays minimal and immutable.
FROM deps AS ops
ENV NODE_ENV=production
COPY . .
RUN npx prisma generate
CMD ["npx", "prisma", "migrate", "deploy"]
