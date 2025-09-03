'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface SiteThumbnailProps {
  site: {
    id: string
    name: string | { ko: string; en: string }
    url: string
    thumbnail?: string
    customThumbnail?: string
  }
  width?: number
  height?: number
  className?: string
}

export function SiteThumbnail({ 
  site, 
  width = 400, 
  height = 300, 
  className = '' 
}: SiteThumbnailProps) {
  const { language } = useLanguage()
  const [imageError, setImageError] = useState(false)
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  
  // 사이트 이름을 언어에 따라 안전하게 가져오기
  const siteName = (() => {
    if (!site.name) return 'Unknown Site'
    if (typeof site.name === 'string') return site.name
    if (typeof site.name === 'object' && site.name[language]) return site.name[language]
    if (typeof site.name === 'object' && site.name.ko) return site.name.ko
    if (typeof site.name === 'object' && site.name.en) return site.name.en
    return String(site.name) || 'Unknown Site'
  })()

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // 다양한 무료 썸네일 서비스들 (API 키 없이 사용 가능)
  const thumbnailServices = [
    // Microlink - API 키 없이 사용 가능한 무료 서비스
    `https://api.microlink.io/screenshot?url=${encodeURIComponent(site.url)}&viewport.width=${width}&viewport.height=${height}`,
    
    // Website Screenshot - 간단한 무료 서비스  
    `https://api.screenshotone.com/take?url=${encodeURIComponent(site.url)}&viewport_width=${width}&viewport_height=${height}&device_scale_factor=1&format=png&cache=true`,
    
    // Image rendering service
    `https://render.screenshot.website/?url=${encodeURIComponent(site.url)}&width=${width}&height=${height}`,
  ]
  
  const handleImageError = () => {
    if (currentServiceIndex < thumbnailServices.length - 1) {
      setCurrentServiceIndex(prev => prev + 1)
    } else {
      setImageError(true)
    }
  }
  
  // 커스텀 썸네일이 있으면 우선적으로 사용
  if (site.customThumbnail && isMounted) {
    const localImage = localStorage.getItem(`thumbnail_${site.customThumbnail}`)
    if (localImage) {
      return (
        <div 
          className={`relative overflow-hidden rounded-lg group ${className}`}
          style={className.includes('w-full') && className.includes('h-full') ? {} : { width, height }}
        >
          <img
            src={localImage}
            alt={`${siteName} thumbnail`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="font-bold text-white text-lg leading-tight mb-1">{siteName}</div>
              <div className="text-sm text-gray-200">
                {new URL(site.url).hostname}
              </div>
            </div>
          </div>
        </div>
      )
    }
    // localStorage에 없으면 서버 경로 시도
    if (!imageError) {
      return (
        <div 
          className={`relative overflow-hidden rounded-lg group ${className}`}
          style={className.includes('w-full') && className.includes('h-full') ? {} : { width, height }}
        >
          <img
            src={`/images/thumbnails/${site.customThumbnail}`}
            alt={`${siteName} thumbnail`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="font-bold text-white text-lg leading-tight mb-1">{siteName}</div>
              <div className="text-sm text-gray-200">
                {new URL(site.url).hostname}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  // 마운트되지 않았거나 에러가 발생했거나 캐처 서비스가 없을 때 fallback
  if (!isMounted || imageError || thumbnailServices.length === 0) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg group hover:from-blue-100 hover:to-blue-200 transition-all duration-300 ${className}`}
        style={className.includes('w-full') && className.includes('h-full') ? {} : { width, height }}
      >
        <div className="text-center p-6">
          {site.thumbnail?.startsWith('bi-') ? (
            <div className="text-6xl text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <i className={site.thumbnail}></i>
            </div>
          ) : (
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {site.thumbnail || '🌐'}
            </div>
          )}
          <div className="font-bold text-lg text-gray-800 leading-tight mb-2">{siteName}</div>
          <div className="text-sm text-blue-700 opacity-75">
            {new URL(site.url).hostname}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div 
      className={`relative overflow-hidden rounded-lg group ${className}`}
      style={className.includes('w-full') && className.includes('h-full') ? {} : { width, height }}
    >
      <img
        src={thumbnailServices[currentServiceIndex]}
        alt={`${siteName} screenshot`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={handleImageError}
        loading="lazy"
      />
      
      {/* 오버레이 정보 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="font-bold text-white text-lg leading-tight mb-1">{siteName}</div>
          <div className="text-sm text-gray-200">
            {new URL(site.url).hostname}
          </div>
        </div>
      </div>
      
      {/* 이미지가 로딩 실패했을 때만 fallback 보이기 */}
      {imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 flex items-center justify-center">
          <div className="text-center p-4">
            {site.thumbnail?.startsWith('bi-') ? (
              <i className={`${site.thumbnail} text-4xl text-blue-600 mb-2`}></i>
            ) : (
              <span className="text-4xl mb-2 block">{site.thumbnail || '🌐'}</span>
            )}
            <div className="font-bold text-sm text-gray-800 leading-tight">{siteName}</div>
          </div>
        </div>
      )}
    </div>
  )
}