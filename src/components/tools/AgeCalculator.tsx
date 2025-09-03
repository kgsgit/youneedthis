'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface AgeResult {
  years: number
  months: number
  days: number
  totalDays: number
  nextBirthday: {
    date: string
    daysUntil: number
  }
}

export function AgeCalculator() {
  const { language } = useLanguage()
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<AgeResult | null>(null)

  const calculateAge = () => {
    if (!birthDate) return

    const birth = new Date(birthDate)
    const today = new Date()
    
    if (birth > today) {
      alert(language === 'ko' ? '생년월일이 미래 날짜입니다.' : 'Birth date cannot be in the future.')
      return
    }

    // 나이 계산
    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    let days = today.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += lastMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    // 총 일수 계산
    const timeDiff = today.getTime() - birth.getTime()
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24))

    // 다음 생일 계산
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1)
    }
    
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 3600 * 24))

    setResult({
      years,
      months,
      days,
      totalDays,
      nextBirthday: {
        date: nextBirthday.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US'),
        daysUntil: daysUntilBirthday
      }
    })
  }

  const reset = () => {
    setBirthDate('')
    setResult(null)
  }

  const content = {
    ko: {
      title: '정확한 나이 계산기',
      birthDateLabel: '생년월일',
      calculateButton: '나이 계산하기',
      recalculateButton: '다시 계산',
      resultTitle: '계산 결과',
      years: '년',
      months: '개월',
      days: '일',
      totalDaysTitle: '총 살아온 날',
      totalDaysValue: (days: number) => `${days.toLocaleString()}일`,
      nextBirthdayTitle: '다음 생일',
      daysRemaining: (days: number) => `${days}일 남음`,
      funFactsTitle: '재미있는 사실',
      funFacts: {
        hours: (hours: number) => `• 당신은 약 ${hours.toLocaleString()}시간을 살았습니다`,
        minutes: (minutes: number) => `• 당신은 약 ${minutes.toLocaleString()}분을 살았습니다`,
        heartbeats: (beats: number) => `• 당신의 심장은 약 ${beats.toLocaleString()}번 뛰었습니다`
      },
      usageTitle: '사용법 및 특징',
      usageItems: [
        { title: '📱 간편한 사용', desc: '생년월일만 입력하면 정확한 나이를 계산합니다.' },
        { title: '📊 상세한 정보', desc: '년, 월, 일 단위로 구분하여 정확한 나이를 표시합니다.' },
        { title: '🎂 생일 알림', desc: '다음 생일까지 남은 날짜를 계산해 알려드립니다.' },
        { title: '🎯 재미있는 통계', desc: '살아온 총 일수와 재미있는 생체 통계를 제공합니다.' }
      ]
    },
    en: {
      title: 'Precise Age Calculator',
      birthDateLabel: 'Birth Date',
      calculateButton: 'Calculate Age',
      recalculateButton: 'Recalculate',
      resultTitle: 'Calculation Result',
      years: 'Years',
      months: 'Months',
      days: 'Days',
      totalDaysTitle: 'Total Days Lived',
      totalDaysValue: (days: number) => `${days.toLocaleString()} days`,
      nextBirthdayTitle: 'Next Birthday',
      daysRemaining: (days: number) => `${days} days remaining`,
      funFactsTitle: 'Fun Facts',
      funFacts: {
        hours: (hours: number) => `• You have lived approximately ${hours.toLocaleString()} hours`,
        minutes: (minutes: number) => `• You have lived approximately ${minutes.toLocaleString()} minutes`,
        heartbeats: (beats: number) => `• Your heart has beaten approximately ${beats.toLocaleString()} times`
      },
      usageTitle: 'How to Use & Features',
      usageItems: [
        { title: '📱 Easy to Use', desc: 'Just enter your birth date to calculate your precise age.' },
        { title: '📊 Detailed Information', desc: 'Shows accurate age broken down by years, months, and days.' },
        { title: '🎂 Birthday Reminder', desc: 'Calculates and shows days remaining until your next birthday.' },
        { title: '🎯 Fun Statistics', desc: 'Provides total days lived and interesting biological statistics.' }
      ]
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentContent.birthDateLabel}
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            placeholder={language === 'ko' ? '연도-월-일' : 'YYYY-MM-DD'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 mb-8">
          <button
            onClick={calculateAge}
            disabled={!birthDate}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {currentContent.calculateButton}
          </button>
          {result && (
            <button
              onClick={reset}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {currentContent.recalculateButton}
            </button>
          )}
        </div>

        {/* Result Section */}
        {result && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              {currentContent.resultTitle}
            </h3>

            {/* Main Age Display */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {result.years}
                </div>
                <div className="text-sm text-gray-600">{currentContent.years}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {result.months}
                </div>
                <div className="text-sm text-gray-600">{currentContent.months}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {result.days}
                </div>
                <div className="text-sm text-gray-600">{currentContent.days}</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">📅</span>
                  <h4 className="font-medium text-gray-900">{currentContent.totalDaysTitle}</h4>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {currentContent.totalDaysValue(result.totalDays)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">🎂</span>
                  <h4 className="font-medium text-gray-900">{currentContent.nextBirthdayTitle}</h4>
                </div>
                <p className="text-lg font-semibold text-purple-600">
                  {result.nextBirthday.date}
                </p>
                <p className="text-sm text-gray-600">
                  {currentContent.daysRemaining(result.nextBirthday.daysUntil)}
                </p>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <span className="text-xl mr-2">🎯</span>
                {currentContent.funFactsTitle}
              </h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>{currentContent.funFacts.hours(Math.floor(result.totalDays * 24))}</p>
                <p>{currentContent.funFacts.minutes(Math.floor(result.totalDays * 24 * 60))}</p>
                <p>{currentContent.funFacts.heartbeats(Math.floor(result.totalDays * 24 * 60 * 70))}</p>
              </div>
            </div>
          </div>
        )}

        {/* Usage Guide */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentContent.usageTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentContent.usageItems.map((item, index) => (
              <div key={index}>
                <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}