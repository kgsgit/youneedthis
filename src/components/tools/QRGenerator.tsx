'use client'

import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'
import { useLanguage } from '@/contexts/LanguageContext'

export function QRGenerator() {
  const { language } = useLanguage()
  const [text, setText] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [size, setSize] = useState(256)
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [])

  const generateQR = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      const canvas = canvasRef.current
      if (!canvas) {
        throw new Error('Canvas element not found')
      }
      
      await QRCode.toCanvas(canvas, text, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      const dataUrl = canvas.toDataURL('image/png')
      setQrCodeUrl(dataUrl)
    } catch (error) {
      console.error('QR 코드 생성 실패:', error)
      alert(language === 'ko' ? 'QR 코드 생성에 실패했습니다.' : 'Failed to generate QR code.')
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrCodeUrl) return

    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.png`
    link.href = qrCodeUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyToClipboard = async () => {
    if (!qrCodeUrl) return

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      alert(language === 'ko' ? 'QR 코드가 클립보드에 복사되었습니다!' : 'QR code copied to clipboard!')
    } catch (error) {
      console.error('클립보드 복사 실패:', error)
      alert(language === 'ko' ? '클립보드 복사에 실패했습니다.' : 'Failed to copy to clipboard.')
    }
  }

  const content = {
    ko: {
      title: 'QR 코드 생성',
      inputLabel: '텍스트 또는 URL',
      placeholder: 'QR 코드로 변환할 텍스트나 URL을 입력하세요',
      sizeLabel: '크기 (px)',
      errorLevelLabel: '오류 정정 수준',
      errorLevels: {
        L: '낮음 (L)',
        M: '보통 (M)', 
        Q: '높음 (Q)',
        H: '최고 (H)'
      },
      generateButton: 'QR 코드 생성',
      generating: 'QR 코드 생성 중...',
      resultTitle: '생성된 QR 코드',
      placeholder2: 'QR 코드가 여기에 생성됩니다',
      downloadButton: '다운로드',
      copyButton: '복사',
      usageTitle: '사용 방법',
      steps: [
        {
          title: '📝 텍스트 입력',
          desc: 'QR 코드로 변환하고 싶은 텍스트나 URL을 입력창에 작성하세요.'
        },
        {
          title: '⚙️ 옵션 설정',
          desc: 'QR 코드의 크기와 오류 정정 수준을 선택하세요.'
        },
        {
          title: '🎯 생성 및 다운로드',
          desc: '생성 버튼을 클릭하고 완성된 QR 코드를 다운로드하세요.'
        },
        {
          title: '📱 스캔 테스트',
          desc: '스마트폰의 카메라나 QR 스캐너로 코드를 테스트해보세요.'
        }
      ]
    },
    en: {
      title: 'Generate QR Code',
      inputLabel: 'Text or URL',
      placeholder: 'Enter text or URL to convert to QR code',
      sizeLabel: 'Size (px)',
      errorLevelLabel: 'Error Correction Level',
      errorLevels: {
        L: 'Low (L)',
        M: 'Medium (M)',
        Q: 'High (Q)', 
        H: 'Highest (H)'
      },
      generateButton: 'Generate QR Code',
      generating: 'Generating QR Code...',
      resultTitle: 'Generated QR Code',
      placeholder2: 'QR code will be generated here',
      downloadButton: 'Download',
      copyButton: 'Copy',
      usageTitle: 'How to Use',
      steps: [
        {
          title: '📝 Text Input',
          desc: 'Enter the text or URL you want to convert to a QR code.'
        },
        {
          title: '⚙️ Option Settings',
          desc: 'Select the size and error correction level for your QR code.'
        },
        {
          title: '🎯 Generate & Download',
          desc: 'Click the generate button and download your completed QR code.'
        },
        {
          title: '📱 Scan Test',
          desc: 'Test the code with your smartphone camera or QR scanner.'
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

          {/* Text Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.inputLabel}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={currentContent.placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.sizeLabel}
              </label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={128}>128x128</option>
                <option value={256}>256x256</option>
                <option value={384}>384x384</option>
                <option value={512}>512x512</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.errorLevelLabel}
              </label>
              <select
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="L">{currentContent.errorLevels.L}</option>
                <option value="M">{currentContent.errorLevels.M}</option>
                <option value="Q">{currentContent.errorLevels.Q}</option>
                <option value="H">{currentContent.errorLevels.H}</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateQR}
            disabled={!text.trim() || loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? currentContent.generating : currentContent.generateButton}
          </button>
        </div>

        {/* Result Section */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {currentContent.resultTitle}
          </h3>

          {/* QR Code Display */}
          <div className="mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <canvas
                ref={canvasRef}
                width={256}
                height={256}
                className="border border-gray-200 rounded mx-auto"
                style={{ display: qrCodeUrl ? 'block' : 'none' }}
              />
              {!qrCodeUrl && (
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mx-auto">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">
                      <i className="bi-qr-code"></i>
                    </div>
                    <p>{currentContent.placeholder2}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {qrCodeUrl && (
            <div className="flex space-x-3">
              <button
                onClick={downloadQR}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {currentContent.downloadButton}
              </button>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {currentContent.copyButton}
              </button>
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