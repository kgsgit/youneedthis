'use client'

import { useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface CopyButtonProps {
  text: string
  label?: string
}

export function CopyButton({ text, label }: CopyButtonProps) {
  const { language } = useLanguage()
  
  const messages = {
    ko: {
      success: '클립보드에 복사되었습니다!',
      error: '복사에 실패했습니다.',
      copy: '복사'
    },
    en: {
      success: 'Copied to clipboard!',
      error: 'Failed to copy.',
      copy: 'Copy'
    }
  }
  
  const currentMessages = messages[language]
  
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      alert(currentMessages.success)
    } catch (error) {
      console.error('Copy failed:', error)
      alert(currentMessages.error)
    }
  }, [text, currentMessages])

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition-colors"
    >
      📋 {label || currentMessages.copy}
    </button>
  )
}