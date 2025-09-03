'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CopyButton } from '@/components/ui/CopyButton'

export function LoremGenerator() {
  const { language } = useLanguage()
  const [generatedText, setGeneratedText] = useState('')
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs')
  const [count, setCount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)

  // Lorem ipsum 단어들
  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo',
    'nemo', 'ipsam', 'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut',
    'odit', 'fugit', 'sed', 'quia', 'consequuntur', 'magni', 'dolores', 'ratione',
    'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem', 'ipsum',
    'voluptatem', 'numquam', 'eius', 'modi', 'tempora', 'incidunt', 'magnam',
    'aliquam', 'quaerat', 'voluptatem', 'harum', 'quidem', 'rerum', 'facilis'
  ]

  const getRandomWords = (wordCount: number): string[] => {
    const words: string[] = []
    for (let i = 0; i < wordCount; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)])
    }
    return words
  }

  const generateSentence = (wordCount: number = Math.floor(Math.random() * 10) + 5): string => {
    const words = getRandomWords(wordCount)
    const sentence = words.join(' ')
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
  }

  const generateParagraph = (sentenceCount: number = Math.floor(Math.random() * 4) + 3): string => {
    const sentences: string[] = []
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence())
    }
    return sentences.join(' ')
  }

  const generateText = () => {
    let result = ''

    switch (type) {
      case 'words':
        const words = getRandomWords(count)
        if (startWithLorem && words.length > 0) {
          words[0] = 'Lorem'
        }
        result = words.join(' ')
        break

      case 'sentences':
        const sentences: string[] = []
        for (let i = 0; i < count; i++) {
          let sentence = generateSentence()
          if (i === 0 && startWithLorem) {
            sentence = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
          }
          sentences.push(sentence)
        }
        result = sentences.join(' ')
        break

      case 'paragraphs':
        const paragraphs: string[] = []
        for (let i = 0; i < count; i++) {
          let paragraph = generateParagraph()
          if (i === 0 && startWithLorem) {
            paragraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + paragraph.substring(paragraph.indexOf('.') + 2)
          }
          paragraphs.push(paragraph)
        }
        result = paragraphs.join('\n\n')
        break
    }

    setGeneratedText(result)
  }

  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const getCharacterCount = (text: string): number => {
    return text.length
  }

  const content = {
    ko: {
      title: 'Lorem Ipsum 생성기',
      typeLabel: '생성 타입',
      types: {
        words: '단어',
        sentences: '문장',
        paragraphs: '단락'
      },
      countLabel: '개수',
      startWithLoremLabel: '"Lorem ipsum"으로 시작',
      generateButton: '텍스트 생성',
      resultTitle: '생성된 텍스트',
      placeholder: '생성된 Lorem Ipsum 텍스트가 여기에 표시됩니다',
      statsTitle: '텍스트 통계',
      words: '단어',
      characters: '글자',
      usageTitle: '사용 방법',
      aboutTitle: 'Lorem Ipsum이란?',
      aboutDesc: 'Lorem Ipsum은 인쇄 및 타이프세팅 업계에서 사용되는 더미 텍스트입니다. 웹 디자인, 출판, 그래픽 디자인에서 실제 콘텐츠 대신 레이아웃을 확인하는 용도로 사용됩니다.',
      steps: [
        {
          title: '📝 타입 선택',
          desc: '생성할 텍스트 타입(단어, 문장, 단락)을 선택하세요.'
        },
        {
          title: '📊 개수 설정',
          desc: '생성할 개수를 설정하세요 (1-100개).'
        },
        {
          title: '⚡ 옵션 설정',
          desc: '"Lorem ipsum"으로 시작할지 선택하세요.'
        },
        {
          title: '🎯 생성 및 활용',
          desc: '생성 버튼을 클릭하고 디자인 작업에 활용하세요.'
        }
      ]
    },
    en: {
      title: 'Lorem Ipsum Generator',
      typeLabel: 'Generation Type',
      types: {
        words: 'Words',
        sentences: 'Sentences',
        paragraphs: 'Paragraphs'
      },
      countLabel: 'Count',
      startWithLoremLabel: 'Start with "Lorem ipsum"',
      generateButton: 'Generate Text',
      resultTitle: 'Generated Text',
      placeholder: 'Generated Lorem Ipsum text will appear here',
      statsTitle: 'Text Statistics',
      words: 'Words',
      characters: 'Characters',
      usageTitle: 'How to Use',
      aboutTitle: 'What is Lorem Ipsum?',
      aboutDesc: 'Lorem Ipsum is dummy text used in the printing and typesetting industry. It\'s used in web design, publishing, and graphic design to check layouts instead of actual content.',
      steps: [
        {
          title: '📝 Select Type',
          desc: 'Choose the text type to generate (words, sentences, paragraphs).'
        },
        {
          title: '📊 Set Count',
          desc: 'Set the number to generate (1-100).'
        },
        {
          title: '⚡ Configure Options',
          desc: 'Choose whether to start with "Lorem ipsum".'
        },
        {
          title: '🎯 Generate & Use',
          desc: 'Click generate and use it in your design work.'
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

          {/* Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.typeLabel}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'words' | 'sentences' | 'paragraphs')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="words">{currentContent.types.words}</option>
              <option value="sentences">{currentContent.types.sentences}</option>
              <option value="paragraphs">{currentContent.types.paragraphs}</option>
            </select>
          </div>

          {/* Count Setting */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.countLabel}
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Start with Lorem Option */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{currentContent.startWithLoremLabel}</span>
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateText}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {currentContent.generateButton}
          </button>

          {/* About Lorem Ipsum */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">{currentContent.aboutTitle}</h4>
            <p className="text-sm text-blue-700">{currentContent.aboutDesc}</p>
          </div>
        </div>

        {/* Result Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentContent.resultTitle}
            </h3>
            {generatedText && <CopyButton text={generatedText} />}
          </div>

          {/* Text Display */}
          <div className="flex-1 mb-4">
            {generatedText ? (
              <div className="p-4 bg-gray-50 rounded-lg border max-h-96 overflow-y-auto">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {generatedText}
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center min-h-64">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>{currentContent.placeholder}</p>
                </div>
              </div>
            )}
          </div>

          {/* Text Statistics */}
          {generatedText && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{getWordCount(generatedText)}</div>
                <div className="text-sm text-gray-600">{currentContent.words}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{getCharacterCount(generatedText)}</div>
                <div className="text-sm text-gray-600">{currentContent.characters}</div>
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