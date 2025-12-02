#!/bin/bash

#!/bin/bash
# ads169th System - Production Deployment Script
# สคริปต์สำหรับ deploy โปรเจคไป production

set -e

echo "🚀 Starting deployment process..."

# 1. Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# 3. Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# 4. Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# 5. Build application
echo "🏗️  Building application..."
npm run build

# 6. Restart application
echo "🔄 Restarting application..."
if command -v pm2 &> /dev/null; then
    pm2 restart ads169th-system || pm2 start server.js --name "ads169th-system"
else
    echo "⚠️  PM2 not found. Please restart manually."
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running at: http://localhost:3000"
