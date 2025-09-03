'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/config/site'
import { useLanguage } from '@/contexts/LanguageContext'

export function Header() {
  const { language, isHydrated, setLanguage } = useLanguage()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // 하이드레이션 완료 전까지는 기본 언어(한국어) 사용
  const currentLanguage = isHydrated ? language : 'ko'

  const handleBookmark = () => {
    if (typeof window !== 'undefined') {
      try {
        // 페이지 제목 최적화
        document.title = siteConfig.name + ' - ' + (currentLanguage === 'ko' ? '실용적인 도구 모음' : 'Practical Tools Collection')
        
        // 브라우저별 북마크 단축키 감지
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
        const shortcut = isMac ? 'Cmd+D' : 'Ctrl+D'
        
        // 더 나은 UX를 위한 확인창
        const message = currentLanguage === 'ko' ? 
          `이 사이트를 북마크하시겠습니까?\n\n${shortcut}를 눌러서 북마크를 추가하세요!\n\n또는 브라우저 주소창 우측의 ⭐ 버튼을 클릭하세요.` :
          `Do you want to bookmark this site?\n\nPress ${shortcut} to add bookmark!\n\nOr click the ⭐ button on the right side of the address bar.`
        
        if (confirm(message)) {
          // 사용자가 확인을 누르면 북마크 상태 업데이트
          setIsBookmarked(true)
          
          // 브라우저가 지원하는 경우 자동 북마크 시도
          if ('addToHomescreen' in window || 'BeforeInstallPromptEvent' in window) {
            // PWA 설치 프롬프트 트리거 시도
            const event = new Event('beforeinstallprompt')
            window.dispatchEvent(event)
          }
          
          // 몇 초 후 상태 리셋
          setTimeout(() => setIsBookmarked(false), 3000)
        }
      } catch (error) {
        console.log('Bookmark feature not supported')
        // 폴백: 단순 안내 메시지
        const shortcut = navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 'Cmd+D' : 'Ctrl+D'
        alert(currentLanguage === 'ko' ? 
          `${shortcut}를 눌러서 이 사이트를 북마크하세요!` :
          `Press ${shortcut} to bookmark this site!`
        )
      }
    }
  }

  const menuContent = {
    ko: {
      converter: '변환도구',
      generator: '생성도구',
      image: '이미지도구',
      developer: '개발자도구',
      validator: '검증도구',
      analyzer: '분석도구',
      resources: '추천리소스',
      bookmark: '북마크'
    },
    en: {
      converter: 'Converter',
      generator: 'Generator',
      image: 'Image Tools',
      developer: 'Developer',
      validator: 'Validator',
      analyzer: 'Analyzer',
      resources: 'Resources',
      bookmark: 'Bookmark'
    }
  }

  const currentMenu = menuContent[currentLanguage]


  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="/images/logo_s.svg"
                alt="YouNeedThis Logo"
                width={48}
                height={48}
                className="w-12 h-12 brightness-90"
                priority
                unoptimized
              />
              <span className="text-lg font-semibold text-white">
                {siteConfig.name}
              </span>
            </Link>
            
            {/* Desktop Navigation Menu - Mobile First: 숨기고 태블릿부터 보이기 */}
            <nav className="hidden sm:flex ml-6 lg:ml-10 space-x-3 lg:space-x-6">
              <Link href="/category/converter" className="text-gray-300 hover:text-white text-xs sm:text-sm font-medium">{currentMenu.converter}</Link>
              <Link href="/category/generator" className="text-gray-300 hover:text-white text-xs sm:text-sm font-medium">{currentMenu.generator}</Link>
              <Link href="/category/image" className="text-gray-300 hover:text-white text-xs sm:text-sm font-medium">{currentMenu.image}</Link>
              <Link href="/category/developer" className="text-gray-300 hover:text-white text-xs sm:text-sm font-medium">{currentMenu.developer}</Link>
              <Link href="/category/validator" className="text-gray-300 hover:text-white text-xs sm:text-sm font-medium">{currentMenu.validator}</Link>
              <Link href="/category/analyzer" className="text-gray-300 hover:text-white text-xs sm:text-sm font-medium">{currentMenu.analyzer}</Link>
              <Link href="/sites" className="text-gray-300 hover:text-white text-xs sm:text-sm font-medium">{currentMenu.resources}</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile menu button - 모바일에서 북마크 자리에 표시 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden text-gray-300 hover:text-white p-2 rounded-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Language selector - 모바일에서는 더 작게, 데스크톱에서는 정상 크기 */}
            <div className="relative">
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as 'ko' | 'en')}
                className="bg-slate-800 border border-slate-700 text-gray-300 text-xs sm:text-sm rounded-md px-2 sm:px-3 py-1 sm:py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none pr-6 sm:pr-8"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-2 pointer-events-none">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Bookmark button - 모바일에서는 숨김, 데스크톱에서만 표시 */}
            <button 
              onClick={handleBookmark}
              className={`hidden sm:flex ${isBookmarked ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 items-center space-x-2`}
            >
              <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>{isBookmarked ? (currentLanguage === 'ko' ? '북마크됨!' : 'Bookmarked!') : currentMenu.bookmark}</span>
            </button>
          </div>
        </div>
        
        {/* Mobile menu - Mobile First: 작은 화면에서만 표시 */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/category/converter" className="block px-3 py-2 text-gray-300 hover:text-white text-sm font-medium rounded-md hover:bg-slate-800">{currentMenu.converter}</Link>
              <Link href="/category/generator" className="block px-3 py-2 text-gray-300 hover:text-white text-sm font-medium rounded-md hover:bg-slate-800">{currentMenu.generator}</Link>
              <Link href="/category/image" className="block px-3 py-2 text-gray-300 hover:text-white text-sm font-medium rounded-md hover:bg-slate-800">{currentMenu.image}</Link>
              <Link href="/category/developer" className="block px-3 py-2 text-gray-300 hover:text-white text-sm font-medium rounded-md hover:bg-slate-800">{currentMenu.developer}</Link>
              <Link href="/category/validator" className="block px-3 py-2 text-gray-300 hover:text-white text-sm font-medium rounded-md hover:bg-slate-800">{currentMenu.validator}</Link>
              <Link href="/category/analyzer" className="block px-3 py-2 text-gray-300 hover:text-white text-sm font-medium rounded-md hover:bg-slate-800">{currentMenu.analyzer}</Link>
              <Link href="/sites" className="block px-3 py-2 text-gray-300 hover:text-white text-sm font-medium rounded-md hover:bg-slate-800">{currentMenu.resources}</Link>
              {/* 모바일 메뉴에서는 언어 선택기 제거 (헤더에 이미 있음) */}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

