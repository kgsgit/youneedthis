'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CopyButton } from '@/components/ui/CopyButton'
import { SiteThumbnail } from '@/components/ui/SiteThumbnail'
import { siteConfig } from '@/config/site'
import { useLanguage } from '@/contexts/LanguageContext'

interface SiteDetailClientProps {
  initialSite: any
  slug: string
}

// Enhanced site features data
const siteFeatures: Record<string, {
  features: { ko: string[]; en: string[] }
  useCases: { ko: string[]; en: string[] }
  pros: { ko: string[]; en: string[] }
  cons: { ko: string[]; en: string[] }
}> = {
  // AI & Automation
  'chatgpt': {
    features: {
      ko: ['GPT-4 기반 고성능 대화형 AI', '다양한 주제의 질의응답 지원', '코드 생성 및 디버깅 도움', '창작 활동 지원 (글쓰기, 아이디어 등)', '이미지 분석 및 설명', '플러그인 생태계 지원'],
      en: ['High-performance conversational AI based on GPT-4', 'Q&A support for various topics', 'Code generation and debugging assistance', 'Creative activity support (writing, ideas, etc.)', 'Image analysis and description', 'Plugin ecosystem support']
    },
    useCases: {
      ko: ['업무 자동화 및 생산성 향상', '학습 도우미 및 과제 도움', '콘텐츠 제작 및 마케팅', '프로그래밍 학습 지원', '번역 및 언어 학습', '창작 영감 및 브레인스토밍'],
      en: ['Work automation and productivity improvement', 'Learning assistant and homework help', 'Content creation and marketing', 'Programming learning support', 'Translation and language learning', 'Creative inspiration and brainstorming']
    },
    pros: {
      ko: ['매우 자연스러운 대화', '빠른 응답 속도', '다양한 분야 지식', '지속적인 업데이트'],
      en: ['Very natural conversation', 'Fast response speed', 'Knowledge in various fields', 'Continuous updates']
    },
    cons: {
      ko: ['유료 구독 필요 (고급 기능)', '정보 업데이트 제한', '가끔 부정확한 답변'],
      en: ['Paid subscription required (advanced features)', 'Information update limitations', 'Occasionally inaccurate answers']
    }
  },
  'claude': {
    features: {
      ko: ['안전성을 중시하는 AI 설계', '긴 문서 분석 및 요약', '논리적이고 신중한 응답', '다양한 언어 지원', '대용량 텍스트 처리', '윤리적 AI 원칙 준수'],
      en: ['AI design prioritizing safety', 'Long document analysis and summarization', 'Logical and thoughtful responses', 'Multi-language support', 'Large-scale text processing', 'Adherence to ethical AI principles']
    },
    useCases: {
      ko: ['문서 요약 및 분석', '연구 보조 및 정보 정리', '안전한 AI 상담', '교육 및 학습 지원', '법률 문서 검토', '학술 논문 작성 지원'],
      en: ['Document summarization and analysis', 'Research assistance and information organization', 'Safe AI consulting', 'Education and learning support', 'Legal document review', 'Academic paper writing support']
    },
    pros: {
      ko: ['높은 안전성과 신뢰성', '긴 문서 처리 우수', '논리적 사고', '윤리적 응답'],
      en: ['High safety and reliability', 'Excellent long document processing', 'Logical thinking', 'Ethical responses']
    },
    cons: {
      ko: ['응답 속도가 다소 느림', '창작 능력 제한적', '보수적인 답변 경향'],
      en: ['Response speed somewhat slower', 'Limited creative abilities', 'Conservative response tendency']
    }
  }
}

