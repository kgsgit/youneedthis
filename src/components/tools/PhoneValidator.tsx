'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function PhoneValidator() {
  const { language } = useLanguage()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [country, setCountry] = useState('KR')
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    formatted?: string
    type?: string
    errors: string[]
    suggestions?: string
  } | null>(null)

  // 국가별 전화번호 패턴
  const phonePatterns = {
    KR: {
      name: { ko: '대한민국', en: 'South Korea' },
      patterns: [
        { regex: /^010-\d{4}-\d{4}$/, type: '휴대폰', format: '010-XXXX-XXXX' },
        { regex: /^01[1-9]-\d{3,4}-\d{4}$/, type: '휴대폰', format: '01X-XXX(X)-XXXX' },
        { regex: /^0\d{1,2}-\d{3,4}-\d{4}$/, type: '지역번호', format: '0XX-XXX(X)-XXXX' },
        { regex: /^1\d{3}-\d{4}$/, type: '특번', format: '1XXX-XXXX' },
        { regex: /^010\d{8}$/, type: '휴대폰 (하이픈 없음)', format: '010XXXXXXXX' },
        { regex: /^01[1-9]\d{7,8}$/, type: '휴대폰 (하이픈 없음)', format: '01XXXXXXXXX' }
      ]
    },
    US: {
      name: { ko: '미국', en: 'United States' },
      patterns: [
        { regex: /^\(\d{3}\) \d{3}-\d{4}$/, type: 'Mobile/Landline', format: '(XXX) XXX-XXXX' },
        { regex: /^\d{3}-\d{3}-\d{4}$/, type: 'Mobile/Landline', format: 'XXX-XXX-XXXX' },
        { regex: /^\d{10}$/, type: 'Mobile/Landline', format: 'XXXXXXXXXX' }
      ]
    },
    CN: {
      name: { ko: '중국', en: 'China' },
      patterns: [
        { regex: /^1[3-9]\d{9}$/, type: 'Mobile', format: '1XXXXXXXXXX' },
        { regex: /^0\d{2,3}-\d{7,8}$/, type: 'Landline', format: '0XX(X)-XXXXXXXX' }
      ]
    },
    JP: {
      name: { ko: '일본', en: 'Japan' },
      patterns: [
        { regex: /^0[789]0-\d{4}-\d{4}$/, type: 'Mobile', format: '0X0-XXXX-XXXX' },
        { regex: /^0\d{1,4}-\d{1,4}-\d{4}$/, type: 'Landline', format: '0XXX-XXX-XXXX' }
      ]
    }
  }

  const validatePhoneNumber = (phone: string, countryCode: string) => {
    const errors: string[] = []
    let isValid = false
    let formatted = ''
    let type = ''
    let suggestions = ''

    if (!phone.trim()) {
      errors.push(language === 'ko' ? '전화번호를 입력하세요.' : 'Please enter a phone number.')
      return { isValid, errors, formatted, type, suggestions }
    }

    const patterns = phonePatterns[countryCode as keyof typeof phonePatterns]
    if (!patterns) {
      errors.push(language === 'ko' ? '지원하지 않는 국가입니다.' : 'Unsupported country.')
      return { isValid, errors, formatted, type, suggestions }
    }

    // 패턴 매칭 확인
    for (const pattern of patterns.patterns) {
      if (pattern.regex.test(phone)) {
        isValid = true
        formatted = phone
        type = pattern.type
        break
      }
    }

    if (!isValid) {
      errors.push(language === 'ko' 
        ? `올바른 ${patterns.name[language]} 전화번호 형식이 아닙니다.`
        : `Invalid ${patterns.name[language]} phone number format.`
      )

      // 한국 전화번호 자동 포맷팅 제안
      if (countryCode === 'KR') {
        const digitsOnly = phone.replace(/\D/g, '')
        
        if (digitsOnly.length === 11 && digitsOnly.startsWith('010')) {
          suggestions = `010-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7)}`
        } else if (digitsOnly.length === 10 && digitsOnly.startsWith('01')) {
          suggestions = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
        } else if (digitsOnly.length === 10 && digitsOnly.startsWith('0')) {
          suggestions = `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2, 6)}-${digitsOnly.slice(6)}`
        } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
          suggestions = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7)}`
        }
      }
      
      // 미국 전화번호 자동 포맷팅 제안
      if (countryCode === 'US') {
        const digitsOnly = phone.replace(/\D/g, '')
        if (digitsOnly.length === 10) {
          suggestions = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
        }
      }
    }

    return { isValid, errors, formatted, type, suggestions }
  }

  const handleValidation = () => {
    const result = validatePhoneNumber(phoneNumber, country)
    setValidationResult(result)
  }

  const handleInputChange = (value: string) => {
    setPhoneNumber(value)
    if (validationResult) {
      // 실시간 검증
      const result = validatePhoneNumber(value, country)
      setValidationResult(result)
    }
  }

  const applySuggestion = () => {
    if (validationResult?.suggestions) {
      setPhoneNumber(validationResult.suggestions)
      const result = validatePhoneNumber(validationResult.suggestions, country)
      setValidationResult(result)
    }
  }

  const content = {
    ko: {
      title: '전화번호 검증기',
      phoneLabel: '전화번호',
      countryLabel: '국가',
      placeholder: '전화번호를 입력하세요',
      validateButton: '검증하기',
      resultTitle: '검증 결과',
      valid: '✅ 유효한 전화번호입니다',
      invalid: '❌ 유효하지 않은 전화번호입니다',
      phoneType: '전화번호 유형',
      formattedNumber: '정규화된 번호',
      errors: '오류 목록:',
      suggestion: '제안 형식:',
      applySuggestion: '적용하기',
      usageTitle: '사용 방법',
      supportedCountries: '지원 국가',
      countries: {
        KR: '대한민국',
        US: '미국',
        CN: '중국',
        JP: '일본'
      },
      formats: {
        title: '지원 형식',
        KR: [
          '010-1234-5678 (휴대폰)',
          '02-1234-5678 (지역번호)',
          '01012345678 (하이픈 없음)',
          '1588-1234 (특번)'
        ],
        US: [
          '(555) 123-4567',
          '555-123-4567',
          '5551234567'
        ],
        CN: [
          '13812345678 (휴대폰)',
          '021-12345678 (지역번호)'
        ],
        JP: [
          '090-1234-5678 (휴대폰)',
          '03-1234-5678 (지역번호)'
        ]
      }
    },
    en: {
      title: 'Phone Number Validator',
      phoneLabel: 'Phone Number',
      countryLabel: 'Country',
      placeholder: 'Enter phone number',
      validateButton: 'Validate',
      resultTitle: 'Validation Result',
      valid: '✅ Valid phone number',
      invalid: '❌ Invalid phone number',
      phoneType: 'Phone Type',
      formattedNumber: 'Formatted Number',
      errors: 'Errors:',
      suggestion: 'Suggested format:',
      applySuggestion: 'Apply',
      usageTitle: 'How to Use',
      supportedCountries: 'Supported Countries',
      countries: {
        KR: 'South Korea',
        US: 'United States',
        CN: 'China',
        JP: 'Japan'
      },
      formats: {
        title: 'Supported Formats',
        KR: [
          '010-1234-5678 (Mobile)',
          '02-1234-5678 (Landline)',
          '01012345678 (No hyphens)',
          '1588-1234 (Special)'
        ],
        US: [
          '(555) 123-4567',
          '555-123-4567',
          '5551234567'
        ],
        CN: [
          '13812345678 (Mobile)',
          '021-12345678 (Landline)'
        ],
        JP: [
          '090-1234-5678 (Mobile)',
          '03-1234-5678 (Landline)'
        ]
      }
    }
  }

  const currentContent = content[language]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-7">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {currentContent.title}
          </h2>

          {/* Country Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.countryLabel}
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(currentContent.countries).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Phone Number Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.phoneLabel}
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={currentContent.placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleValidation}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {currentContent.validateButton}
          </button>

          {/* Supported Formats */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">
              {currentContent.formats.title} ({currentContent.countries[country as keyof typeof currentContent.countries]})
            </h4>
            <ul className="space-y-1">
              {(currentContent.formats[country as keyof typeof currentContent.formats] as string[]).map((format, index) => (
                <li key={index} className="text-sm text-gray-600 font-mono">
                  • {format}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Result Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {currentContent.resultTitle}
          </h3>

          {validationResult ? (
            <div className="space-y-4">
              {/* Validation Status */}
              <div className={`p-4 rounded-lg ${
                validationResult.isValid 
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <div className="font-medium">
                  {validationResult.isValid ? currentContent.valid : currentContent.invalid}
                </div>
                {validationResult.isValid && validationResult.type && (
                  <div className="text-sm mt-2">
                    <strong>{currentContent.phoneType}:</strong> {validationResult.type}
                  </div>
                )}
                {validationResult.isValid && validationResult.formatted && (
                  <div className="text-sm mt-1">
                    <strong>{currentContent.formattedNumber}:</strong> 
                    <code className="ml-2 px-2 py-1 bg-white rounded text-green-900">
                      {validationResult.formatted}
                    </code>
                  </div>
                )}
              </div>

              {/* Errors */}
              {!validationResult.isValid && validationResult.errors.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="font-medium text-red-800 mb-2">{currentContent.errors}</div>
                  <ul className="space-y-1">
                    {validationResult.errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {validationResult.suggestions && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="font-medium text-yellow-800 mb-2">{currentContent.suggestion}</div>
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                      {validationResult.suggestions}
                    </code>
                    <button
                      onClick={applySuggestion}
                      className="ml-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                    >
                      {currentContent.applySuggestion}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <div className="text-4xl mb-4">📞</div>
              <p className="text-gray-500">
                {language === 'ko' 
                  ? '전화번호를 입력하고 검증 버튼을 눌러보세요' 
                  : 'Enter a phone number and click validate'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Usage Guide */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {currentContent.usageTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(currentContent.countries).map(([code, name]) => (
            <div key={code} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🏁 {name}</h4>
              <ul className="space-y-1">
                {(currentContent.formats[code as keyof typeof currentContent.formats] as string[]).slice(0, 2).map((format, index) => (
                  <li key={index} className="text-xs text-gray-600 font-mono">
                    {format}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}