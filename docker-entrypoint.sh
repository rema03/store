#!/bin/sh
set -e

if [ "${STORE_DB_PUSH:-true}" = "true" ]; then
  echo "Waiting for PostgreSQL database and pushing Prisma schema..."
  until npx prisma db push; do
    echo "Prisma db push failed or DB is not ready. Retrying in 3 seconds..."
    sleep 3
  done

  echo "Seeding initial store data..."
  npx prisma db seed || true
fi

exec "$@"

