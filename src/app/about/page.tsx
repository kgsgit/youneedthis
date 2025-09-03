'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { siteConfig } from '@/config/site'

export default function AboutPage() {
  const { language } = useLanguage()

  const content = {
    ko: {
      title: `${siteConfig.name} 소개`,
      subtitle: '당신의 삶을 빠르게 도와드립니다',
      sections: [
        {
          title: '서비스 소개',
          content: `${siteConfig.name}는 설치나 회원가입 없이 바로 사용할 수 있는 웹 도구 모음집입니다. 간단한 입력으로 즉시 사용 가능하며, 복잡한 절차는 필요하지 않습니다.`
        },
        {
          title: '주요 도구',
          content: '• 그림판 - 브러시, 텍스트, 도형 그리기\n• 부가세 계산기 - 한국 부가세 10% 계산\n• 한글 이름 로마자 변환기 - 여권용 이름 변환\n• IP 추적기 - 위치, 통신사, 기기 정보 확인\n• QR 코드 생성기 - URL, 텍스트 QR코드 변환\n• 비밀번호 생성기 - 안전한 랜덤 비밀번호\n• 그 외 다양한 실용적 도구들'
        },
        {
          title: '특징',
          content: '• 설치 불필요 - 웹브라우저에서 바로 사용\n• 회원가입 불필요 - 즉시 접근 가능\n• 완전 무료 - 모든 도구 무료 제공\n• 간단한 사용법 - 복잡한 절차 없이 간단 입력\n• 한국어 지원 - 한국 사용자 특화 도구 포함'
        }
      ]
    },
    en: {
      title: `About ${siteConfig.name}`,
      subtitle: 'Help your life quickly',
      sections: [
        {
          title: 'Service Introduction',
          content: `${siteConfig.name} is a collection of web tools that can be used immediately without installation or registration. Simple input allows instant use, and no complex procedures are required.`
        },
        {
          title: 'Main Tools',
          content: '• Paint - Brush, text, and shape drawing\n• VAT Calculator - Korean VAT 10% calculation\n• Korean Name Romanizer - Name conversion for passports\n• IP Tracker - Location, ISP, and device information\n• QR Code Generator - URL and text to QR code conversion\n• Password Generator - Secure random passwords\n• Various other practical tools'
        },
        {
          title: 'Features',
          content: '• No Installation Required - Use directly in web browser\n• No Registration Required - Instant access\n• Completely Free - All tools provided for free\n• Simple Usage - No complex procedures, just simple input\n• Korean Support - Includes tools specialized for Korean users'
        }
      ]
    }
  }

  const currentContent = content[language]

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-white">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {currentContent.title}
              </h1>
              <p className="text-xl text-gray-600">
                {currentContent.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            {currentContent.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}