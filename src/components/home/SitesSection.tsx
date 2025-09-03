'use client'

import { useState, useMemo, useEffect } from 'react'
import { siteConfig } from '@/config/site'
import Link from 'next/link'
import { SiteThumbnail } from '@/components/ui/SiteThumbnail'

interface SitesSectionProps {
  searchQuery?: string
  language?: 'ko' | 'en'
}

export function SitesSection({ searchQuery = '', language = 'ko' }: SitesSectionProps) {
  // 안전한 기본값 설정
  const safeSearchQuery = typeof searchQuery === 'string' ? searchQuery : ''
  const categories = siteConfig.siteCategories
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const [sites, setSites] = useState(siteConfig.sites)

  // 관리자에서 수정된 데이터와 기본 데이터 병합
  useEffect(() => {
    const savedSites = localStorage.getItem('admin_sites')
    if (savedSites) {
      try {
        const adminSites = JSON.parse(savedSites)
        const baseSites = siteConfig.sites
        
        // 관리자에서 수정된 사이트가 있으면 해당 사이트를 업데이트
        const mergedSites = baseSites.map(baseSite => {
          const adminSite = adminSites.find((site: any) => site.id === baseSite.id)
          return adminSite ? { ...baseSite, ...adminSite } : baseSite
        })
        
        // 관리자에서 새로 추가된 사이트들도 포함
        const newAdminSites = adminSites.filter((adminSite: any) => 
          !baseSites.some(baseSite => baseSite.id === adminSite.id)
        )
        
        setSites([...mergedSites, ...newAdminSites])
      } catch (e) {
        console.error('Error parsing admin sites:', e)
      }
    }
  }, [])

  const { filteredSites } = useMemo(() => {
    let filteredSites = selectedCategory === 'all' 
      ? sites 
      : sites.filter(site => site.category === selectedCategory)
    
    // 검색 필터링 추가 (로컬 검색 쿼리 사용)
    const finalSearchQuery = localSearchQuery || safeSearchQuery
    if (finalSearchQuery && finalSearchQuery.trim() !== '') {
      filteredSites = filteredSites.filter(site => 
        (typeof site.name === 'string' ? site.name : site.name[language]).toLowerCase().includes(finalSearchQuery.toLowerCase()) ||
        (typeof site.description === 'string' ? site.description : (site.description?.[language] || site.description?.ko || '')).toLowerCase().includes(finalSearchQuery.toLowerCase()) ||
        (() => {
          let tags: string[] = []
          if (site.tags && typeof site.tags === 'object' && !Array.isArray(site.tags)) {
            tags = site.tags[language as 'ko' | 'en'] || []
          } else if (Array.isArray(site.tags)) {
            tags = site.tags
          }
          return tags.some(tag => tag.toLowerCase().includes(finalSearchQuery.toLowerCase()))
        })()
      )
    }
    
    return { filteredSites }
  }, [sites, selectedCategory, safeSearchQuery, localSearchQuery, language])

  const content = {
    ko: {
      title: '추천 리소스',
      all: '전체',
      searchPlaceholder: '사이트 검색...'
    },
    en: {
      title: 'Recommended Resources',
      all: 'All',
      searchPlaceholder: 'Search sites...'
    }
  }

  const currentContent = content[language]

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-6xl">
        {/* Category Tags - Simple & Clean Style */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {currentContent.all}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name[language]}
              </button>
            ))}
          </div>
          
          {/* Search Bar */}
          <div className="max-w-md sm:max-w-lg mx-auto relative">
            <input
              type="text"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              placeholder={currentContent.searchPlaceholder}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 sm:px-6 py-3 sm:py-4 pr-12 text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
            />
            <i className="bi-search absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        {/* Sites Grid - 새로운 썸네일 중심 디자인 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredSites.map((site) => (
            <Link
              key={site.id}
              href={`/sites/detail/${site.id}`}
              className="block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-300 hover:scale-105 hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Site Thumbnail - 카드의 3/4 차지 */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {site.customThumbnail ? (
                  <>
                    <img 
                      src={typeof window !== 'undefined' ? localStorage.getItem(`thumbnail_${site.customThumbnail}`) || `/images/thumbnails/${site.customThumbnail}` : `/images/thumbnails/${site.customThumbnail}`}
                      alt={`${typeof site.name === 'string' ? site.name : site.name[language]} thumbnail`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        // localStorage 실패 시 일반 경로, 그것도 실패하면 fallback 표시
                        if (e.currentTarget.src.startsWith('data:')) {
                          e.currentTarget.src = `/images/thumbnails/${site.customThumbnail}`
                        } else {
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.parentElement?.querySelector('.fallback-thumbnail') as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }
                      }}
                    />
                    <div 
                      className="fallback-thumbnail w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 items-center justify-center absolute inset-0" 
                      style={{ display: 'none' }}
                    >
                      {site.thumbnail?.startsWith('bi-') ? (
                        <i className={`${site.thumbnail} text-4xl text-blue-600`}></i>
                      ) : (
                        <span className="text-4xl">{site.thumbnail || '🌐'}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    {site.thumbnail?.startsWith('bi-') ? (
                      <i className={`${site.thumbnail} text-4xl text-blue-600`}></i>
                    ) : (
                      <span className="text-4xl">{site.thumbnail || '🌐'}</span>
                    )}
                  </div>
                )}
                
                {/* 호버 시 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                  <div className="text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-lg mb-2">{typeof site.name === 'string' ? site.name : site.name[language]}</h3>
                    <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                      <span>{language === 'ko' ? '바로가기' : 'Visit'}</span>
                      <span className="ml-2">→</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 카드 하단 정보 */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-base truncate">
                    {typeof site.name === 'string' ? site.name : site.name[language]}
                  </h4>
                  <div className="flex items-center space-x-1 ml-2">
                    {site.isPaid ? (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                        {language === 'ko' ? '유료' : 'Paid'}
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        {language === 'ko' ? '무료' : 'Free'}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
                  {typeof site.description === 'string' ? site.description : (site.description?.[language] || site.description?.ko || '')}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {site.rating && (
                      <>
                        <span className="text-yellow-400 text-sm">⭐</span>
                        <span className="text-xs text-gray-600 font-medium">{site.rating}</span>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      let tags: string[] = []
                      if (site.tags && typeof site.tags === 'object' && !Array.isArray(site.tags)) {
                        tags = site.tags[language as 'ko' | 'en'] || []
                      } else if (Array.isArray(site.tags)) {
                        tags = site.tags
                      }
                      return tags.slice(0, 1).map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))
                    })()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'ko' ? '이 카테고리에는 아직 사이트가 없습니다' : 'No sites in this category yet'}
            </h3>
            <p className="text-gray-600">
              {language === 'ko' ? '곧 더 많은 리소스가 추가됩니다!' : 'More resources coming soon!'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}