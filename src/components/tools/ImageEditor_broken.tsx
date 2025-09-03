'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type Tool = 'select' | 'brush' | 'pencil' | 'eraser' | 'bucket' | 'text' | 'line' | 'rectangle' | 'circle'

interface Point {
  x: number
  y: number
}

interface DrawAction {
  id: string
  tool: Tool
  color: string
  size: number
  points: Point[]
  isSelected?: boolean
  imageData?: string
}

interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  font: string
  isSelected?: boolean
  width?: number
  height?: number
}

interface DragState {
  isDragging: boolean
  isResizing: boolean
  dragOffset: Point
  elementId: string | null
  resizeHandle: 'nw' | 'ne' | 'sw' | 'se' | null
}

export default function ImageEditor() {
  const { language } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 캔버스 크기를 화면에 맞게 동적으로 설정
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 })
  const CANVAS_WIDTH = canvasSize.width
  const CANVAS_HEIGHT = canvasSize.height
  
  const [currentTool, setCurrentTool] = useState<Tool>('brush')
  const [currentColor, setCurrentColor] = useState('#000000')
  const [textSize, setTextSize] = useState(20)
  const [zoom, setZoom] = useState(1)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawActions, setDrawActions] = useState<DrawAction[]>([])
  const [redoActions, setRedoActions] = useState<DrawAction[]>([])
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [lastPoint, setLastPoint] = useState<Point | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isAddingText, setIsAddingText] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [pendingTextPosition, setPendingTextPosition] = useState<Point | null>(null)
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isResizing: false,
    dragOffset: { x: 0, y: 0 },
    elementId: null,
    resizeHandle: null
  })

  // 언어별 텍스트
  const t = useMemo(() => {
    const ko = {
      title: '이미지 에디터',
      tools: '도구',
      colors: '색상',
      select: '선택',
      brush: '브러시', 
      pencil: '연필',
      eraser: '지우개',
      bucket: '채우기',
      text: '텍스트',
      line: '직선',
      rectangle: '사각형',
      circle: '원형',
      undo: '실행취소',
      redo: '다시실행', 
      clear: '전체삭제',
      save: '저장',
      load: '불러오기',
      print: '인쇄',
      colorPicker: '색상 선택',
      textPrompt: '텍스트를 입력하세요...',
      zoomIn: '확대',
      zoomOut: '축소',
      fitToScreen: '화면맞춤'
    }
    
    const en = {
      title: 'Image Editor',
      tools: 'Tools', 
      colors: 'Colors',
      select: 'Select',
      brush: 'Brush',
      pencil: 'Pencil', 
      eraser: 'Eraser',
      bucket: 'Fill',
      text: 'Text',
      line: 'Line',
      rectangle: 'Rectangle', 
      circle: 'Circle',
      undo: 'Undo',
      redo: 'Redo',
      clear: 'Clear',
      save: 'Save', 
      load: 'Load',
      print: 'Print',
      colorPicker: 'Color Picker',
      textPrompt: 'Enter text...',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out', 
      fitToScreen: 'Fit to Screen'
    }
    
    return language === 'ko' ? ko : en
  }, [language])

  // 기본 색상 팔레트
  const basicColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#808080', '#808000', '#008000', '#800080', '#008080', '#C0C0C0', '#FF8080'
  ]

  // 확장 색상 팔레트
  const extendedColors = [
    '#000000', '#404040', '#808080', '#C0C0C0', '#FFFFFF', '#FF0000', '#FF4040', '#FF8080',
    '#800000', '#400000', '#FFFF00', '#FFFF80', '#808000', '#404000', '#00FF00', '#40FF40',
    '#80FF80', '#008000', '#004000', '#00FFFF', '#40FFFF', '#80FFFF', '#008080', '#004040',
    '#0000FF', '#4040FF', '#8080FF', '#000080', '#000040', '#FF00FF', '#FF40FF', '#FF80FF',
    '#800080', '#400040', '#FFA500', '#FFD700', '#8B4513', '#A0522D', '#DEB887', '#F5DEB3'
  ]

  // 도구 버튼 설정
  const toolButtons = useMemo(() => [
    { tool: 'select' as Tool, icon: 'bi-cursor', label: t.select },
    { tool: 'brush' as Tool, icon: 'bi-brush', label: t.brush },
    { tool: 'pencil' as Tool, icon: 'bi-pencil', label: t.pencil },
    { tool: 'eraser' as Tool, icon: 'bi-eraser', label: t.eraser },
    { tool: 'bucket' as Tool, icon: 'bi-bucket', label: t.bucket },
    { tool: 'text' as Tool, icon: 'bi-type', label: t.text },
    { tool: 'line' as Tool, icon: 'bi-slash', label: t.line },
    { tool: 'rectangle' as Tool, icon: 'bi-square', label: t.rectangle },
    { tool: 'circle' as Tool, icon: 'bi-circle', label: t.circle }
  ], [t])

  // 컨테이너 크기에 맞춰 캔버스 크기 조정
  useEffect(() => {
    const updateCanvasSize = () => {
      // 고정 크기로 설정 (화면에 맞게)
      const width = 900
      const height = 600
      setCanvasSize({ width, height })
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  // 플러드 필 알고리즘
  const floodFill = useCallback((ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string) => {
    const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    const data = imageData.data
    
    // 색상을 RGBA로 변환
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255
      } : { r: 0, g: 0, b: 0, a: 255 }
    }
    
    const fillRGBA = hexToRgb(fillColor)
    
    // 시작 지점의 색상 가져오기
    const startIndex = (startY * CANVAS_WIDTH + startX) * 4
    if (startIndex < 0 || startIndex >= data.length) return
    
    const startR = data[startIndex]
    const startG = data[startIndex + 1]
    const startB = data[startIndex + 2]
    const startA = data[startIndex + 3]
    
    // 이미 같은 색상이면 리턴
    if (startR === fillRGBA.r && startG === fillRGBA.g && startB === fillRGBA.b && startA === fillRGBA.a) {
      return
    }
    
    const stack = [[startX, startY]]
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()!
      
      if (x < 0 || x >= CANVAS_WIDTH || y < 0 || y >= CANVAS_HEIGHT) continue
      
      const index = (y * CANVAS_WIDTH + x) * 4
      
      // 색상이 시작 색상과 같은지 확인
      if (data[index] === startR && data[index + 1] === startG && 
          data[index + 2] === startB && data[index + 3] === startA) {
        
        // 색상 변경
        data[index] = fillRGBA.r
        data[index + 1] = fillRGBA.g  
        data[index + 2] = fillRGBA.b
        data[index + 3] = fillRGBA.a
        
        // 주변 픽셀을 스택에 추가
        stack.push([x + 1, y])
        stack.push([x - 1, y])
        stack.push([x, y + 1])
        stack.push([x, y - 1])
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
  }, [CANVAS_WIDTH, CANVAS_HEIGHT])

  // 그리기 액션 실행
  const executeDrawAction = useCallback((ctx: CanvasRenderingContext2D, action: DrawAction) => {
    ctx.strokeStyle = action.color
    ctx.fillStyle = action.color
    ctx.lineWidth = action.size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    switch (action.tool) {
      case 'brush':
      case 'pencil':
      case 'eraser':
        if (action.points.length > 1) {
          if (action.tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out'
          } else {
            ctx.globalCompositeOperation = 'source-over'
          }
          
          ctx.beginPath()
          ctx.moveTo(action.points[0].x, action.points[0].y)
          
          for (let i = 1; i < action.points.length; i++) {
            ctx.lineTo(action.points[i].x, action.points[i].y)
          }
          ctx.stroke()
        }
        break

      case 'line':
        if (action.points.length >= 2) {
          ctx.globalCompositeOperation = 'source-over'
          ctx.beginPath()
          ctx.moveTo(action.points[0].x, action.points[0].y)
          ctx.lineTo(action.points[1].x, action.points[1].y)
          ctx.stroke()
        }
        break

      case 'rectangle':
        if (action.points.length >= 2) {
          ctx.globalCompositeOperation = 'source-over'
          const width = action.points[1].x - action.points[0].x
          const height = action.points[1].y - action.points[0].y
          ctx.strokeRect(action.points[0].x, action.points[0].y, width, height)
        }
        break

      case 'circle':
        if (action.points.length >= 2) {
          ctx.globalCompositeOperation = 'source-over'
          const centerX = action.points[0].x
          const centerY = action.points[0].y
          const radius = Math.sqrt(
            Math.pow(action.points[1].x - centerX, 2) + 
            Math.pow(action.points[1].y - centerY, 2)
          )
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
          ctx.stroke()
        }
        break

      case 'bucket':
        if (action.points.length > 0) {
          ctx.globalCompositeOperation = 'source-over'
          // 플러드 필 알고리즘으로 특정 영역만 채우기
          const point = action.points[0]
          floodFill(ctx, Math.floor(point.x), Math.floor(point.y), action.color)
        }
        break
    }
  }, [floodFill])

  // 캔버스 다시 그리기
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // 캔버스 초기화
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // 그리기 액션들 실행
    drawActions.forEach(action => {
      executeDrawAction(ctx, action)
    })

    // 텍스트 요소들 그리기
    textElements.forEach(textEl => {
      ctx.fillStyle = textEl.color
      ctx.font = `${textEl.fontSize}px ${textEl.font}`
      ctx.fillText(textEl.text, textEl.x, textEl.y)
    })
  }, [drawActions, textElements, CANVAS_WIDTH, CANVAS_HEIGHT, executeDrawAction])

  // 캔버스 초기화
  useEffect(() => {
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    if (!canvas || !overlay) return

    const ctx = canvas.getContext('2d')
    const overlayCtx = overlay.getContext('2d')
    if (!ctx || !overlayCtx) return

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    overlay.width = CANVAS_WIDTH
    overlay.height = CANVAS_HEIGHT

    redrawCanvas()
  }, [CANVAS_WIDTH, CANVAS_HEIGHT, redrawCanvas])

  // drawActions 또는 textElements 변경 시 캔버스 다시 그리기
  useEffect(() => {
    redrawCanvas()
  }, [drawActions, textElements, redrawCanvas])


  // 마우스 위치를 캔버스 좌표로 변환
  const getCanvasPoint = useCallback((e: React.MouseEvent): Point => {
    const overlay = overlayRef.current
    if (!overlay) return { x: 0, y: 0 }

    const rect = overlay.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }, [CANVAS_WIDTH, CANVAS_HEIGHT])

  // 마우스 다운 이벤트 처리
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const point = getCanvasPoint(e)
    
    if (currentTool === 'text') {
      setPendingTextPosition(point)
      setIsAddingText(true)
      return
    }

    if (currentTool === 'bucket') {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      const action: DrawAction = {
        id: Date.now().toString(),
        tool: 'bucket',
        color: currentColor,
        size: 1,
        points: [point]
      }

      setDrawActions(prev => [...prev, action])
      setRedoActions([])
      
      floodFill(ctx, Math.floor(point.x), Math.floor(point.y), currentColor)
      return
    }

    setIsDrawing(true)
    setLastPoint(point)

    if (currentTool === 'brush' || currentTool === 'pencil' || currentTool === 'eraser') {
      const action: DrawAction = {
        id: Date.now().toString(),
        tool: currentTool,
        color: currentColor,
        size: 3, // 고정 크기
        points: [point]
      }
      setDrawActions(prev => [...prev, action])
      setRedoActions([])
    }
  }, [currentTool, currentColor, getCanvasPoint, floodFill])

  // 마우스 이동 이벤트 처리
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || !lastPoint) return

    const point = getCanvasPoint(e)

    if (currentTool === 'brush' || currentTool === 'pencil' || currentTool === 'eraser') {
      setDrawActions(prev => {
        const newActions = [...prev]
        const lastAction = newActions[newActions.length - 1]
        if (lastAction) {
          lastAction.points = [...lastAction.points, point]
        }
        return newActions
      })

      // 실시간 그리기
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
      } else {
        ctx.globalCompositeOperation = 'source-over'
      }
      
      ctx.strokeStyle = currentColor
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }

    setLastPoint(point)
  }, [isDrawing, lastPoint, currentTool, currentColor, getCanvasPoint])

  // 마우스 업 이벤트 처리
  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) return

    const point = getCanvasPoint(e)

    if (currentTool === 'line' || currentTool === 'rectangle' || currentTool === 'circle') {
      if (lastPoint) {
        const action: DrawAction = {
          id: Date.now().toString(),
          tool: currentTool,
          color: currentColor,
          size: 3,
          points: [lastPoint, point]
        }
        setDrawActions(prev => [...prev, action])
        setRedoActions([])

        // 즉시 그리기
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) {
          executeDrawAction(ctx, action)
        }
      }
    }

    setIsDrawing(false)
    setLastPoint(null)
  }, [isDrawing, currentTool, currentColor, lastPoint, getCanvasPoint])

  // 텍스트 추가
  const handleAddText = useCallback(() => {
    if (!textInput.trim() || !pendingTextPosition) return

    const newText: TextElement = {
      id: Date.now().toString(),
      text: textInput,
      x: pendingTextPosition.x,
      y: pendingTextPosition.y,
      fontSize: textSize,
      color: currentColor,
      font: 'Arial',
      isSelected: false
    }

    setTextElements(prev => [...prev, newText])
    setTextInput('')
    setIsAddingText(false)
    setPendingTextPosition(null)
    // redrawCanvas() - useEffect에서 자동으로 호출됨
  }, [textInput, pendingTextPosition, textSize, currentColor])

  // 실행 취소
  const handleUndo = useCallback(() => {
    if (drawActions.length === 0 && textElements.length === 0) return

    if (drawActions.length > 0) {
      const lastAction = drawActions[drawActions.length - 1]
      setRedoActions(prev => [...prev, lastAction])
      setDrawActions(prev => prev.slice(0, -1))
    } else if (textElements.length > 0) {
      const lastText = textElements[textElements.length - 1]
      setTextElements(prev => prev.slice(0, -1))
    }
    // useEffect에서 자동으로 redrawCanvas() 호출됨
  }, [drawActions, textElements])

  // 다시 실행
  const handleRedo = useCallback(() => {
    if (redoActions.length === 0) return

    const redoAction = redoActions[redoActions.length - 1]
    setDrawActions(prev => [...prev, redoAction])
    setRedoActions(prev => prev.slice(0, -1))
    // useEffect에서 자동으로 redrawCanvas() 호출됨
  }, [redoActions])

  // 전체 삭제
  const handleClear = useCallback(() => {
    setDrawActions([])
    setRedoActions([])
    setTextElements([])
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }, [CANVAS_WIDTH, CANVAS_HEIGHT])

  // 저장
  const handleSave = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const link = document.createElement('a')
      link.download = 'drawing.png'
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('저장 실패:', error)
      alert(language === 'ko' ? '저장에 실패했습니다.' : 'Failed to save.')
    }
  }, [language])

  // 인쇄
  const handlePrint = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
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
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              @media print {
                body { padding: 0; }
                img { 
                  width: 100%; 
                  border: none;
                  box-shadow: none;
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
    } catch (error) {
      console.error('인쇄 실패:', error)
      alert(language === 'ko' ? '인쇄에 실패했습니다.' : 'Failed to print.')
    }
  }, [language])

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 상단 타이틀 바 */}
      <div className="bg-white shadow-sm border-b px-4 py-2 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
      </div>

      {/* 메인 작업 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽 도구 툴바 */}
        <div className="w-16 bg-white border-r shadow-sm flex flex-col items-center py-4 space-y-2 flex-shrink-0">
          {toolButtons.map(({ tool, icon, label }) => (
            <button
              key={tool}
              onClick={() => setCurrentTool(tool)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                currentTool === tool 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={label}
            >
              <i className={`${icon} text-lg`}></i>
            </button>
          ))}
        </div>

        {/* 메인 캔버스 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 상단 메뉴 바 */}
          <div className="bg-white border-b shadow-sm px-4 py-2 flex-shrink-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              {/* 파일 작업 버튼들 */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleUndo}
                  disabled={drawActions.length === 0 && textElements.length === 0}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-sm disabled:bg-gray-300 hover:bg-blue-600"
                  title={t.undo}
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
                <button
                  onClick={handleRedo}
                  disabled={redoActions.length === 0}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-sm disabled:bg-gray-300 hover:bg-blue-600"
                  title={t.redo}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
                <button
                  onClick={handleSave}
                  className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  title={t.save}
                >
                  <i className="bi bi-download"></i>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                  title={t.load}
                >
                  <i className="bi bi-upload"></i>
                </button>
                <button
                  onClick={handleClear}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  title={t.clear}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>

              {/* 색상 팔레트 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{t.colors}:</span>
                <div 
                  className="w-7 h-7 rounded border-2 border-gray-300 cursor-pointer"
                  style={{ backgroundColor: currentColor }}
                  onClick={() => setShowColorPicker(true)}
                />
                <div className="flex gap-1">
                  {basicColors.slice(0, 8).map(color => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-5 h-5 rounded border transition-all ${
                        currentColor === color ? 'border-gray-800 ring-1 ring-blue-300' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* 줌 컨트롤 */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoom(Math.max(zoom / 1.2, 0.3))}
                  className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center text-xs"
                  title={language === 'ko' ? '축소' : 'Zoom Out'}
                >
                  -
                </button>
                <span className="text-xs px-1 py-1 bg-gray-100 rounded min-w-[40px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(zoom * 1.2, 3))}
                  className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center text-xs"
                  title={language === 'ko' ? '확대' : 'Zoom In'}
                >
                  +
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="text-xs px-1 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  title={language === 'ko' ? '실제 크기' : 'Actual Size'}
                >
                  100%
                </button>
              </div>
            </div>
          </div>

          {/* 캔버스 영역 - 남은 공간을 모두 사용 */}
          <div 
            ref={containerRef}
            className="flex-1 bg-gray-200 p-2 relative overflow-auto"
          >
            <div className="h-full flex items-center justify-center">
              <div 
                className="relative bg-white shadow-xl border border-gray-300 rounded" 
                style={{ 
                  width: Math.min(CANVAS_WIDTH * zoom, window.innerWidth - 120), 
                  height: Math.min(CANVAS_HEIGHT * zoom, window.innerHeight - 200)
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="absolute top-0 left-0 w-full h-full rounded"
                  style={{ 
                    imageRendering: zoom > 1 ? 'pixelated' : 'auto'
                  }}
                  aria-label={language === 'ko' ? '그리기 캔버스' : 'Drawing canvas'}
                />
                <canvas
                  ref={overlayRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="absolute top-0 left-0 w-full h-full cursor-crosshair rounded"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={() => setIsDrawing(false)}
                  style={{ 
                    imageRendering: zoom > 1 ? 'pixelated' : 'auto'
                  }}
                  tabIndex={0}
                  aria-label={language === 'ko' ? '상호작용 레이어' : 'Interactive layer'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
              const img = new Image()
              img.onload = () => {
                const canvas = canvasRef.current
                const ctx = canvas?.getContext('2d')
                if (!canvas || !ctx) return

                // 기존 내용 유지하면서 이미지 추가
                const scale = Math.min(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height)
                const width = img.width * scale
                const height = img.height * scale
                const x = (CANVAS_WIDTH - width) / 2
                const y = (CANVAS_HEIGHT - height) / 2
                
                ctx.drawImage(img, x, y, width, height)
              }
              img.src = e.target?.result as string
            }
            reader.readAsDataURL(file)
          }
        }}
        className="hidden"
      />

      {/* 색상 선택 모달 */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">{t.colorPicker}</h3>
            
            {/* 색상 팔레트 */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              {extendedColors.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setCurrentColor(color)
                    setShowColorPicker(false)
                  }}
                  className={`w-8 h-8 rounded border-2 transition-transform hover:scale-110 ${
                    currentColor === color ? 'border-gray-800 ring-2 ring-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* 커스텀 색상 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {language === 'ko' ? '커스텀 색상:' : 'Custom Color:'}
              </label>
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-full h-12 border border-gray-300 rounded cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowColorPicker(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {language === 'ko' ? '닫기' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 텍스트 입력 모달 */}
      {isAddingText && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ko' ? '텍스트 추가' : 'Add Text'}
            </h3>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t.textPrompt}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddText()
                } else if (e.key === 'Escape') {
                  setIsAddingText(false)
                  setTextInput('')
                }
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsAddingText(false)
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