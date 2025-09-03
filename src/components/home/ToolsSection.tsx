'use client'

import { siteConfig } from '@/config/site'
import Link from 'next/link'
import { useMemo, memo } from 'react'

interface ToolsSectionProps {
  searchQuery?: string
  language?: 'ko' | 'en'
  region?: 'kr' | 'global'
}

export function ToolsSection({ searchQuery = '', language = 'ko', region = 'kr' }: ToolsSectionProps) {
  
  // 메모이제이션으로 성능 최적화
  const { categories, filteredTools } = useMemo(() => {
    const categories = siteConfig.toolCategories
    const tools = siteConfig.tools
    
    // 지역별 도구 필터링 및 검색 필터링
    const filteredTools = tools.filter(tool => {
      const regionMatch = tool.regions.includes(region)
      const searchMatch = !searchQuery || 
        tool.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.keywords && tool.keywords[language] && tool.keywords[language].toLowerCase().includes(searchQuery.toLowerCase()))
      return regionMatch && searchMatch
    })

    return {
      categories,
      filteredTools
    }
  }, [language, region])

  // 카테고리 순서: converter 먼저, 그 다음 나머지
  const orderedCategories = [
    ...categories.filter(cat => cat.id === 'converter'),
    ...categories.filter(cat => cat.id === 'generator'), 
    ...categories.filter(cat => cat.id === 'validator'),
    ...categories.filter(cat => cat.id === 'analyzer'),
    ...categories.filter(cat => cat.id === 'image'),
    ...categories.filter(cat => cat.id === 'developer'),
    ...categories.filter(cat => !['converter', 'generator', 'validator', 'analyzer', 'image', 'developer'].includes(cat.id))
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50/30 via-blue-50/20 to-purple-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 추천 도구 섹션 */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {language === 'ko' ? '추천 도구' : 'Featured Tools'}
              </h2>
              <p className="text-gray-600">
                {language === 'ko' ? '엄선된 실용적인 도구 모음' : 'Hand-picked practical tools'}
              </p>
            </div>
            <Link href="/tools" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              {language === 'ko' ? '전체 보기' : 'View all'}
            </Link>
          </div>

          {/* Responsive Grid Layout - 모든 화면에서 그리드 사용 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.slice(0, 6).map((tool) => {
              const category = categories.find(cat => cat.id === tool.category)
              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  prefetch={false}
                  className="block group"
                >
                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-200 h-full">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          {tool.icon?.startsWith('bi-') ? (
                            <i className={`${tool.icon} text-xl text-blue-600`}></i>
                          ) : (
                            <span className="text-xl">{tool.icon || '⭐'}</span>
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" suppressHydrationWarning>
                          {category?.name[language]}
                        </span>
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          <span suppressHydrationWarning>{language === 'ko' ? '바로가기' : 'Visit'}</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* 카테고리별 도구들 - 변환도구부터 시작 */}
        {orderedCategories.map((category) => {
          const categoryTools = filteredTools.filter(tool => tool.category === category.id)
          
          if (categoryTools.length === 0) return null
          
          // 카테고리별 색상 설정
          const getCategoryStyles = (categoryId: string) => {
            switch (categoryId) {
              case 'converter':
                return {
                  iconBg: 'bg-gradient-to-br from-green-50 to-emerald-50',
                  iconColor: 'text-green-600',
                  badgeBg: 'bg-green-100 text-green-800'
                }
              case 'generator':
                return {
                  iconBg: 'bg-gradient-to-br from-purple-50 to-pink-50',
                  iconColor: 'text-purple-600',
                  badgeBg: 'bg-purple-100 text-purple-800'
                }
              case 'validator':
                return {
                  iconBg: 'bg-gradient-to-br from-orange-50 to-amber-50',
                  iconColor: 'text-orange-600',
                  badgeBg: 'bg-orange-100 text-orange-800'
                }
              case 'analyzer':
                return {
                  iconBg: 'bg-gradient-to-br from-violet-50 to-purple-50',
                  iconColor: 'text-violet-600',
                  badgeBg: 'bg-violet-100 text-violet-800'
                }
              case 'image':
                return {
                  iconBg: 'bg-gradient-to-br from-pink-50 to-rose-50',
                  iconColor: 'text-pink-600',
                  badgeBg: 'bg-pink-100 text-pink-800'
                }
              case 'developer':
                return {
                  iconBg: 'bg-gradient-to-br from-slate-50 to-gray-50',
                  iconColor: 'text-slate-600',
                  badgeBg: 'bg-slate-100 text-slate-800'
                }
              default:
                return {
                  iconBg: 'bg-gray-100',
                  iconColor: 'text-gray-700',
                  badgeBg: 'bg-gray-100 text-gray-800'
                }
            }
          }

          const styles = getCategoryStyles(category.id)
          
          return (
            <div key={category.id} className="mb-16">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {category.name[language]}
                  </h2>
                  <p className="text-gray-600">
                    {category.description[language]}
                  </p>
                </div>
                <Link href={`/category/${category.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all
                </Link>
              </div>

              {/* Responsive Grid Layout - 모든 화면에서 그리드 사용 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    prefetch={false}
                    className="block group"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-200 h-full">
                        {/* Icon and Title Row */}
                        <div className="flex items-start space-x-4 mb-4">
                          <div className={`w-12 h-12 ${styles.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            {tool.icon?.startsWith('bi-') ? (
                              <i className={`${tool.icon} text-xl ${styles.iconColor}`}></i>
                            ) : (
                              <span className="text-xl">{tool.icon || '🛠️'}</span>
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
                        
                        {/* Footer with category and visit button */}
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.badgeBg}`} suppressHydrationWarning>
                            {category.name[language]}
                          </span>
                          <div className="flex items-center text-blue-600 text-sm font-medium">
                            <span suppressHydrationWarning>{language === 'ko' ? '바로가기' : 'Visit'}</span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </div>
                      </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

      </div>
    </section>
  )
}