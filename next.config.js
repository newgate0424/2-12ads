/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // For Plesk deployment
  output: 'standalone',
  poweredByHeader: false,
  generateEtags: true, // เปิด ETag เพื่อ caching
  compress: true, // Gzip compression
  
  // Image optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 วัน
  },
  
  // Performance optimizations
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // optimizeCss: true, // ปิดไว้ชั่วคราว - ต้องการ critters module
    optimizePackageImports: ['lucide-react'],
  },
  
  // ปรับแต่ง webpack เพื่อประสิทธิภาพ
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // ลด bundle size
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
          },
        },
      }
    }
    return config
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';",
          },
        ],
      },
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/users',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
