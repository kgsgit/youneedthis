'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type Tool = 'brush' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text'

interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  isDragging?: boolean
}

export default function ImageEditor() {
  const { language } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // 상태
  const [currentTool, setCurrentTool] = useState<Tool>('brush')
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentColor, setCurrentColor] = useState('#000000')
  const [showTextInput, setShowTextInput] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })
  const [textFontSize, setTextFontSize] = useState(20)
  const [textFontFamily, setTextFontFamily] = useState('Arial')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [dragState, setDragState] = useState({ isDragging: false, elementId: '', offset: { x: 0, y: 0 } })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  // 캔버스 크기 (화면에 맞게 고정)
  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 500

  // 확장 색상 팔레트 (모달에서 사용)
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#808080', '#C0C0C0',
    '#FFA500', '#FFB6C1', '#98FB98', '#87CEEB', '#DDA0DD', '#F0E68C', '#FA8072', '#40E0D0'
  ]

  // 폰트 목록
  const fontFamilies = [
    'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 
    'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Courier New'
  ]

  // 도구 목록
  const tools = [
    { id: 'brush' as Tool, name: language === 'ko' ? '브러시' : 'Brush', icon: '🖌️' },
    { id: 'eraser' as Tool, name: language === 'ko' ? '지우개' : 'Eraser', icon: '🧽' },
    { id: 'line' as Tool, name: language === 'ko' ? '직선' : 'Line', icon: '📏' },
    { id: 'rectangle' as Tool, name: language === 'ko' ? '사각형' : 'Rectangle', icon: '⬜' },
    { id: 'circle' as Tool, name: language === 'ko' ? '원' : 'Circle', icon: '⭕' },
    { id: 'text' as Tool, name: language === 'ko' ? '텍스트' : 'Text', icon: '🔤' }
  ]

  // 캔버스 초기화
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 캔버스 크기 설정
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    // 흰색 배경
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }, [])

  // 마우스 위치를 캔버스 좌표로 변환
  const getCanvasPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  // 마우스 다운 - 도구별 처리
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPosition(e)
    
    // 텍스트 도구인 경우
    if (currentTool === 'text') {
      setTextPosition(pos)
      setShowTextInput(true)
      return
    }

    // 그리기 시작
    setIsDrawing(true)
    setStartPos(pos)
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    // 도구별 설정
    if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = 10
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = currentColor
      ctx.lineWidth = 3
    }
    
    ctx.lineCap = 'round'

    // 브러시와 지우개는 즉시 그리기 시작
    if (currentTool === 'brush' || currentTool === 'eraser') {
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
    }
  }

  // 마우스 이동 - 도구별 처리
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const pos = getCanvasPosition(e)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    // 브러시와 지우개는 연속 그리기
    if (currentTool === 'brush' || currentTool === 'eraser') {
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
    // 도형들은 실시간 미리보기는 구현하지 않음 (간단하게 유지)
  }

  // 마우스 업 - 도구별 완료 처리
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const pos = getCanvasPosition(e)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    // 도형 그리기
    if (currentTool === 'line') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = currentColor
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(startPos.x, startPos.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if (currentTool === 'rectangle') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = currentColor
      ctx.lineWidth = 3
      const width = pos.x - startPos.x
      const height = pos.y - startPos.y
      ctx.strokeRect(startPos.x, startPos.y, width, height)
    } else if (currentTool === 'circle') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = currentColor
      ctx.lineWidth = 3
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      )
      ctx.beginPath()
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
      ctx.stroke()
    }

    setIsDrawing(false)
  }


  // 전체 삭제
  const handleClear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // 텍스트 요소들도 모두 삭제
    setTextElements([])
  }

  // 이미지 불러오기
  const handleLoadImage = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        // 캔버스에 맞게 이미지 크기 조정
        const scale = Math.min(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height)
        const width = img.width * scale
        const height = img.height * scale
        const x = (CANVAS_WIDTH - width) / 2
        const y = (CANVAS_HEIGHT - height) / 2

        // 기존 내용 위에 이미지 그리기
        ctx.drawImage(img, x, y, width, height)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // 다운로드
  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'drawing.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  // 인쇄
  const handlePrint = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imgData = canvas.toDataURL()
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>${language === 'ko' ? '그림 인쇄' : 'Print Drawing'}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              text-align: center; 
              font-family: Arial, sans-serif;
            }
            img { 
              max-width: 100%; 
              height: auto; 
              border: 1px solid #ddd;
            }
            @media print {
              body { padding: 0; }
              img { 
                width: 100%; 
                border: none;
              }
            }
          </style>
        </head>
        <body>
          <h2>${language === 'ko' ? '그림판 작품' : 'Paint Artwork'}</h2>
          <img src="${imgData}" onload="setTimeout(() => { window.print(); window.close(); }, 100);" />
        </body>
      </html>
    `)
  }

  // 텍스트 추가 (DOM 요소로 생성)
  const handleAddText = () => {
    if (!textInput.trim()) return

    const newText: TextElement = {
      id: Date.now().toString(),
      text: textInput,
      x: textPosition.x,
      y: textPosition.y,
      fontSize: textFontSize,
      fontFamily: textFontFamily,
      color: currentColor
    }

    setTextElements(prev => [...prev, newText])
    setTextInput('')
    setShowTextInput(false)
  }

  // 텍스트 드래그 시작
  const handleTextMouseDown = (e: React.MouseEvent, textId: string) => {
    e.preventDefault()
    const textElement = textElements.find(t => t.id === textId)
    if (!textElement || !canvasContainerRef.current) return

    const containerRect = canvasContainerRef.current.getBoundingClientRect()
    setDragState({
      isDragging: true,
      elementId: textId,
      offset: {
        x: e.clientX - containerRect.left - textElement.x,
        y: e.clientY - containerRect.top - textElement.y
      }
    })
  }

  // 텍스트 드래그 중
  const handleTextMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !canvasContainerRef.current) return

    const containerRect = canvasContainerRef.current.getBoundingClientRect()
    const newX = e.clientX - containerRect.left - dragState.offset.x
    const newY = e.clientY - containerRect.top - dragState.offset.y

    setTextElements(prev => 
      prev.map(text => 
        text.id === dragState.elementId 
          ? { ...text, x: Math.max(0, Math.min(newX, CANVAS_WIDTH - 100)), y: Math.max(20, Math.min(newY, CANVAS_HEIGHT - 20)) }
          : text
      )
    )
  }

  // 텍스트 드래그 끝
  const handleTextMouseUp = () => {
    setDragState({ isDragging: false, elementId: '', offset: { x: 0, y: 0 } })
  }

  // 텍스트 삭제
  const handleDeleteText = (textId: string) => {
    setTextElements(prev => prev.filter(t => t.id !== textId))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 제목 */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'ko' ? '그림판' : 'Paint'}
        </h1>
        <p className="text-gray-600 text-sm mt-2">
          {language === 'ko' 
            ? '도구를 선택하고 캔버스에서 그리세요' 
            : 'Select a tool and draw on the canvas'
          }
        </p>
      </div>

      {/* 색상 선택 및 파일 기능 */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
          <span className="text-sm text-gray-700">
            {language === 'ko' ? '색상:' : 'Color:'}
          </span>
          <button
            onClick={() => setShowColorPicker(true)}
            className="w-12 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-all hover:scale-105 shadow-sm"
            style={{ backgroundColor: currentColor }}
            title={language === 'ko' ? '색상 선택' : 'Choose color'}
          />
          
          <div className="w-px h-6 bg-gray-300"></div>
          
          <button
            onClick={handleLoadImage}
            className="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors flex items-center gap-1"
            title={language === 'ko' ? '이미지 불러오기' : 'Load image'}
          >
            📁 <span className="hidden sm:inline">{language === 'ko' ? '불러오기' : 'Load'}</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors flex items-center gap-1"
            title={language === 'ko' ? '다운로드' : 'Download'}
          >
            💾 <span className="hidden sm:inline">{language === 'ko' ? '다운로드' : 'Download'}</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
            title={language === 'ko' ? '인쇄' : 'Print'}
          >
            🖨️ <span className="hidden sm:inline">{language === 'ko' ? '인쇄' : 'Print'}</span>
          </button>
          
          <button
            onClick={handleClear}
            className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors flex items-center gap-1"
            title={language === 'ko' ? '전체삭제' : 'Clear all'}
          >
            🗑️ <span className="hidden sm:inline">{language === 'ko' ? '삭제' : 'Clear'}</span>
          </button>
        </div>
      </div>

      {/* 도구 선택 */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-2 bg-white p-3 rounded-lg shadow-sm">
          <span className="text-sm text-gray-700 mr-2">
            {language === 'ko' ? '도구:' : 'Tools:'}
          </span>
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setCurrentTool(tool.id)}
              className={`px-3 py-2 rounded text-sm transition-all hover:scale-105 flex items-center gap-1 ${
                currentTool === tool.id 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={tool.name}
            >
              <span>{tool.icon}</span>
              <span className="hidden sm:inline">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 캔버스 영역 */}
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div 
            ref={canvasContainerRef}
            className="relative"
            onMouseMove={handleTextMouseMove}
            onMouseUp={handleTextMouseUp}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border border-gray-300 cursor-crosshair rounded"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => setIsDrawing(false)}
            />
            
            {/* 드래그 가능한 텍스트 요소들 */}
            {textElements.map(textElement => (
              <div
                key={textElement.id}
                className="absolute cursor-move select-none group"
                style={{
                  left: textElement.x,
                  top: textElement.y,
                  fontSize: textElement.fontSize,
                  fontFamily: textElement.fontFamily,
                  color: textElement.color,
                  transform: 'translate(0, -50%)'
                }}
                onMouseDown={(e) => handleTextMouseDown(e, textElement.id)}
                title={language === 'ko' ? '드래그하여 이동' : 'Drag to move'}
              >
                {textElement.text}
                
                {/* 삭제 버튼 (호버 시 표시) */}
                <button
                  onClick={() => handleDeleteText(textElement.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title={language === 'ko' ? '삭제' : 'Delete'}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 색상 선택 모달 */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ko' ? '색상 선택' : 'Choose Color'}
            </h3>
            
            {/* 색상 팔레트 */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setCurrentColor(color)
                    setShowColorPicker(false)
                  }}
                  className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                    currentColor === color ? 'border-gray-800 ring-2 ring-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* 커스텀 색상 선택 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {language === 'ko' ? '커스텀 색상:' : 'Custom Color:'}
              </label>
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded cursor-pointer"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowColorPicker(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {language === 'ko' ? '완료' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 텍스트 입력 모달 */}
      {showTextInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ko' ? '텍스트 추가' : 'Add Text'}
            </h3>
            
            {/* 텍스트 입력 */}
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={language === 'ko' ? '텍스트를 입력하세요...' : 'Enter text...'}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddText()
                } else if (e.key === 'Escape') {
                  setShowTextInput(false)
                  setTextInput('')
                }
              }}
              autoFocus
            />

            {/* 폰트 크기 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {language === 'ko' ? '크기:' : 'Size:'}
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={textFontSize}
                onChange={(e) => setTextFontSize(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>12px</span>
                <span>{textFontSize}px</span>
                <span>72px</span>
              </div>
            </div>

            {/* 폰트 선택 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {language === 'ko' ? '폰트:' : 'Font:'}
              </label>
              <select
                value={textFontFamily}
                onChange={(e) => setTextFontFamily(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {fontFamilies.map(font => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* 미리보기 */}
            <div className="mb-4 p-3 bg-gray-50 rounded text-center">
              <span 
                style={{ 
                  fontSize: `${Math.min(textFontSize, 24)}px`, 
                  fontFamily: textFontFamily,
                  color: currentColor 
                }}
              >
                {textInput || (language === 'ko' ? '미리보기' : 'Preview')}
              </span>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowTextInput(false)
                  setTextInput('')
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button
                onClick={handleAddText}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!textInput.trim()}
              >
                {language === 'ko' ? '추가' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}