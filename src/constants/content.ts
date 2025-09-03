// 상수로 분리하여 매번 새 객체 생성 방지
export const CONTENT = {
  ko: {
    home: '홈',
    tools: '도구',
    sites: '사이트',
    resources: '리소스',
    all: '전체',
    search: '검색',
    searchPlaceholder: '도구나 사이트를 검색하세요...',
    noResults: '검색 결과가 없습니다',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    tryAgain: '다시 시도'
  },
  en: {
    home: 'Home',
    tools: 'Tools', 
    sites: 'Sites',
    resources: 'Resources',
    all: 'All',
    search: 'Search',
    searchPlaceholder: 'Search tools or sites...',
    noResults: 'No results found',
    loading: 'Loading...',
    error: 'An error occurred',
    tryAgain: 'Try Again'
  }
} as const

export const MENU_CONTENT = {
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
} as const