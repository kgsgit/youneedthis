import { siteConfig } from '@/config/site'

interface ToolJsonLdProps {
  toolId: string
  language?: 'ko' | 'en'
}

export function ToolJsonLd({ toolId, language = 'ko' }: ToolJsonLdProps) {
  const tool = siteConfig.tools.find(t => t.id === toolId)
  
  if (!tool) return null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.name[language],
    "description": tool.description[language],
    "url": `${siteConfig.url}/tools/${toolId}`,
    "applicationCategory": "Utility",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": {
      "@type": "Organization", 
      "name": "YouNeedThis",
      "url": siteConfig.url,
      "logo": `${siteConfig.url}/images/logo_s.svg`
    },
    "keywords": tool.keywords?.[language] || "",
    "applicationSubCategory": tool.category,
    "featureList": language === 'ko' ? [
      "완전 무료 사용",
      "회원가입 불필요", 
      "클라이언트사이드 처리",
      "개인정보 보호"
    ] : [
      "Completely free to use",
      "No registration required",
      "Client-side processing", 
      "Privacy protection"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}