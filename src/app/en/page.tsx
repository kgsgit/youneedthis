'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { ToolsSection } from '@/components/home/ToolsSection'
import { SitesSection } from '@/components/home/SitesSection'
import { Footer } from '@/components/layout/Footer'
import { WebsiteJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd'
import { siteConfig } from '@/config/site'

export default function EnglishHomePage() {
  const { setLanguage } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // 영어 페이지에 접근하면 언어를 영어로 설정
    setLanguage('en')
  }, [setLanguage])

  const content = {
    title: 'Practical tools that make life more convenient',
    description: 'No installation, no sign-up required. Use instantly when you need it.',
    searchPlaceholder: 'Search tools or sites...'
  }

  return (
    <>
      <Header />
      
      {/* Premium Hero Section with Ultra Strong Gradient */}
      <section className="bg-gradient-to-br from-black via-slate-900 to-indigo-950 text-white py-4 sm:py-6 lg:py-8 relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 via-purple-900/30 to-violet-900/50"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-blue-900/20 to-purple-900/40"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-4">
                <span className="block text-white">{content.title}</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mb-6 leading-relaxed max-w-2xl lg:max-w-none">
                {content.description}
              </p>
              
              {/* Search Bar */}
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
                    }
                  }}
                  placeholder={content.searchPlaceholder}
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-800 transition-all text-base"
                />
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
                    }
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400">
                <span className="font-medium" suppressHydrationWarning>{siteConfig.tools.length}+ Tools</span>
                <span className="hidden sm:inline">•</span>
                <span>Latest Update</span>
                <span className="hidden sm:inline">•</span>
                <span>Free Access</span>
              </div>
            </div>
            
            {/* Right Column - Rotating Popular Tools */}
            <div className="hidden lg:block">
              <div className="relative bg-gradient-to-br from-slate-800/30 to-indigo-900/20 backdrop-blur-sm rounded-2xl p-8 h-80 border border-slate-700/30">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950/30 to-transparent"></div>
                
                <div className="relative h-full flex flex-col justify-center">
                  {/* Vertical Auto-Rotating Tools - Bottom to Top */}
                  <div className="space-y-3 overflow-hidden h-80 relative">
                    <div className="absolute inset-0 animate-scroll-up">
                      {[...siteConfig.tools.slice(0, 8), ...siteConfig.tools.slice(0, 8)].map((tool, index) => (
                        <div
                          key={`${tool.id}-${index}`}
                          className="flex items-center space-x-3 p-3 mb-3 bg-slate-800/30 rounded-xl border border-slate-600/30 backdrop-blur-sm hover:bg-slate-700/40 transition-all duration-300"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            {tool.icon?.startsWith('bi-') ? (
                              <i className={`${tool.icon} text-sm text-blue-300`}></i>
                            ) : (
                              <span className="text-sm">{tool.icon || '🛠️'}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-slate-200 truncate" suppressHydrationWarning>
                              {tool.name.en}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToolsSection 
        searchQuery=""
        language="en"
        region="global"
      />
      <Footer />
      
      {/* JSON-LD 구조화 데이터를 마지막에 배치 */}
      <WebsiteJsonLd />
      <OrganizationJsonLd />
    </>
  )
}