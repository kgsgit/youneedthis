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
  
  // 캔버스 크기를 동적으로 계산
  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 700 })
  const CANVAS_WIDTH = canvasSize.width
  const CANVAS_HEIGHT = canvasSize.height
  
  const [currentTool, setCurrentTool] = useState<Tool>('brush')
  const [currentColor, setCurrentColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(3)
  const [textSize, setTextSize] = useState(20)
  const [zoom, setZoom] = useState(1) // 기본 100% 크기로 시작
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawActions, setDrawActions] = useState<DrawAction[]>([])
  const [redoActions, setRedoActions] = useState<DrawAction[]>([])
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isResizing: false,
    dragOffset: { x: 0, y: 0 },
    elementId: null,
    resizeHandle: null
  })
  
  // 모달 상태들
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isAddingText, setIsAddingText] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [textPosition, setTextPosition] = useState<Point>({ x: 0, y: 0 })

  const content = {
    ko: {
      title: '그림판',
      tools: '도구',
      select: '선택',
      brush: '브러시',
      pencil: '연필',
      eraser: '지우개',
      bucket: '채우기',
      text: '텍스트',
      line: '직선',
      rectangle: '사각형',
      circle: '원',
      colors: '색상',
      size: '크기',
      undo: '실행 취소',
      redo: '다시 실행',
      clear: '모두 지우기',
      save: '저장',
      load: '불러오기',
      print: '인쇄',
      textPrompt: '텍스트를 입력하세요',
      colorPicker: '색상 선택',
      zoomIn: '확대',
      zoomOut: '축소',
      fitToScreen: '화면에 맞추기'
    },
    en: {
      title: 'Paint',
      tools: 'Tools',
      select: 'Select',
      brush: 'Brush',
      pencil: 'Pencil',
      eraser: 'Eraser',
      bucket: 'Fill',
      text: 'Text',
      line: 'Line',
      rectangle: 'Rectangle',
      circle: 'Circle',
      colors: 'Colors',
      size: 'Size',
      undo: 'Undo',
      redo: 'Redo',
      clear: 'Clear All',
      save: 'Save',
      load: 'Load',
      print: 'Print',
      textPrompt: 'Enter text',
      colorPicker: 'Color Picker',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      fitToScreen: 'Fit to Screen'
    }
  }

  const t = content[language]

  // 도구 버튼 배열 메모이제이션
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

  // 기본 색상들
  const basicColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#808080', '#C0C0C0', '#800000', '#008000'
  ]

  // 확장 색상 팔레트
  const extendedColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#808080', '#C0C0C0', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080',
    '#FFFFE0', '#FFE4B5', '#FFDEAD', '#F0E68C', '#BDB76B', '#90EE90', '#98FB98', '#AFEEEE',
    '#87CEEB', '#B0E0E6', '#E6E6FA', '#DDA0DD', '#FFB6C1', '#FFC0CB', '#FA8072', '#F0FFFF'
  ]

  // 캔버스 초기화
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    const ctx = canvas?.getContext('2d')
    const overlayCtx = overlay?.getContext('2d')
    
    if (!canvas || !overlay || !ctx || !overlayCtx) return

    // 메인 캔버스 설정
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // 오버레이 캔버스 설정
    overlay.width = CANVAS_WIDTH
    overlay.height = CANVAS_HEIGHT
  }, [])

  // 정확한 마우스 위치 계산 (zoom 고려)
  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / (rect.width * zoom)
    const scaleY = canvas.height / (rect.height * zoom)
    
    return {
      x: ((e.clientX - rect.left) / zoom) * scaleX,
      y: ((e.clientY - rect.top) / zoom) * scaleY
    }
  }, [zoom])

  // 메인 캔버스 그리기
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
  }, [drawActions, textElements])

  // 오버레이 그리기 (선택 상자와 핸들)
  const redrawOverlay = useCallback(() => {
    const overlay = overlayRef.current
    const ctx = overlay?.getContext('2d')
    if (!overlay || !ctx) return

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // 선택된 텍스트의 경계 상자
    textElements.forEach(textEl => {
      if (textEl.isSelected) {
        const metrics = measureText(textEl)
        const bounds = {
          x: textEl.x - 5,
          y: textEl.y - textEl.fontSize - 5,
          width: metrics.width + 10,
          height: textEl.fontSize + 10
        }

        // 선택 상자
        ctx.strokeStyle = '#0066CC'
        ctx.setLineDash([4, 4])
        ctx.lineWidth = 1
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height)

        // 리사이즈 핸들
        const handleSize = 8
        const handles = [
          { x: bounds.x, y: bounds.y, type: 'nw' },
          { x: bounds.x + bounds.width, y: bounds.y, type: 'ne' },
          { x: bounds.x, y: bounds.y + bounds.height, type: 'sw' },
          { x: bounds.x + bounds.width, y: bounds.y + bounds.height, type: 'se' }
        ]

        ctx.setLineDash([])
        ctx.fillStyle = '#0066CC'
        handles.forEach(handle => {
          ctx.fillRect(
            handle.x - handleSize / 2, 
            handle.y - handleSize / 2, 
            handleSize, 
            handleSize
          )
        })
      }
    })
  }, [textElements])

  // 텍스트 크기 측정
  const measureText = useCallback((textEl: TextElement) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return { width: 0, height: 0 }

    ctx.font = `${textEl.fontSize}px ${textEl.font}`
    const metrics = ctx.measureText(textEl.text)
    return {
      width: metrics.width,
      height: textEl.fontSize
    }
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
  }, [])

  // 그리기 액션 실행
  const executeDrawAction = (ctx: CanvasRenderingContext2D, action: DrawAction) => {
    ctx.strokeStyle = action.color
    ctx.fillStyle = action.color
    ctx.lineWidth = action.size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (action.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
    } else {
      ctx.globalCompositeOperation = 'source-over'
    }

    switch (action.tool) {
      case 'brush':
      case 'pencil':
      case 'eraser':
        if (action.points.length > 1) {
          ctx.beginPath()
          ctx.moveTo(action.points[0].x, action.points[0].y)
          for (let i = 1; i < action.points.length; i++) {
            if (action.tool === 'pencil') {
              ctx.lineTo(action.points[i].x, action.points[i].y)
            } else {
              const prevPoint = action.points[i - 1]
              const currentPoint = action.points[i]
              const cpx = (prevPoint.x + currentPoint.x) / 2
              const cpy = (prevPoint.y + currentPoint.y) / 2
              ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpx, cpy)
            }
          }
          ctx.stroke()
        }
        break

      case 'line':
        if (action.points.length >= 2) {
          ctx.beginPath()
          ctx.moveTo(action.points[0].x, action.points[0].y)
          ctx.lineTo(action.points[1].x, action.points[1].y)
          ctx.stroke()
        }
        break

      case 'rectangle':
        if (action.points.length >= 2) {
          const width = action.points[1].x - action.points[0].x
          const height = action.points[1].y - action.points[0].y
          ctx.strokeRect(action.points[0].x, action.points[0].y, width, height)
        }
        break

      case 'circle':
        if (action.points.length >= 2) {
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
  }

  // 텍스트 히트 테스트
  const hitTestText = useCallback((pos: Point): TextElement | null => {
    for (let i = textElements.length - 1; i >= 0; i--) {
      const textEl = textElements[i]
      const metrics = measureText(textEl)
      
      if (pos.x >= textEl.x && pos.x <= textEl.x + metrics.width &&
          pos.y >= textEl.y - textEl.fontSize && pos.y <= textEl.y) {
        return textEl
      }
    }
    return null
  }, [textElements, measureText])

  // 리사이즈 핸들 히트 테스트
  const hitTestHandle = useCallback((pos: Point, textEl: TextElement) => {
    const metrics = measureText(textEl)
    const bounds = {
      x: textEl.x - 5,
      y: textEl.y - textEl.fontSize - 5,
      width: metrics.width + 10,
      height: textEl.fontSize + 10
    }

    const handleSize = 8
    const handles = [
      { x: bounds.x, y: bounds.y, type: 'nw' as const },
      { x: bounds.x + bounds.width, y: bounds.y, type: 'ne' as const },
      { x: bounds.x, y: bounds.y + bounds.height, type: 'sw' as const },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height, type: 'se' as const }
    ]

    for (const handle of handles) {
      if (pos.x >= handle.x - handleSize / 2 && pos.x <= handle.x + handleSize / 2 &&
          pos.y >= handle.y - handleSize / 2 && pos.y <= handle.y + handleSize / 2) {
        return handle.type
      }
    }
    return null
  }, [measureText])

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete 키로 선택된 텍스트 삭제
      if (e.key === 'Delete') {
        const selectedText = textElements.find(el => el.isSelected)
        if (selectedText) {
          setTextElements(prev => prev.filter(el => el.id !== selectedText.id))
          e.preventDefault()
        }
      }
      // Ctrl+Z 실행취소
      if (e.ctrlKey && e.key === 'z') {
        handleUndo()
        e.preventDefault()
      }
      // Ctrl+Y 다시실행
      if (e.ctrlKey && e.key === 'y') {
        handleRedo()
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [textElements])

  // 초기화 및 다시 그리기
  useEffect(() => {
    initCanvas()
  }, [initCanvas])

  useEffect(() => {
    redrawCanvas()
    redrawOverlay()
  }, [redrawCanvas, redrawOverlay])

  // 마우스 다운 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e)

    if (currentTool === 'select') {
      const hitText = hitTestText(pos)
      if (hitText) {
        const resizeHandle = hitTestHandle(pos, hitText)
        
        if (resizeHandle) {
          // 리사이즈 시작
          setDragState({
            isDragging: false,
            isResizing: true,
            dragOffset: { x: 0, y: 0 },
            elementId: hitText.id,
            resizeHandle
          })
        } else {
          // 드래그 시작
          setDragState({
            isDragging: true,
            isResizing: false,
            dragOffset: { x: pos.x - hitText.x, y: pos.y - hitText.y },
            elementId: hitText.id,
            resizeHandle: null
          })
        }

        // 텍스트 선택
        setTextElements(prev => prev.map(el => ({
          ...el,
          isSelected: el.id === hitText.id
        })))
        return
      } else {
        // 빈 공간 클릭 - 모든 선택 해제
        setTextElements(prev => prev.map(el => ({ ...el, isSelected: false })))
      }
      return
    }

    if (currentTool === 'text') {
      setIsAddingText(true)
      setTextPosition(pos)
      return
    }

    if (currentTool === 'bucket') {
      const newAction: DrawAction = {
        id: Date.now().toString(),
        tool: 'bucket',
        color: currentColor,
        size: brushSize,
        points: [pos]
      }
      setDrawActions([...drawActions, newAction])
      setRedoActions([])
      return
    }

    // 일반 그리기 도구
    setIsDrawing(true)
    const newAction: DrawAction = {
      id: Date.now().toString(),
      tool: currentTool,
      color: currentTool === 'eraser' ? '#FFFFFF' : currentColor,
      size: brushSize,
      points: [pos]
    }
    
    setDrawActions([...drawActions, newAction])
    setRedoActions([])
  }

  // 마우스 이동 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e)

    // 텍스트 드래그
    if (dragState.isDragging && dragState.elementId) {
      setTextElements(prev => prev.map(el => 
        el.id === dragState.elementId 
          ? { ...el, x: pos.x - dragState.dragOffset.x, y: pos.y - dragState.dragOffset.y }
          : el
      ))
      return
    }

    // 텍스트 리사이즈
    if (dragState.isResizing && dragState.elementId) {
      setTextElements(prev => prev.map(el => {
        if (el.id === dragState.elementId) {
          const deltaX = Math.abs(pos.x - el.x)
          const deltaY = Math.abs(pos.y - el.y)
          const newSize = Math.max(12, Math.min(deltaX, deltaY, 100))
          return { ...el, fontSize: newSize }
        }
        return el
      }))
      return
    }

    // 커서 변경
    if (currentTool === 'select') {
      const hitText = hitTestText(pos)
      if (hitText) {
        const handle = hitTestHandle(pos, hitText)
        if (handle) {
          e.currentTarget.style.cursor = 'nw-resize'
        } else {
          e.currentTarget.style.cursor = 'move'
        }
      } else {
        e.currentTarget.style.cursor = 'default'
      }
    } else {
      e.currentTarget.style.cursor = currentTool === 'text' ? 'text' : 'crosshair'
    }

    // 일반 그리기
    if (!isDrawing) return

    if (currentTool === 'brush' || currentTool === 'pencil' || currentTool === 'eraser') {
      setDrawActions(prev => {
        const newActions = [...prev]
        const currentAction = newActions[newActions.length - 1]
        if (currentAction) {
          currentAction.points.push(pos)
        }
        return newActions
      })
    }
  }

  // 마우스 업 핸들러
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e)

    // 드래그/리사이즈 종료
    if (dragState.isDragging || dragState.isResizing) {
      setDragState({
        isDragging: false,
        isResizing: false,
        dragOffset: { x: 0, y: 0 },
        elementId: null,
        resizeHandle: null
      })
      return
    }

    if (!isDrawing) return

    if (currentTool === 'line' || currentTool === 'rectangle' || currentTool === 'circle') {
      setDrawActions(prev => {
        const newActions = [...prev]
        const currentAction = newActions[newActions.length - 1]
        if (currentAction && currentAction.points.length === 1) {
          currentAction.points.push(pos)
        }
        return newActions
      })
    }

    setIsDrawing(false)
  }

  // 텍스트 추가
  const handleAddText = () => {
    if (textInput.trim()) {
      const newText: TextElement = {
        id: Date.now().toString(),
        text: textInput,
        x: textPosition.x,
        y: textPosition.y + textSize,
        fontSize: textSize,
        color: currentColor,
        font: 'Arial',
        isSelected: true
      }
      setTextElements([...textElements.map(el => ({ ...el, isSelected: false })), newText])
    }
    setTextInput('')
    setIsAddingText(false)
  }

  // 실행 취소 (텍스트 포함)
  const handleUndo = () => {
    if (textElements.length > 0) {
      // 텍스트 요소 우선 삭제
      const lastText = textElements[textElements.length - 1]
      setTextElements(prev => prev.slice(0, -1))
      return
    }
    if (drawActions.length > 0) {
      const lastAction = drawActions[drawActions.length - 1]
      setRedoActions([...redoActions, lastAction])
      setDrawActions(drawActions.slice(0, -1))
    }
  }

  // 다시 실행
  const handleRedo = () => {
    if (redoActions.length > 0) {
      const lastRedo = redoActions[redoActions.length - 1]
      setDrawActions([...drawActions, lastRedo])
      setRedoActions(redoActions.slice(0, -1))
    }
  }

  // 모두 지우기
  const handleClear = () => {
    if (confirm(language === 'ko' ? '모든 내용을 지우시겠습니까?' : 'Are you sure you want to clear everything?')) {
      setDrawActions([])
      setTextElements([])
      setRedoActions([])
      initCanvas()
    }
  }

  // 저장
  const handleSave = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const link = document.createElement('a')
      const filename = `drawing-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`
      link.download = filename
      link.href = canvas.toDataURL('image/png', 1.0)
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
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert(language === 'ko' ? '팝업이 차단되었습니다. 팝업을 허용해주세요.' : 'Popup blocked. Please allow popups.')
        return
      }

      const imgData = canvas.toDataURL('image/png', 1.0)
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
    <div className="max-w-7xl mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* 상단 도구 모음 */}
        <div className="mb-4 flex flex-wrap gap-2 justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleUndo}
              disabled={drawActions.length === 0 && textElements.length === 0}
              className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm disabled:bg-gray-300 hover:bg-blue-600 flex items-center gap-1"
              title={t.undo}
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
            <button
              onClick={handleRedo}
              disabled={redoActions.length === 0}
              className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm disabled:bg-gray-300 hover:bg-blue-600 flex items-center gap-1"
              title={t.redo}
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 flex items-center gap-1"
              title={t.clear}
            >
              <i className="bi bi-trash"></i>
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center gap-1"
              title={t.save}
            >
              <i className="bi bi-download"></i>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 flex items-center gap-1"
              title={t.load}
            >
              <i className="bi bi-upload"></i>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 flex items-center gap-1"
              title={t.print}
            >
              <i className="bi bi-printer"></i>
            </button>
          </div>
          
          {/* 줌 컨트롤 - 상단으로 이동 */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setZoom(Math.max(zoom / 1.2, 0.3))}
              className="w-8 h-8 bg-white hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center text-sm border"
              title={language === 'ko' ? '축소' : 'Zoom Out'}
            >
              -
            </button>
            <span className="text-xs px-2 py-1 bg-white rounded min-w-[50px] text-center border">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(zoom * 1.2, 3))}
              className="w-8 h-8 bg-white hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center text-sm border"
              title={language === 'ko' ? '확대' : 'Zoom In'}
            >
              +
            </button>
            <button
              onClick={() => setZoom(1)}
              className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded border"
              title={language === 'ko' ? '실제 크기' : 'Actual Size'}
            >
              100%
            </button>
          </div>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* 왼쪽 도구 패널 - 너비 축소 */}
          <div className="w-full lg:w-48 space-y-3">
            {/* 도구 선택 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3 text-center">{t.tools}</h3>
              <div className="grid grid-cols-3 gap-2">
                {toolButtons.map(({ tool, icon, label }) => (
                  <button
                    key={tool}
                    onClick={() => setCurrentTool(tool)}
                    className={`p-3 rounded text-xs transition-colors flex flex-col items-center justify-center min-h-[60px] gap-1 ${
                      currentTool === tool 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white hover:bg-gray-100 border border-gray-300'
                    }`}
                    title={label}
                  >
                    <i className={`${icon} text-lg`}></i>
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 크기 조절 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3 text-center">{t.size}</h4>
              <div className="flex items-center gap-3">
                {currentTool === 'text' ? (
                  <>
                    <span className="text-xs">8</span>
                    <input
                      type="range"
                      min="8"
                      max="72"
                      value={textSize}
                      onChange={(e) => setTextSize(Number(e.target.value))}
                      className="flex-1 h-3"
                    />
                    <span className="text-xs">72</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs">1</span>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="flex-1 h-3"
                    />
                    <span className="text-xs">50</span>
                  </>
                )}
              </div>
              <div className="text-center text-lg font-bold mt-2">
                {currentTool === 'text' ? `${textSize}px` : `${brushSize}px`}
              </div>
            </div>

            {/* 색상 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3 text-center">{t.colors}</h4>
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-16 h-16 rounded border-2 border-gray-300 cursor-pointer transition-transform hover:scale-105 shadow-sm"
                  style={{ backgroundColor: currentColor }}
                  onClick={() => setShowColorPicker(true)}
                />
                <div className="grid grid-cols-4 gap-2">
                  {basicColors.slice(0, 8).map(color => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                        currentColor === color ? 'border-gray-800 ring-2 ring-blue-500' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setShowColorPicker(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                >
                  {language === 'ko' ? '더보기...' : 'More...'}
                </button>
              </div>
            </div>

          </div>

          {/* 메인 캔버스 영역 */}
          <div className="flex-1">
            {/* 캔버스 컨테이너 */}
            <div className="border-2 border-gray-300 rounded-lg bg-gray-50 h-[750px] relative overflow-auto">
              <div className="flex items-center justify-center p-4 h-full">
                <div 
                  className="relative bg-white shadow-lg border border-gray-200" 
                  style={{ 
                    width: CANVAS_WIDTH * zoom, 
                    height: CANVAS_HEIGHT * zoom,
                    maxWidth: 'none'
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ 
                      imageRendering: zoom > 1 ? 'pixelated' : 'auto'
                    }}
                    aria-label={language === 'ko' ? '그리기 캔버스' : 'Drawing canvas'}
                  />
                  <canvas
                    ref={overlayRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="absolute top-0 left-0 w-full h-full cursor-crosshair"
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
                
                // 업로드된 이미지를 DrawAction으로 저장
                const imageAction: DrawAction = {
                  id: Date.now().toString(),
                  tool: 'bucket', // 임시로 bucket 사용
                  color: '#FFFFFF',
                  size: 1,
                  points: [{ x, y }, { x: x + width, y: y + height }]
                }
                setDrawActions(prev => [...prev, imageAction])
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