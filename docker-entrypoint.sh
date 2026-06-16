#!/bin/sh
set -e

if [ "${STORE_DB_PUSH:-true}" = "true" ]; then
  npx prisma db push
fi

exec "$@"
