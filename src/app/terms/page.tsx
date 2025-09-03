'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { siteConfig } from '@/config/site'

export default function TermsPage() {
  const { language } = useLanguage()

  const content = {
    ko: {
      title: '이용약관',
      lastUpdated: '최종 업데이트: 2025년 8월 25일',
      sections: [
        {
          title: '제1조 (목적)',
          content: `본 약관은 ${siteConfig.name}(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.`
        },
        {
          title: '제2조 (정의)',
          content: '1. "서비스"라 함은 온라인 도구 제공 및 웹사이트 추천 서비스를 의미합니다.\n2. "이용자"라 함은 본 서비스를 이용하는 모든 개인을 의미합니다.\n3. "콘텐츠"라 함은 서비스를 통해 제공되는 모든 정보와 자료를 의미합니다.'
        },
        {
          title: '제3조 (서비스의 제공)',
          content: '1. 서비스는 24시간 연중무휴로 제공됩니다.\n2. 시스템 점검, 보수 등의 사유로 서비스를 일시 중단할 수 있습니다.\n3. 모든 도구는 무료로 제공되며, 회원가입 없이 이용 가능합니다.'
        },
        {
          title: '제4조 (이용자의 의무)',
          content: '1. 불법적인 목적으로 서비스를 이용해서는 안 됩니다.\n2. 서비스의 안정적인 운영을 방해하는 행위를 해서는 안 됩니다.\n3. 다른 이용자의 개인정보를 수집, 저장, 공개해서는 안 됩니다.'
        },
        {
          title: '제5조 (면책사항)',
          content: '1. 서비스는 도구 이용 결과에 대해 책임을 지지 않습니다.\n2. 외부 링크 사이트로 인한 손해에 대해 책임을 지지 않습니다.\n3. 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.'
        },
        {
          title: '제6조 (저작권)',
          content: '서비스의 모든 콘텐츠에 대한 저작권은 회사에 있습니다. 이용자는 사전 동의 없이 복제, 전송, 배포할 수 없습니다.'
        }
      ]
    },
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last Updated: August 25, 2025',
      sections: [
        {
          title: 'Article 1 (Purpose)',
          content: `These terms aim to stipulate the rights, obligations, and responsibilities between the company and users regarding the use of ${siteConfig.name} (hereinafter "Service").`
        },
        {
          title: 'Article 2 (Definitions)',
          content: '1. "Service" means online tool provision and website recommendation services.\n2. "User" means any individual using this service.\n3. "Content" means all information and materials provided through the service.'
        },
        {
          title: 'Article 3 (Service Provision)',
          content: '1. Service is provided 24/7 year-round.\n2. Service may be temporarily suspended due to system maintenance, repairs, etc.\n3. All tools are provided free of charge and can be used without registration.'
        },
        {
          title: 'Article 4 (User Obligations)',
          content: '1. Users must not use the service for illegal purposes.\n2. Users must not engage in activities that interfere with stable service operation.\n3. Users must not collect, store, or disclose other users\' personal information.'
        },
        {
          title: 'Article 5 (Disclaimer)',
          content: '1. The service is not responsible for tool usage results.\n2. Not responsible for damages caused by external link sites.\n3. Not responsible for service usage disruptions due to user fault.'
        },
        {
          title: 'Article 6 (Copyright)',
          content: 'All content in the service is copyrighted by the company. Users cannot reproduce, transmit, or distribute without prior consent.'
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
              <p className="text-lg text-gray-600">
                {currentContent.lastUpdated}
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