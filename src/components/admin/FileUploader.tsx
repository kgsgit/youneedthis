'use client'

import { useState } from 'react'

interface FileUploaderProps {
  onFileSelect: (filename: string) => void
  currentFile?: string
  siteId: string
}

export function FileUploader({ onFileSelect, currentFile, siteId }: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    const filename = `${siteId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    setUploading(true)
    
    // 실제 업로드 대신 localStorage에 base64로 저장 (개발용)
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      localStorage.setItem(`thumbnail_${filename}`, base64)
      onFileSelect(filename)
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        사이트 썸네일 이미지
      </label>
      
      {currentFile && (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white">
            <img 
              src={localStorage.getItem(`thumbnail_${currentFile}`) || `/images/thumbnails/${currentFile}`}
              alt="Current thumbnail"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder.jpg'
              }}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">현재 파일: {currentFile}</p>
            <button
              onClick={() => {
                localStorage.removeItem(`thumbnail_${currentFile}`)
                onFileSelect('')
              }}
              className="text-xs text-red-600 hover:text-red-800"
            >
              삭제
            </button>
          </div>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors relative pointer-events-auto ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleDrop(e)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragOver(false)
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {uploading ? (
          <div className="py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">업로드 중...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="mb-2 text-sm text-gray-600">
              <span className="font-semibold">클릭하여 업로드</span> 또는 파일을 드래그하세요
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP (최대 5MB)</p>
            <label className="absolute inset-0 w-full h-full cursor-pointer z-10">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                onClick={(e) => e.stopPropagation()}
                className="sr-only"
              />
            </label>
          </>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        💡 팁: 가로 4:3 비율의 이미지가 가장 잘 표시됩니다 (예: 800x600px)
      </p>
    </div>
  )
}