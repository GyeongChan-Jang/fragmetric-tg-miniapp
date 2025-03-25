import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/core/i18n/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Vercel 정적 내보내기 시 API 라우트 무시
  images: {
    unoptimized: true
  },
  // Edge Functions 디렉토리를 빌드에서 제외
  webpack: (config) => {
    config.module.rules.push({
      test: /supabase\/functions\/.*\.ts$/,
      loader: 'ignore-loader'
    })
    return config
  }
}

export default withNextIntl(nextConfig)
