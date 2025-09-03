'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { siteConfig } from '@/config/site'
import { useLanguage } from '@/contexts/LanguageContext'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const { language, isHydrated } = useLanguage()
  
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (query) {
      // 검색 로직
      const tools = siteConfig.tools
      const sites = siteConfig.sites || []
      
      const filteredTools = tools.filter(tool => {
        const searchTerm = query.toLowerCase()
        return (
          tool.name[language].toLowerCase().includes(searchTerm) ||
          tool.description[language].toLowerCase().includes(searchTerm) ||
          (tool.keywords && tool.keywords[language] && tool.keywords[language].toLowerCase().includes(searchTerm))
        )
      })

      const filteredSites = sites.filter((site: any) => {
        const searchTerm = query.toLowerCase()
        return (
          site.name[language].toLowerCase().includes(searchTerm) ||
          site.description[language].toLowerCase().includes(searchTerm) ||
          (site.keywords && site.keywords[language] && site.keywords[language].toLowerCase().includes(searchTerm))
        )
      })

      setSearchResults([...filteredTools, ...filteredSites])
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [query, language])

  const content = {
    ko: {
      title: '검색 결과',
      searchResults: '검색 결과',
      noResults: '검색 결과가 없습니다',
      resultsFor: '에 대한 검색 결과',
      tools: '도구',
      sites: '사이트'
    },
    en: {
      title: 'Search Results',
      searchResults: 'Search Results',
      noResults: 'No results found',
      resultsFor: 'results for',
      tools: 'Tools',
      sites: 'Sites'
    }
  }

  const currentContent = content[isHydrated ? language : 'ko']

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentContent.searchResults}
            </h1>
            {query && (
              <p className="text-gray-600">
                {searchResults.length} {currentContent.resultsFor} "{query}"
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {currentContent.noResults}
              </h3>
              <p className="text-gray-600">다른 키워드로 검색해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((item, index) => {
                const isTools = 'category' in item
                const category = isTools 
                  ? siteConfig.toolCategories.find(cat => cat.id === item.category)
                  : siteConfig.siteCategories?.find((cat: any) => cat.id === item.category)
                
                return (
                  <Link
                    key={`${isTools ? 'tool' : 'site'}-${item.id || index}`}
                    href={isTools ? `/tools/${item.id}` : item.url}
                    target={isTools ? '_self' : '_blank'}
                    rel={isTools ? '' : 'noopener noreferrer'}
                    className="block group"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-200">
                      {/* Icon and Title Row */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          {item.icon?.startsWith('bi-') ? (
                            <i className={`${item.icon} text-xl text-gray-700`}></i>
                          ) : (
                            <span className="text-xl">{item.icon || (isTools ? '🛠️' : '🌐')}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1 leading-tight" suppressHydrationWarning>
                            {item.name[language]}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2" suppressHydrationWarning>
                            {item.description[language]}
                          </p>
                        </div>
                      </div>
                      
                      {/* Footer with category and visit button */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800" suppressHydrationWarning>
                          {category?.name[language] || (isTools ? currentContent.tools : currentContent.sites)}
                        </span>
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          <span>Visit</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">Loading search...</div>
        </div>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}