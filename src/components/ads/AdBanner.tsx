'use client'

import { useEffect, useRef } from 'react'

interface AdBannerProps {
  adSlot: string // Google AdSense 광고 슬롯 ID
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  adClient?: string // Google AdSense 클라이언트 ID
  className?: string
  style?: React.CSSProperties
}

export function AdBanner({ 
  adSlot, 
  adFormat = 'auto', 
  adClient,
  className = '',
  style = {}
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // AdSense가 로드된 후 광고 표시
    if (typeof window !== 'undefined' && (window as any).adsbygoogle && adRef.current) {
      try {
        ((window as any).adsbygoogle as any[]).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [])

  // AdSense ID가 없으면 개발용 플레이스홀더 표시
  if (!adClient || !adSlot) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}
        style={style}
      >
        <div className="text-gray-500">
          <div className="text-sm mb-2">📢 광고 영역</div>
          <div className="text-xs text-gray-400">AdSense 승인 후 광고가 표시됩니다</div>
        </div>
      </div>
    )
  }

  return (
    <div className={className} style={style} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// 자주 사용되는 광고 크기별 컴포넌트
export function AdBannerLarge({ adSlot, adClient, className }: Omit<AdBannerProps, 'adFormat'>) {
  return (
    <AdBanner
      adSlot={adSlot}
      adClient={adClient}
      adFormat="auto"
      className={className}
      style={{ minHeight: '280px' }}
    />
  )
}

export function AdBannerMedium({ adSlot, adClient, className }: Omit<AdBannerProps, 'adFormat'>) {
  return (
    <AdBanner
      adSlot={adSlot}
      adClient={adClient}
      adFormat="rectangle"
      className={className}
      style={{ minHeight: '250px' }}
    />
  )
}

export function AdBannerSmall({ adSlot, adClient, className }: Omit<AdBannerProps, 'adFormat'>) {
  return (
    <AdBanner
      adSlot={adSlot}
      adClient={adClient}
      adFormat="horizontal"
      className={className}
      style={{ minHeight: '90px' }}
    />
  )
}