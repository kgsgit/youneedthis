import type { Metadata } from 'next'
import './globals.css'
import { siteConfig } from '@/config/site'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { kakaoSmallSans, kakaoBigSans } from '@/lib/fonts'
import { AdSenseScript } from '@/components/ads/AdSenseScript'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description.ko,
  keywords: '실용적 도구, 온라인 도구, 무료 도구, QR코드 생성, 비밀번호 생성기, 유용한 사이트, 생산성 도구',
  authors: [{ name: 'YouNeedThis' }],
  creator: 'YouNeedThis',
  publisher: 'YouNeedThis',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      ko: siteConfig.url,
      en: `${siteConfig.url}/en`
    }
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description.ko,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/images/logo_s.svg`,
        width: 400,
        height: 400,
        alt: 'YouNeedThis Logo',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description.ko,
    images: [`${siteConfig.url}/images/logo_s.svg`]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  verification: {
    // Google Search Console 추가 시 여기에 입력
    // google: 'verification_code',
    // Naver 웹마스터도구 추가 시 여기에 입력
    // other: { 'naver-site-verification': 'verification_code' }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2152944666199864"
             crossOrigin="anonymous"></script>
        <GoogleAnalytics GA_MEASUREMENT_ID="G-8YX9WZEMJ1" />
      </head>
      <body className={`${kakaoSmallSans.variable} ${kakaoBigSans.variable}`}>
        <div className="min-h-screen">
          <LanguageProvider>
            <main>{children}</main>
          </LanguageProvider>
        </div>
      </body>
    </html>
  )
}