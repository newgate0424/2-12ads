#!/usr/bin/env node

/**
 * Health Check Script for ads169th System
 * Usage: node healthcheck.js
 */

const http = require('http')
const { parse } = require('url')

const config = {
  hostname: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || 3000,
  timeout: 5000,
  path: '/health'
}

function healthCheck() {
  return new Promise((resolve, reject) => {
    const url = `http://${config.hostname}:${config.port}${config.path}`
    const parsedUrl = parse(url)
    
    const req = http.request({
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'GET',
      timeout: config.timeout,
      headers: {
        'User-Agent': 'HealthCheck/1.0'
      }
    }, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          
          if (res.statusCode === 200 && result.status === 'ok') {
            resolve({
              status: 'healthy',
              statusCode: res.statusCode,
              response: result,
              timestamp: new Date().toISOString()
            })
          } else {
            reject({
              status: 'unhealthy',
              statusCode: res.statusCode,
              response: result,
              timestamp: new Date().toISOString()
            })
          }
        } catch (error) {
          reject({
            status: 'unhealthy',
            statusCode: res.statusCode,
            error: 'Invalid JSON response',
            response: data,
            timestamp: new Date().toISOString()
          })
        }
      })
    })
    
    req.on('error', (error) => {
      reject({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    })
    
    req.on('timeout', () => {
      req.destroy()
      reject({
        status: 'unhealthy',
        error: 'Request timeout',
        timeout: config.timeout,
        timestamp: new Date().toISOString()
      })
    })
    
    req.end()
  })
}

// Main execution
if (require.main === module) {
  console.log('🔍 Checking ads169th System health...')
  console.log(`📍 Target: http://${config.hostname}:${config.port}${config.path}`)
  
  healthCheck()
    .then((result) => {
      console.log('✅ Health check passed!')
      console.log(JSON.stringify(result, null, 2))
      process.exit(0)
    })
    .catch((error) => {
      console.log('❌ Health check failed!')
      console.log(JSON.stringify(error, null, 2))
      process.exit(1)
    })
}

module.exports = { healthCheck, config }