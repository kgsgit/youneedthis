import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

interface Site {
  id: string
  name: string | { ko: string; en: string }
  description: { ko: string; en: string }
  url: string
  thumbnail: string
  customThumbnail?: string
  isPaid: boolean
  rating: number
  tags: string[] | { ko: string[]; en: string[] }
}

interface SiteCardProps {
  site: Site
}

export function SiteCard({ site }: SiteCardProps) {
  const { language, isHydrated } = useLanguage()
  
  // 하이드레이션 완료 전까지는 기본 언어(한국어) 사용
  const currentLanguage = isHydrated ? language : 'ko'
  
  // 사이트 이름을 언어에 따라 가져오기
  const siteName = typeof site.name === 'string' ? site.name : site.name[currentLanguage]
  
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
          {site.customThumbnail ? (
            (() => {
              const localImage = typeof window !== 'undefined' ? localStorage.getItem(`thumbnail_${site.customThumbnail}`) : null
              return localImage ? (
                <img 
                  src={localImage}
                  alt={`${siteName} thumbnail`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={`/images/thumbnails/${site.customThumbnail}`}
                  alt={`${siteName} thumbnail`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon') as HTMLElement
                    if (fallback) fallback.style.display = 'block'
                  }}
                />
              )
            })()
          ) : site.thumbnail?.startsWith('bi-') ? (
            <i className={`${site.thumbnail} text-2xl text-purple-600`}></i>
          ) : (
            <span className="text-2xl">{site.thumbnail}</span>
          )}
          {site.customThumbnail && (
            <span 
              className="fallback-icon text-2xl"
              style={{ display: 'none' }}
            >
              {site.thumbnail}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-purple-600 transition-colors">
            {siteName}
          </h4>
          <div className="flex items-center space-x-2">
            {site.isPaid ? (
              <span className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-medium">
                {currentLanguage === 'ko' ? '유료' : 'Paid'}
              </span>
            ) : (
              <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">
                {currentLanguage === 'ko' ? '무료' : 'Free'}
              </span>
            )}
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-xs text-gray-500 font-medium">{site.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-2">
        {typeof site.description === 'string' ? site.description : (site.description?.[currentLanguage] || site.description?.ko || '')}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(() => {
          let tags: string[] = []
          if (site.tags && typeof site.tags === 'object' && !Array.isArray(site.tags)) {
            tags = site.tags[currentLanguage as 'ko' | 'en'] || []
          } else if (Array.isArray(site.tags)) {
            tags = site.tags
          }
          return tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full font-medium"
            >
              {tag}
            </span>
          ))
        })()}
      </div>

      <div className="flex items-center space-x-3">
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
        >
          {currentLanguage === 'ko' ? '사이트 방문' : 'Visit Site'}
        </a>
        <Link
          href={`/sites/detail/${site.id}`}
          className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium"
        >
          {currentLanguage === 'ko' ? '상세' : 'Details'}
        </Link>
      </div>
    </div>
  )
}