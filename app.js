const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// Environment configuration for Plesk
const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = process.env.PORT || process.env.npm_config_port || 3000

console.log('🚀 Starting ads169th System...')
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
console.log(`🌐 Hostname: ${hostname}`)
console.log(`🔌 Port: ${port}`)

// Initialize Next.js app
const app = next({ 
  dev, 
  hostname, 
  port,
  // For Plesk deployment
  conf: {
    distDir: '.next',
    generateEtags: false,
    compress: !dev
  }
})

const handle = app.getRequestHandler()

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('📦 Received SIGTERM, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('📦 Received SIGINT, shutting down gracefully...')
  process.exit(0)
})

// Health check endpoint
const healthCheck = (req, res) => {
  if (req.url === '/health' || req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: require('./package.json').version || '1.0.0'
    }))
    return true
  }
  return false
}

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      // Health check
      if (healthCheck(req, res)) {
        return
      }

      // Security headers for production
      if (!dev) {
        res.setHeader('X-Frame-Options', 'DENY')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('X-XSS-Protection', '1; mode=block')
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
      }

      // Parse request URL
      const parsedUrl = parse(req.url, true)
      
      // Handle request with Next.js
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('❌ Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  })

  server.once('error', (err) => {
    console.error('❌ Server error:', err)
    if (err.code === 'EADDRINUSE') {
      console.error(`💥 Port ${port} is already in use`)
    }
    process.exit(1)
  })

  server.listen(port, hostname, () => {
    console.log('✅ ads169th System is ready!')
    console.log(`🌍 Local: http://${hostname}:${port}`)
    if (!dev) {
      console.log('🏭 Running in production mode')
    }
    console.log('📱 Ready to accept connections...')
  })

  // Keep server reference for potential cleanup
  global.server = server
})
.catch((err) => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})

// Export for potential external use
module.exports = app