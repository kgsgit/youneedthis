import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SiteDetailClient } from '@/components/sites/SiteDetailClient'
import { SiteJsonLd } from '@/components/seo/JsonLd'
import { siteConfig } from '@/config/site'

interface SiteDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// Enhanced site features data
const siteFeatures: Record<string, {
  features: string[]
  useCases: string[]
  pros: string[]
  cons: string[]
}> = {
  // AI & Automation
  'chatgpt': {
    features: ['GPT-4 기반 고성능 대화형 AI', '다양한 주제의 질의응답 지원', '코드 생성 및 디버깅 도움', '창작 활동 지원 (글쓰기, 아이디어 등)', '이미지 분석 및 설명', '플러그인 생태계 지원'],
    useCases: ['업무 자동화 및 생산성 향상', '학습 도우미 및 과제 도움', '콘텐츠 제작 및 마케팅', '프로그래밍 학습 지원', '번역 및 언어 학습', '창작 영감 및 브레인스토밍'],
    pros: ['매우 자연스러운 대화', '빠른 응답 속도', '다양한 분야 지식', '지속적인 업데이트'],
    cons: ['유료 구독 필요 (고급 기능)', '정보 업데이트 제한', '가끔 부정확한 답변']
  },
  'claude': {
    features: ['안전성을 중시하는 AI 설계', '긴 문서 분석 및 요약', '논리적이고 신중한 응답', '다양한 언어 지원', '대용량 텍스트 처리', '윤리적 AI 원칙 준수'],
    useCases: ['문서 요약 및 분석', '연구 보조 및 정보 정리', '안전한 AI 상담', '교육 및 학습 지원', '법률 문서 검토', '학술 논문 작성 지원'],
    pros: ['높은 안전성과 신뢰성', '긴 문서 처리 우수', '논리적 사고', '윤리적 응답'],
    cons: ['응답 속도가 다소 느림', '창작 능력 제한적', '보수적인 답변 경향']
  },
  'midjourney': {
    features: ['고품질 AI 이미지 생성', '다양한 스타일과 기법 지원', 'Discord 기반 인터페이스', '상업적 이용 가능', '커뮤니티 갤러리', '고급 프롬프트 엔지니어링'],
    useCases: ['마케팅 이미지 제작', '아트워크 및 일러스트', '프로토타입 비주얼', '창작 영감 얻기', '소셜미디어 콘텐츠', '책 표지 디자인'],
    pros: ['뛰어난 이미지 품질', '독창적인 스타일', '활발한 커뮤니티', '상업적 이용 허용'],
    cons: ['Discord 사용법 익혀야 함', '유료 구독 필요', '한국어 프롬프트 제한']
  },
  'zapier': {
    features: ['5000+ 앱 연동 지원', '코딩 없는 자동화 구축', '조건부 로직 지원', '멀티스텝 워크플로우', '스케줄링 기능', 'Webhook 지원'],
    useCases: ['이메일 마케팅 자동화', 'CRM 데이터 동기화', '소셜미디어 게시 자동화', '문서 백업 자동화', '팀 알림 시스템', '데이터 수집 자동화'],
    pros: ['광범위한 앱 지원', '직관적인 인터페이스', '안정적인 실행', '풍부한 템플릿'],
    cons: ['유료 구독 시 고가', '복잡한 로직 구현 제한', '실행 속도 제약']
  },

  // Design & UI/UX
  'figma': {
    features: ['실시간 협업 디자인', '클라우드 기반 저장', '프로토타이핑 도구', '컴포넌트 시스템', '버전 관리', '개발자 핸드오프'],
    useCases: ['UI/UX 디자인', '프로토타입 제작', '팀 협업 작업', '디자인 시스템 구축', '와이어프레임 제작', '사용자 테스트'],
    pros: ['실시간 협업 우수', '클라우드 기반 편의성', '강력한 프로토타이핑', '활발한 커뮤니티'],
    cons: ['오프라인 작업 불가', '복잡한 애니메이션 제한', '대용량 파일 처리 느림']
  },
  'canva': {
    features: ['드래그 앤 드롭 에디터', '수만 개의 템플릿', 'AI 디자인 도구', '브랜드 키트 관리', '팀 협업 기능', '소셜미디어 연동'],
    useCases: ['소셜미디어 포스트', '프레젠테이션 제작', '마케팅 자료', '로고 디자인', '웹 그래픽', '인쇄물 디자인'],
    pros: ['쉬운 사용법', '풍부한 템플릿', '합리적인 가격', 'AI 기능 내장'],
    cons: ['전문 디자인 제한', '한정적인 커스터마이징', '일부 기능 유료']
  },

  // Development
  'github': {
    features: ['Git 버전 관리', '이슈 트래킹', 'Pull Request', 'GitHub Actions', '프로젝트 관리', '패키지 레지스트리'],
    useCases: ['소스코드 관리', '오픈소스 기여', '팀 개발 협업', 'CI/CD 구축', '프로젝트 문서화', '포트폴리오 구축'],
    pros: ['업계 표준', '강력한 협업 도구', '무료 플랜', '광범위한 통합'],
    cons: ['학습 곡선 존재', '일부 고급 기능 유료', 'Git 이해 필요']
  },
  'vscode': {
    features: ['풍부한 확장 생태계', '내장 터미널', '디버거 지원', 'Git 통합', '인텔리센스', '멀티 플랫폼'],
    useCases: ['웹 개발', '데이터 사이언스', '모바일 개발', '클라우드 개발', '마크다운 편집', '설정 파일 관리'],
    pros: ['무료 오픈소스', '빠른 성능', '활발한 커뮤니티', '지속적인 업데이트'],
    cons: ['메모리 사용량 높음', '플러그인 의존성', '초기 설정 복잡함']
  },

  // Add more as needed - for brevity, adding a few more key ones
  'notion': {
    features: ['블록 기반 에디터', '데이터베이스 기능', '템플릿 시스템', '팀 협업', 'API 지원', '다양한 콘텐츠 타입'],
    useCases: ['노트 정리', '프로젝트 관리', '지식 베이스', '팀 위키', '개인 일정 관리', '습관 트래커'],
    pros: ['올인원 워크스페이스', '유연한 구조', '강력한 데이터베이스', '아름다운 UI'],
    cons: ['학습 곡선 존재', '속도 이슈', '복잡한 구조 가능', '모바일 앱 제한']
  }
}

