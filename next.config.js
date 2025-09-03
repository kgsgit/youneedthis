const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 성능 최적화
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons'],
  },
  
  // 압축 활성화
  compress: true,
  
  // 정적 파일 최적화
  poweredByHeader: false,
  
  // 최신 Next.js에서는 기본적으로 SWC가 활성화됨
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.screenshotone.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        port: '',
        pathname: '/s2/favicons/**',
      },
      {
        protocol: 'https',
        hostname: 'favicon.yandex.net',
        port: '',
        pathname: '/**',
      },
    ],
    // 이미지 최적화
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일 캐시
  },
  
  // 캐시 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)\\.(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = withBundleAnalyzer(nextConfig)