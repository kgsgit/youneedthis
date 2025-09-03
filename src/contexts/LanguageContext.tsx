'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'ko' | 'en'
export type Region = 'kr' | 'global'

interface LanguageContextType {
  language: Language
  region: Region
  isHydrated: boolean
  setLanguage: (lang: Language) => void
  setRegion: (region: Region) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko') // 한국 기본값 유지
  const [region, setRegionState] = useState<Region>('kr') // 한국 기본값 유지  
  const [isHydrated, setIsHydrated] = useState(false)

  // 하이드레이션 완료 후 언어/지역 자동 감지
  useEffect(() => {
    const detectLanguageAndRegion = async () => {
      // 저장된 설정이 있으면 우선 사용
      const savedLang = localStorage.getItem('preferred-language') as Language
      const savedRegion = localStorage.getItem('preferred-region') as Region
      
      if (savedLang && savedRegion) {
        setLanguageState(savedLang)
        setRegionState(savedRegion)
        setIsHydrated(true)
        return
      }

      // 브라우저 언어 감지
      const browserLang = navigator.language || navigator.languages?.[0] || 'ko-KR'
      const isKorean = browserLang.startsWith('ko')
      
      // IP 기반 지역 감지 (간단한 타임존 기반 추정)
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const isKoreanTimezone = timezone === 'Asia/Seoul'
      
      // 언어 및 지역 결정 로직
      let detectedLang: Language = 'en' // 기본값을 영어로 변경
      let detectedRegion: Region = 'global' // 기본값을 글로벌로 변경
      
      // 한국어 브라우저이거나 한국 시간대인 경우 한국 설정
      if (isKorean || isKoreanTimezone) {
        detectedLang = 'ko'
        detectedRegion = 'kr'
      }
      
      console.log('🌐 Language Detection:', {
        browserLang,
        timezone,
        isKorean,
        isKoreanTimezone,
        detectedLang,
        detectedRegion
      })
      
      setLanguageState(detectedLang)
      setRegionState(detectedRegion)
      setIsHydrated(true)
      
    }

    detectLanguageAndRegion()
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('preferred-language', lang)
    
    // 언어 변경시 지역도 자동 매칭
    if (lang === 'ko') {
      setRegionState('kr')
      localStorage.setItem('preferred-region', 'kr')
    } else {
      setRegionState('global')
      localStorage.setItem('preferred-region', 'global')
    }
  }

  const setRegion = (newRegion: Region) => {
    setRegionState(newRegion)
    localStorage.setItem('preferred-region', newRegion)
  }

  const toggleLanguage = () => {
    const newLang = language === 'ko' ? 'en' : 'ko'
    setLanguage(newLang)
  }

  return (
    <LanguageContext.Provider value={{
      language,
      region,
      isHydrated,
      setLanguage,
      setRegion,
      toggleLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}