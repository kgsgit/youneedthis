'use client'

import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { useLanguage } from '@/contexts/LanguageContext'

interface Tool {
  id: string
  name: { ko: string; en: string }
  description: { ko: string; en: string }
  icon: string
  category: string
  regions: string[]
}

interface ToolLayoutProps {
  tool: Tool
  children: React.ReactNode
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const { language, region } = useLanguage()
  const category = siteConfig.toolCategories.find(cat => cat.id === tool.category)
  
  const content = {
    ko: {
      home: '홈',
      tools: '도구',
      relatedTools: '관련 도구',
      korean: '한국',
      global: '글로벌'
    },
    en: {
      home: 'Home',
      tools: 'Tools', 
      relatedTools: 'Related Tools',
      korean: 'Korea',
      global: 'Global'
    }
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Match category page design */}
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
            <Link href="/tools" className="text-slate-300 hover:text-white transition-colors">
              {currentContent.tools}
            </Link>
            <span className="text-slate-400 mx-2">/</span>
            <Link href={`/category/${tool.category}`} className="text-slate-300 hover:text-white transition-colors">
              {category?.name[language]}
            </Link>
            <span className="text-slate-400 mx-2">/</span>
            <span className="text-white">{tool.name[language]}</span>
          </nav>
          
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2 sm:mb-3">
              <span className="block text-white">{tool.name[language]}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {tool.description[language]}
            </p>
          </div>
        </div>
      </div>

      {/* Tool Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border p-7 mb-8">
          {children}
        </div>
      </div>

      {/* Related Tools */}
      <div className="container mx-auto px-4 pb-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border p-7">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 font-kakao-big">
            {currentContent.relatedTools}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.tools
              .filter(t => t.category === tool.category && t.id !== tool.id && 
                          (t.regions.includes(region) || t.regions.includes('global')))
              .slice(0, 6)
              .map((relatedTool) => (
                <Link
                  key={relatedTool.id}
                  href={`/tools/${relatedTool.id}`}
                  className="block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 hover:scale-105 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                      {relatedTool.icon?.startsWith('bi-') ? (
                        <i className={`${relatedTool.icon} text-2xl text-blue-600`}></i>
                      ) : (
                        <span className="text-2xl">{relatedTool.icon || '🛠️'}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                        {relatedTool.name[language]}
                      </h4>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-2">
                    {relatedTool.description[language]}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                      {category?.name[language]}
                    </div>
                    <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <span className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all text-sm">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
          {siteConfig.tools.filter(t => t.category === tool.category && t.id !== tool.id).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {language === 'ko' ? '관련 도구가 없습니다.' : 'No related tools available.'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}