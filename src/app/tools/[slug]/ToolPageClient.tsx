'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { ToolJsonLd } from '@/components/seo/JsonLd'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// 동적 임포트로 필요할 때만 로드
const QRGenerator = dynamic(() => import('@/components/tools/QRGenerator').then(mod => ({ default: mod.QRGenerator })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const AgeCalculator = dynamic(() => import('@/components/tools/AgeCalculator').then(mod => ({ default: mod.AgeCalculator })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const ColorConverter = dynamic(() => import('@/components/tools/ColorConverter').then(mod => ({ default: mod.ColorConverter })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const Base64Converter = dynamic(() => import('@/components/tools/Base64Converter').then(mod => ({ default: mod.Base64Converter })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const BusinessValidator = dynamic(() => import('@/components/tools/BusinessValidator').then(mod => ({ default: mod.BusinessValidator })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const PasswordGenerator = dynamic(() => import('@/components/tools/PasswordGenerator').then(mod => ({ default: mod.PasswordGenerator })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const UUIDGenerator = dynamic(() => import('@/components/tools/UUIDGenerator').then(mod => ({ default: mod.UUIDGenerator })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const LoremGenerator = dynamic(() => import('@/components/tools/LoremGenerator').then(mod => ({ default: mod.LoremGenerator })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const TextCounter = dynamic(() => import('@/components/tools/TextCounter').then(mod => ({ default: mod.TextCounter })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const EmailValidator = dynamic(() => import('@/components/tools/EmailValidator').then(mod => ({ default: mod.EmailValidator })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const PhoneValidator = dynamic(() => import('@/components/tools/PhoneValidator').then(mod => ({ default: mod.PhoneValidator })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const UnitConverter = dynamic(() => import('@/components/tools/UnitConverter').then(mod => ({ default: mod.UnitConverter })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const KoreanNameConverter = dynamic(() => import('@/components/tools/KoreanNameConverter').then(mod => ({ default: mod.KoreanNameConverter })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const PDFConverter = dynamic(() => import('@/components/tools/PDFConverter').then(mod => ({ default: mod.PDFConverter })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const ResidentValidator = dynamic(() => import('@/components/tools/ResidentValidator').then(mod => ({ default: mod.ResidentValidator })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const VATCalculator = dynamic(() => import('@/components/tools/VATCalculator').then(mod => ({ default: mod.VATCalculator })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const IPTrackerSimple = dynamic(() => import('@/components/tools/IPTrackerSimple').then(mod => ({ default: mod.IPTrackerSimple })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const ImageEditor = dynamic(() => import('@/components/tools/ImageEditor'), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
const MarkdownLinkGenerator = dynamic(() => import('@/components/tools/MarkdownLinkGenerator').then(mod => ({ default: mod.MarkdownLinkGenerator })), { 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div> 
})
import { useLanguage } from '@/contexts/LanguageContext'
import { siteConfig } from '@/config/site'

interface ToolPageClientProps {
  params: { slug: string }
  forceLanguage?: 'ko' | 'en'
}

export default function ToolPageClient({ params, forceLanguage }: ToolPageClientProps) {
  const { language: contextLanguage, region, setLanguage } = useLanguage()
  
  // forceLanguage가 있으면 그것을 사용, 없으면 context의 언어 사용
  const language = forceLanguage || contextLanguage
  
  // forceLanguage가 있으면 언어 설정 업데이트
  React.useEffect(() => {
    if (forceLanguage && forceLanguage !== contextLanguage) {
      setLanguage(forceLanguage)
    }
  }, [forceLanguage, contextLanguage, setLanguage])
  
  const tool = siteConfig.tools.find((t) => t.id === params.slug)
  
  // 도구가 없는 경우 처리
  if (!tool) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'ko' ? '도구를 찾을 수 없습니다' : 'Tool Not Found'}
            </h3>
            <p className="text-gray-600">
              {language === 'ko' 
                ? '요청하신 도구를 찾을 수 없습니다.'
                : 'The requested tool could not be found.'}
            </p>
          </div>
        </div>
        <Footer />
      </>
    )
  }
  
  // 지역 체크
  if (!tool.regions.includes(region) && !tool.regions.includes('global')) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🚫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'ko' ? '지역 제한' : 'Region Restricted'}
            </h3>
            <p className="text-gray-600">
              {language === 'ko' 
                ? '이 도구는 현재 지역에서 사용할 수 없습니다.'
                : 'This tool is not available in your region.'}
            </p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const renderToolComponent = () => {
    switch (tool.component) {
      case 'QRGenerator':
        return <QRGenerator />
      case 'AgeCalculator':
        return <AgeCalculator />
      case 'ColorConverter':
        return <ColorConverter />
      case 'Base64Converter':
        return <Base64Converter />
      case 'BusinessValidator':
        return <BusinessValidator />
      case 'PasswordGenerator':
        return <PasswordGenerator />
      case 'UUIDGenerator':
        return <UUIDGenerator />
      case 'LoremGenerator':
        return <LoremGenerator />
      case 'TextCounter':
        return <TextCounter />
      case 'EmailValidator':
        return <EmailValidator />
      case 'PhoneValidator':
        return <PhoneValidator />
      case 'UnitConverter':
        return <UnitConverter />
      case 'KoreanNameConverter':
        return <KoreanNameConverter />
      case 'PDFConverter':
        return <PDFConverter />
      case 'ResidentValidator':
        return <ResidentValidator />
      case 'VATCalculator':
        return <VATCalculator />
      case 'IPTracker':
        return <IPTrackerSimple />
      case 'ImageEditor':
        return <ImageEditor />
      case 'MarkdownLinkGenerator':
        return <MarkdownLinkGenerator />
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'ko' ? '준비 중인 도구입니다' : 'Tool Coming Soon'}
            </h3>
            <p className="text-gray-600">
              {language === 'ko' 
                ? `${typeof tool.name === 'string' ? tool.name : tool.name.ko} 도구는 곧 출시될 예정입니다.`
                : `${typeof tool.name === 'string' ? tool.name : tool.name.en} tool will be available soon.`}
            </p>
          </div>
        )
    }
  }

  return (
    <>
      <Header />
      <ToolLayout tool={tool}>
        {renderToolComponent()}
      </ToolLayout>
      <Footer />
      <ToolJsonLd tool={tool} />
    </>
  )
}