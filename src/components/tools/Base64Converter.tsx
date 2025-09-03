'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function Base64Converter() {
  const { language } = useLanguage()
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleEncode = useCallback(() => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)))
      setOutput(encoded)
      setError('')
    } catch (err) {
      setError(language === 'ko' ? '인코딩 중 오류가 발생했습니다.' : 'An error occurred during encoding.')
      setOutput('')
    }
  }, [input, language])

  const handleDecode = useCallback(() => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)))
      setOutput(decoded)
      setError('')
    } catch (err) {
      setError(language === 'ko' ? '올바르지 않은 Base64 형식입니다.' : 'Invalid Base64 format.')
      setOutput('')
    }
  }, [input, language])

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setError(language === 'ko' ? '텍스트를 입력해주세요.' : 'Please enter text.')
      return
    }

    if (mode === 'encode') {
      handleEncode()
    } else {
      handleDecode()
    }
  }, [input, mode, handleEncode, handleDecode, language])

  const copyToClipboard = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output).then(() => {
        alert(language === 'ko' ? '결과가 클립보드에 복사되었습니다!' : 'Result copied to clipboard!')
      })
    }
  }, [output, language])

  const swapContent = useCallback(() => {
    const temp = input
    setInput(output)
    setOutput(temp)
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setError('')
  }, [input, output, mode])

  const clearAll = useCallback(() => {
    setInput('')
    setOutput('')
    setError('')
  }, [])

  const exampleTexts = {
    encode: [
      'Hello, World!',
      '안녕하세요! 반가워요 😊',
      'https://example.com/api?key=value',
      '{ "name": "John", "age": 30 }'
    ],
    decode: [
      'SGVsbG8sIFdvcmxkIQ==',
      '7JWI64WV7ZWY7IS47JqUISCrsLDqsIDsm6Dsmpog8J+Yig==',
      'eyAibmFtZSI6ICJKb2huIiwgImFnZSI6IDMwIH0=',
      'YUdWc2JHOHNJRmR2Y214a0lRPT0='
    ]
  }

  const content = {
    ko: {
      title: 'Base64 인코딩/디코딩',
      encoding: '인코딩',
      decoding: '디코딩',
      originalText: '원본 텍스트',
      base64Text: 'Base64 인코딩된 텍스트',
      clearAll: '전체 지우기',
      encodePlaceholder: '인코딩할 텍스트를 입력하세요...',
      decodePlaceholder: '디코딩할 Base64 텍스트를 입력하세요...',
      examples: '예제:',
      base64Result: 'Base64 인코딩 결과',
      decodeResult: '디코딩 결과',
      swap: '↔️ 바꾸기',
      copy: '복사',
      resultPlaceholder: '변환 결과가 여기에 표시됩니다...',
      inputLength: '입력 길이',
      outputLength: '출력 길이',
      sizeIncrease: '크기 증가',
      encodeButton: '🔐 인코딩',
      decodeButton: '🔓 디코딩',
      whatIsBase64: 'Base64란?',
      base64Description: 'Base64는 8비트 이진 데이터를 ASCII 문자열로 변환하는 인코딩 방식입니다.',
      base64Usage: '주로 이메일, 웹, 데이터베이스 등에서 바이너리 데이터를 텍스트로 전송할 때 사용됩니다.',
      usageExamples: '사용 예시',
      examples1: '• 이미지/파일을 HTML/CSS에 임베딩',
      examples2: '• API 인증 토큰 전송',
      examples3: '• 이메일 첨부파일 인코딩',
      examples4: '• JSON에서 바이너리 데이터 전송',
      examples5: '• URL 안전한 데이터 변환',
      features: '특징',
      feature1: '• 64개의 안전한 ASCII 문자 사용',
      feature2: '• 3바이트 → 4문자로 변환',
      feature3: '• 약 33% 크기 증가',
      feature4: '• 가역적 변환 (완벽한 복원)',
      precautions: '주의사항',
      precaution1: '• 암호화가 아닌 단순 인코딩',
      precaution2: '• 보안 목적으로 사용 금지',
      precaution3: '• UTF-8 텍스트 완전 지원',
      precaution4: '• 이모지, 특수문자 안전 처리'
    },
    en: {
      title: 'Base64 Encoding/Decoding',
      encoding: 'Encoding',
      decoding: 'Decoding',
      originalText: 'Original Text',
      base64Text: 'Base64 Encoded Text',
      clearAll: 'Clear All',
      encodePlaceholder: 'Enter text to encode...',
      decodePlaceholder: 'Enter Base64 text to decode...',
      examples: 'Examples:',
      base64Result: 'Base64 Encoding Result',
      decodeResult: 'Decoding Result',
      swap: '↔️ Swap',
      copy: 'Copy',
      resultPlaceholder: 'Conversion result will be displayed here...',
      inputLength: 'Input Length',
      outputLength: 'Output Length',
      sizeIncrease: 'Size Increase',
      encodeButton: '🔐 Encode',
      decodeButton: '🔓 Decode',
      whatIsBase64: 'What is Base64?',
      base64Description: 'Base64 is an encoding scheme that converts 8-bit binary data into ASCII strings.',
      base64Usage: 'It is primarily used for transmitting binary data as text in email, web, and database systems.',
      usageExamples: 'Usage Examples',
      examples1: '• Embedding images/files in HTML/CSS',
      examples2: '• Transmitting API authentication tokens',
      examples3: '• Encoding email attachments',
      examples4: '• Transmitting binary data in JSON',
      examples5: '• URL-safe data conversion',
      features: 'Features',
      feature1: '• Uses 64 safe ASCII characters',
      feature2: '• Converts 3 bytes → 4 characters',
      feature3: '• Approximately 33% size increase',
      feature4: '• Reversible conversion (perfect restoration)',
      precautions: 'Precautions',
      precaution1: '• Simple encoding, not encryption',
      precaution2: '• Do not use for security purposes',
      precaution3: '• Full UTF-8 text support',
      precaution4: '• Safe handling of emojis and special characters'
    }
  }

  const currentContent = content[language]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-7">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {currentContent.title}
        </h2>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('encode')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                mode === 'encode'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {currentContent.encoding}
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                mode === 'decode'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {currentContent.decoding}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {mode === 'encode' ? currentContent.originalText : currentContent.base64Text}
              </label>
              <button
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                {currentContent.clearAll}
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'encode'
                  ? currentContent.encodePlaceholder
                  : currentContent.decodePlaceholder
              }
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            />

            {/* Example Buttons */}
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-2">{currentContent.examples}</p>
              <div className="flex flex-wrap gap-2">
                {exampleTexts[mode].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(example)}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors truncate max-w-32"
                  >
                    {example.length > 15 ? example.substring(0, 15) + '...' : example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {mode === 'encode' ? currentContent.base64Result : currentContent.decodeResult}
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={swapContent}
                  disabled={!output}
                  className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                >
                  {currentContent.swap}
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!output}
                  className="text-sm text-green-600 hover:text-green-700 disabled:text-gray-400"
                >
                  {currentContent.copy}
                </button>
              </div>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder={currentContent.resultPlaceholder}
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
            />

            {/* Error Message */}
            {error && (
              <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                {error}
              </p>
            )}

            {/* Output Info */}
            {output && (
              <div className="mt-3 text-xs text-gray-600 space-y-1">
                <p>• {currentContent.inputLength}: {input.length.toLocaleString()}{language === 'ko' ? '자' : ' chars'}</p>
                <p>• {currentContent.outputLength}: {output.length.toLocaleString()}{language === 'ko' ? '자' : ' chars'}</p>
                {mode === 'encode' && (
                  <p>• {currentContent.sizeIncrease}: {Math.round((output.length / input.length - 1) * 100)}%</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Convert Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleConvert}
            disabled={!input.trim()}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {mode === 'encode' ? currentContent.encodeButton : currentContent.decodeButton}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentContent.whatIsBase64}
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                {currentContent.base64Description}
              </p>
              <p>
                {currentContent.base64Usage}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentContent.usageExamples}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{currentContent.examples1}</p>
              <p>{currentContent.examples2}</p>
              <p>{currentContent.examples3}</p>
              <p>{currentContent.examples4}</p>
              <p>{currentContent.examples5}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentContent.features}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{currentContent.feature1}</p>
              <p>{currentContent.feature2}</p>
              <p>{currentContent.feature3}</p>
              <p>{currentContent.feature4}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentContent.precautions}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{currentContent.precaution1}</p>
              <p>{currentContent.precaution2}</p>
              <p>{currentContent.precaution3}</p>
              <p>{currentContent.precaution4}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}