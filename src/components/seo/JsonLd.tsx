'use client'

import { useEffect, useState } from 'react'

interface JsonLdProps {
  data: object
}

export function JsonLd({ data }: JsonLdProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      key="json-ld"
    />
  )
}

// Website 구조화 데이터
export function WebsiteJsonLd() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "YouNeedThis",
    "description": "생활을 편리하게 만드는 실용적인 도구 모음",
    "url": "https://youneedthis.kr",
    "logo": {
      "@type": "ImageObject",
      "url": "https://youneedthis.kr/images/logo_s.svg"
    },
    "sameAs": [
      // 소셜미디어 링크들 (있다면 추가)
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://youneedthis.kr/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return <JsonLd data={websiteData} />
}

// 도구 페이지용 구조화 데이터
export function ToolJsonLd({ tool }: { tool: any }) {
  const toolData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": typeof tool.name === 'string' ? tool.name : tool.name.ko,
    "description": typeof tool.description === 'string' ? tool.description : tool.description.ko,
    "url": `https://youneedthis.kr/tools/${tool.id}`,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tool.rating || 4.5,
      "bestRating": 5,
      "worstRating": 1,
      "ratingCount": 150 // 실제 리뷰 수가 있으면 교체
    },
    "keywords": typeof tool.keywords === 'string' ? tool.keywords : tool.keywords.ko,
    "author": {
      "@type": "Organization",
      "name": "YouNeedThis"
    }
  }

  return <JsonLd data={toolData} />
}

// 사이트 상세 페이지용 구조화 데이터
export function SiteJsonLd({ site, category }: { site: any, category: string }) {
  const siteData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": typeof site.name === 'string' ? site.name : site.name.ko,
    "description": typeof site.description === 'string' ? site.description : site.description.ko,
    "url": site.url,
    "applicationCategory": category,
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": site.isPaid ? "유료" : "0",
      "priceCurrency": "KRW",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": site.rating,
      "bestRating": 5,
      "worstRating": 1,
      "ratingCount": 300 // 실제 리뷰 수가 있으면 교체
    },
    "author": {
      "@type": "Organization", 
      "name": "YouNeedThis"
    },
    "reviewedBy": {
      "@type": "Organization",
      "name": "YouNeedThis"
    }
  }

  return <JsonLd data={siteData} />
}

// 조직 정보 구조화 데이터
export function OrganizationJsonLd() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "YouNeedThis",
    "description": "생활을 편리하게 만드는 실용적인 도구와 사이트를 소개하는 플랫폼",
    "url": "https://youneedthis.kr",
    "logo": {
      "@type": "ImageObject",
      "url": "https://youneedthis.kr/images/logo_s.svg"
    },
    "foundingDate": "2025",
    "serviceArea": {
      "@type": "Country",
      "name": "South Korea"
    },
    "areaServed": ["South Korea", "Global"]
  }

  return <JsonLd data={organizationData} />
}