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

      // 간단하게: 기본값은 항상 한국어
      const detectedLang = 'ko'
      const detectedRegion = 'kr'
      
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