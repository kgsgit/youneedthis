'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CopyButton } from '@/components/ui/CopyButton'

interface IPLocationInfo {
  ip: string
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  zip: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
  asname: string
  mobile: boolean
  proxy: boolean
  hosting: boolean
  accuracy?: number
  district?: string
  carrier?: string
  connection?: string
  threat?: {
    level: 'low' | 'medium' | 'high'
    types: string[]
    score: number
  }
}

interface DeviceInfo {
  userAgent: string
  platform: string
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  deviceType: string
  isMobile: boolean
  language: string
  languages: string[]
  cookieEnabled: boolean
  javaEnabled: boolean
  screen: {
    width: number
    height: number
    colorDepth: number
    pixelRatio: number
  }
  timezone: {
    name: string
    offset: number
  }
  webgl: {
    vendor: string
    renderer: string
  }
  fingerprint: string
}

interface NetworkInfo {
  rtt: number
  downlink: number
  effectiveType: string
  saveData: boolean
}

interface GeolocationData {
  sources: {
    ipApi: IPLocationInfo | null
    ipStack: any | null
    maxMind: any | null
    ipInfo: any | null
  }
  consensus: IPLocationInfo | null
  confidence: number
  accuracy: {
    country: number
    city: number
    coordinates: number
  }
}

