'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ColorValues {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  hsv: { h: number; s: number; v: number }
}

export function ColorConverter() {
  const { language } = useLanguage()
  const [color, setColor] = useState<ColorValues>({
    hex: '#3B82F6',
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    hsv: { h: 217, s: 76, v: 96 }
  })

  // HEX to RGB 변환
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // RGB to HEX 변환
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  // RGB to HSL 변환
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max === min) {
      h = s = 0 // 무채색
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  // RGB to HSV 변환
  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const v = max

    const d = max - min
    s = max === 0 ? 0 : d / max

    if (max === min) {
      h = 0 // 무채색
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    }
  }

  // HEX 입력 처리
  const handleHexChange = (hex: string) => {
    if (!hex.startsWith('#')) hex = '#' + hex
    const rgb = hexToRgb(hex)
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
      setColor({ hex, rgb, hsl, hsv })
    }
  }

  // RGB 입력 처리
  const handleRgbChange = (r: number, g: number, b: number) => {
    const hex = rgbToHex(r, g, b)
    const hsl = rgbToHsl(r, g, b)
    const hsv = rgbToHsv(r, g, b)
    setColor({ hex, rgb: { r, g, b }, hsl, hsv })
  }

  // 색상 복사
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(language === 'ko' ? `${type} 값이 클립보드에 복사되었습니다!` : `${type} value copied to clipboard!`)
    })
  }

  // 랜덤 색상 생성
  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    handleHexChange(randomHex)
  }

  const content = {
    ko: {
      title: '색상 변환기',
      randomColor: '🎲 랜덤 색상',
      inputTitle: '색상 입력',
      colorPicker: '색상 선택기',
      hexCode: 'HEX 코드',
      rgbValues: 'RGB 값',
      resultTitle: '변환 결과',
      copy: '복사',
      colorPalette: '색상 팔레트',
      usageTitle: '사용법 및 특징',
      usageItems: [
        { title: '🎨 다양한 형식 지원', desc: 'HEX, RGB, HSL, HSV 형식 간 자동 변환을 지원합니다.' },
        { title: '🎯 실시간 미리보기', desc: '입력하는 즉시 색상이 실시간으로 미리보기됩니다.' },
        { title: '📋 원클릭 복사', desc: '각 형식별로 클립보드에 바로 복사할 수 있습니다.' },
        { title: '🎲 랜덤 생성', desc: '영감이 필요할 때 랜덤 색상을 생성할 수 있습니다.' }
      ]
    },
    en: {
      title: 'Color Converter',
      randomColor: '🎲 Random Color',
      inputTitle: 'Color Input',
      colorPicker: 'Color Picker',
      hexCode: 'HEX Code',
      rgbValues: 'RGB Values',
      resultTitle: 'Conversion Result',
      copy: 'Copy',
      colorPalette: 'Color Palette',
      usageTitle: 'How to Use & Features',
      usageItems: [
        { title: '🎨 Multiple Format Support', desc: 'Supports automatic conversion between HEX, RGB, HSL, and HSV formats.' },
        { title: '🎯 Real-time Preview', desc: 'Color is previewed in real-time as you input values.' },
        { title: '📋 One-click Copy', desc: 'Copy each format directly to clipboard with one click.' },
        { title: '🎲 Random Generation', desc: 'Generate random colors when you need inspiration.' }
      ]
    }
  }

  const currentContent = content[language]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-7">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {currentContent.title}
        </h2>

        {/* Color Preview */}
        <div className="mb-8">
          <div className="flex flex-col items-center">
            <div 
              className="w-32 h-32 rounded-xl border-4 border-white shadow-lg mb-4"
              style={{ backgroundColor: color.hex }}
            />
            <button
              onClick={generateRandomColor}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {currentContent.randomColor}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentContent.inputTitle}
            </h3>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.colorPicker}
              </label>
              <input
                type="color"
                value={color.hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
            </div>

            {/* HEX Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.hexCode}
              </label>
              <input
                type="text"
                value={color.hex}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#3B82F6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>

            {/* RGB Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.rgbValues}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={color.rgb.r}
                  onChange={(e) => handleRgbChange(parseInt(e.target.value) || 0, color.rgb.g, color.rgb.b)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="R"
                />
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={color.rgb.g}
                  onChange={(e) => handleRgbChange(color.rgb.r, parseInt(e.target.value) || 0, color.rgb.b)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="G"
                />
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={color.rgb.b}
                  onChange={(e) => handleRgbChange(color.rgb.r, color.rgb.g, parseInt(e.target.value) || 0)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="B"
                />
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentContent.resultTitle}
            </h3>

            {/* HEX */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">HEX</h4>
                <button
                  onClick={() => copyToClipboard(color.hex, 'HEX')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {currentContent.copy}
                </button>
              </div>
              <p className="font-mono text-lg">{color.hex}</p>
            </div>

            {/* RGB */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">RGB</h4>
                <button
                  onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, 'RGB')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {currentContent.copy}
                </button>
              </div>
              <p className="font-mono text-lg">rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})</p>
            </div>

            {/* HSL */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">HSL</h4>
                <button
                  onClick={() => copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, 'HSL')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {currentContent.copy}
                </button>
              </div>
              <p className="font-mono text-lg">hsl({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)</p>
            </div>

            {/* HSV */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">HSV</h4>
                <button
                  onClick={() => copyToClipboard(`hsv(${color.hsv.h}, ${color.hsv.s}%, ${color.hsv.v}%)`, 'HSV')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {currentContent.copy}
                </button>
              </div>
              <p className="font-mono text-lg">hsv({color.hsv.h}, {color.hsv.s}%, {color.hsv.v}%)</p>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentContent.colorPalette}
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity, index) => (
              <div key={index} className="text-center">
                <div 
                  className="h-16 rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${opacity})` }}
                  onClick={() => copyToClipboard(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${opacity})`, 'RGBA')}
                />
                <p className="text-xs text-gray-600 mt-1">{Math.round(opacity * 100)}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Guide */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentContent.usageTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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