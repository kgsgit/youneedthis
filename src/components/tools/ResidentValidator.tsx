'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function ResidentValidator() {
  const { language } = useLanguage()
  const [residentNumber, setResidentNumber] = useState('')
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    birthDate?: string
    gender?: string
    region?: string
    errors: string[]
  } | null>(null)

  // 주민등록번호 검증 함수
  const validateResidentNumber = (number: string) => {
    const errors: string[] = []
    let isValid = true
    let birthDate = ''
    let gender = ''
    let region = ''

    // 입력값 정리 (하이픈 제거)
    const cleanNumber = number.replace(/-/g, '')

    // 기본 형식 검사
    if (!cleanNumber) {
      errors.push(language === 'ko' ? '주민등록번호를 입력하세요.' : 'Please enter a resident number.')
      return { isValid: false, errors }
    }

    if (!/^\d{13}$/.test(cleanNumber)) {
      errors.push(language === 'ko' ? '주민등록번호는 13자리 숫자여야 합니다.' : 'Resident number must be 13 digits.')
      isValid = false
      return { isValid, errors }
    }

    // 생년월일 검증
    const yearPrefix = cleanNumber.substring(0, 2)
    const month = cleanNumber.substring(2, 4)
    const day = cleanNumber.substring(4, 6)
    const genderCode = cleanNumber.substring(6, 7)

    // 성별 코드로 년도 확인
    let fullYear: number
    if (genderCode === '1' || genderCode === '2') {
      fullYear = 1900 + parseInt(yearPrefix)
    } else if (genderCode === '3' || genderCode === '4') {
      fullYear = 2000 + parseInt(yearPrefix)
    } else if (genderCode === '9' || genderCode === '0') {
      fullYear = 1800 + parseInt(yearPrefix)
    } else {
      errors.push(language === 'ko' ? '올바르지 않은 성별 코드입니다.' : 'Invalid gender code.')
      isValid = false
    }

    // 월 검증
    const monthNum = parseInt(month)
    if (monthNum < 1 || monthNum > 12) {
      errors.push(language === 'ko' ? '올바르지 않은 월입니다.' : 'Invalid month.')
      isValid = false
    }

    // 일 검증
    const dayNum = parseInt(day)
    if (dayNum < 1 || dayNum > 31) {
      errors.push(language === 'ko' ? '올바르지 않은 일입니다.' : 'Invalid day.')
      isValid = false
    }

    // 날짜 유효성 검증 (윤년 고려)
    if (isValid && fullYear!) {
      const date = new Date(fullYear, monthNum - 1, dayNum)
      if (date.getFullYear() !== fullYear || date.getMonth() !== monthNum - 1 || date.getDate() !== dayNum) {
        errors.push(language === 'ko' ? '존재하지 않는 날짜입니다.' : 'Date does not exist.')
        isValid = false
      } else {
        birthDate = `${fullYear}-${month}-${day}`
      }
    }

    // 성별 확인
    if (isValid) {
      if (genderCode === '1' || genderCode === '3' || genderCode === '9') {
        gender = language === 'ko' ? '남성' : 'Male'
      } else if (genderCode === '2' || genderCode === '4' || genderCode === '0') {
        gender = language === 'ko' ? '여성' : 'Female'
      }
    }

    // 지역 코드 확인 (7-8번째 자리)
    if (isValid) {
      const regionCode = cleanNumber.substring(6, 8)
      const regionMap: { [key: string]: { ko: string; en: string } } = {
        '00': { ko: '서울', en: 'Seoul' },
        '01': { ko: '서울', en: 'Seoul' },
        '02': { ko: '서울', en: 'Seoul' },
        '03': { ko: '서울', en: 'Seoul' },
        '04': { ko: '서울', en: 'Seoul' },
        '05': { ko: '서울', en: 'Seoul' },
        '06': { ko: '부산', en: 'Busan' },
        '07': { ko: '부산', en: 'Busan' },
        '08': { ko: '인천', en: 'Incheon' },
        '09': { ko: '인천', en: 'Incheon' },
        '10': { ko: '경기', en: 'Gyeonggi' },
        '11': { ko: '경기', en: 'Gyeonggi' },
        '12': { ko: '경기', en: 'Gyeonggi' },
        '13': { ko: '강원', en: 'Gangwon' },
        '14': { ko: '충북', en: 'Chungbuk' },
        '15': { ko: '충남', en: 'Chungnam' },
        '16': { ko: '전북', en: 'Jeonbuk' },
        '17': { ko: '전남', en: 'Jeonnam' },
        '18': { ko: '경북', en: 'Gyeongbuk' },
        '19': { ko: '경남', en: 'Gyeongnam' },
        '20': { ko: '제주', en: 'Jeju' },
      }
      
      const regionInfo = regionMap[regionCode.substring(1)] || regionMap[regionCode]
      region = regionInfo ? regionInfo[language as 'ko' | 'en'] : (language === 'ko' ? '기타' : 'Other')
    }

    // 체크섬 검증
    if (isValid) {
      const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5]
      let sum = 0
      
      for (let i = 0; i < 12; i++) {
        sum += parseInt(cleanNumber[i]) * weights[i]
      }
      
      const remainder = sum % 11
      const checkDigit = (11 - remainder) % 10
      
      if (parseInt(cleanNumber[12]) !== checkDigit) {
        errors.push(language === 'ko' ? '체크섬이 올바르지 않습니다.' : 'Invalid checksum.')
        isValid = false
      }
    }

    return { isValid, birthDate, gender, region, errors }
  }

  const handleValidation = () => {
    const result = validateResidentNumber(residentNumber)
    setValidationResult(result)
  }

  const handleInputChange = (value: string) => {
    // 자동 하이픈 삽입
    let formatted = value.replace(/\D/g, '')
    if (formatted.length >= 6) {
      formatted = formatted.substring(0, 6) + '-' + formatted.substring(6, 13)
    }
    
    setResidentNumber(formatted)
    
    if (validationResult && formatted.replace(/-/g, '').length === 13) {
      const result = validateResidentNumber(formatted)
      setValidationResult(result)
    }
  }

  const content = {
    ko: {
      title: '주민등록번호 검증기',
      inputLabel: '주민등록번호',
      placeholder: '예: 901201-1234567',
      validateButton: '검증하기',
      resultTitle: '검증 결과',
      valid: '✅ 유효한 주민등록번호입니다',
      invalid: '❌ 유효하지 않은 주민등록번호입니다',
      birthDate: '생년월일',
      gender: '성별',
      region: '출생 지역',
      errors: '오류 목록:',
      usageTitle: '사용 방법',
      aboutTitle: '주민등록번호란?',
      aboutDesc: '대한민국 국민에게 부여되는 13자리 고유 번호입니다. 생년월일, 성별, 출생 지역 정보를 포함합니다.',
      securityNotice: {
        title: '⚠️ 보안 주의사항',
        content: '이 도구는 형식 검증만 수행합니다. 실제 개인정보는 저장되지 않으며, 교육 목적으로만 사용하세요.'
      },
      steps: [
        {
          title: '🔢 번호 입력',
          desc: '검증하고 싶은 주민등록번호를 입력하세요. 하이픈은 자동으로 추가됩니다.'
        },
        {
          title: '✅ 형식 검증',
          desc: '13자리 숫자, 생년월일, 성별 코드 등의 형식을 검증합니다.'
        },
        {
          title: '🧮 체크섬 계산',
          desc: '마지막 자리 체크섬을 계산하여 유효성을 확인합니다.'
        },
        {
          title: '📊 정보 추출',
          desc: '유효한 경우 생년월일, 성별, 출생 지역 정보를 표시합니다.'
        }
      ]
    },
    en: {
      title: 'Korean Resident Number Validator',
      inputLabel: 'Resident Registration Number',
      placeholder: 'e.g., 901201-1234567',
      validateButton: 'Validate',
      resultTitle: 'Validation Result',
      valid: '✅ Valid resident registration number',
      invalid: '❌ Invalid resident registration number',
      birthDate: 'Birth Date',
      gender: 'Gender',
      region: 'Birth Region',
      errors: 'Errors:',
      usageTitle: 'How to Use',
      aboutTitle: 'What is Korean Resident Number?',
      aboutDesc: 'A unique 13-digit number assigned to Korean citizens. It contains birth date, gender, and birth region information.',
      securityNotice: {
        title: '⚠️ Security Notice',
        content: 'This tool only performs format validation. No personal information is stored. Use for educational purposes only.'
      },
      steps: [
        {
          title: '🔢 Enter Number',
          desc: 'Enter the resident registration number to validate. Hyphens are automatically added.'
        },
        {
          title: '✅ Format Validation',
          desc: 'Validates format including 13 digits, birth date, and gender code.'
        },
        {
          title: '🧮 Checksum Calculation',
          desc: 'Calculates and verifies the checksum of the last digit.'
        },
        {
          title: '📊 Extract Information',
          desc: 'If valid, displays birth date, gender, and birth region information.'
        }
      ]
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

          {/* Resident Number Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.inputLabel}
            </label>
            <input
              type="text"
              value={residentNumber}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={currentContent.placeholder}
              maxLength={14}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
          </div>

          {/* Validate Button */}
          <button
            onClick={handleValidation}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {currentContent.validateButton}
          </button>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-900 mb-2">{currentContent.securityNotice.title}</h4>
            <p className="text-sm text-red-700">{currentContent.securityNotice.content}</p>
          </div>

          {/* About Section */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
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

              {/* Extracted Information */}
              {validationResult.isValid && (
                <div className="space-y-3">
                  {validationResult.birthDate && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">{currentContent.birthDate}</div>
                      <div className="text-lg text-gray-900">{validationResult.birthDate}</div>
                    </div>
                  )}
                  
                  {validationResult.gender && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">{currentContent.gender}</div>
                      <div className="text-lg text-gray-900">{validationResult.gender}</div>
                    </div>
                  )}
                  
                  {validationResult.region && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">{currentContent.region}</div>
                      <div className="text-lg text-gray-900">{validationResult.region}</div>
                    </div>
                  )}
                </div>
              )}

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
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <div className="text-4xl mb-4">🆔</div>
              <p className="text-gray-500">
                {language === 'ko' 
                  ? '주민등록번호를 입력하고 검증 버튼을 눌러보세요' 
                  : 'Enter a resident number and click validate'
                }
              </p>
            </div>
          )}
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