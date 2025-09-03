'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { siteConfig } from '@/config/site'

export default function DisclaimerPage() {
  const { language } = useLanguage()

  const content = {
    ko: {
      title: '면책조항',
      lastUpdated: '최종 업데이트: 2025년 8월 25일',
      sections: [
        {
          title: '1. 일반 면책조항',
          content: `${siteConfig.name}는 제공되는 모든 도구와 정보에 대해 "있는 그대로" 제공하며, 명시적이거나 묵시적인 어떠한 보증도 하지 않습니다.`
        },
        {
          title: '2. 도구 사용에 대한 면책',
          content: '• 도구 사용 결과의 정확성에 대해 보장하지 않습니다.\n• 도구 사용으로 인한 직접적, 간접적 손해에 대해 책임지지 않습니다.\n• 중요한 업무나 결정에는 반드시 전문가의 검토를 받으시기 바랍니다.'
        },
        {
          title: '3. 외부 링크 면책',
          content: '• 추천 사이트의 내용이나 서비스에 대해 책임지지 않습니다.\n• 외부 사이트의 개인정보 처리방침이나 약관에 대해 책임지지 않습니다.\n• 외부 사이트 이용으로 인한 손해에 대해 책임지지 않습니다.'
        },
        {
          title: '4. 서비스 중단',
          content: '기술적 문제, 시스템 점검, 법적 요구사항 등으로 인해 사전 통지 없이 서비스를 중단할 수 있으며, 이로 인한 손해에 대해 책임지지 않습니다.'
        },
        {
          title: '5. 법적 고지',
          content: '본 면책조항은 관련 법령에서 허용하는 최대한의 범위에서 적용되며, 법령에 의해 배제될 수 없는 책임은 예외로 합니다.'
        }
      ]
    },
    en: {
      title: 'Disclaimer',
      lastUpdated: 'Last Updated: August 25, 2025',
      sections: [
        {
          title: '1. General Disclaimer',
          content: `${siteConfig.name} provides all tools and information "as is" and makes no explicit or implicit warranties of any kind.`
        },
        {
          title: '2. Tool Usage Disclaimer',
          content: '• We do not guarantee the accuracy of tool usage results.\n• We are not responsible for direct or indirect damages resulting from tool usage.\n• For important work or decisions, please consult with experts.'
        },
        {
          title: '3. External Link Disclaimer',
          content: '• We are not responsible for the content or services of recommended sites.\n• We are not responsible for external sites\' privacy policies or terms.\n• We are not responsible for damages caused by using external sites.'
        },
        {
          title: '4. Service Interruption',
          content: 'We may suspend services without prior notice due to technical issues, system maintenance, legal requirements, etc., and are not responsible for damages caused by such interruptions.'
        },
        {
          title: '5. Legal Notice',
          content: 'This disclaimer applies to the maximum extent permitted by applicable law, except for responsibilities that cannot be excluded by law.'
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