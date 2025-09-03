'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { siteConfig } from '@/config/site'

export default function ContactPage() {
  const { language } = useLanguage()

  const content = {
    ko: {
      title: '문의하기',
      subtitle: '의견이나 문의사항이 있으시면 언제든 연락해주세요.',
      sections: [
        {
          title: '📧 이메일 문의',
          content: 'youneedthiskr@gmail.com\n\n• 일반 문의 및 의견\n• 사이트 추천\n• 새로운 도구 제안\n• 기술적 문제 신고'
        },
        {
          title: '💡 사이트 추천',
          content: '유용한 웹사이트를 발견하셨나요?\n\n추천하고 싶은 사이트가 있다면:\n• 사이트 URL\n• 간단한 설명\n• 추천 이유\n\n위 정보와 함께 이메일로 보내주세요!'
        },
        {
          title: '🛠️ 새로운 도구 제안',
          content: '필요한 온라인 도구가 있다면 제안해주세요:\n\n• 도구 이름\n• 기능 설명\n• 사용 용도\n• 우선순위\n\n검토 후 개발 일정에 포함하겠습니다.'
        },
        {
          title: '🔧 기술 지원',
          content: '기술적인 문제나 버그를 발견하셨나요?\n\n다음 정보와 함께 신고해주세요:\n• 사용 중인 브라우저\n• 문제가 발생한 도구\n• 구체적인 증상\n• 재현 방법'
        }
      ]
    },
    en: {
      title: 'Contact Us',
      subtitle: 'Feel free to reach out to us with any questions or feedback.',
      sections: [
        {
          title: '📧 Email Contact',
          content: 'youneedthiskr@gmail.com\n\n• General inquiries and feedback\n• Site recommendations\n• New tool suggestions\n• Technical issue reports'
        },
        {
          title: '💡 Site Recommendations',
          content: 'Found a useful website?\n\nIf you have a site to recommend:\n• Site URL\n• Brief description\n• Reason for recommendation\n\nPlease send the above information via email!'
        },
        {
          title: '🛠️ New Tool Suggestions',
          content: 'If you need a specific online tool, please suggest:\n\n• Tool name\n• Feature description\n• Use case\n• Priority level\n\nWe\'ll review and include it in our development schedule.'
        },
        {
          title: '🔧 Technical Support',
          content: 'Encountered a technical issue or bug?\n\nPlease report with the following information:\n• Browser being used\n• Tool where the issue occurred\n• Specific symptoms\n• Steps to reproduce'
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentContent.sections.map((section, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Direct Contact CTA */}
          <div className="mt-12 text-center bg-blue-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ko' ? '바로 연락하기' : 'Contact Directly'}
            </h3>
            <a
              href="mailto:youneedthiskr@gmail.com"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              📧 youneedthiskr@gmail.com
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}