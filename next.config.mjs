import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/core/i18n/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Vercel 정적 내보내기 시 API 라우트 무시
  images: {
    unoptimized: true
  }
}

export default withNextIntl(nextConfig)
