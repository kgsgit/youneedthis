'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function MarkdownLinkGenerator() {
  const { language } = useLanguage()
  const [url, setUrl] = useState('')
  const [customTitle, setCustomTitle] = useState('')
  const [extractedTitle, setExtractedTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [outputFormat, setOutputFormat] = useState<'markdown' | 'html' | 'both'>('markdown')
  const [useCustomTitle, setUseCustomTitle] = useState(false)

  const content = {
    ko: {
      title: '마크다운 링크 생성기',
      description: 'URL을 마크다운 링크 형식으로 변환합니다',
      urlLabel: 'URL 입력',
      urlPlaceholder: 'https://example.com',
      customTitleLabel: '커스텀 제목 (선택사항)',
      customTitlePlaceholder: '링크 제목을 직접 입력하세요',
      useCustomTitleLabel: '커스텀 제목 사용',
      extractTitleBtn: '제목 추출',
      formatLabel: '출력 형식',
      markdownFormat: '마크다운',
      htmlFormat: 'HTML',
      bothFormat: '둘 다',
      extractedTitleLabel: '추출된 제목',
      resultLabel: '결과',
      copyBtn: '복사',
      copiedBtn: '복사됨!',
      invalidUrl: '유효한 URL을 입력해주세요',
      extractionError: '제목을 추출할 수 없습니다',
      corsError: 'CORS 정책으로 인해 일부 사이트의 제목을 가져올 수 없습니다',
      exampleUrls: '예시 URL',
      examples: [
        'https://github.com',
        'https://stackoverflow.com',
        'https://developer.mozilla.org'
      ]
    },
    en: {
      title: 'Markdown Link Generator',
      description: 'Convert URLs to Markdown link format',
      urlLabel: 'Enter URL',
      urlPlaceholder: 'https://example.com',
      customTitleLabel: 'Custom Title (Optional)',
      customTitlePlaceholder: 'Enter custom link title',
      useCustomTitleLabel: 'Use Custom Title',
      extractTitleBtn: 'Extract Title',
      formatLabel: 'Output Format',
      markdownFormat: 'Markdown',
      htmlFormat: 'HTML',
      bothFormat: 'Both',
      extractedTitleLabel: 'Extracted Title',
      resultLabel: 'Result',
      copyBtn: 'Copy',
      copiedBtn: 'Copied!',
      invalidUrl: 'Please enter a valid URL',
      extractionError: 'Cannot extract title',
      corsError: 'Cannot fetch title from some sites due to CORS policy',
      exampleUrls: 'Example URLs',
      examples: [
        'https://github.com',
        'https://stackoverflow.com',
        'https://developer.mozilla.org'
      ]
    }
  }

  const currentContent = content[language]

  // URL 유효성 검사
  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // 제목 추출 함수
  const extractTitle = async () => {
    if (!url || !isValidUrl(url)) {
      alert(currentContent.invalidUrl)
      return
    }

    setIsLoading(true)
    try {
      // CORS 우회를 위한 프록시 서비스 사용 (무료 서비스들)
      const proxyUrls = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
      ]

      let title = ''
      for (const proxyUrl of proxyUrls) {
        try {
          const response = await fetch(proxyUrl)
          const data = await response.json()
          const html = data.contents || data
          
          // HTML에서 title 태그 추출
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
          if (titleMatch) {
            title = titleMatch[1].trim()
            break
          }
        } catch (error) {
          continue // 다음 프록시 시도
        }
      }

      if (title) {
        // HTML 엔티티 디코딩
        const textarea = document.createElement('textarea')
        textarea.innerHTML = title
        setExtractedTitle(textarea.value)
      } else {
        // 프록시로도 실패한 경우, URL에서 도메인 추출
        const urlObj = new URL(url)
        const domain = urlObj.hostname.replace('www.', '')
        setExtractedTitle(domain)
        alert(currentContent.corsError)
      }
    } catch (error) {
      // 최후의 수단: URL의 도메인 이름 사용
      try {
        const urlObj = new URL(url)
        const domain = urlObj.hostname.replace('www.', '')
        setExtractedTitle(domain)
      } catch {
        alert(currentContent.extractionError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 결과 생성
  const generateResult = () => {
    if (!url || !isValidUrl(url)) return ''

    const title = useCustomTitle ? customTitle : extractedTitle || url
    
    switch (outputFormat) {
      case 'markdown':
        return `[${title}](${url})`
      case 'html':
        return `<a href="${url}">${title}</a>`
      case 'both':
        return `Markdown: [${title}](${url})\n\nHTML: <a href="${url}">${title}</a>`
      default:
        return `[${title}](${url})`
    }
  }

  // 클립보드에 복사
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // 복사 완료 피드백 (간단한 상태 변경)
      const btn = document.getElementById('copy-btn')
      if (btn) {
        const originalText = btn.textContent
        btn.textContent = currentContent.copiedBtn
        setTimeout(() => {
          btn.textContent = originalText
        }, 2000)
      }
    } catch (error) {
      // 폴백: 텍스트 선택
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  }

  const result = generateResult()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {currentContent.title}
        </h1>
        <p className="text-lg text-gray-600">
          {currentContent.description}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {/* URL 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentContent.urlLabel}
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={currentContent.urlPlaceholder}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={extractTitle}
              disabled={!url || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? '...' : currentContent.extractTitleBtn}
            </button>
          </div>
        </div>

        {/* 예시 URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentContent.exampleUrls}
          </label>
          <div className="flex flex-wrap gap-2">
            {currentContent.examples.map((exampleUrl, index) => (
              <button
                key={index}
                onClick={() => setUrl(exampleUrl)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                {exampleUrl}
              </button>
            ))}
          </div>
        </div>

        {/* 커스텀 제목 옵션 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              id="useCustomTitle"
              checked={useCustomTitle}
              onChange={(e) => setUseCustomTitle(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="useCustomTitle" className="text-sm font-medium text-gray-700">
              {currentContent.useCustomTitleLabel}
            </label>
          </div>
          
          {useCustomTitle && (
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder={currentContent.customTitlePlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>

        {/* 추출된 제목 표시 */}
        {extractedTitle && !useCustomTitle && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.extractedTitleLabel}
            </label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-800">{extractedTitle}</p>
            </div>
          </div>
        )}

        {/* 출력 형식 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentContent.formatLabel}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="markdown"
                checked={outputFormat === 'markdown'}
                onChange={(e) => setOutputFormat(e.target.value as 'markdown')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{currentContent.markdownFormat}</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="html"
                checked={outputFormat === 'html'}
                onChange={(e) => setOutputFormat(e.target.value as 'html')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{currentContent.htmlFormat}</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="both"
                checked={outputFormat === 'both'}
                onChange={(e) => setOutputFormat(e.target.value as 'both')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{currentContent.bothFormat}</span>
            </label>
          </div>
        </div>

        {/* 결과 출력 */}
        {result && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {currentContent.resultLabel}
              </label>
              <button
                id="copy-btn"
                onClick={() => copyToClipboard(result)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                {currentContent.copyBtn}
              </button>
            </div>
            <textarea
              value={result}
              readOnly
              rows={outputFormat === 'both' ? 4 : 2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm"
            />
          </div>
        )}
      </div>

      {/* 사용법 안내 */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {language === 'ko' ? '사용법' : 'How to Use'}
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• {language === 'ko' ? 'URL을 입력하고 "제목 추출" 버튼을 클릭하세요' : 'Enter a URL and click "Extract Title" button'}</li>
          <li>• {language === 'ko' ? '원하는 경우 커스텀 제목을 직접 입력할 수 있습니다' : 'You can enter a custom title if desired'}</li>
          <li>• {language === 'ko' ? '마크다운, HTML, 또는 두 형식 모두를 선택하세요' : 'Choose Markdown, HTML, or both formats'}</li>
          <li>• {language === 'ko' ? '생성된 링크를 복사하여 블로그, README, 문서에 사용하세요' : 'Copy the generated link for use in blogs, README, or documents'}</li>
        </ul>
      </div>
    </div>
  )
}