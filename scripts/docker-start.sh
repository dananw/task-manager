#!/bin/bash

# Production startup script for Docker container
set -e

echo "Starting Task Manager application..."

# Ensure Prisma directory exists
mkdir -p ./prisma

# Initialize database if it doesn't exist
if [ ! -f "./prisma/dev.db" ]; then
    echo "Database not found. Creating database..."
    npx prisma db push --skip-generate
else
    echo "Database found. Ensuring schema is up to date..."
    npx prisma db push --skip-generate
fi

# Start the application
echo "Starting Next.js application..."
exec "$@"