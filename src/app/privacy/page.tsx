'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { siteConfig } from '@/config/site'

export default function PrivacyPage() {
  const { language } = useLanguage()

  const content = {
    ko: {
      title: '개인정보처리방침',
      lastUpdated: '최종 업데이트: 2025년 8월 25일',
      sections: [
        {
          title: '1. 개인정보의 처리 목적',
          content: `${siteConfig.name}는 다음의 목적을 위하여 개인정보를 처리합니다:\n• 서비스 제공 및 운영\n• 웹사이트 이용 통계 분석\n• 서비스 개선 및 최적화`
        },
        {
          title: '2. 처리하는 개인정보 항목',
          content: '• IP 주소\n• 쿠키, 접속 로그, 방문 기록\n• 브라우저 종류 및 OS 정보\n• 서비스 이용 기록'
        },
        {
          title: '3. 개인정보의 처리 및 보유 기간',
          content: '개인정보는 수집 목적 달성 후 지체 없이 파기하며, 통계 분석을 위한 로그 데이터는 최대 1년간 보관합니다.'
        },
        {
          title: '4. 개인정보의 제3자 제공',
          content: '당사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의해 요구되는 경우는 예외입니다.'
        },
        {
          title: '5. 쿠키의 사용',
          content: '웹사이트 이용 편의성 향상과 통계 분석을 위해 쿠키를 사용할 수 있습니다. 브라우저 설정을 통해 쿠키를 거부할 수 있습니다.'
        },
        {
          title: '6. 개인정보 보호책임자',
          content: `개인정보 처리에 관한 업무를 총괄해서 책임지고 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 처리하고 있습니다.\n\n이메일: youneedthiskr@gmail.com`
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: August 25, 2025',
      sections: [
        {
          title: '1. Purpose of Processing Personal Information',
          content: `${siteConfig.name} processes personal information for the following purposes:\n• Service provision and operation\n• Website usage statistics analysis\n• Service improvement and optimization`
        },
        {
          title: '2. Personal Information Items Processed',
          content: '• IP address\n• Cookies, access logs, visit records\n• Browser type and OS information\n• Service usage records'
        },
        {
          title: '3. Processing and Retention Period',
          content: 'Personal information is destroyed without delay after achieving the collection purpose, and log data for statistical analysis is retained for a maximum of 1 year.'
        },
        {
          title: '4. Provision of Personal Information to Third Parties',
          content: 'We do not provide personal information to third parties without user consent, except when required by law.'
        },
        {
          title: '5. Use of Cookies',
          content: 'Cookies may be used to improve website usability and for statistical analysis. You can refuse cookies through browser settings.'
        },
        {
          title: '6. Personal Information Protection Officer',
          content: `Responsible for overall management of personal information processing and handling complaints and damage relief related to personal information processing.\n\nEmail: youneedthiskr@gmail.com`
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