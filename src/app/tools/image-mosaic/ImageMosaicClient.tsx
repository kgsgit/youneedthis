'use client'

import { useState, useRef, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { ToolJsonLd } from '@/components/seo/ToolJsonLd'
import { useLanguage } from '@/contexts/LanguageContext'
import { siteConfig } from '@/config/site'

export default function ImageMosaicClient() {
  const { language } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mosaicSize, setMosaicSize] = useState(20)
  const [mosaicType, setMosaicType] = useState<'pixelate' | 'blur'>('pixelate')
  const [mosaicMode, setMosaicMode] = useState<'full' | 'selective'>('full')
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(30)
  const [selectedAreas, setSelectedAreas] = useState<Array<{x: number, y: number, size: number}>>([])

  // 도구 정보 가져오기
  const tool = siteConfig.tools.find(t => t.id === 'image-mosaic')!

  const content = {
    ko: {
      uploadButton: '이미지 업로드',
      dragText: '이미지를 드래그하거나 클릭하여 업로드하세요',
      mosaicSize: '모자이크 크기',
      mosaicType: '모자이크 타입',
      pixelate: '픽셀화',
      blur: '블러',
      applyMosaic: '모자이크 적용',
      download: '다운로드',
      reset: '초기화',
      processing: '처리중...',
      mosaicMode: '모자이크 모드',
      fullImage: '전체 이미지',
      selectiveArea: '선택 영역',
      brushSize: '브러시 크기',
      clearSelection: '선택 영역 지우기',
      drawInstruction: '모자이크를 적용할 영역을 마우스로 그려주세요',
      howToUse: '사용법',
      step1: '1. 위의 영역에 이미지를 드래그하거나 클릭하여 업로드하세요',
      step2: '2. 모자이크 타입(픽셀화/블러)과 크기를 선택하세요',
      step3: '3. "모자이크 적용" 버튼을 클릭하여 효과를 적용하세요',
      step4: '4. 결과가 만족스러우면 "다운로드" 버튼으로 저장하세요',
      features: '주요 기능',
      feature1: '• 완전 클라이언트사이드 처리로 개인정보 보호',
      feature2: '• 픽셀화와 블러 두 가지 모자이크 효과',
      feature3: '• 모자이크 크기 5px~50px 자유 조절',
      feature4: '• 드래그앤드롭으로 간편한 이미지 업로드',
      feature5: '• 고품질 PNG 형태로 다운로드 가능'
    },
    en: {
      uploadButton: 'Upload Image',
      dragText: 'Drag and drop an image or click to upload',
      mosaicSize: 'Mosaic Size',
      mosaicType: 'Mosaic Type',
      pixelate: 'Pixelate',
      blur: 'Blur',
      applyMosaic: 'Apply Mosaic',
      download: 'Download',
      reset: 'Reset',
      processing: 'Processing...',
      mosaicMode: 'Mosaic Mode',
      fullImage: 'Full Image',
      selectiveArea: 'Selective Area',
      brushSize: 'Brush Size',
      clearSelection: 'Clear Selection',
      drawInstruction: 'Draw on areas where you want to apply mosaic',
      howToUse: 'How to Use',
      step1: '1. Drag and drop or click to upload your image in the area above',
      step2: '2. Choose mosaic type (Pixelate/Blur) and adjust the size',
      step3: '3. Click "Apply Mosaic" button to apply the effect',
      step4: '4. If satisfied with the result, click "Download" to save',
      features: 'Key Features',
      feature1: '• Complete client-side processing for privacy protection',
      feature2: '• Two mosaic effects: Pixelate and Blur',
      feature3: '• Adjustable mosaic size from 5px to 50px',
      feature4: '• Easy drag-and-drop image upload',
      feature5: '• High-quality PNG download'
    }
  }

  const currentContent = content[language]

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        // Clear any previous selection
        setSelectedAreas([])
        // Small delay to ensure canvas is ready
        setTimeout(() => {
          drawOriginalImage(img)
        }, 10)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [])

  const drawOriginalImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current
    const overlayCanvas = overlayCanvasRef.current
    if (!canvas || !overlayCanvas) return

    const ctx = canvas.getContext('2d')
    const overlayCtx = overlayCanvas.getContext('2d')
    if (!ctx || !overlayCtx) return

    // 캔버스 크기를 이미지에 맞게 조정 (최대 600px, 최소 300px)
    const maxSize = 600
    const minSize = 300
    
    let scale = Math.min(maxSize / img.width, maxSize / img.height)
    
    // 너무 작은 이미지는 확대
    if (img.width < minSize || img.height < minSize) {
      scale = Math.max(minSize / img.width, minSize / img.height)
    }
    
    const newWidth = Math.floor(img.width * scale)
    const newHeight = Math.floor(img.height * scale)
    
    // 메인 캔버스 크기 설정
    canvas.width = newWidth
    canvas.height = newHeight
    canvas.style.width = newWidth + 'px'
    canvas.style.height = newHeight + 'px'
    
    // 오버레이 캔버스 크기 설정
    overlayCanvas.width = newWidth
    overlayCanvas.height = newHeight
    overlayCanvas.style.width = newWidth + 'px'
    overlayCanvas.style.height = newHeight + 'px'

    ctx.clearRect(0, 0, newWidth, newHeight)
    ctx.drawImage(img, 0, 0, newWidth, newHeight)
    
    // 오버레이 캔버스 초기화
    overlayCtx.clearRect(0, 0, newWidth, newHeight)
    
    console.log('Canvas resized:', { 
      originalSize: { width: img.width, height: img.height },
      newSize: { width: newWidth, height: newHeight },
      scale 
    })
  }

  const applyPixelMosaic = () => {
    if (!image || !canvasRef.current) return

    setIsProcessing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // 픽셀화 효과
    for (let y = 0; y < canvas.height; y += mosaicSize) {
      for (let x = 0; x < canvas.width; x += mosaicSize) {
        // 블록의 평균 색상 계산
        let r = 0, g = 0, b = 0, count = 0
        
        for (let dy = 0; dy < mosaicSize && y + dy < canvas.height; dy++) {
          for (let dx = 0; dx < mosaicSize && x + dx < canvas.width; dx++) {
            const index = ((y + dy) * canvas.width + (x + dx)) * 4
            r += data[index]
            g += data[index + 1]
            b += data[index + 2]
            count++
          }
        }
        
        // 평균 색상으로 블록 채우기
        r = Math.floor(r / count)
        g = Math.floor(g / count)
        b = Math.floor(b / count)
        
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(x, y, mosaicSize, mosaicSize)
      }
    }
    
    setIsProcessing(false)
  }

  const applyBlurMosaic = () => {
    if (!image || !canvasRef.current) return

    setIsProcessing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 블러 효과 적용
    ctx.filter = `blur(${mosaicSize / 4}px)`
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    ctx.filter = 'none'
    
    setIsProcessing(false)
  }

  // 선택 영역에만 모자이크 적용
  const applySelectiveMosaic = () => {
    if (!image || !canvasRef.current || !overlayCanvasRef.current) return

    setIsProcessing(true)
    const canvas = canvasRef.current
    const overlayCanvas = overlayCanvasRef.current
    const ctx = canvas.getContext('2d')
    const overlayCtx = overlayCanvas.getContext('2d')
    
    if (!ctx || !overlayCtx) return

    // 먼저 원본 이미지로 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    // 선택한 영역에 모자이크 적용
    selectedAreas.forEach(area => {
      const x = Math.max(0, area.x - area.size / 2)
      const y = Math.max(0, area.y - area.size / 2)
      const width = Math.min(area.size, canvas.width - x)
      const height = Math.min(area.size, canvas.height - y)

      if (mosaicType === 'pixelate') {
        // 픽셀화 효과
        const imageData = ctx.getImageData(x, y, width, height)
        const data = imageData.data
        const blockSize = mosaicSize

        for (let by = 0; by < height; by += blockSize) {
          for (let bx = 0; bx < width; bx += blockSize) {
            let r = 0, g = 0, b = 0, count = 0
            
            for (let dy = 0; dy < blockSize && by + dy < height; dy++) {
              for (let dx = 0; dx < blockSize && bx + dx < width; dx++) {
                const index = ((by + dy) * width + (bx + dx)) * 4
                r += data[index]
                g += data[index + 1]
                b += data[index + 2]
                count++
              }
            }
            
            r = Math.floor(r / count)
            g = Math.floor(g / count)
            b = Math.floor(b / count)
            
            ctx.fillStyle = `rgb(${r},${g},${b})`
            ctx.fillRect(x + bx, y + by, blockSize, blockSize)
          }
        }
      } else {
        // 블러 효과
        ctx.save()
        ctx.filter = `blur(${mosaicSize / 4}px)`
        ctx.drawImage(canvas, x, y, width, height, x, y, width, height)
        ctx.restore()
      }
    })

    setIsProcessing(false)
  }

  const applyMosaic = () => {
    if (mosaicMode === 'selective') {
      applySelectiveMosaic()
    } else if (mosaicType === 'pixelate') {
      applyPixelMosaic()
    } else {
      applyBlurMosaic()
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `mosaic-image-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const resetCanvas = () => {
    if (image) {
      drawOriginalImage(image)
      setSelectedAreas([])
    }
  }

  // 마우스/터치 이벤트 핸들러
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mosaicMode !== 'selective') return
    setIsDrawing(true)
    const rect = overlayCanvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    drawOnCanvas(x, y)
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mosaicMode !== 'selective') return
    const rect = overlayCanvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    drawOnCanvas(x, y)
  }

  const handleCanvasMouseUp = () => {
    setIsDrawing(false)
  }

  const drawOnCanvas = (x: number, y: number) => {
    const overlayCanvas = overlayCanvasRef.current
    if (!overlayCanvas) return
    
    const ctx = overlayCanvas.getContext('2d')
    if (!ctx) return

    // 선택 영역 그리기 - 점선 테두리만
    ctx.globalCompositeOperation = 'source-over'
    
    // 점선 스타일 설정
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)'  // 파란색 테두리
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])  // 5px 선, 5px 공백의 점선
    
    // 원 그리기 (테두리만, 채우기 없음)
    ctx.beginPath()
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
    ctx.stroke()
    
    // 점선 스타일 리셋
    ctx.setLineDash([])

    // 선택 영역 저장
    setSelectedAreas(prev => [...prev, { x, y, size: brushSize }])
  }

  const clearSelection = () => {
    const overlayCanvas = overlayCanvasRef.current
    if (!overlayCanvas) return
    
    const ctx = overlayCanvas.getContext('2d')
    if (!ctx) return
    
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
    setSelectedAreas([])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    if (files[0]) {
      handleFileSelect(files[0])
    }
  }

  return (
    <>
      <Header />
      <ToolLayout tool={tool}>
        {/* Tool Content */}
        <div className="space-y-8">
          {/* Upload Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            {!image ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {currentContent.dragText}
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  {currentContent.uploadButton}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Controls */}
                <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                  {/* Mode Selection */}
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        {currentContent.mosaicMode}:
                      </label>
                      <select
                        value={mosaicMode}
                        onChange={(e) => setMosaicMode(e.target.value as 'full' | 'selective')}
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="full">{currentContent.fullImage}</option>
                        <option value="selective">{currentContent.selectiveArea}</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        {currentContent.mosaicType}:
                      </label>
                      <select
                        value={mosaicType}
                        onChange={(e) => setMosaicType(e.target.value as 'pixelate' | 'blur')}
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pixelate">{currentContent.pixelate}</option>
                        <option value="blur">{currentContent.blur}</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        {currentContent.mosaicSize}: {mosaicSize}px
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={mosaicSize}
                        onChange={(e) => setMosaicSize(Number(e.target.value))}
                        className="w-32"
                      />
                    </div>
                  </div>

                  {/* Selective Mode Controls */}
                  {mosaicMode === 'selective' && (
                    <div className="flex flex-wrap gap-4 items-center border-t pt-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          {currentContent.brushSize}: {brushSize}px
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={brushSize}
                          onChange={(e) => setBrushSize(Number(e.target.value))}
                          className="w-32"
                        />
                      </div>
                      <button
                        onClick={clearSelection}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        {currentContent.clearSelection}
                      </button>
                      <span className="text-sm text-gray-500 italic">
                        {currentContent.drawInstruction}
                      </span>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 border-t pt-4">
                    <button
                      onClick={applyMosaic}
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {isProcessing ? currentContent.processing : currentContent.applyMosaic}
                    </button>
                    <button
                      onClick={resetCanvas}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {currentContent.reset}
                    </button>
                    <button
                      onClick={downloadImage}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {currentContent.download}
                    </button>
                  </div>
                </div>

                {/* Canvas */}
                <div className="flex justify-center bg-white p-4 rounded-lg shadow-sm">
                  <div className="relative border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      className="block max-w-full h-auto"
                    />
                    {/* Overlay Canvas for selection */}
                    <canvas
                      ref={overlayCanvasRef}
                      className="absolute top-0 left-0 block max-w-full h-auto"
                      style={{ 
                        cursor: mosaicMode === 'selective' ? 'crosshair' : 'default',
                        pointerEvents: mosaicMode === 'selective' ? 'auto' : 'none' 
                      }}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseUp}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {currentContent.howToUse}
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>{currentContent.step1}</p>
                <p>{currentContent.step2}</p>
                <p>{currentContent.step3}</p>
                <p>{currentContent.step4}</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                {currentContent.features}
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>{currentContent.feature1}</p>
                <p>{currentContent.feature2}</p>
                <p>{currentContent.feature3}</p>
                <p>{currentContent.feature4}</p>
                <p>{currentContent.feature5}</p>
              </div>
            </div>
          </div>
        </div>
      </ToolLayout>
      <Footer />
      
      {/* JSON-LD 구조화 데이터 */}
      <ToolJsonLd toolId="image-mosaic" language={language} />
    </>
  )
}