// Default features for sites not in the above list
const getDefaultFeatures = (site: any) => ({
  features: {
    ko: [
      `${typeof site.name === 'string' ? site.name : site.name.ko}의 핵심 기능`,
      `${site.category.replace(/-/g, ' ')} 분야 전문성`,
      '사용자 친화적 인터페이스',
      '안정적인 서비스 제공'
    ],
    en: [
      `Core features of ${typeof site.name === 'string' ? site.name : site.name.en}`,
      `${site.category.replace(/-/g, ' ')} domain expertise`,
      'User-friendly interface',
      'Reliable service delivery'
    ]
  },
  useCases: {
    ko: [
      '업무 효율성 향상',
      '전문적인 작업 지원',
      '창작 활동 도움',
      '학습 및 스킬 개발'
    ],
    en: [
      'Improve work efficiency',
      'Professional work support',
      'Creative activity assistance',
      'Learning and skill development'
    ]
  },
  pros: {
    ko: [
      '직관적인 사용법',
      '안정적인 성능',
      '지속적인 업데이트',
      '커뮤니티 지원'
    ],
    en: [
      'Intuitive usage',
      'Stable performance',
      'Continuous updates',
      'Community support'
    ]
  },
  cons: {
    ko: [
      '일부 기능 유료',
      '학습 시간 필요',
      '인터넷 연결 필요',
      '언어 지원 한계'
    ],
    en: [
      'Some features are paid',
      'Learning time required',
      'Internet connection required',
      'Language support limitations'
    ]
  }
})

// Smart recommendation system
const getRecommendedSites = (currentSite: any, allSites: any[], language: string) => {
  // Calculate similarity scores for each site
  const candidates = allSites.filter(site => site.id !== currentSite.id)
  
  const scoredSites = candidates.map(site => {
    let score = 0
    
    // Same category gets highest score
    if (site.category === currentSite.category) {
      score += 10
    }
    
    // Similar tags - 안전하게 처리
    let siteTagsArray = []
    let currentSiteTagsArray = []
    
    try {
      // 태그 처리 로직 개선
      if (site.tags) {
        if (site.tags && typeof site.tags === 'object' && !Array.isArray(site.tags)) {
          siteTagsArray = site.tags[language as 'ko' | 'en'] || []
        } else if (Array.isArray(site.tags)) {
          siteTagsArray = site.tags
        }
      }
      if (currentSite.tags) {
        if (currentSite.tags && typeof currentSite.tags === 'object' && !Array.isArray(currentSite.tags)) {
          currentSiteTagsArray = currentSite.tags[language as 'ko' | 'en'] || []
        } else if (Array.isArray(currentSite.tags)) {
          currentSiteTagsArray = currentSite.tags
        }
      }
    } catch (e) {
      // Tags processing error - silently handle
    }
    
    const commonTags = siteTagsArray.filter((tag: string) => 
      currentSiteTagsArray.includes(tag)
    ).length
    score += commonTags * 3
    
    // Similar price model (free vs paid)
    if (site.isPaid === currentSite.isPaid) {
      score += 2
    }
    
    // Similar rating range
    const ratingDiff = Math.abs(site.rating - currentSite.rating)
    if (ratingDiff <= 0.3) score += 3
    else if (ratingDiff <= 0.6) score += 2
    else if (ratingDiff <= 1.0) score += 1
    
    // Boost popular sites
    if (site.rating >= 4.5) score += 1
    
    return { ...site, score }
  })
  
  // Sort by score and return top recommendations
  const recommendations = scoredSites
    .sort((a, b) => b.score - a.score)
    .slice(0, 9) // Show up to 9 recommendations
  
  return recommendations
}

