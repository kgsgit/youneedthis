'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ValidationResult {
  isValid: boolean
  message: string
  details?: {
    number: string
    checkDigit: number
    calculatedCheckDigit: number
  }
}

export function BusinessValidator() {
  const { language } = useLanguage()
  const [businessNumber, setBusinessNumber] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)

  // 사업자등록번호 유효성 검사 알고리즘
  const validateBusinessNumber = (number: string): ValidationResult => {
    // 숫자만 추출
    const digits = number.replace(/\D/g, '')
    
    // 길이 검사
    if (digits.length !== 10) {
      return {
        isValid: false,
        message: language === 'ko' ? '사업자등록번호는 10자리 숫자여야 합니다.' : 'Business registration number must be 10 digits.'
      }
    }

    // 체크섬 계산
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]
    let sum = 0
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits[i]) * weights[i]
    }
    
    // 8번째 자리수에 5를 곱한 몫을 더함
    sum += Math.floor((parseInt(digits[8]) * 5) / 10)
    
    // 체크 디지트 계산
    const calculatedCheckDigit = (10 - (sum % 10)) % 10
    const actualCheckDigit = parseInt(digits[9])
    
    const isValid = calculatedCheckDigit === actualCheckDigit
    
    return {
      isValid,
      message: isValid 
        ? (language === 'ko' ? '✅ 유효한 사업자등록번호입니다.' : '✅ Valid business registration number.')
        : (language === 'ko' ? '❌ 유효하지 않은 사업자등록번호입니다.' : '❌ Invalid business registration number.'),
      details: {
        number: digits,
        checkDigit: actualCheckDigit,
        calculatedCheckDigit
      }
    }
  }

  const handleValidate = () => {
    if (!businessNumber.trim()) {
      setResult({
        isValid: false,
        message: language === 'ko' ? '사업자등록번호를 입력해주세요.' : 'Please enter a business registration number.'
      })
      return
    }

    const validationResult = validateBusinessNumber(businessNumber)
    setResult(validationResult)
  }

  const formatBusinessNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBusinessNumber(e.target.value)
    setBusinessNumber(formatted)
    setResult(null)
  }

  const exampleNumbers = [
    '101-81-40150', // 삼성전자
    '214-81-96276', // 네이버
    '120-81-84429', // 카카오
    '123-45-67890'  // 잘못된 번호 예시
  ]

  const insertExample = (number: string) => {
    setBusinessNumber(number)
    setResult(null)
  }

  const reset = () => {
    setBusinessNumber('')
    setResult(null)
  }

  const content = {
    ko: {
      title: '사업자등록번호 검증기',
      businessNumber: '사업자등록번호',
      clear: '지우기',
      placeholder: '000-00-00000',
      inputHelp: '하이픈(-) 포함하여 입력하거나 숫자만 입력하세요',
      examples: '예시 번호 (테스트용):',
      validateButton: '검증하기',
      resultTitle: '검증 결과',
      enteredNumber: '입력된 번호:',
      checkDigit: '체크 디지트:',
      calculatedCheckDigit: '계산된 체크 디지트:',
      whatIs: '사업자등록번호란?',
      whatIsDesc1: '사업자등록번호는 사업을 하는 개인이나 법인에게 부여되는 고유한 10자리 번호입니다.',
      whatIsDesc2: '형식:',
      validationMethod: '검증 방법',
      method1: '• 10자리 숫자로 구성되어 있는지 확인',
      method2: '• 체크섬 알고리즘을 통해 유효성 검사',
      method3: '• 마지막 자리는 체크 디지트로 사용',
      method4: '• 국세청에서 정한 규칙에 따라 계산',
      precautions: '주의사항',
      warning: '⚠️ 이 도구는 번호 형식만 검증합니다.',
      precaution1: '• 실제 사업자 존재 여부는 확인하지 않습니다',
      precaution2: '• 정확한 정보는 국세청 홈텍스에서 확인하세요',
      precaution3: '• 개인정보 보호를 위해 데이터는 저장되지 않습니다',
      useCases: '활용 용도',
      useCase1: '• 거래처 정보 입력 시 형식 검증',
      useCase2: '• 세금계산서 발행 전 번호 확인',
      useCase3: '• 계약서 작성 시 사업자번호 검증',
      useCase4: '• 전자상거래 판매자 정보 확인'
    },
    en: {
      title: 'Business Registration Number Validator',
      businessNumber: 'Business Registration Number',
      clear: 'Clear',
      placeholder: '000-00-00000',
      inputHelp: 'Enter with hyphens (-) or numbers only',
      examples: 'Example Numbers (For Testing):',
      validateButton: 'Validate',
      resultTitle: 'Validation Result',
      enteredNumber: 'Entered Number:',
      checkDigit: 'Check Digit:',
      calculatedCheckDigit: 'Calculated Check Digit:',
      whatIs: 'What is a Business Registration Number?',
      whatIsDesc1: 'A business registration number is a unique 10-digit number assigned to individuals or corporations conducting business.',
      whatIsDesc2: 'Format:',
      validationMethod: 'Validation Method',
      method1: '• Check if it consists of 10 digits',
      method2: '• Validate using checksum algorithm',
      method3: '• Last digit is used as check digit',
      method4: '• Calculated according to rules set by the National Tax Service',
      precautions: 'Precautions',
      warning: '⚠️ This tool only validates the number format.',
      precaution1: '• Does not verify actual business existence',
      precaution2: '• For accurate information, check the National Tax Service Hometax',
      precaution3: '• Data is not stored to protect personal information',
      useCases: 'Use Cases',
      useCase1: '• Format validation when entering business partner information',
      useCase2: '• Number verification before issuing tax invoices',
      useCase3: '• Business number validation when drafting contracts',
      useCase4: '• Verifying e-commerce seller information'
    }
  }

  const currentContent = content[language]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-7">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {currentContent.title}
        </h2>

        {/* Input Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              {currentContent.businessNumber}
            </label>
            <button
              onClick={reset}
              className="text-sm text-gray-500 hover:text-red-600"
            >
              {currentContent.clear}
            </button>
          </div>
          
          <input
            type="text"
            value={businessNumber}
            onChange={handleInputChange}
            placeholder={currentContent.placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono text-center"
            maxLength={12}
          />
          
          <p className="mt-2 text-sm text-gray-600 text-center">
            {currentContent.inputHelp}
          </p>
        </div>

        {/* Example Numbers */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-3">{currentContent.examples}</p>
          <div className="grid grid-cols-2 gap-2">
            {exampleNumbers.map((number, index) => (
              <button
                key={index}
                onClick={() => insertExample(number)}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-mono"
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        {/* Validate Button */}
        <div className="mb-8">
          <button
            onClick={handleValidate}
            disabled={!businessNumber.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {currentContent.validateButton}
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div className={`rounded-xl p-6 mb-8 ${
            result.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <h3 className="text-lg font-semibold mb-4">{currentContent.resultTitle}</h3>
            
            <div className="space-y-3">
              <p className={`text-lg font-medium ${
                result.isValid ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message}
              </p>

              {result.details && (
                <div className="text-sm space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{currentContent.enteredNumber}</span>
                      <span className="font-mono">{result.details.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{currentContent.checkDigit}</span>
                      <span className="font-mono">{result.details.checkDigit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{currentContent.calculatedCheckDigit}</span>
                      <span className="font-mono">{result.details.calculatedCheckDigit}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {currentContent.whatIs}
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                {currentContent.whatIsDesc1}
              </p>
              <p>
                {currentContent.whatIsDesc2} <span className="font-mono bg-gray-100 px-1 rounded">{currentContent.placeholder}</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {currentContent.validationMethod}
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>{currentContent.method1}</p>
              <p>{currentContent.method2}</p>
              <p>{currentContent.method3}</p>
              <p>{currentContent.method4}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {currentContent.precautions}
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p className="text-red-600">
                {currentContent.warning}
              </p>
              <p>{currentContent.precaution1}</p>
              <p>{currentContent.precaution2}</p>
              <p>{currentContent.precaution3}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {currentContent.useCases}
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>{currentContent.useCase1}</p>
              <p>{currentContent.useCase2}</p>
              <p>{currentContent.useCase3}</p>
              <p>{currentContent.useCase4}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}