module.exports = {
  apps: [
    {
      name: 'ads169th-system',
      script: 'app.js',
      cwd: '/httpdocs',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      // Auto restart on file changes (disable in production)
      watch: false,
      ignore_watch: [
        'node_modules',
        '.next',
        'logs',
        '.env*',
        '*.log'
      ]
    }
  ],
  
  deploy: {
    production: {
      user: 'node',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/newgate0424/ads169th-system.git',
      path: '/httpdocs',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}