'use client'

import { Header } from '@/components/layout/Header'
import { SitesSection } from '@/components/home/SitesSection'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export default function SitesPage() {
  const { language } = useLanguage()

  const content = {
    ko: {
      title: '추천 리소스',
      description: '시간을 절약해주는 신뢰할 수 있는 웹사이트 모음',
      home: '홈',
      resources: '리소스'
    },
    en: {
      title: 'Recommended Resources',
      description: 'A collection of trusted websites to save your time',
      home: 'Home',
      resources: 'Resources'
    }
  }

  const currentContent = content[language]

  return (
    <>
      <Header />
      
      {/* Hero Section - Match main page design */}
      <section className="bg-gradient-to-br from-black via-slate-900 to-indigo-950 text-white py-2 sm:py-3 lg:py-4 relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 via-purple-900/30 to-violet-900/50"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-blue-900/20 to-purple-900/40"></div>
        
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative">
          {/* Breadcrumb Navigation */}
          <nav className="mb-1 text-sm">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">{currentContent.home}</Link>
            <span className="text-slate-400 mx-2">/</span>
            <span className="text-white">{currentContent.resources}</span>
          </nav>
          
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2 sm:mb-3">
              <span className="block text-white">{currentContent.title}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mb-2 sm:mb-3 max-w-2xl mx-auto leading-relaxed">
              {currentContent.description}
            </p>
          </div>
        </div>
      </section>

      <SitesSection language={language} />
      <Footer />
    </>
  )
}