export function SiteDetailClient({ 
  initialSite, 
  slug
}: SiteDetailClientProps) {
  const { language, isHydrated } = useLanguage()
  const [site, setSite] = useState(initialSite)
  const [allSites, setAllSites] = useState(siteConfig.sites)
  
  // 하이드레이션 완료 전까지는 기본 언어(한국어) 사용
  const currentLanguage = isHydrated ? language : 'ko'

  useEffect(() => {
    // 관리자에서 수정된 데이터와 기본 데이터 병합
    const savedSites = localStorage.getItem('admin_sites')
    if (savedSites) {
      try {
        const adminSites = JSON.parse(savedSites)
        const baseSites = siteConfig.sites
        
        // 관리자에서 수정된 사이트가 있으면 해당 사이트를 업데이트
        const mergedSites = baseSites.map(baseSite => {
          const adminSite = adminSites.find((s: any) => s.id === baseSite.id)
          return adminSite ? { ...baseSite, ...adminSite } : baseSite
        })
        
        // 관리자에서 새로 추가된 사이트들도 포함
        const newAdminSites = adminSites.filter((adminSite: any) => 
          !baseSites.some(baseSite => baseSite.id === adminSite.id)
        )
        
        const finalSites = [...mergedSites, ...newAdminSites]
        setAllSites(finalSites)
        
        // 현재 사이트도 업데이트
        const updatedCurrentSite = finalSites.find(s => s.id === slug)
        if (updatedCurrentSite) {
          setSite(updatedCurrentSite)
        }
      } catch (e) {
        console.error('Error parsing admin sites:', e)
      }
    }
  }, [slug])

  const category = siteConfig.siteCategories.find(cat => cat.id === site.category)
  const recommendedSites = getRecommendedSites(site, allSites, currentLanguage)
  const sameCategorySites = recommendedSites.filter(s => s.category === site.category).slice(0, 6)
  const crossCategorySites = recommendedSites.filter(s => s.category !== site.category).slice(0, 6)
  const siteInfo = siteFeatures[site.id] || getDefaultFeatures(site)

  const content = {
    ko: {
      paid: '유료',
      free: '무료',
      visitSite: '🚀 사이트 방문하기',
      copyUrl: 'URL 복사',
      detailInfo: '상세 정보',
      features: '주요 특징',
      useCases: '활용 용도',
      evaluation: '평가 및 분석',
      pros: '장점',
      cons: '단점',
      category: '카테고리',
      rating: '평점',
      relatedSites: '관련 사이트',
      sameCategoryRecommendations: '같은 카테고리의 추천 사이트',
      customRecommendations: '맞춤 추천 사이트',
      viewAll: '전체 보기',
      customRecommendationDesc: (siteName: string) => `${siteName}과 유사한 기능이나 태그를 가진 다른 카테고리의 추천 사이트입니다.`
    },
    en: {
      paid: 'Paid',
      free: 'Free',
      visitSite: '🚀 Visit Site',
      copyUrl: 'Copy URL',
      detailInfo: 'Detailed Information',
      features: 'Key Features',
      useCases: 'Use Cases',
      evaluation: 'Evaluation & Analysis',
      pros: 'Pros',
      cons: 'Cons',
      category: 'Category',
      rating: 'Rating',
      relatedSites: 'Related Sites',
      sameCategoryRecommendations: 'Recommended Sites in Same Category',
      customRecommendations: '🎯 Custom Recommendations',
      viewAll: 'View All',
      customRecommendationDesc: (siteName: string) => `Recommended sites from other categories with similar features or tags to ${siteName}.`
    }
  }

  const currentContent = content[currentLanguage]

  const siteName = typeof site.name === 'string' ? site.name : site.name[currentLanguage]
  const siteDescription = typeof site.description === 'string' ? site.description : (site.description?.[currentLanguage] || site.description?.ko || '')

  const headerContent = {
    ko: {
      home: 'Home',
      creatorResources: 'Creator Resources'
    },
    en: {
      home: 'Home', 
      creatorResources: 'Creator Resources'
    }
  }

  const currentHeaderContent = headerContent[currentLanguage]

  return (
    <>
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
              {currentLanguage === 'ko' ? '홈' : 'Home'}
            </Link>
            <span className="text-slate-400 mx-2">/</span>
            <Link href="/sites" className="text-slate-300 hover:text-white transition-colors">
              {currentLanguage === 'ko' ? '리소스' : 'Resources'}
            </Link>
            <span className="text-slate-400 mx-2">/</span>
            <span className="text-white">{siteName}</span>
          </nav>
          
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2 sm:mb-3">
              <span className="block text-white">{siteName}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {siteDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Site Content */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16 max-w-6xl">
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex-shrink-0">
              <SiteThumbnail 
                site={site} 
                width={300} 
                height={200} 
                className="shadow-md hover:shadow-lg transition-shadow duration-200"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-2">
                  {site.isPaid ? (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                      {currentContent.paid}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      {currentContent.free}
                    </span>
                  )}
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm font-medium">{site.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {currentContent.visitSite}
                </a>
                <CopyButton text={site.url} label={currentContent.copyUrl} />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {(() => {
                  // 올바른 태그 구조 처리: 객체 형태를 우선 확인
                  let tags: string[] = []
                  if (site.tags && typeof site.tags === 'object' && !Array.isArray(site.tags)) {
                    // 객체 형태 { ko: [], en: [] }
                    tags = site.tags[currentLanguage as 'ko' | 'en'] || []
                  } else if (Array.isArray(site.tags)) {
                    // 배열 형태 (구버전 호환)
                    tags = site.tags
                  }
                  
                  
                  return tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))
                })()}
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Information */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Features & Use Cases */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {currentContent.detailInfo}
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">✨</span>
                    {currentContent.features}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    {siteInfo.features[currentLanguage].map((feature: string, index: number) => (
                      <p key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        {feature}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">💡</span>
                    {currentContent.useCases}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    {siteInfo.useCases[currentLanguage].map((useCase: string, index: number) => (
                      <p key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        {useCase}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pros & Cons */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {currentContent.evaluation}
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">👍</span>
                    {currentContent.pros}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    {siteInfo.pros[currentLanguage].map((pro: string, index: number) => (
                      <p key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        {pro}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">👎</span>
                    {currentContent.cons}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    {siteInfo.cons[currentLanguage].map((con: string, index: number) => (
                      <p key={index} className="flex items-start">
                        <span className="text-red-500 mr-2 mt-1">✗</span>
                        {con}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{currentContent.category}</p>
                      <p className="font-medium">{category?.name[currentLanguage]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{currentContent.rating}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span className="font-medium">{site.rating}/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Sites */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 font-kakao-big">
            {currentContent.relatedSites}
          </h3>
          
          {/* Same Category Sites */}
          {sameCategorySites.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-gray-900">
                  {currentContent.sameCategoryRecommendations}
                </h4>
                <Link
                  href={`/sites?category=${site.category}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  {currentContent.viewAll}
                  <span className="ml-1">→</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sameCategorySites.map((relatedSite: any) => (
                  <Link
                    key={relatedSite.id}
                    href={`/sites/detail/${relatedSite.id}`}
                    className="group block p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                      <SiteThumbnail 
                        site={relatedSite} 
                        width={280} 
                        height={158} 
                        className="w-full h-full group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {typeof relatedSite.name === 'string' ? relatedSite.name : relatedSite.name[currentLanguage]}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {relatedSite.isPaid ? (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                              {currentContent.paid}
                            </span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                              {currentContent.free}
                            </span>
                          )}
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400 text-sm">⭐</span>
                            <span className="text-xs text-gray-600 font-medium">{relatedSite.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mt-2">
                      {typeof relatedSite.description === 'string' ? relatedSite.description : (relatedSite.description[currentLanguage] || '')}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {(() => {
                        let tags: string[] = []
                        if (relatedSite.tags && typeof relatedSite.tags === 'object' && !Array.isArray(relatedSite.tags)) {
                          tags = relatedSite.tags[currentLanguage as 'ko' | 'en'] || []
                        } else if (Array.isArray(relatedSite.tags)) {
                          tags = relatedSite.tags
                        }
                        return tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))
                      })()}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Cross Category Recommendations */}
          {crossCategorySites.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-gray-900">
                  {currentContent.customRecommendations}
                </h4>
                <Link
                  href="/sites"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  {currentContent.viewAll}
                  <span className="ml-1">→</span>
                </Link>
              </div>
              <p className="text-gray-600 mb-6">
                {currentContent.customRecommendationDesc(typeof site.name === 'string' ? site.name : site.name[currentLanguage])}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crossCategorySites.map((recommendedSite: any) => {
                  const recommendedCategory = siteConfig.siteCategories.find(cat => cat.id === recommendedSite.category)
                  return (
                    <Link
                      key={recommendedSite.id}
                      href={`/sites/detail/${recommendedSite.id}`}
                      className="group block p-5 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                        <SiteThumbnail 
                          site={recommendedSite} 
                          width={280} 
                          height={158} 
                          className="w-full h-full group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            {typeof recommendedSite.name === 'string' ? recommendedSite.name : recommendedSite.name[currentLanguage]}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                              {recommendedCategory?.name[currentLanguage]}
                            </span>
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400 text-sm">⭐</span>
                              <span className="text-xs text-gray-600 font-medium">{recommendedSite.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mt-2">
                        {typeof recommendedSite.description === 'string' ? recommendedSite.description : (recommendedSite.description[currentLanguage] || '')}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(() => {
                          let tags: string[] = []
                          if (recommendedSite.tags && typeof recommendedSite.tags === 'object' && !Array.isArray(recommendedSite.tags)) {
                            tags = recommendedSite.tags[currentLanguage as 'ko' | 'en'] || []
                          } else if (Array.isArray(recommendedSite.tags)) {
                            tags = recommendedSite.tags
                          }
                          return tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))
                        })()}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}