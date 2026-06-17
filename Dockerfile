FROM node:20-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY scripts ./scripts
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_TOSS_CLIENT_KEY=
ARG NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=50000
ARG NEXT_PUBLIC_SHIPPING_FEE=3000
ENV NEXT_PUBLIC_TOSS_CLIENT_KEY=${NEXT_PUBLIC_TOSS_CLIENT_KEY}
ENV NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=${NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD}
ENV NEXT_PUBLIC_SHIPPING_FEE=${NEXT_PUBLIC_SHIPPING_FEE}
ENV DATABASE_URL=postgresql://store:store_password@localhost:5432/store

RUN npx prisma generate \
  && npm run build \
  && chmod +x /app/docker-entrypoint.sh

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", ".next/standalone/server.js"]
