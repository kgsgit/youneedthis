'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function EmailValidator() {
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    errors: string[]
    suggestions?: string
  } | null>(null)

  const validateEmail = (emailToValidate: string) => {
    const errors: string[] = []
    let isValid = true
    let suggestions = ''

    if (!emailToValidate.trim()) {
      errors.push(language === 'ko' ? '이메일을 입력하세요.' : 'Please enter an email address.')
      isValid = false
      return { isValid, errors, suggestions }
    }

    // 기본 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailToValidate)) {
      errors.push(language === 'ko' ? '올바른 이메일 형식이 아닙니다.' : 'Invalid email format.')
      isValid = false
    }

    // 세부 검증
    const parts = emailToValidate.split('@')
    
    if (parts.length !== 2) {
      errors.push(language === 'ko' ? '@가 없거나 여러 개입니다.' : 'Missing or multiple @ symbols.')
      isValid = false
    } else {
      const [localPart, domainPart] = parts

      // 로컬 부분 검증
      if (!localPart) {
        errors.push(language === 'ko' ? '@ 앞에 사용자명이 없습니다.' : 'Missing username before @.')
        isValid = false
      } else {
        if (localPart.length > 64) {
          errors.push(language === 'ko' ? '사용자명이 너무 깁니다. (최대 64자)' : 'Username is too long (max 64 characters).')
          isValid = false
        }
        if (localPart.startsWith('.') || localPart.endsWith('.')) {
          errors.push(language === 'ko' ? '사용자명은 점(.)으로 시작하거나 끝날 수 없습니다.' : 'Username cannot start or end with a dot.')
          isValid = false
        }
        if (localPart.includes('..')) {
          errors.push(language === 'ko' ? '사용자명에 연속된 점(..)이 있습니다.' : 'Username contains consecutive dots.')
          isValid = false
        }
      }

      // 도메인 부분 검증
      if (!domainPart) {
        errors.push(language === 'ko' ? '@ 뒤에 도메인이 없습니다.' : 'Missing domain after @.')
        isValid = false
      } else {
        if (domainPart.length > 253) {
          errors.push(language === 'ko' ? '도메인이 너무 깁니다. (최대 253자)' : 'Domain is too long (max 253 characters).')
          isValid = false
        }
        if (!domainPart.includes('.')) {
          errors.push(language === 'ko' ? '도메인에 점(.)이 없습니다.' : 'Domain must contain at least one dot.')
          isValid = false
        }
        if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
          errors.push(language === 'ko' ? '도메인은 점(.)으로 시작하거나 끝날 수 없습니다.' : 'Domain cannot start or end with a dot.')
          isValid = false
        }

        // 일반적인 도메인 오타 검사 및 제안
        const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'naver.com', 'daum.net', 'hanmail.net']
        const domainLower = domainPart.toLowerCase()
        
        if (!commonDomains.includes(domainLower)) {
          // 유사한 도메인 찾기
          for (const commonDomain of commonDomains) {
            if (levenshteinDistance(domainLower, commonDomain) <= 2) {
              suggestions = language === 'ko' 
                ? `혹시 "${commonDomain}"을(를) 의도하셨나요?`
                : `Did you mean "${commonDomain}"?`
              break
            }
          }
        }
      }
    }

    // 허용되지 않는 문자 검사
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailToValidate)) {
      if (isValid) { // 다른 오류가 없을 때만 추가
        errors.push(language === 'ko' ? '허용되지 않는 문자가 포함되어 있습니다.' : 'Contains invalid characters.')
        isValid = false
      }
    }

    return { isValid, errors, suggestions }
  }

  // 레벤슈타인 거리 계산 (문자열 유사도)
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = []
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    return matrix[str2.length][str1.length]
  }

  const handleValidation = () => {
    const result = validateEmail(email)
    setValidationResult(result)
  }

  const handleInputChange = (value: string) => {
    setEmail(value)
    if (validationResult) {
      // 실시간 검증
      const result = validateEmail(value)
      setValidationResult(result)
    }
  }

  const applySuggestion = (suggestion: string) => {
    const parts = email.split('@')
    if (parts.length === 2) {
      const newEmail = `${parts[0]}@${suggestion}`
      setEmail(newEmail)
      const result = validateEmail(newEmail)
      setValidationResult(result)
    }
  }

  const content = {
    ko: {
      title: '이메일 검증기',
      inputLabel: '이메일 주소',
      placeholder: 'example@domain.com',
      validateButton: '검증하기',
      resultTitle: '검증 결과',
      valid: '✅ 유효한 이메일입니다',
      invalid: '❌ 유효하지 않은 이메일입니다',
      errors: '오류 목록:',
      suggestion: '제안:',
      applySuggestion: '적용하기',
      usageTitle: '사용 방법',
      aboutTitle: '이메일 검증이란?',
      aboutDesc: '이메일 주소가 올바른 형식을 따르는지 확인하는 과정입니다. 회원가입, 연락처 수집 등에서 중요합니다.',
      features: {
        title: '검증 항목',
        items: [
          '기본 이메일 형식 (예: user@domain.com)',
          '사용자명 길이 및 특수문자 검사',
          '도메인 형식 및 길이 검사',
          '일반적인 도메인 오타 검사'
        ]
      },
      tips: {
        title: '검증 팁',
        items: [
          '@ 기호는 반드시 하나만 있어야 합니다',
          '점(.)으로 시작하거나 끝날 수 없습니다',
          '연속된 점(..)은 허용되지 않습니다',
          '허용된 문자만 사용해야 합니다'
        ]
      }
    },
    en: {
      title: 'Email Validator',
      inputLabel: 'Email Address',
      placeholder: 'example@domain.com',
      validateButton: 'Validate',
      resultTitle: 'Validation Result',
      valid: '✅ Valid email address',
      invalid: '❌ Invalid email address',
      errors: 'Errors:',
      suggestion: 'Suggestion:',
      applySuggestion: 'Apply',
      usageTitle: 'How to Use',
      aboutTitle: 'What is Email Validation?',
      aboutDesc: 'The process of checking whether an email address follows the correct format. Important for user registration, contact collection, etc.',
      features: {
        title: 'Validation Items',
        items: [
          'Basic email format (e.g., user@domain.com)',
          'Username length and special character check',
          'Domain format and length check',
          'Common domain typo check'
        ]
      },
      tips: {
        title: 'Validation Tips',
        items: [
          'Must have exactly one @ symbol',
          'Cannot start or end with a dot (.)',
          'Consecutive dots (..) are not allowed',
          'Only allowed characters should be used'
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.inputLabel}
            </label>
            <input
              type="email"
              value={email}
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

          {/* About Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">{currentContent.aboutTitle}</h4>
            <p className="text-sm text-blue-700">{currentContent.aboutDesc}</p>
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
                    <span className="text-sm text-yellow-700">{validationResult.suggestions}</span>
                    {validationResult.suggestions.includes('@') && (
                      <button
                        onClick={() => {
                          const domain = validationResult.suggestions!.match(/"([^"]+)"/)?.[1]
                          if (domain) applySuggestion(domain)
                        }}
                        className="ml-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                      >
                        {currentContent.applySuggestion}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-gray-500">
                {language === 'ko' 
                  ? '이메일을 입력하고 검증 버튼을 눌러보세요' 
                  : 'Enter an email address and click validate'
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              ✅ {currentContent.features.title}
            </h4>
            <ul className="space-y-2">
              {currentContent.features.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              💡 {currentContent.tips.title}
            </h4>
            <ul className="space-y-2">
              {currentContent.tips.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}