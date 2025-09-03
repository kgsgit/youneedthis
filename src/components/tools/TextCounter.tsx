'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function TextCounter() {
  const { language } = useLanguage()
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    if (!text) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTime: 0
      }
    }

    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    
    // 단어 수 계산 (공백으로 구분, 빈 문자열 제외)
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    
    // 문장 수 계산 (., !, ? 기준)
    const sentences = text ? text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length : 0
    
    // 단락 수 계산 (연속된 줄바꿈으로 구분)
    const paragraphs = text ? text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0).length : 0
    
    // 줄 수 계산
    const lines = text ? text.split('\n').length : 0
    
    // 읽기 시간 계산 (분당 200단어 기준)
    const readingTime = Math.ceil(words / 200)

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime
    }
  }, [text])

  const clearText = () => {
    setText('')
  }

  const content = {
    ko: {
      title: '글자수 세기',
      placeholder: '텍스트를 입력하세요...\n\n이 도구는 글자수, 단어수, 문장수, 단락수 등을 실시간으로 계산합니다.\n\n학교 과제, 블로그 글, SNS 게시물 등 다양한 용도로 활용하세요.',
      clearButton: '지우기',
      statsTitle: '텍스트 통계',
      stats: {
        characters: '총 글자수',
        charactersNoSpaces: '공백 제외 글자수',
        words: '단어수',
        sentences: '문장수',
        paragraphs: '단락수',
        lines: '줄 수',
        readingTime: '예상 읽기 시간'
      },
      minute: '분',
      usageTitle: '사용 방법',
      features: {
        title: '주요 기능',
        items: [
          '실시간 글자수 계산',
          '공백 포함/제외 글자수',
          '단어, 문장, 단락 수 계산',
          '예상 읽기 시간 계산'
        ]
      },
      useCases: {
        title: '활용 분야',
        items: [
          '학교 과제 및 리포트',
          '블로그 및 콘텐츠 작성',
          'SNS 게시물 (트위터 등)',
          '이메일 및 문서 작성'
        ]
      }
    },
    en: {
      title: 'Text Counter',
      placeholder: 'Enter your text here...\n\nThis tool calculates characters, words, sentences, paragraphs in real-time.\n\nUse it for school assignments, blog posts, social media posts, and more.',
      clearButton: 'Clear',
      statsTitle: 'Text Statistics',
      stats: {
        characters: 'Total Characters',
        charactersNoSpaces: 'Characters (no spaces)',
        words: 'Words',
        sentences: 'Sentences',
        paragraphs: 'Paragraphs',
        lines: 'Lines',
        readingTime: 'Estimated Reading Time'
      },
      minute: 'min',
      usageTitle: 'How to Use',
      features: {
        title: 'Key Features',
        items: [
          'Real-time character counting',
          'Characters with/without spaces',
          'Word, sentence, paragraph counting',
          'Estimated reading time calculation'
        ]
      },
      useCases: {
        title: 'Use Cases',
        items: [
          'School assignments & reports',
          'Blog & content writing',
          'Social media posts (Twitter, etc.)',
          'Email & document writing'
        ]
      }
    }
  }

  const currentContent = content[language]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-7">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentContent.title}
            </h2>
            {text && (
              <button
                onClick={clearText}
                className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {currentContent.clearButton}
              </button>
            )}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={currentContent.placeholder}
            className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Statistics Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {currentContent.statsTitle}
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.characters.toLocaleString()}</div>
                <div className="text-sm text-blue-700">{currentContent.stats.characters}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.charactersNoSpaces.toLocaleString()}</div>
                <div className="text-sm text-green-700">{currentContent.stats.charactersNoSpaces}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.words.toLocaleString()}</div>
                <div className="text-sm text-purple-700">{currentContent.stats.words}</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.sentences.toLocaleString()}</div>
                <div className="text-sm text-orange-700">{currentContent.stats.sentences}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.paragraphs.toLocaleString()}</div>
                <div className="text-sm text-red-700">{currentContent.stats.paragraphs}</div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{stats.lines.toLocaleString()}</div>
                <div className="text-sm text-indigo-700">{currentContent.stats.lines}</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {stats.readingTime} {currentContent.minute}
              </div>
              <div className="text-sm text-gray-700">{currentContent.stats.readingTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Guide */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {currentContent.usageTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              ✨ {currentContent.features.title}
            </h4>
            <ul className="space-y-2">
              {currentContent.features.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              💼 {currentContent.useCases.title}
            </h4>
            <ul className="space-y-2">
              {currentContent.useCases.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}