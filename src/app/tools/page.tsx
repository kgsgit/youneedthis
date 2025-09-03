'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { siteConfig } from '@/config/site'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

// PDF Design color mapping for categories
const getCategoryColor = (categoryId: string) => {
  switch (categoryId) {
    case 'converter':
      return 'bg-green-50 border-green-200'
    case 'generator':
      return 'bg-blue-50 border-blue-200'
    case 'validator':
      return 'bg-orange-50 border-orange-200'
    case 'analyzer':
      return 'bg-purple-50 border-purple-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
}

export default function ToolsPage() {
  const { language, region } = useLanguage()
  const categories = siteConfig.toolCategories
  const tools = siteConfig.tools

  // 지역별 도구 필터링
  const filteredTools = tools.filter(tool => 
    tool.regions.includes(region)
  )

  const content = {
    ko: {
      title: '실용 도구',
      subtitle: '바로 사용할 수 있는 간단한 온라인 도구들 - 빠르고, 쉽고, 무료입니다.',
      button: '바로사용',
      ctaTitle: '더 많은 도구가 준비 중입니다!',
      ctaSubtitle: '자주 사용하는 도구나 추가했으면 하는 기능이 있다면 언제든 요청해주세요.',
      requestButton: '📧 도구 요청하기',
      sitesButton: '🎨 창작자 리소스 보기',
      home: '홈',
      tools: '도구'
    },
    en: {
      title: 'Utility Tools',
      subtitle: 'Simple online tools you can use right away — quick, easy, and free.',
      button: 'Use Now',
      ctaTitle: 'More tools coming soon!',
      ctaSubtitle: 'If you have tools you use frequently or features you\'d like to see, please let us know.',
      requestButton: '📧 Request Tool',
      sitesButton: '🎨 View Creator Resources',
      home: 'Home',
      tools: 'Tools'
    }
  }

  const currentContent = content[language]

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50/30 via-blue-50/20 to-purple-50/30">
        {/* Page Header - Match main page design */}
        <div className="bg-gradient-to-br from-black via-slate-900 to-indigo-950 text-white py-2 sm:py-3 lg:py-4 relative overflow-hidden">
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 via-purple-900/30 to-violet-900/50"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-blue-900/20 to-purple-900/40"></div>
          
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative">
            {/* Breadcrumb Navigation */}
            <nav className="mb-1 text-sm">
              <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                {currentContent.home}
              </Link>
              <span className="text-slate-400 mx-2">/</span>
              <span className="text-white">{currentContent.tools}</span>
            </nav>
            
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2 sm:mb-3">
                <span className="block text-white">{currentContent.title}</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto">
                {currentContent.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Tools by Category */}
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12 max-w-6xl">
          {categories.map((category) => {
            const categoryTools = filteredTools.filter(tool => tool.category === category.id)
            
            if (categoryTools.length === 0) return null
            
            return (
              <div key={category.id} className="mb-12">
                {/* Category Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {category.name[language]}
                  </h2>
                  <p className="text-gray-600">
                    {category.description[language]}
                  </p>
                </div>

                {/* Tools Grid - 모바일 최적화된 반응형 레이아웃 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">
                  {categoryTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      className={`block border-2 rounded-lg p-5 h-40 flex flex-col justify-between text-center hover:shadow-md transition-shadow ${getCategoryColor(tool.category)}`}
                    >
                      <div>
                        <div className="font-semibold text-gray-900 text-base mb-2 leading-tight">
                          {tool.name[language]}
                        </div>
                        <div className="text-gray-600 text-sm mb-3 leading-tight">
                          {tool.description[language]}
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white border-none py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                        {currentContent.button}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 border-t">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 max-w-6xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {currentContent.ctaTitle}
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                {currentContent.ctaSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:youneedthiskr@gmail.com"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {currentContent.requestButton}
                </a>
                <Link
                  href="/sites"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {currentContent.sitesButton}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}