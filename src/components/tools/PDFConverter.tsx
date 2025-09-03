'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import jsPDF from 'jspdf'

export function PDFConverter() {
  const { language } = useLanguage()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [conversionType, setConversionType] = useState<'to-pdf' | 'from-pdf' | 'merge' | 'split'>('to-pdf')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }

  const clearFiles = () => {
    setSelectedFiles([])
  }

  const processFiles = async () => {
    if (selectedFiles.length === 0) return
    
    setIsProcessing(true)
    
    try {
      if (conversionType === 'to-pdf') {
        await convertToPDF()
      } else {
        // 다른 변환 유형들은 추후 구현
        alert(language === 'ko' 
          ? '해당 변환 기능은 아직 구현되지 않았습니다. PDF로 변환 기능만 사용 가능합니다.' 
          : 'This conversion type is not implemented yet. Only "Convert to PDF" is available.'
        )
      }
    } catch (error) {
      console.error('PDF 변환 실패:', error)
      alert(language === 'ko' ? 'PDF 변환에 실패했습니다.' : 'PDF conversion failed.')
    } finally {
      setIsProcessing(false)
    }
  }

  const convertToPDF = async () => {
    const doc = new jsPDF()
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      
      if (file.type.startsWith('text/')) {
        // 텍스트 파일 처리
        const text = await file.text()
        const lines = doc.splitTextToSize(text, 180)
        
        if (i > 0) doc.addPage()
        doc.setFontSize(12)
        doc.text(lines, 15, 20)
      } else if (file.type.startsWith('image/')) {
        // 이미지 파일 처리
        const imageDataUrl = await readFileAsDataURL(file)
        
        if (i > 0) doc.addPage()
        const imgProps = doc.getImageProperties(imageDataUrl)
        const pdfWidth = doc.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
        
        doc.addImage(imageDataUrl, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, doc.internal.pageSize.getHeight()))
      }
    }
    
    doc.save(`converted-${Date.now()}.pdf`)
  }

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const getAcceptedFormats = () => {
    switch (conversionType) {
      case 'to-pdf':
        return '.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp'
      case 'from-pdf':
        return '.pdf'
      case 'merge':
      case 'split':
        return '.pdf'
      default:
        return '*'
    }
  }

  const content = {
    ko: {
      title: 'PDF 변환기',
      typeLabel: '변환 종류',
      types: {
        'to-pdf': 'PDF로 변환',
        'from-pdf': 'PDF에서 변환',
        'merge': 'PDF 합치기',
        'split': 'PDF 나누기'
      },
      fileLabel: '파일 선택',
      selectButton: '파일 선택',
      clearButton: '파일 지우기',
      processButton: '변환 시작',
      processing: '변환 중...',
      noFiles: '선택된 파일이 없습니다',
      selectedFiles: '선택된 파일',
      supportedFormats: '지원 형식',
      usageTitle: '사용 방법',
      aboutTitle: 'PDF 변환이란?',
      aboutDesc: '다양한 문서 형식을 PDF로 변환하거나 PDF를 다른 형식으로 변환하는 기능입니다. 문서 공유와 보관에 유용합니다.',
      formats: {
        'to-pdf': ['Word 문서 (.doc, .docx)', '텍스트 파일 (.txt)', '이미지 파일 (.jpg, .png)'],
        'from-pdf': ['PDF 파일을 Word로', 'PDF 파일을 이미지로', 'PDF 파일을 텍스트로'],
        'merge': ['여러 PDF를 하나로', '페이지 순서 조정 가능', '북마크 보존'],
        'split': ['PDF를 여러 파일로', '페이지별 분할', '범위별 분할']
      },
      steps: [
        {
          icon: 'bi-folder2-open',
          title: '변환 종류 선택',
          desc: '원하는 PDF 변환 작업의 종류를 선택하세요.'
        },
        {
          icon: 'bi-file-earmark-arrow-up',
          title: '파일 업로드',
          desc: '변환할 파일들을 선택하여 업로드하세요.'
        },
        {
          icon: 'bi-gear',
          title: '옵션 설정',
          desc: '필요한 경우 품질, 압축 등의 옵션을 설정하세요.'
        },
        {
          icon: 'bi-arrow-repeat',
          title: '변환 실행',
          desc: '변환 시작 버튼을 클릭하여 처리를 시작하세요.'
        }
      ]
    },
    en: {
      title: 'PDF Converter',
      typeLabel: 'Conversion Type',
      types: {
        'to-pdf': 'Convert to PDF',
        'from-pdf': 'Convert from PDF',
        'merge': 'Merge PDFs',
        'split': 'Split PDF'
      },
      fileLabel: 'File Selection',
      selectButton: 'Select Files',
      clearButton: 'Clear Files',
      processButton: 'Start Conversion',
      processing: 'Converting...',
      noFiles: 'No files selected',
      selectedFiles: 'Selected Files',
      supportedFormats: 'Supported Formats',
      usageTitle: 'How to Use',
      aboutTitle: 'What is PDF Conversion?',
      aboutDesc: 'Convert various document formats to PDF or convert PDF to other formats. Useful for document sharing and archiving.',
      formats: {
        'to-pdf': ['Word documents (.doc, .docx)', 'Text files (.txt)', 'Image files (.jpg, .png)'],
        'from-pdf': ['PDF to Word', 'PDF to Images', 'PDF to Text'],
        'merge': ['Combine multiple PDFs', 'Adjustable page order', 'Preserve bookmarks'],
        'split': ['Split PDF into multiple files', 'Split by pages', 'Split by ranges']
      },
      steps: [
        {
          icon: 'bi-folder2-open',
          title: 'Select Conversion Type',
          desc: 'Choose the type of PDF conversion you want to perform.'
        },
        {
          icon: 'bi-file-earmark-arrow-up',
          title: 'Upload Files',
          desc: 'Select and upload the files you want to convert.'
        },
        {
          icon: 'bi-gear',
          title: 'Configure Options',
          desc: 'Set quality, compression, and other options if needed.'
        },
        {
          icon: 'bi-arrow-repeat',
          title: 'Start Conversion',
          desc: 'Click the start conversion button to begin processing.'
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

          {/* Conversion Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.typeLabel}
            </label>
            <select
              value={conversionType}
              onChange={(e) => setConversionType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(currentContent.types).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* File Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentContent.fileLabel}
            </label>
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="file"
                  multiple={conversionType === 'merge'}
                  accept={getAcceptedFormats()}
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-file-input"
                />
                <label
                  htmlFor="pdf-file-input"
                  className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-4xl mb-2">
                    <i className="bi-folder-plus text-blue-600"></i>
                  </div>
                  <span className="text-sm text-gray-600">{currentContent.selectButton}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Selected Files Display */}
          {selectedFiles.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {currentContent.selectedFiles} ({selectedFiles.length})
                </span>
                <button
                  onClick={clearFiles}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  {currentContent.clearButton}
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={processFiles}
            disabled={selectedFiles.length === 0 || isProcessing}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? currentContent.processing : currentContent.processButton}
          </button>

          {/* About Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">{currentContent.aboutTitle}</h4>
            <p className="text-sm text-blue-700">{currentContent.aboutDesc}</p>
          </div>
        </div>

        {/* Info Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {currentContent.supportedFormats}
          </h3>

          {/* Format Information */}
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                {currentContent.types[conversionType]}
              </h4>
              <ul className="space-y-2">
                {currentContent.formats[conversionType].map((format, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>{format}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature Notice */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start">
              <div className="text-green-600 text-xl mr-3">
                <i className="bi-check-circle-fill"></i>
              </div>
              <div>
                <h4 className="font-medium text-green-800 mb-1">
                  {language === 'ko' ? '사용 가능한 기능' : 'Available Features'}
                </h4>
                <p className="text-sm text-green-700">
                  {language === 'ko' 
                    ? '텍스트 파일(.txt)과 이미지 파일(.jpg, .png)을 PDF로 변환하는 기능이 구현되었습니다. 다른 변환 기능은 추후 추가될 예정입니다.'
                    : 'Text files (.txt) and image files (.jpg, .png) can now be converted to PDF. Other conversion features will be added later.'
                  }
                </p>
              </div>
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
            <div key={index} className="flex items-start space-x-3">
              <div className="text-blue-600 text-lg">
                <i className={step.icon}></i>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}