#!/bin/sh
set -e

echo "🚀 Starting Johnnie Walker DJ Awards application..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -h ${PGHOST:-postgres} -p ${PGPORT:-5432} -U ${PGUSER:-djvoting}; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run database migrations (push schema)
echo "📦 Running database migrations..."
npm run db:push || {
  echo "⚠️  Warning: db:push failed, trying with --force flag..."
  npm run db:push -- --force || {
    echo "❌ Error: Database migration failed"
    exit 1
  }
}

echo "✅ Database migrations completed!"

# Run seed script to create admin user and default settings
echo "🌱 Seeding database..."
npm run seed || {
  echo "⚠️  Warning: Seed script failed (this is OK if data already exists)"
}

echo "✅ Database initialization completed!"

# Start the application
echo "🎉 Starting application server..."
exec npm start
