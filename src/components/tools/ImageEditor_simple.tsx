'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ImageEditor() {
  const { language } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // 상태
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState('#000000')
  const [showTextInput, setShowTextInput] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })

  // 캔버스 크기 (화면에 맞게 고정)
  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 500

  // 기본 색상 팔레트
  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF']

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

  // 마우스 다운 - 그리기 시작 또는 텍스트 위치 설정
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPosition(e)
    
    // 우클릭이면 텍스트 입력
    if (e.button === 2) {
      setTextPosition(pos)
      setShowTextInput(true)
      return
    }

    // 좌클릭이면 그리기 시작
    setIsDrawing(true)
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = currentColor
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  // 마우스 이동 - 그리기
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const pos = getCanvasPosition(e)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  // 마우스 업 - 그리기 끝
  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  // 텍스트 추가
  const handleAddText = () => {
    if (!textInput.trim()) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = currentColor
    ctx.font = '20px Arial'
    ctx.fillText(textInput, textPosition.x, textPosition.y)

    // 입력창 닫기
    setTextInput('')
    setShowTextInput(false)
  }

  // 전체 삭제
  const handleClear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 제목 */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'ko' ? '간단한 그림판' : 'Simple Paint'}
        </h1>
        <p className="text-gray-600 text-sm mt-2">
          {language === 'ko' 
            ? '좌클릭: 그리기, 우클릭: 텍스트 입력' 
            : 'Left click: Draw, Right click: Add text'
          }
        </p>
      </div>

      {/* 색상 팔레트 */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-2 bg-white p-3 rounded-lg shadow-sm">
          <span className="text-sm text-gray-700 mr-2">
            {language === 'ko' ? '색상:' : 'Color:'}
          </span>
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                currentColor === color ? 'border-gray-800 ring-2 ring-blue-300' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <button
            onClick={handleClear}
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            {language === 'ko' ? '전체삭제' : 'Clear'}
          </button>
        </div>
      </div>

      {/* 캔버스 영역 */}
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border border-gray-300 cursor-crosshair rounded"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()} // 우클릭 메뉴 방지
          />
        </div>
      </div>

      {/* 텍스트 입력 모달 */}
      {showTextInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ko' ? '텍스트 입력' : 'Add Text'}
            </h3>
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
              >
                {language === 'ko' ? '추가' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}