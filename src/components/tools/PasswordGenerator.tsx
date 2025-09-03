'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CopyButton } from '@/components/ui/CopyButton'

export function PasswordGenerator() {
  const { language } = useLanguage()
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(12)
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
    exclude: ''
  })

  const generatePassword = () => {
    let charset = ''
    
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (options.numbers) charset += '0123456789'
    if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    // 제외할 문자 제거
    if (options.exclude) {
      options.exclude.split('').forEach(char => {
        charset = charset.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
      })
    }

    if (!charset) return

    let result = ''
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    
    setPassword(result)
  }

  const getPasswordStrength = (pwd: string) => {
    let score = 0
    
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    
    if (score <= 2) return { level: 'weak', color: 'red' }
    if (score <= 4) return { level: 'medium', color: 'yellow' }
    return { level: 'strong', color: 'green' }
  }

  const strength = password ? getPasswordStrength(password) : null

  const content = {
    ko: {
      title: '비밀번호 생성기',
      lengthLabel: '비밀번호 길이',
      optionsTitle: '생성 옵션',
      lowercase: '소문자 (a-z)',
      uppercase: '대문자 (A-Z)',
      numbers: '숫자 (0-9)',
      symbols: '특수문자 (!@#$...)',
      excludeLabel: '제외할 문자',
      excludePlaceholder: '제외하고 싶은 문자를 입력하세요',
      generateButton: '비밀번호 생성',
      resultTitle: '생성된 비밀번호',
      placeholder: '생성된 비밀번호가 여기에 표시됩니다',
      strengthTitle: '보안 강도',
      strength: {
        weak: '약함',
        medium: '보통',
        strong: '강함'
      },
      usageTitle: '사용 방법',
      steps: [
        {
          title: '📏 길이 설정',
          desc: '비밀번호 길이를 4~50자 사이에서 선택하세요. 12자 이상을 권장합니다.'
        },
        {
          title: '⚙️ 옵션 선택',
          desc: '사용할 문자 종류를 선택하세요. 다양한 종류를 포함할수록 더 안전합니다.'
        },
        {
          title: '🚫 문자 제외',
          desc: '사용하지 않을 특정 문자가 있다면 제외 옵션에 입력하세요.'
        },
        {
          title: '🔐 생성 및 복사',
          desc: '생성 버튼을 클릭하고 비밀번호를 안전한 곳에 저장하세요.'
        }
      ]
    },
    en: {
      title: 'Password Generator',
      lengthLabel: 'Password Length',
      optionsTitle: 'Generation Options',
      lowercase: 'Lowercase (a-z)',
      uppercase: 'Uppercase (A-Z)',
      numbers: 'Numbers (0-9)',
      symbols: 'Symbols (!@#$...)',
      excludeLabel: 'Exclude Characters',
      excludePlaceholder: 'Enter characters to exclude',
      generateButton: 'Generate Password',
      resultTitle: 'Generated Password',
      placeholder: 'Generated password will appear here',
      strengthTitle: 'Security Strength',
      strength: {
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong'
      },
      usageTitle: 'How to Use',
      steps: [
        {
          title: '📏 Set Length',
          desc: 'Choose password length between 4-50 characters. 12+ characters recommended.'
        },
        {
          title: '⚙️ Select Options',
          desc: 'Choose character types to include. More variety means better security.'
        },
        {
          title: '🚫 Exclude Characters',
          desc: 'If you have specific characters to avoid, enter them in the exclude option.'
        },
        {
          title: '🔐 Generate & Copy',
          desc: 'Click generate and save your password in a secure location.'
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

          {/* Length Setting */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.lengthLabel}: {length}
            </label>
            <input
              type="range"
              min="4"
              max="50"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>50</span>
            </div>
          </div>

          {/* Options */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {currentContent.optionsTitle}
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={(e) => setOptions({...options, lowercase: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{currentContent.lowercase}</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={(e) => setOptions({...options, uppercase: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{currentContent.uppercase}</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={(e) => setOptions({...options, numbers: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{currentContent.numbers}</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={(e) => setOptions({...options, symbols: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{currentContent.symbols}</span>
              </label>
            </div>
          </div>

          {/* Exclude Characters */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.excludeLabel}
            </label>
            <input
              type="text"
              value={options.exclude}
              onChange={(e) => setOptions({...options, exclude: e.target.value})}
              placeholder={currentContent.excludePlaceholder}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePassword}
            disabled={!options.lowercase && !options.uppercase && !options.numbers && !options.symbols}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {currentContent.generateButton}
          </button>
        </div>

        {/* Result Section */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {currentContent.resultTitle}
          </h3>

          {/* Password Display */}
          <div className="mb-6">
            {password ? (
              <div className="relative">
                <div className="p-4 bg-gray-50 rounded-lg border font-mono text-lg break-all">
                  {password}
                </div>
                <div className="absolute top-2 right-2">
                  <CopyButton text={password} />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-center text-gray-500">
                <div className="text-4xl mb-2">🔐</div>
                <p>{currentContent.placeholder}</p>
              </div>
            )}
          </div>

          {/* Password Strength */}
          {strength && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {currentContent.strengthTitle}
                </span>
                <span className={`text-sm font-medium text-${strength.color}-600`}>
                  {currentContent.strength[strength.level]}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-${strength.color}-500 h-2 rounded-full transition-all`}
                  style={{
                    width: strength.level === 'weak' ? '33%' : 
                           strength.level === 'medium' ? '66%' : '100%'
                  }}
                ></div>
              </div>
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