// Default features for sites not in the above list
const getDefaultFeatures = (site: any) => ({
  features: [
    `${typeof site.name === 'string' ? site.name : site.name.ko}의 핵심 기능`,
    `${site.category.replace(/-/g, ' ')} 분야 전문성`,
    '사용자 친화적 인터페이스',
    '안정적인 서비스 제공'
  ],
  useCases: [
    '업무 효율성 향상',
    '전문적인 작업 지원',
    '창작 활동 도움',
    '학습 및 스킬 개발'
  ],
  pros: [
    '직관적인 사용법',
    '안정적인 성능',
    '지속적인 업데이트',
    '커뮤니티 지원'
  ],
  cons: [
    '일부 기능 유료',
    '학습 시간 필요',
    '인터넷 연결 필요',
    '언어 지원 한계'
  ]
})

// Smart recommendation system
const getRecommendedSites = (currentSite: any, allSites: any[]) => {
  // Calculate similarity scores for each site
  const candidates = allSites.filter(site => site.id !== currentSite.id)
  
  const scoredSites = candidates.map(site => {
    let score = 0
    
    // Same category gets highest score
    if (site.category === currentSite.category) {
      score += 10
    }
    
    // Similar tags
    // 안전하게 태그 처리
    let commonTags = 0
    try {
      const siteTagsArray = Array.isArray(site.tags) ? site.tags : (site.tags?.ko || site.tags?.en || [])
      const currentSiteTagsArray = Array.isArray(currentSite.tags) ? currentSite.tags : (currentSite.tags?.ko || currentSite.tags?.en || [])
      commonTags = siteTagsArray.filter((tag: string) => 
        currentSiteTagsArray.includes(tag)
      ).length
    } catch (e) {
      // Tags processing error - silently handle
    }
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

export async function generateStaticParams() {
  return siteConfig.sites.map((site) => ({
    slug: site.id,
  }))
}

export async function generateMetadata({ params }: SiteDetailPageProps) {
  const { slug } = await params
  const site = siteConfig.sites.find((site) => site.id === slug)
  
  if (!site) {
    return {
      title: '사이트를 찾을 수 없습니다',
      description: '요청하신 사이트를 찾을 수 없습니다.'
    }
  }

  const name = typeof site.name === 'string' ? site.name : site.name.ko
  const description = typeof site.description === 'string' ? site.description : (site.description?.ko || '')
  const tags = Array.isArray(site.tags) ? site.tags : (site.tags?.ko || [])
  const category = siteConfig.siteCategories.find(cat => cat.id === site.category)?.name.ko || site.category
  
  const title = `${name} - ${category} | ${siteConfig.name}`
  const fullDescription = `${description} ${name}은(는) ${category} 분야의 ${site.isPaid ? '유료' : '무료'} 서비스입니다. 평점 ${site.rating}/5.0`

  return {
    title,
    description: fullDescription,
    keywords: `${name}, ${category}, ${tags.join(', ')}, ${site.isPaid ? '유료 도구' : '무료 도구'}, 온라인 도구`,
    alternates: {
      canonical: `${siteConfig.url}/sites/detail/${slug}`
    },
    openGraph: {
      title,
      description: fullDescription,
      url: `${siteConfig.url}/sites/detail/${slug}`,
      type: 'website',
      siteName: siteConfig.name,
      images: [
        {
          url: site.customThumbnail ? 
            `${siteConfig.url}/images/thumbnails/${site.customThumbnail}` : 
            `${siteConfig.url}/images/logo_s.svg`,
          width: 400,
          height: 400,
          alt: `${name} 썸네일`,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: fullDescription,
      images: [site.customThumbnail ? 
        `${siteConfig.url}/images/thumbnails/${site.customThumbnail}` : 
        `${siteConfig.url}/images/logo_s.svg`]
    },
    robots: {
      index: true,
      follow: true
    },
    other: {
      'article:author': 'YouNeedThis',
      'article:section': category,
      'product:price:amount': site.isPaid ? 'Paid' : 'Free',
      'product:availability': 'in stock'
    }
  }
}

export default async function SiteDetailPage({ params }: SiteDetailPageProps) {
  const { slug } = await params
  const site = siteConfig.sites.find((site) => site.id === slug)
  
  if (!site) {
    notFound()
  }

  const category = siteConfig.siteCategories.find(cat => cat.id === site.category)?.name.ko || site.category

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-white">
        <SiteDetailClient
          initialSite={site}
          slug={slug}
        />
      </div>

      <Footer />
      <SiteJsonLd site={site} category={category} />
    </>
  )
}