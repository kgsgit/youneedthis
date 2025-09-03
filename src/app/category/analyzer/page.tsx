'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { siteConfig } from '@/config/site'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AnalyzerPage() {
  const { language, isHydrated } = useLanguage()
  
  const category = siteConfig.toolCategories.find(cat => cat.id === 'analyzer')
  const tools = siteConfig.tools.filter(tool => tool.category === 'analyzer')

  const content = {
    ko: {
      title: '분석도구',
      description: '데이터와 콘텐츠를 분석하는 도구들',
      allTools: '모든 도구',
      home: '홈',
      tools: '도구',
      useBtn: '사용하기',
      toolsCount: '개의 도구를 사용할 수 있습니다'
    },
    en: {
      title: 'Analyzer Tools',
      description: 'Tools for analyzing data and content',
      allTools: 'All Tools',
      home: 'Home',
      tools: 'Tools',
      useBtn: 'Use Tool',
      toolsCount: ' tools available'
    }
  }

  const currentContent = content[isHydrated ? language : 'ko']

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50/30 via-blue-50/20 to-purple-50/30">
        {/* Hero Section - Match main page design */}
        <div className="bg-gradient-to-br from-black via-slate-900 to-indigo-950 text-white py-2 sm:py-3 lg:py-4 relative overflow-hidden">
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
              <Link href="/tools" className="text-slate-300 hover:text-white transition-colors">{currentContent.tools}</Link>
              <span className="text-slate-400 mx-2">/</span>
              <span className="text-white">{currentContent.title}</span>
            </nav>
            
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2 sm:mb-3">
                <span className="block text-white">{currentContent.title}</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {currentContent.description}
              </p>
            </div>
          </div>
        </div>

        <div className="py-8 sm:py-12 lg:py-16">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentContent.allTools}
              </h2>
              <p className="text-gray-600">
                {tools.length}{currentContent.toolsCount}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="block group"
                >
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {tool.icon?.startsWith('bi-') ? (
                          <i className={`${tool.icon} text-xl text-gray-700`}></i>
                        ) : (
                          <span className="text-xl">{tool.icon || '📊'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 leading-tight" suppressHydrationWarning>
                          {tool.name[language]}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2" suppressHydrationWarning>
                          {tool.description[language]}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {category?.name[language]}
                      </span>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        <span>{currentContent.useBtn}</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}