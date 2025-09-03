'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CopyButton } from '@/components/ui/CopyButton'

export function KoreanNameConverter() {
  const { language } = useLanguage()
  const [koreanName, setKoreanName] = useState('')
  const [conventionalRoman, setConventionalRoman] = useState('')
  const [officialRoman, setOfficialRoman] = useState('')
  const [showResults, setShowResults] = useState(false)

  // 원본 convert.js의 로직을 그대로 구현
  const initialConsonants = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h']
  const vowels = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i']
  const finalConsonants = ['','k','k','ks','n','nj','nh','t','l','lk','lm','lp','ls','lt','lp','lh','m','p','ps','t','t','ng','t','t','k','t','p','t']

  function decomposeHangul(s: string) {
    const code = s.charCodeAt(0) - 0xAC00
    if (code < 0 || code > 11171) return [s]
    const i = Math.floor(code / (21 * 28))
    const v = Math.floor((code % (21 * 28)) / 28)
    const f = code % 28
    return [initialConsonants[i], vowels[v], finalConsonants[f]]
  }

  function capitalize(str: string) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
  }

  function romanize(name: string, mode: 'official' | 'common' = 'official') {
    if (!name) return ''
    let first = name[0]
    let res = ''
    
    if (mode === 'common') {
      if (first === '김') { res = 'Kim'; name = name.slice(1) }
      else if (first === '박') { res = 'Park'; name = name.slice(1) }
      else if (first === '이') { res = 'Lee'; name = name.slice(1) }
      else if (first === '최') { res = 'Choi'; name = name.slice(1) }
      else if (first === '정') { res = 'Jung'; name = name.slice(1) }
    } else {
      if (first === '이') { res = 'I'; name = name.slice(1) }
      else if (first === '박') { res = 'Bak'; name = name.slice(1) }
      else if (first === '최') { res = 'Choe'; name = name.slice(1) }
      else if (first === '정') { res = 'Jeong'; name = name.slice(1) }
      else if (first === '김') { res = 'Gim'; name = name.slice(1) }
    }

    for (let ch of name) {
      const parts = decomposeHangul(ch)
      if (parts.length === 1) {
        res += parts[0]
      } else {
        const [i, v, f] = parts
        res += i + v + f
      }
    }
    return capitalize(res)
  }

  const handleConvert = () => {
    if (!koreanName.trim()) {
      setConventionalRoman('')
      setOfficialRoman('')
      setShowResults(false)
      return
    }

    const nm = koreanName.trim()
    setConventionalRoman(romanize(nm, 'common'))
    setOfficialRoman(romanize(nm, 'official'))
    setShowResults(true)
  }

  const content = {
    ko: {
      title: '정확한 한글 이름 로마자 변환기',
      subtitle: '국립국어원 표기법 기준 공식 표기와 국내 관습 표기를 모두 제공합니다.',
      inputLabel: '한글 이름 입력',
      placeholder: '홍길동',
      convertButton: '변환하기',
      note: '* 한글만 입력 가능. 변환 후 복사 아이콘으로 결과를 복사하세요.',
      conventionalLabel: '관습 표기',
      officialLabel: '공식 표기',
      copyLabel: '관습 표기 복사'
    },
    en: {
      title: 'Accurate Korean Name Romanizer',
      subtitle: 'Provides both official romanization based on National Institute of Korean Language standards and conventional romanization used domestically.',
      inputLabel: 'Enter Korean Name',
      placeholder: 'Hong Gil-dong',
      convertButton: 'Convert',
      note: '* Only Korean characters accepted. Use the copy icon to copy results after conversion.',
      conventionalLabel: 'Conventional',
      officialLabel: 'Official',
      copyLabel: 'Copy Conventional'
    }
  }

  const currentContent = content[language]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-7 max-w-4xl mx-auto">
      {/* Title and Description */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {currentContent.title}
        </h1>
        <p className="text-gray-600 text-lg">
          {currentContent.subtitle}
        </p>
      </div>

      {/* Input Section */}
      <div className="mb-8">
        <div className="bg-blue-600 text-white py-2 px-4 rounded-t-lg">
          {currentContent.inputLabel}
        </div>
        <div className="flex gap-3 p-4 border border-t-0 rounded-b-lg">
          <input
            type="text"
            value={koreanName}
            onChange={(e) => setKoreanName(e.target.value)}
            placeholder={currentContent.placeholder}
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleConvert()}
          />
          <button
            onClick={handleConvert}
            className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
          >
            {currentContent.convertButton}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2 px-4">
          {currentContent.note}
        </p>
      </div>

      {/* Results Section - 변환 후에만 표시 */}
      {showResults && (
        <>
          <div className="space-y-4 mb-8">
            {/* Conventional Romanization */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                <span className="font-medium text-gray-700">{currentContent.conventionalLabel}</span>
                {conventionalRoman && <CopyButton text={conventionalRoman} />}
              </div>
              <div className="px-6 py-8">
                <div className="text-3xl font-bold text-gray-900 text-center">
                  {conventionalRoman}
                </div>
              </div>
            </div>

            {/* Official Romanization */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                <span className="font-medium text-gray-700">{currentContent.officialLabel}</span>
                {officialRoman && <CopyButton text={officialRoman} />}
              </div>
              <div className="px-6 py-8">
                <div className="text-3xl font-bold text-gray-900 text-center">
                  {officialRoman}
                </div>
              </div>
            </div>
          </div>

          {/* Copy Button */}
          <div className="text-right">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded font-medium hover:bg-red-600 transition-colors"
              onClick={() => {
                if (conventionalRoman) {
                  navigator.clipboard.writeText(conventionalRoman)
                  alert('관습 표기가 복사되었습니다!')
                }
              }}
            >
              {currentContent.copyLabel}
            </button>
          </div>
        </>
      )}
    </div>
  )
}