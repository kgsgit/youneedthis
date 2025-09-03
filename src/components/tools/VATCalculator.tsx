'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function VATCalculator() {
  const { language } = useLanguage()
  const [amount, setAmount] = useState('')
  const [calculationType, setCalculationType] = useState<'add-vat' | 'remove-vat' | 'vat-only'>('add-vat')
  const [vatRate, setVatRate] = useState(10) // 한국 부가세율 10%
  const [result, setResult] = useState<{
    originalAmount: number
    vatAmount: number
    totalAmount: number
  } | null>(null)

  const calculateVAT = () => {
    const inputAmount = parseFloat(amount)
    if (isNaN(inputAmount) || inputAmount <= 0) {
      setResult(null)
      return
    }

    let originalAmount: number
    let vatAmount: number
    let totalAmount: number

    switch (calculationType) {
      case 'add-vat':
        // 부가세 추가: 원가에 부가세를 더함
        originalAmount = inputAmount
        vatAmount = Math.round(inputAmount * (vatRate / 100))
        totalAmount = originalAmount + vatAmount
        break

      case 'remove-vat':
        // 부가세 제거: 총액에서 부가세를 빼서 원가 계산
        totalAmount = inputAmount
        originalAmount = Math.round(inputAmount / (1 + vatRate / 100))
        vatAmount = totalAmount - originalAmount
        break

      case 'vat-only':
        // 부가세만 계산: 원가에 대한 부가세액만 계산
        originalAmount = inputAmount
        vatAmount = Math.round(inputAmount * (vatRate / 100))
        totalAmount = originalAmount + vatAmount
        break
    }

    setResult({
      originalAmount,
      vatAmount,
      totalAmount
    })
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ko-KR').format(value)
  }

  const content = {
    ko: {
      title: '부가세 계산기',
      amountLabel: '금액',
      placeholder: '금액을 입력하세요',
      calculationTypeLabel: '계산 방식',
      vatRateLabel: '부가세율 (%)',
      calculateButton: '계산하기',
      resultTitle: '계산 결과',
      originalAmount: '공급가액',
      vatAmount: '부가세액',
      totalAmount: '총액',
      won: '원',
      types: {
        'add-vat': '부가세 추가 (공급가액 → 총액)',
        'remove-vat': '부가세 제거 (총액 → 공급가액)',
        'vat-only': '부가세만 계산'
      },
      usageTitle: '사용 방법',
      aboutTitle: '부가세란?',
      aboutDesc: '부가가치세(VAT)는 상품이나 서비스의 판매 시 부과되는 세금입니다. 한국의 표준 부가세율은 10%입니다.',
      examples: {
        title: '계산 예시',
        items: [
          { type: 'add-vat', input: '100,000원', output: '공급가액: 100,000원 + 부가세: 10,000원 = 총액: 110,000원' },
          { type: 'remove-vat', input: '110,000원', output: '총액: 110,000원 → 공급가액: 100,000원 + 부가세: 10,000원' },
          { type: 'vat-only', input: '100,000원', output: '부가세액: 10,000원' }
        ]
      },
      steps: [
        {
          title: '💰 금액 입력',
          desc: '계산하고 싶은 금액을 입력하세요.'
        },
        {
          title: '🔧 계산 방식 선택',
          desc: '부가세 추가/제거/만 계산 중에서 원하는 방식을 선택하세요.'
        },
        {
          title: '📊 세율 확인',
          desc: '부가세율을 확인하세요. 한국은 기본 10%입니다.'
        },
        {
          title: '🧮 결과 확인',
          desc: '공급가액, 부가세액, 총액을 확인하세요.'
        }
      ]
    },
    en: {
      title: 'VAT Calculator',
      amountLabel: 'Amount',
      placeholder: 'Enter amount',
      calculationTypeLabel: 'Calculation Type',
      vatRateLabel: 'VAT Rate (%)',
      calculateButton: 'Calculate',
      resultTitle: 'Calculation Result',
      originalAmount: 'Net Amount',
      vatAmount: 'VAT Amount',
      totalAmount: 'Total Amount',
      won: 'KRW',
      types: {
        'add-vat': 'Add VAT (Net → Total)',
        'remove-vat': 'Remove VAT (Total → Net)',
        'vat-only': 'VAT Amount Only'
      },
      usageTitle: 'How to Use',
      aboutTitle: 'What is VAT?',
      aboutDesc: 'Value Added Tax (VAT) is a tax imposed on the sale of goods or services. The standard VAT rate in Korea is 10%.',
      examples: {
        title: 'Calculation Examples',
        items: [
          { type: 'add-vat', input: '100,000 KRW', output: 'Net: 100,000 + VAT: 10,000 = Total: 110,000 KRW' },
          { type: 'remove-vat', input: '110,000 KRW', output: 'Total: 110,000 → Net: 100,000 + VAT: 10,000 KRW' },
          { type: 'vat-only', input: '100,000 KRW', output: 'VAT Amount: 10,000 KRW' }
        ]
      },
      steps: [
        {
          title: '💰 Enter Amount',
          desc: 'Enter the amount you want to calculate.'
        },
        {
          title: '🔧 Select Type',
          desc: 'Choose from add VAT, remove VAT, or VAT amount only.'
        },
        {
          title: '📊 Check Rate',
          desc: 'Verify the VAT rate. Korea uses 10% as standard.'
        },
        {
          title: '🧮 View Results',
          desc: 'Check the net amount, VAT amount, and total amount.'
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

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.amountLabel}
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={currentContent.placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                {currentContent.won}
              </span>
            </div>
          </div>

          {/* Calculation Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.calculationTypeLabel}
            </label>
            <select
              value={calculationType}
              onChange={(e) => setCalculationType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(currentContent.types).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* VAT Rate */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.vatRateLabel}
            </label>
            <div className="relative">
              <input
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(Math.max(0, parseFloat(e.target.value) || 0))}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateVAT}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {currentContent.calculateButton}
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

          {/* Result Display */}
          <div className="mb-8">
            {result ? (
              <div className="space-y-4">
                {/* Original Amount */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-700 mb-1">
                    {currentContent.originalAmount}
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(result.originalAmount)} {currentContent.won}
                  </div>
                </div>

                {/* VAT Amount */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-green-700 mb-1">
                    {currentContent.vatAmount} ({vatRate}%)
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {formatCurrency(result.vatAmount)} {currentContent.won}
                  </div>
                </div>

                {/* Total Amount */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {currentContent.totalAmount}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(result.totalAmount)} {currentContent.won}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <div className="text-4xl mb-4">💰</div>
                <p className="text-gray-500">
                  {language === 'ko' 
                    ? '금액을 입력하고 계산 버튼을 눌러보세요' 
                    : 'Enter an amount and click calculate'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Examples */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">{currentContent.examples.title}</h4>
            <div className="space-y-3 text-xs">
              {currentContent.examples.items.map((example, index) => (
                <div key={index} className="p-2 bg-white rounded border">
                  <div className="font-medium text-gray-700 mb-1">
                    {currentContent.types[example.type as keyof typeof currentContent.types]}
                  </div>
                  <div className="text-gray-600">
                    {example.input} → {example.output}
                  </div>
                </div>
              ))}
            </div>
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