export function IPTracker() {
  const { language } = useLanguage()
  const [ipInput, setIpInput] = useState('')
  const [currentIP, setCurrentIP] = useState('')
  const [geolocationData, setGeolocationData] = useState<GeolocationData | null>(null)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [advancedMode, setAdvancedMode] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0) // 강제 리렌더링용

  useEffect(() => {
    setIsClient(true)
    getCurrentIP()
    collectNetworkInfo()
  }, [])

  // 현재 사용자의 IP 가져오기
  const getCurrentIP = async () => {
    if (typeof window === 'undefined') return
    
    setLoading(true)
    setError('')
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      setCurrentIP(data.ip)
      setIpInput(data.ip)
      await getAdvancedIPLocationInfo(data.ip)
    } catch (err) {
      setError('IP 주소를 가져올 수 없습니다.')
      console.error('IP fetch error:', err)
    }
    setLoading(false)
  }

  // 고급 IP 위치 정보 가져오기 (여러 소스 활용)
  const getAdvancedIPLocationInfo = async (ip: string) => {
    if (!ip || !isValidIP(ip)) {
      setError('올바른 IP 주소를 입력해주세요.')
      return
    }

    console.log('🔍 IP 조회 시작:', ip)
    setLoading(true)
    setError('')
    // 기존 데이터 완전 초기화 - 강제 리렌더링
    setGeolocationData(null)
    setDeviceInfo(null)
    setNetworkInfo(null)
    
    // React 상태 초기화를 위한 강제 대기
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      // 다중 IP 지오로케이션 API 동시 호출 (더 많은 소스 추가)
      const [ipApiCall, ipStackCall, ipInfoCall, freeGeoCall, geoJSCall, ipRegistryCall] = await Promise.allSettled([
        fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,asname,mobile,proxy,hosting,query`),
        fetch(`https://ipapi.co/${ip}/json/`),
        fetch(`https://ipinfo.io/${ip}/json`),
        fetch(`https://freegeoip.app/json/${ip}`),
        fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`),
        fetch(`https://api.ipregistry.co/${ip}?key=tryout`)
      ])

      const sources: any = {
        ipApi: null,
        ipStack: null,
        ipInfo: null,
        freeGeo: null,
        geoJS: null,
        ipRegistry: null
      }

      // IP-API 결과 처리
      if (ipApiCall.status === 'fulfilled') {
        try {
          const data = await ipApiCall.value.json()
          console.log('📍 IP-API 응답:', data)
          if (data.status === 'success') {
            sources.ipApi = {
              ...data,
              ip: ip, // 정확한 IP 보장
              accuracy: 85 // IP-API는 일반적으로 85% 정확도
            }
          }
        } catch (e) {
          console.error('IP-API 파싱 오류:', e)
        }
      }

      // IPAPI.co 결과 처리
      if (ipStackCall.status === 'fulfilled') {
        try {
          const data = await ipStackCall.value.json()
          if (!data.error) {
            sources.ipStack = {
              ...data,
              accuracy: 80
            }
          }
        } catch (e) {}
      }

      // IPInfo 결과 처리
      if (ipInfoCall.status === 'fulfilled') {
        try {
          const data = await ipInfoCall.value.json()
          if (!data.bogon) {
            const [lat, lon] = (data.loc || '0,0').split(',').map(Number)
            sources.ipInfo = {
              ip: data.ip,
              country: data.country,
              region: data.region,
              city: data.city,
              lat,
              lon,
              org: data.org,
              timezone: data.timezone,
              accuracy: 75
            }
          }
        } catch (e) {}
      }

      // FreeGeoIP 결과 처리
      if (freeGeoCall.status === 'fulfilled') {
        try {
          const data = await freeGeoCall.value.json()
          sources.freeGeo = {
            ...data,
            lat: data.latitude,
            lon: data.longitude,
            accuracy: 70
          }
        } catch (e) {}
      }

      // GeoJS 결과 처리
      if (geoJSCall.status === 'fulfilled') {
        try {
          const data = await geoJSCall.value.json()
          sources.geoJS = {
            ...data,
            lat: parseFloat(data.latitude),
            lon: parseFloat(data.longitude),
            accuracy: 75
          }
        } catch (e) {}
      }

      // IPRegistry 결과 처리 (높은 정확도)
      if (ipRegistryCall.status === 'fulfilled') {
        try {
          const data = await ipRegistryCall.value.json()
          if (data.location) {
            sources.ipRegistry = {
              ip: data.ip,
              country: data.location.country.code,
              region: data.location.region.name,
              city: data.location.city,
              lat: data.location.latitude,
              lon: data.location.longitude,
              timezone: data.time_zone.name,
              isp: data.connection.isp,
              org: data.connection.organization,
              as: data.connection.asn ? `AS${data.connection.asn}` : undefined,
              asname: data.connection.organization,
              accuracy: 90 // IPRegistry는 높은 정확도
            }
          }
        } catch (e) {}
      }

      // 다중 소스 데이터 통합 및 정확도 계산
      const consensus = calculateConsensus(sources, ip) // IP 전달
      const confidence = calculateConfidence(sources, consensus)
      
      // 고급 정확도 계산
      const accuracy = calculateAdvancedAccuracy(sources, consensus, confidence)
      
      const geoData: GeolocationData = {
        sources,
        consensus,
        confidence,
        accuracy
      }

      console.log('🔍 IP 검색 결과:', {
        ip,
        inputIP: ip,
        consensus,
        confidence,
        sourcesCount: Object.keys(sources).filter(k => sources[k]).length,
        allSources: sources
      })

      // 강제로 새로운 객체 생성하여 React 리렌더링 보장
      const newGeoData = JSON.parse(JSON.stringify({
        ...geoData,
        timestamp: Date.now(), // 타임스탬프 추가로 항상 새로운 데이터임을 보장
        searchedIP: ip // 검색한 IP 명시적 저장
      }))
      
      console.log('💾 setGeolocationData 호출:', newGeoData.consensus?.ip)
      // 함수형 업데이트로 강제 상태 변경
      setGeolocationData(() => newGeoData)
      // 컴포넌트 강제 리렌더링
      setForceUpdate(prev => prev + 1)

      // 기기 정보도 함께 수집 (내 IP인 경우)
      if (typeof window !== 'undefined' && ip === currentIP) {
        await collectAdvancedDeviceInfo()
      }

      // 위협 분석 수행
      if (consensus) {
        await analyzeThreatLevel(consensus)
      }

    } catch (err: any) {
      setError(err.message || 'IP 정보를 가져오는 중 오류가 발생했습니다.')
      console.error('Location fetch error:', err)
    }
    setLoading(false)
  }

  // 다중 소스 데이터 통합 (고급 알고리즘)
  const calculateConsensus = (sources: any, targetIP: string): IPLocationInfo | null => {
    console.log('📊 Consensus 계산 시작:', { targetIP, sources })
    const validSources = Object.values(sources).filter(s => s !== null)
    console.log('✅ 유효한 소스 개수:', validSources.length)
    if (validSources.length === 0) return null

    // 1. 이상치 제거를 위한 클러스터링
    const coordinates = validSources
      .filter((source: any) => source.lat && source.lon)
      .map((source: any) => ({ lat: source.lat, lon: source.lon, source }))

    // 좌표간 거리가 너무 큰 이상치 제거
    const filteredCoords = removeOutliers(coordinates)

    // 2. 동적 가중치 계산 (정확도 + 일치도)
    let totalLat = 0, totalLon = 0, totalWeight = 0
    let countryVotes: {[key: string]: number} = {}
    let cityVotes: {[key: string]: number} = {}

    filteredCoords.forEach(({lat, lon, source}) => {
      // 기본 정확도 가중치
      let weight = source.accuracy || 50
      
      // ISP/조직 정보가 있으면 가중치 증가
      if (source.isp || source.org) weight *= 1.1
      
      // 상세 주소 정보가 있으면 가중치 증가
      if (source.district || source.zip) weight *= 1.05
      
      // 다른 소스들과의 일치도에 따른 가중치 조정
      const agreementBonus = calculateAgreementBonus(source, validSources)
      weight *= (1 + agreementBonus * 0.2)

      totalLat += lat * weight
      totalLon += lon * weight
      totalWeight += weight
      
      if (source.country) {
        countryVotes[source.country] = (countryVotes[source.country] || 0) + weight
      }
      
      if (source.city) {
        cityVotes[source.city] = (cityVotes[source.city] || 0) + weight
      }
    })

    // 최고 점수 항목 선택
    const topCountry = Object.keys(countryVotes).reduce((a, b) => 
      countryVotes[a] > countryVotes[b] ? a : b, '')
    const topCity = Object.keys(cityVotes).reduce((a, b) => 
      cityVotes[a] > cityVotes[b] ? a : b, '')

    // 최고 품질 소스에서 기본 데이터 가져오기
    const primarySource = validSources.length > 0 ? validSources.reduce((best: any, current: any) => 
      (current.accuracy || 0) > (best.accuracy || 0) ? current : best) : null

    return {
      ip: targetIP, // 입력받은 IP 주소를 정확히 반영
      country: topCountry || (primarySource as any)?.country || '',
      countryCode: (primarySource as any)?.countryCode || '',
      region: (primarySource as any)?.region || '',
      regionName: (primarySource as any)?.regionName || '',
      city: topCity || (primarySource as any)?.city || '',
      district: (primarySource as any)?.district || '',
      zip: (primarySource as any)?.zip || '',
      lat: totalWeight > 0 ? totalLat / totalWeight : (primarySource as any)?.lat || 0,
      lon: totalWeight > 0 ? totalLon / totalWeight : (primarySource as any)?.lon || 0,
      timezone: (primarySource as any)?.timezone || '',
      isp: (primarySource as any)?.isp || '',
      org: (primarySource as any)?.org || '',
      as: (primarySource as any)?.as || '',
      asname: (primarySource as any)?.asname || '',
      mobile: (primarySource as any)?.mobile || false,
      proxy: (primarySource as any)?.proxy || false,
      hosting: (primarySource as any)?.hosting || false,
      accuracy: Math.round(totalWeight / validSources.length)
    }
  }

  // 신뢰도 계산
  const calculateConfidence = (sources: any, consensus: any): number => {
    if (!consensus) return 0

    const validSources = Object.values(sources).filter(s => s !== null)
    let agreements = 0
    let totalChecks = 0

    validSources.forEach((source: any) => {
      // 국가 일치도
      if (source.country === consensus.country) agreements++
      totalChecks++

      // 도시 일치도
      if (source.city === consensus.city) agreements++
      totalChecks++

      // 좌표 근사치 일치도 (1km 이내)
      if (source.lat && source.lon && consensus.lat && consensus.lon) {
        const distance = calculateDistance(
          source.lat, source.lon, 
          consensus.lat, consensus.lon
        )
        if (distance < 1) agreements++
      }
      totalChecks++
    })

    return totalChecks > 0 ? agreements / totalChecks : 0
  }

  // 거리 계산 (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // 이상치 제거 함수
  const removeOutliers = (coordinates: any[]): any[] => {
    if (coordinates.length < 3) return coordinates

    // 모든 좌표 쌍 간의 거리 계산
    const distances: number[] = []
    for (let i = 0; i < coordinates.length; i++) {
      for (let j = i + 1; j < coordinates.length; j++) {
        const dist = calculateDistance(
          coordinates[i].lat, coordinates[i].lon,
          coordinates[j].lat, coordinates[j].lon
        )
        distances.push(dist)
      }
    }

    // 중간값 계산
    distances.sort((a, b) => a - b)
    const median = distances[Math.floor(distances.length / 2)]
    
    // 중간값의 3배를 초과하는 거리를 가진 이상치 제거
    const threshold = median * 3
    const center = {
      lat: coordinates.reduce((sum, c) => sum + c.lat, 0) / coordinates.length,
      lon: coordinates.reduce((sum, c) => sum + c.lon, 0) / coordinates.length
    }

    return coordinates.filter(coord => {
      const distFromCenter = calculateDistance(coord.lat, coord.lon, center.lat, center.lon)
      return distFromCenter <= threshold
    })
  }

  // 소스 간 일치도 계산
  const calculateAgreementBonus = (source: any, allSources: any[]): number => {
    let agreements = 0
    let totalChecks = 0

    allSources.forEach(other => {
      if (other === source) return

      // 국가 일치
      if (source.country && other.country) {
        if (source.country === other.country) agreements++
        totalChecks++
      }

      // 도시 일치
      if (source.city && other.city) {
        if (source.city === other.city) agreements++
        totalChecks++
      }

      // ISP 일치
      if (source.isp && other.isp) {
        if (source.isp === other.isp) agreements++
        totalChecks++
      }

      // 좌표 근접성 (5km 이내)
      if (source.lat && source.lon && other.lat && other.lon) {
        const distance = calculateDistance(source.lat, source.lon, other.lat, other.lon)
        if (distance <= 5) agreements++
        totalChecks++
      }
    })

    return totalChecks > 0 ? agreements / totalChecks : 0
  }

  // 고급 정확도 계산
  const calculateAdvancedAccuracy = (sources: any, consensus: any, confidence: number) => {
    if (!consensus) return { country: 30, city: 20, coordinates: 15 }

    const validSources = Object.values(sources).filter(s => s !== null)
    const sourceCount = validSources.length

    // 기본 정확도 (소스 수에 따라 증가)
    let baseAccuracy = Math.min(40 + sourceCount * 8, 70)
    
    // 신뢰도에 따른 보정
    const confidenceMultiplier = Math.max(0.3, confidence)
    
    // 고품질 소스 보너스
    const highQualitySources = validSources.filter((s: any) => (s.accuracy || 0) >= 85)
    const qualityBonus = highQualitySources.length * 5

    // 좌표 분산도 계산 (좌표들이 얼마나 집중되어 있는지)
    let coordinateDispersion = 0
    const coordSources = validSources.filter((s: any) => s.lat && s.lon)
    if (coordSources.length > 1) {
      let latSum = 0
      let lonSum = 0
      coordSources.forEach((s: any) => {
        latSum += Number(s.lat) || 0
        lonSum += Number(s.lon) || 0
      })
      const avgLat = latSum / coordSources.length
      const avgLon = lonSum / coordSources.length
      
      let dispersionSum = 0
      coordSources.forEach((s: any) => {
        dispersionSum += calculateDistance(Number(s.lat) || 0, Number(s.lon) || 0, avgLat, avgLon)
      })
      coordinateDispersion = dispersionSum / coordSources.length
    }

    // 분산도가 낮을수록 정확도 증가
    const dispersionPenalty = Math.min(coordinateDispersion * 2, 20)

    return {
      country: Math.min(95, Math.max(50, 
        (baseAccuracy + qualityBonus + 25) * confidenceMultiplier - dispersionPenalty * 0.5
      )),
      city: Math.min(90, Math.max(35, 
        (baseAccuracy + qualityBonus + 10) * confidenceMultiplier - dispersionPenalty * 0.8
      )),
      coordinates: Math.min(85, Math.max(25, 
        (baseAccuracy + qualityBonus) * confidenceMultiplier - dispersionPenalty
      ))
    }
  }

  // 위협 수준 분석
  const analyzeThreatLevel = async (locationInfo: IPLocationInfo) => {
    let threatScore = 0
    const threatTypes: string[] = []

    // 프록시/VPN 탐지
    if (locationInfo.proxy) {
      threatScore += 30
      threatTypes.push('Proxy/VPN')
    }

    // 호스팅 서비스 탐지
    if (locationInfo.hosting) {
      threatScore += 25
      threatTypes.push('Hosting Service')
    }

    // Tor 네트워크 탐지 (기본적인 AS 번호 확인)
    if (locationInfo.as && (
      locationInfo.as.includes('Tor') || 
      locationInfo.asname?.toLowerCase().includes('tor')
    )) {
      threatScore += 50
      threatTypes.push('Tor Network')
    }

    // 알려진 악성 AS 확인 (예시)
    const suspiciousAS = ['AS13335', 'AS15169', 'AS8075'] // 예시 목록
    if (locationInfo.as && suspiciousAS.some(as => locationInfo.as.includes(as))) {
      threatScore += 20
      threatTypes.push('Suspicious AS')
    }

    // 위협 수준 결정
    let threatLevel: 'low' | 'medium' | 'high' = 'low'
    if (threatScore >= 50) threatLevel = 'high'
    else if (threatScore >= 25) threatLevel = 'medium'

    // 기존 locationInfo에 위협 정보 추가
    if (geolocationData?.consensus) {
      geolocationData.consensus.threat = {
        level: threatLevel,
        types: threatTypes,
        score: threatScore
      }
      setGeolocationData({...geolocationData})
    }
  }

  // 고급 기기 정보 수집
  const collectAdvancedDeviceInfo = async () => {
    if (typeof window === 'undefined') return

    const nav = navigator as any
    
    // 브라우저 정보 상세 분석
    const userAgent = nav.userAgent
    let browser = 'Unknown', browserVersion = 'Unknown'
    let os = 'Unknown', osVersion = 'Unknown'
    
    // Chrome
    if (userAgent.includes('Chrome')) {
      const match = userAgent.match(/Chrome\/([0-9.]+)/)
      browser = 'Chrome'
      browserVersion = match ? match[1] : 'Unknown'
    }
    // Firefox
    else if (userAgent.includes('Firefox')) {
      const match = userAgent.match(/Firefox\/([0-9.]+)/)
      browser = 'Firefox'
      browserVersion = match ? match[1] : 'Unknown'
    }
    // Safari
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      const match = userAgent.match(/Version\/([0-9.]+)/)
      browser = 'Safari'
      browserVersion = match ? match[1] : 'Unknown'
    }

    // OS 상세 정보
    if (userAgent.includes('Windows NT')) {
      const match = userAgent.match(/Windows NT ([0-9.]+)/)
      os = 'Windows'
      osVersion = match ? match[1] : 'Unknown'
    } else if (userAgent.includes('Mac OS X')) {
      const match = userAgent.match(/Mac OS X ([0-9_]+)/)
      os = 'macOS'
      osVersion = match ? match[1].replace(/_/g, '.') : 'Unknown'
    }

    // WebGL 정보 수집
    let webglInfo = { vendor: 'Unknown', renderer: 'Unknown' }
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          webglInfo = {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown',
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown'
          }
        }
      }
    } catch (e) {}

    // 고급 브라우저 지문 생성
    const fingerprint = await generateAdvancedFingerprint()

    const deviceInfo: DeviceInfo = {
      userAgent,
      platform: nav.platform,
      browser,
      browserVersion,
      os,
      osVersion,
      deviceType: /Mobi|Android|iPhone|iPad/i.test(userAgent) ? 'Mobile' : 'Desktop',
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
      language: nav.language,
      languages: nav.languages || [nav.language],
      cookieEnabled: nav.cookieEnabled,
      javaEnabled: typeof (nav as any).javaEnabled === 'function' ? nav.javaEnabled() : false,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio || 1
      },
      timezone: {
        name: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offset: new Date().getTimezoneOffset()
      },
      webgl: webglInfo,
      fingerprint
    }

    setDeviceInfo(deviceInfo)
  }

  // 고급 브라우저 지문 생성
  const generateAdvancedFingerprint = async (): Promise<string> => {
    const components: any = {}

    try {
      // Canvas fingerprint
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.textBaseline = 'top'
        ctx.font = '14px Arial'
        ctx.fillText('IP Tracker Advanced Fingerprint 🌍', 2, 2)
        components.canvas = canvas.toDataURL()
      }

      // WebGL fingerprint
      const webglCanvas = document.createElement('canvas')
      const gl = webglCanvas.getContext('webgl')
      if (gl) {
        components.webgl = gl.getParameter(gl.VERSION) + gl.getParameter(gl.RENDERER)
      }

      // Audio fingerprint
      if (window.AudioContext || (window as any).webkitAudioContext) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioCtx.createOscillator()
        const analyser = audioCtx.createAnalyser()
        oscillator.connect(analyser)
        components.audio = analyser.frequencyBinCount
      }

      // 플러그인 정보
      components.plugins = Array.from(navigator.plugins).map(p => p.name).join(',')

      // 폰트 감지 (일부)
      const testFonts = ['Arial', 'Helvetica', 'Times', 'Courier', 'Georgia', 'Verdana']
      components.fonts = testFonts.filter(font => {
        const span = document.createElement('span')
        span.style.fontFamily = font
        span.textContent = 'test'
        document.body.appendChild(span)
        const hasFont = span.offsetWidth !== 0
        document.body.removeChild(span)
        return hasFont
      }).join(',')

    } catch (e) {}

    return btoa(JSON.stringify(components)).substring(0, 32)
  }

  // 네트워크 정보 수집
  const collectNetworkInfo = () => {
    if (typeof window === 'undefined') return

    const nav = navigator as any
    if (nav.connection) {
      setNetworkInfo({
        rtt: nav.connection.rtt || 0,
        downlink: nav.connection.downlink || 0,
        effectiveType: nav.connection.effectiveType || 'unknown',
        saveData: nav.connection.saveData || false
      })
    }
  }

  // IP 주소 유효성 검사
  const isValidIP = (ip: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$/
    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
  }

  // IP 조회 실행
  const handleSearch = async () => {
    if (!ipInput.trim()) {
      setError('IP 주소를 입력해주세요.')
      return
    }
    const targetIP = ipInput.trim()
    console.log('🎯 handleSearch 호출됨:', targetIP)
    await getAdvancedIPLocationInfo(targetIP)
  }

  const content = {
    ko: {
      title: 'IP 추적기',
      subtitle: 'IP 주소로 위치, 통신사, 기기 종류를 즉시 확인',
      inputPlaceholder: 'IP 주소 입력 (예: 8.8.8.8)',
      myIP: '내 IP',
      search: '조회',
      searching: '조회 중...',
      advancedMode: '고급 모드',
      location: '위치 정보',
      device: '기기 정보',
      network: '네트워크 정보',
      isp: 'ISP 정보',
      security: '보안 분석',
      accuracy: '정확도 분석',
      multiSource: '다중 소스 검증',
      ipAddress: 'IP 주소',
      country: '국가',
      region: '지역',
      city: '도시',
      district: '구역',
      coordinates: '좌표',
      timezone: '시간대',
      postalCode: '우편번호',
      internetProvider: '인터넷 제공업체',
      organization: '조직',
      asNumber: 'AS 번호',
      connectionType: '연결 유형',
      browser: '브라우저',
      operatingSystem: '운영체제',
      deviceType: '기기 유형',
      platform: '플랫폼',
      language: '언어',
      confidence: '신뢰도',
      threatLevel: '위협 수준',
      threatTypes: '위협 유형',
      fingerprint: '브라우저 지문',
      networkSpeed: '네트워크 속도',
      latency: '지연시간',
      effectiveType: '연결 품질',
      sources: '데이터 소스',
      consensus: '통합 결과',
      coordinateAccuracy: '좌표 정확도',
      locationAccuracy: '위치 정확도',
      openGoogleMaps: 'Google 지도 열기',
      openOpenStreetMap: 'OpenStreetMap 열기',
      copy: '복사',
      yes: '예',
      no: '아니오',
      low: '낮음',
      medium: '보통',
      high: '높음',
      unknown: '알 수 없음',
      accuracyNote: 'IP 위치는 여러 소스를 통합한 추정치이며, 실제 위치와 다를 수 있습니다.',
      privacyNote: '개인정보 보호를 위해 수집된 정보는 저장되지 않습니다.',
      proxyDetected: '프록시/VPN 감지됨',
      hostingService: '호스팅 서비스',
      torNetwork: 'Tor 네트워크',
      suspiciousAS: '의심스러운 AS'
    },
    en: {
      title: 'IP Tracker',
      subtitle: 'Instantly check location, ISP, and device type by IP address',
      inputPlaceholder: 'Enter IP address (e.g., 8.8.8.8)',
      myIP: 'My IP',
      search: 'Search',
      searching: 'Searching...',
      advancedMode: 'Advanced Mode',
      location: 'Location Information',
      device: 'Device Information',
      network: 'Network Information',
      isp: 'ISP Information',
      security: 'Security Analysis',
      accuracy: 'Accuracy Analysis',
      multiSource: 'Multi-Source Verification',
      ipAddress: 'IP Address',
      country: 'Country',
      region: 'Region',
      city: 'City',
      district: 'District',
      coordinates: 'Coordinates',
      timezone: 'Timezone',
      postalCode: 'Postal Code',
      internetProvider: 'Internet Service Provider',
      organization: 'Organization',
      asNumber: 'AS Number',
      connectionType: 'Connection Type',
      browser: 'Browser',
      operatingSystem: 'Operating System',
      deviceType: 'Device Type',
      platform: 'Platform',
      language: 'Language',
      confidence: 'Confidence',
      threatLevel: 'Threat Level',
      threatTypes: 'Threat Types',
      fingerprint: 'Browser Fingerprint',
      networkSpeed: 'Network Speed',
      latency: 'Latency',
      effectiveType: 'Connection Quality',
      sources: 'Data Sources',
      consensus: 'Consensus Result',
      coordinateAccuracy: 'Coordinate Accuracy',
      locationAccuracy: 'Location Accuracy',
      openGoogleMaps: 'Open Google Maps',
      openOpenStreetMap: 'Open OpenStreetMap',
      copy: 'Copy',
      yes: 'Yes',
      no: 'No',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      unknown: 'Unknown',
      accuracyNote: 'IP location is an integrated estimate from multiple sources and may differ from actual location.',
      privacyNote: 'Collected information is not stored to protect privacy.',
      proxyDetected: 'Proxy/VPN Detected',
      hostingService: 'Hosting Service',
      torNetwork: 'Tor Network',
      suspiciousAS: 'Suspicious AS'
    }
  }

  const currentContent = content[language]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-7">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🌍 {currentContent.title}
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          {currentContent.subtitle}
        </p>

        {/* IP 입력 및 검색 */}
        {isClient && (
          <div className="max-w-lg mx-auto mb-6">
            <div className="flex space-x-3 mb-4">
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={currentContent.inputPlaceholder}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono"
              />
              <button
                onClick={getCurrentIP}
                className="px-4 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                {currentContent.myIP}
              </button>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? currentContent.searching : currentContent.search}
              </button>
            </div>

            {/* 고급 모드 토글 */}
            <div className="flex items-center justify-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={advancedMode}
                  onChange={(e) => setAdvancedMode(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-700">🔬 {currentContent.advancedMode}</span>
              </label>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">{currentContent.searching}</span>
          </div>
          {advancedMode && (
            <p className="text-xs text-gray-500 mt-2">다중 소스에서 데이터를 수집하고 있습니다...</p>
          )}
        </div>
      )}

      {/* IP 위치 정보 */}
      {geolocationData?.consensus && !loading && (
        <div key={`results-${geolocationData.consensus.ip}-${Date.now()}-${forceUpdate}`} className="space-y-6">
          {/* 정확도 및 신뢰도 표시 (고급 모드) */}
          {advancedMode && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                📊 {currentContent.accuracy}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(geolocationData.confidence * 100)}%</div>
                  <div className="text-sm text-gray-600">{currentContent.confidence}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{geolocationData.accuracy.coordinates}%</div>
                  <div className="text-sm text-gray-600">{currentContent.coordinateAccuracy}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{Object.keys(geolocationData.sources).filter(k => geolocationData.sources[k]).length}</div>
                  <div className="text-sm text-gray-600">{currentContent.sources}</div>
                </div>
              </div>
            </div>
          )}

          {/* 지도 영역 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                📍 {currentContent.location}
              </h3>
              <div className="flex space-x-2">
                <a
                  href={`https://www.google.com/maps?q=${geolocationData.consensus.lat},${geolocationData.consensus.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {currentContent.openGoogleMaps}
                </a>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${geolocationData.consensus.lat}&mlon=${geolocationData.consensus.lon}&zoom=12`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  {currentContent.openOpenStreetMap}
                </a>
              </div>
            </div>
            
            {/* 임베디드 지도 */}
            <div className="w-full h-64 rounded-lg overflow-hidden border">
              <iframe
                key={`map-${geolocationData.consensus.ip}-${Date.now()}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${geolocationData.consensus.lon-0.01},${geolocationData.consensus.lat-0.01},${geolocationData.consensus.lon+0.01},${geolocationData.consensus.lat+0.01}&layer=mapnik&marker=${geolocationData.consensus.lat},${geolocationData.consensus.lon}&t=${Date.now()}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Location Map"
              ></iframe>
            </div>

            {/* 정확도 표시 */}
            {advancedMode && (
              <div className="mt-4 text-center">
                <span className="text-xs text-gray-500">
                  {currentContent.coordinateAccuracy}: ±{Math.round((100 - geolocationData.accuracy.coordinates) * 0.5)}km
                </span>
              </div>
            )}
          </div>

          {/* 상세 정보 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 위치 정보 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🌍 {currentContent.location}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{currentContent.ipAddress}:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-blue-600">{geolocationData.consensus.ip}</span>
                    <CopyButton text={geolocationData.consensus.ip} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{currentContent.country}:</span>
                  <span className="font-medium">{geolocationData.consensus.country} ({geolocationData.consensus.countryCode})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{currentContent.region}:</span>
                  <span className="font-medium">{geolocationData.consensus.regionName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{currentContent.city}:</span>
                  <span className="font-medium">{geolocationData.consensus.city}</span>
                </div>
                {geolocationData.consensus.district && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{currentContent.district}:</span>
                    <span className="font-medium">{geolocationData.consensus.district}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{currentContent.coordinates}:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">{geolocationData.consensus.lat.toFixed(6)}, {geolocationData.consensus.lon.toFixed(6)}</span>
                    <CopyButton text={`${geolocationData.consensus.lat}, ${geolocationData.consensus.lon}`} />
                  </div>
                </div>
                {geolocationData.consensus.zip && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{currentContent.postalCode}:</span>
                    <span className="font-medium">{geolocationData.consensus.zip}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{currentContent.timezone}:</span>
                  <span className="font-medium">{geolocationData.consensus.timezone}</span>
                </div>
              </div>
            </div>

            {/* ISP 정보 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🌐 {currentContent.isp}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{currentContent.internetProvider}:</span>
                  <span className="font-medium">{geolocationData.consensus.isp}</span>
                </div>
                {geolocationData.consensus.org && geolocationData.consensus.org !== geolocationData.consensus.isp && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{currentContent.organization}:</span>
                    <span className="font-medium">{geolocationData.consensus.org}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{currentContent.asNumber}:</span>
                  <span className="font-mono text-sm">{geolocationData.consensus.as}</span>
                </div>
                
                {/* 연결 유형 표시 */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {geolocationData.consensus.mobile && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        📱 Mobile
                      </span>
                    )}
                    {geolocationData.consensus.proxy && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        🛡️ {currentContent.proxyDetected}
                      </span>
                    )}
                    {geolocationData.consensus.hosting && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        🏢 {currentContent.hostingService}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 보안 분석 (고급 모드) */}
          {advancedMode && geolocationData.consensus.threat && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔒 {currentContent.security}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${
                    geolocationData.consensus.threat.level === 'high' ? 'text-red-600' :
                    geolocationData.consensus.threat.level === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {currentContent[geolocationData.consensus.threat.level]}
                  </div>
                  <div className="text-sm text-gray-600">{currentContent.threatLevel}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700 mb-2">{geolocationData.consensus.threat.score}</div>
                  <div className="text-sm text-gray-600">위험 점수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700 mb-2">{geolocationData.consensus.threat.types.length}</div>
                  <div className="text-sm text-gray-600">{currentContent.threatTypes}</div>
                </div>
              </div>
              
              {geolocationData.consensus.threat.types.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {geolocationData.consensus.threat.types.map((type, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      {currentContent[type.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')] || type}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 기기 정보 (내 IP인 경우) */}
          {deviceInfo && ipInput === currentIP && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📱 {currentContent.device}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{currentContent.browser}:</span>
                    <span className="font-medium">{deviceInfo.browser} {deviceInfo.browserVersion}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{currentContent.operatingSystem}:</span>
                    <span className="font-medium">{deviceInfo.os} {deviceInfo.osVersion}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{currentContent.deviceType}:</span>
                    <span className="font-medium">{deviceInfo.deviceType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{currentContent.platform}:</span>
                    <span className="font-medium">{deviceInfo.platform}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{currentContent.language}:</span>
                    <span className="font-medium">{deviceInfo.language}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">화면 해상도:</span>
                    <span className="font-medium">{deviceInfo.screen.width}x{deviceInfo.screen.height}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">색깔 깊이:</span>
                    <span className="font-medium">{deviceInfo.screen.colorDepth}bit</span>
                  </div>
                  {advancedMode && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{currentContent.fingerprint}:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs">{deviceInfo.fingerprint}</span>
                        <CopyButton text={deviceInfo.fingerprint} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* WebGL 정보 (고급 모드) */}
              {advancedMode && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">WebGL 정보</h4>
                  <div className="text-xs text-gray-600">
                    <p>Vendor: {deviceInfo.webgl.vendor}</p>
                    <p>Renderer: {deviceInfo.webgl.renderer}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 네트워크 정보 (고급 모드) */}
          {advancedMode && networkInfo && ipInput === currentIP && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📡 {currentContent.network}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{currentContent.latency}:</span>
                    <span className="font-medium">{networkInfo.rtt}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{currentContent.networkSpeed}:</span>
                    <span className="font-medium">{networkInfo.downlink}Mbps</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{currentContent.effectiveType}:</span>
                    <span className="font-medium">{networkInfo.effectiveType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Data Saver:</span>
                    <span className="font-medium">{networkInfo.saveData ? currentContent.yes : currentContent.no}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 주의사항 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">{currentContent.accuracy}</h4>
            <p className="text-sm text-blue-700 mb-2">{currentContent.accuracyNote}</p>
            <p className="text-xs text-blue-600">{currentContent.privacyNote}</p>
            {advancedMode && geolocationData.confidence && (
              <p className="text-xs text-blue-600 mt-2">
                현재 결과의 신뢰도: {Math.round(geolocationData.confidence * 100)}% (다중 소스 검증)
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}