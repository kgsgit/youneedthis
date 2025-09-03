'use client'

import { siteConfig } from '@/config/site'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export function Footer() {
  const { language } = useLanguage()

  const content = {
    ko: {
      about: '소개',
      privacy: '개인정보처리방침',
      terms: '이용약관',
      contact: '문의',
      disclaimer: '면책조항',
      copyright: `© 2025 ${siteConfig.name}. 모든 권리 보유.`
    },
    en: {
      about: 'About',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact',
      disclaimer: 'Disclaimer',
      copyright: `© 2025 ${siteConfig.name}. All rights reserved.`
    }
  }

  const currentContent = content[language]

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">{siteConfig.name}</h3>
          <p className="text-gray-400 mb-6">
            {siteConfig.description[language]}
          </p>
          
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
              {currentContent.about}
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              {currentContent.privacy}
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              {currentContent.terms}
            </Link>
            <Link href="/disclaimer" className="text-gray-400 hover:text-white transition-colors">
              {currentContent.disclaimer}
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              {currentContent.contact}
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            {currentContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}