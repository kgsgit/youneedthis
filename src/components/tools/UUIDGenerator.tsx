'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CopyButton } from '@/components/ui/CopyButton'

export function UUIDGenerator() {
  const { language } = useLanguage()
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [version, setVersion] = useState('v4')

  // UUID v4 생성 함수
  const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // UUID v1 생성 함수 (간단 구현)
  const generateUUIDv1 = (): string => {
    const timestamp = Date.now()
    const random = Math.random().toString(16).substring(2, 8)
    return `${timestamp.toString(16)}-${random}-1xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const generateUUIDs = () => {
    const newUuids: string[] = []
    for (let i = 0; i < count; i++) {
      if (version === 'v4') {
        newUuids.push(generateUUIDv4())
      } else {
        newUuids.push(generateUUIDv1())
      }
    }
    setUuids(newUuids)
  }

  const copyAllUUIDs = () => {
    const allUuids = uuids.join('\n')
    navigator.clipboard.writeText(allUuids)
    alert(language === 'ko' ? '모든 UUID가 클립보드에 복사되었습니다!' : 'All UUIDs copied to clipboard!')
  }

  const clearUUIDs = () => {
    setUuids([])
  }

  const content = {
    ko: {
      title: 'UUID 생성기',
      countLabel: '생성할 개수',
      versionLabel: 'UUID 버전',
      versions: {
        v1: 'Version 1 (시간 기반)',
        v4: 'Version 4 (랜덤)'
      },
      generateButton: 'UUID 생성',
      resultTitle: '생성된 UUID',
      placeholder: '생성된 UUID가 여기에 표시됩니다',
      copyAllButton: '모두 복사',
      clearButton: '지우기',
      usageTitle: '사용 방법',
      aboutTitle: 'UUID란?',
      aboutDesc: 'UUID(Universally Unique Identifier)는 정보를 식별하기 위한 128비트 값입니다. 데이터베이스 키, 파일명, 세션 ID 등에 사용됩니다.',
      steps: [
        {
          title: '📊 개수 설정',
          desc: '생성할 UUID의 개수를 1~100개 사이에서 선택하세요.'
        },
        {
          title: '🏷️ 버전 선택',
          desc: 'Version 1(시간 기반) 또는 Version 4(완전 랜덤)를 선택하세요.'
        },
        {
          title: '🎯 생성 및 복사',
          desc: '생성 버튼을 클릭하고 필요한 UUID를 복사하세요.'
        },
        {
          title: '💼 활용 방법',
          desc: '데이터베이스 ID, API 키, 파일명 등 고유 식별자가 필요한 곳에 사용하세요.'
        }
      ]
    },
    en: {
      title: 'UUID Generator',
      countLabel: 'Number to Generate',
      versionLabel: 'UUID Version',
      versions: {
        v1: 'Version 1 (Time-based)',
        v4: 'Version 4 (Random)'
      },
      generateButton: 'Generate UUID',
      resultTitle: 'Generated UUIDs',
      placeholder: 'Generated UUIDs will appear here',
      copyAllButton: 'Copy All',
      clearButton: 'Clear',
      usageTitle: 'How to Use',
      aboutTitle: 'What is UUID?',
      aboutDesc: 'UUID (Universally Unique Identifier) is a 128-bit value used to identify information. Used for database keys, file names, session IDs, etc.',
      steps: [
        {
          title: '📊 Set Count',
          desc: 'Choose the number of UUIDs to generate between 1-100.'
        },
        {
          title: '🏷️ Select Version',
          desc: 'Choose Version 1 (time-based) or Version 4 (completely random).'
        },
        {
          title: '🎯 Generate & Copy',
          desc: 'Click the generate button and copy the UUIDs you need.'
        },
        {
          title: '💼 Usage',
          desc: 'Use for database IDs, API keys, file names, or anywhere unique identifiers are needed.'
        }
      ]
    }
  }

  const currentContent = content[language]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-7">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {currentContent.title}
          </h2>

          {/* Count Setting */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.countLabel}
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Version Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.versionLabel}
            </label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="v4">{currentContent.versions.v4}</option>
              <option value="v1">{currentContent.versions.v1}</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateUUIDs}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {currentContent.generateButton}
          </button>

          {/* About UUID */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">{currentContent.aboutTitle}</h4>
            <p className="text-sm text-blue-700">{currentContent.aboutDesc}</p>
          </div>
        </div>

        {/* Result Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentContent.resultTitle}
            </h3>
            {uuids.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={copyAllUUIDs}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  {currentContent.copyAllButton}
                </button>
                <button
                  onClick={clearUUIDs}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                >
                  {currentContent.clearButton}
                </button>
              </div>
            )}
          </div>

          {/* UUIDs Display */}
          <div className="flex-1">
            {uuids.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uuids.map((uuid, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <span className="font-mono text-sm text-gray-800 flex-1 mr-2">
                      {uuid}
                    </span>
                    <CopyButton text={uuid} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center min-h-64">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🆔</div>
                  <p>{currentContent.placeholder}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Usage Guide */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {currentContent.usageTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentContent.steps.map((step, index) => (
            <div key={index}>
              <h4 className="font-medium text-gray-900 mb-2">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}