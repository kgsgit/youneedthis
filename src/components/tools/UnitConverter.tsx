'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function UnitConverter() {
  const { language } = useLanguage()
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState('')

  // 단위 변환 데이터
  const conversionData = {
    length: {
      name: { ko: '길이', en: 'Length' },
      units: {
        mm: { ko: '밀리미터', en: 'Millimeter', factor: 0.001 },
        cm: { ko: '센티미터', en: 'Centimeter', factor: 0.01 },
        m: { ko: '미터', en: 'Meter', factor: 1 },
        km: { ko: '킬로미터', en: 'Kilometer', factor: 1000 },
        inch: { ko: '인치', en: 'Inch', factor: 0.0254 },
        ft: { ko: '피트', en: 'Foot', factor: 0.3048 },
        yard: { ko: '야드', en: 'Yard', factor: 0.9144 },
        mile: { ko: '마일', en: 'Mile', factor: 1609.344 }
      }
    },
    weight: {
      name: { ko: '무게', en: 'Weight' },
      units: {
        mg: { ko: '밀리그램', en: 'Milligram', factor: 0.001 },
        g: { ko: '그램', en: 'Gram', factor: 1 },
        kg: { ko: '킬로그램', en: 'Kilogram', factor: 1000 },
        lb: { ko: '파운드', en: 'Pound', factor: 453.592 },
        oz: { ko: '온스', en: 'Ounce', factor: 28.3495 },
        ton: { ko: '톤', en: 'Ton', factor: 1000000 }
      }
    },
    temperature: {
      name: { ko: '온도', en: 'Temperature' },
      units: {
        celsius: { ko: '섭씨', en: 'Celsius' },
        fahrenheit: { ko: '화씨', en: 'Fahrenheit' },
        kelvin: { ko: '켈빈', en: 'Kelvin' }
      }
    },
    area: {
      name: { ko: '넓이', en: 'Area' },
      units: {
        sqmm: { ko: '제곱밀리미터', en: 'Square Millimeter', factor: 0.000001 },
        sqcm: { ko: '제곱센티미터', en: 'Square Centimeter', factor: 0.0001 },
        sqm: { ko: '제곱미터', en: 'Square Meter', factor: 1 },
        sqkm: { ko: '제곱킬로미터', en: 'Square Kilometer', factor: 1000000 },
        sqin: { ko: '제곱인치', en: 'Square Inch', factor: 0.00064516 },
        sqft: { ko: '제곱피트', en: 'Square Foot', factor: 0.092903 },
        acre: { ko: '에이커', en: 'Acre', factor: 4046.86 }
      }
    },
    volume: {
      name: { ko: '부피', en: 'Volume' },
      units: {
        ml: { ko: '밀리리터', en: 'Milliliter', factor: 0.001 },
        l: { ko: '리터', en: 'Liter', factor: 1 },
        gal: { ko: '갤런', en: 'Gallon', factor: 3.78541 },
        qt: { ko: '쿼트', en: 'Quart', factor: 0.946353 },
        pt: { ko: '파인트', en: 'Pint', factor: 0.473176 },
        cup: { ko: '컵', en: 'Cup', factor: 0.236588 },
        floz: { ko: '액량온스', en: 'Fluid Ounce', factor: 0.0295735 }
      }
    }
  }

  // 온도 변환 함수
  const convertTemperature = (value: number, from: string, to: string): number => {
    if (from === to) return value

    let celsius: number
    
    // 먼저 섭씨로 변환
    switch (from) {
      case 'celsius':
        celsius = value
        break
      case 'fahrenheit':
        celsius = (value - 32) * 5 / 9
        break
      case 'kelvin':
        celsius = value - 273.15
        break
      default:
        return 0
    }

    // 섭씨에서 목표 단위로 변환
    switch (to) {
      case 'celsius':
        return celsius
      case 'fahrenheit':
        return celsius * 9 / 5 + 32
      case 'kelvin':
        return celsius + 273.15
      default:
        return 0
    }
  }

  // 일반 단위 변환 함수
  const convertUnit = (value: number, fromFactor: number, toFactor: number): number => {
    return (value * fromFactor) / toFactor
  }

  // 변환 실행
  const performConversion = () => {
    const numValue = parseFloat(inputValue)
    if (isNaN(numValue)) {
      setResult('')
      return
    }

    const categoryData = conversionData[category as keyof typeof conversionData]
    
    if (category === 'temperature') {
      const converted = convertTemperature(numValue, fromUnit, toUnit)
      setResult(converted.toFixed(6).replace(/\.?0+$/, ''))
    } else {
      const fromUnitData = categoryData.units[fromUnit as keyof typeof categoryData.units] as any
      const toUnitData = categoryData.units[toUnit as keyof typeof categoryData.units] as any
      
      if (fromUnitData?.factor && toUnitData?.factor) {
        const converted = convertUnit(numValue, fromUnitData.factor, toUnitData.factor)
        setResult(converted.toFixed(6).replace(/\.?0+$/, ''))
      }
    }
  }

  // 카테고리 변경 시 기본 단위 설정
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    const units = Object.keys(conversionData[newCategory as keyof typeof conversionData].units)
    setFromUnit(units[0] || '')
    setToUnit(units[1] || units[0] || '')
    setInputValue('')
    setResult('')
  }

  // 초기 단위 설정
  if (!fromUnit && category) {
    const units = Object.keys(conversionData[category as keyof typeof conversionData].units)
    setFromUnit(units[0] || '')
    setToUnit(units[1] || units[0] || '')
  }

  const currentCategoryData = conversionData[category as keyof typeof conversionData]

  const content = {
    ko: {
      title: '단위 변환기',
      categoryLabel: '변환 종류',
      valueLabel: '변환할 값',
      fromLabel: '원본 단위',
      toLabel: '변환할 단위',
      placeholder: '숫자를 입력하세요',
      convertButton: '변환하기',
      resultTitle: '변환 결과',
      usageTitle: '사용 방법',
      categories: {
        length: '길이',
        weight: '무게',
        temperature: '온도',
        area: '넓이',
        volume: '부피'
      },
      steps: [
        {
          title: '📏 종류 선택',
          desc: '변환하고 싶은 단위의 종류를 선택하세요.'
        },
        {
          title: '🔢 값 입력',
          desc: '변환할 숫자를 입력하세요.'
        },
        {
          title: '⚖️ 단위 선택',
          desc: '원본 단위와 변환할 단위를 선택하세요.'
        },
        {
          title: '🎯 변환 실행',
          desc: '변환 버튼을 클릭하여 결과를 확인하세요.'
        }
      ]
    },
    en: {
      title: 'Unit Converter',
      categoryLabel: 'Conversion Type',
      valueLabel: 'Value to Convert',
      fromLabel: 'From Unit',
      toLabel: 'To Unit',
      placeholder: 'Enter a number',
      convertButton: 'Convert',
      resultTitle: 'Conversion Result',
      usageTitle: 'How to Use',
      categories: {
        length: 'Length',
        weight: 'Weight',
        temperature: 'Temperature',
        area: 'Area',
        volume: 'Volume'
      },
      steps: [
        {
          title: '📏 Select Type',
          desc: 'Choose the type of unit you want to convert.'
        },
        {
          title: '🔢 Enter Value',
          desc: 'Enter the number you want to convert.'
        },
        {
          title: '⚖️ Select Units',
          desc: 'Choose the source unit and target unit.'
        },
        {
          title: '🎯 Convert',
          desc: 'Click the convert button to see the result.'
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

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.categoryLabel}
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(currentContent.categories).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Value Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.valueLabel}
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                if (e.target.value && fromUnit && toUnit) {
                  // 실시간 변환은 일시적으로 비활성화 (성능상)
                }
              }}
              placeholder={currentContent.placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Unit Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.fromLabel}
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(currentCategoryData.units).map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit[language as keyof typeof unit]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.toLabel}
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(currentCategoryData.units).map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit[language as keyof typeof unit]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Convert Button */}
          <button
            onClick={performConversion}
            disabled={!inputValue || !fromUnit || !toUnit}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {currentContent.convertButton}
          </button>
        </div>

        {/* Result Section */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {currentContent.resultTitle}
          </h3>

          {/* Result Display */}
          <div className="flex-1 flex items-center justify-center">
            {result ? (
              <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200 w-full">
                <div className="text-4xl font-bold text-green-600 mb-4">
                  {result}
                </div>
                <div className="text-lg text-green-700">
                  {currentCategoryData.units[toUnit as keyof typeof currentCategoryData.units]?.[language as 'ko' | 'en']}
                </div>
                <div className="text-sm text-green-600 mt-4">
                  {inputValue} {currentCategoryData.units[fromUnit as keyof typeof currentCategoryData.units]?.[language as 'ko' | 'en']} = {result} {currentCategoryData.units[toUnit as keyof typeof currentCategoryData.units]?.[language as 'ko' | 'en']}
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center w-full">
                <div className="text-4xl mb-4">📏</div>
                <p className="text-gray-500">
                  {language === 'ko' 
                    ? '값을 입력하고 변환 버튼을 눌러보세요' 
                    : 'Enter a value and click convert'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Quick Reference */}
          {category && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                {currentCategoryData.name[language as 'ko' | 'en']} {language === 'ko' ? '단위' : 'Units'}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(currentCategoryData.units).slice(0, 6).map(([key, unit]) => (
                  <div key={key} className="text-gray-600">
                    {unit[language as keyof typeof unit]}
                  </div>
                ))}
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