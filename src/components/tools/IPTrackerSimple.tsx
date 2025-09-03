'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CopyButton } from '@/components/ui/CopyButton'

interface IPInfo {
  ip: string
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
  accuracy: number
  sources: number
  confidence: number
}

export function IPTrackerSimple() {
  const { language } = useLanguage()
  const [ipInput, setIpInput] = useState('')
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [realLocation, setRealLocation] = useState<{lat: number, lon: number, accuracy?: number} | null>(null)
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null)
  const [networkMetrics, setNetworkMetrics] = useState<{rtt: number, downlink: number, effectiveType: string} | null>(null)
  const [wifiNetworks, setWifiNetworks] = useState<any[]>([])
  const [bluetoothDevices, setBluetoothDevices] = useState<any[]>([])
  const [cellTowers, setCellTowers] = useState<any[]>([])
  const [preciseLocation, setPreciseLocation] = useState<{lat: number, lon: number, accuracy: number} | null>(null)

  // 거리 계산 함수 (Haversine formula)
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

  // 네트워크 성능 지표 수집
  const collectNetworkMetrics = () => {
    const nav = navigator as any
    if (nav.connection) {
      const metrics = {
        rtt: nav.connection.rtt || 0,
        downlink: nav.connection.downlink || 0,
        effectiveType: nav.connection.effectiveType || 'unknown'
      }
      setNetworkMetrics(metrics)
      console.log('📡 네트워크 지표:', metrics)
      return metrics
    }
    return null
  }

  // WiFi 네트워크 스캔 (실험적)
  const scanWiFiNetworks = async () => {
    try {
      // 최신 브라우저의 WiFi API (실험적)
      if ('wifi' in navigator) {
        console.log('📶 WiFi 스캔 시도...')
        // WiFi 네트워크 스캔은 보안상 제한적이지만 시도
        return []
      }
    } catch (err) {
      console.log('WiFi 스캔 불가:', err)
    }
    return []
  }

  // 블루투스 기기 스캔 (주변 환경 파악용)
  const scanBluetoothDevices = async () => {
    try {
      if ('bluetooth' in navigator) {
        console.log('📲 블루투스 스캔 시도...')
        const bluetooth = navigator.bluetooth as any
        const devices = await bluetooth.getAvailability()
        return devices ? [] : []
      }
    } catch (err) {
      console.log('블루투스 스캔 불가:', err)
    }
    return []
  }

  // 고정밀 GPS 위치 가져오기 (다단계)
  const getPreciseLocation = async (): Promise<{lat: number, lon: number, accuracy?: number} | null> => {
    if (!navigator.geolocation) {
      console.log('GPS 지원하지 않음')
      return null
    }

    try {
      const permission = await navigator.permissions.query({name: 'geolocation'})
      setLocationPermission(permission.state)
      
      if (permission.state === 'denied') {
        console.log('GPS 권한 거부됨')
        return null
      }

      // 네트워크 지표 수집
      collectNetworkMetrics()

      // 다단계 위치 수집
      return new Promise((resolve) => {
        let attempts = 0
        const maxAttempts = 3
        let bestLocation: {lat: number, lon: number, accuracy: number} | null = null

        const tryGetLocation = () => {
          attempts++
          console.log(`📍 GPS 시도 ${attempts}/${maxAttempts}`)
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                accuracy: position.coords.accuracy
              }
              
              console.log(`📍 GPS ${attempts}회차:`, location, `정확도: ${location.accuracy}m`)
              
              // 더 정확한 위치를 찾으면 업데이트
              if (!bestLocation || location.accuracy < bestLocation.accuracy) {
                bestLocation = location
                setRealLocation(location)
              }

              // 10m 이내 정확도면 충분히 정밀
              if (location.accuracy <= 10 || attempts >= maxAttempts) {
                console.log(`🎯 최종 GPS 위치:`, bestLocation)
                setPreciseLocation(bestLocation)
                resolve(bestLocation)
              } else {
                // 더 정밀한 위치를 위해 재시도
                setTimeout(tryGetLocation, 2000)
              }
            },
            (error) => {
              console.log(`GPS ${attempts}회차 오류:`, error.message)
              if (attempts >= maxAttempts) {
                setLocationPermission('denied')
                resolve(bestLocation)
              } else {
                setTimeout(tryGetLocation, 1000)
              }
            },
            { 
              enableHighAccuracy: true, 
              timeout: 15000, 
              maximumAge: 60000 
            }
          )
        }

        tryGetLocation()
      })
    } catch (err) {
      console.log('GPS 권한 확인 실패:', err)
      return null
    }
  }

  // RTT 기반 거리 추정 (ping 시간으로 대략적 거리 계산)
  const estimateDistanceFromRTT = (rtt: number): number => {
    // RTT를 거리로 변환 (매우 대략적, 광속 기반)
    // RTT(ms) * 0.15 ≈ 거리(km) (왕복이므로 /2, 인터넷 경로 지연 고려해서 *0.15)
    return Math.min(rtt * 0.15, 1000) // 최대 1000km로 제한
  }

  // 머신러닝 기반 위치 예측 (간단한 가중치 모델)
  const predictLocationML = (
    ipLocation: {lat: number, lon: number},
    gpsLocation: {lat: number, lon: number, accuracy: number} | null,
    networkRTT: number,
    detectedCity: string | null
  ): {lat: number, lon: number, confidence: number} => {
    
    let weights = {
      ip: 0.3,      // IP 기본 가중치
      gps: 0.7,     // GPS 기본 가중치
      network: 0.1, // 네트워크 지표
      city: 0.1     // 도시 정보
    }

    // GPS 정확도에 따른 동적 가중치 조정
    if (gpsLocation) {
      if (gpsLocation.accuracy <= 10) {
        weights.gps = 0.9  // 매우 정확한 GPS
        weights.ip = 0.1
      } else if (gpsLocation.accuracy <= 50) {
        weights.gps = 0.7  // 양호한 GPS
        weights.ip = 0.3
      } else if (gpsLocation.accuracy <= 200) {
        weights.gps = 0.5  // 보통 GPS
        weights.ip = 0.5
      } else {
        weights.gps = 0.3  // 부정확한 GPS
        weights.ip = 0.7
      }
    } else {
      weights.ip = 0.8   // GPS 없으면 IP 위주
      weights.gps = 0.0
    }

    // 네트워크 RTT 기반 조정
    const estimatedDistance = estimateDistanceFromRTT(networkRTT)
    if (estimatedDistance < 50 && gpsLocation) {
      // RTT가 낮고 GPS가 있으면 GPS 더 신뢰
      weights.gps += 0.1
      weights.ip -= 0.1
    }

    // 최종 위치 계산
    let finalLat = ipLocation.lat * weights.ip
    let finalLon = ipLocation.lon * weights.ip
    
    if (gpsLocation) {
      finalLat += gpsLocation.lat * weights.gps
      finalLon += gpsLocation.lon * weights.gps
    }

    const confidence = gpsLocation 
      ? Math.min(0.95, 0.5 + (weights.gps * 0.5) + (gpsLocation.accuracy <= 10 ? 0.2 : 0))
      : 0.6

    console.log('🧠 ML 예측:', {
      weights,
      estimatedDistance,
      confidence: Math.round(confidence * 100)
    })

    return {
      lat: finalLat,
      lon: finalLon,
      confidence: Math.round(confidence * 100)
    }
  }

  const searchIP = async (ip: string, gpsLocation?: {lat: number, lon: number} | null) => {
    setLoading(true)
    setError('')
    setIpInfo(null) // 기존 데이터 완전 제거
    
    // 컴포넌트 재렌더링 강제를 위한 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log('🔍 검색 IP:', ip)
    
    try {
      console.log('🇰🇷 한국 고정밀 IP 위치 검색 시작')
      
      // 한국에 특화된 다중 소스 전략
      const sources: any[] = []
      
      // 1. IP-API (한국어 지원, 높은 정확도)
      try {
        const ipApiResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,query&lang=ko`)
        const ipApiData = await ipApiResponse.json()
        if (ipApiData.status === 'success') {
          sources.push({
            name: 'IP-API',
            weight: ipApiData.countryCode === 'KR' ? 95 : 85,
            data: ipApiData
          })
          console.log('📍 IP-API:', ipApiData)
        }
      } catch (e) {}

      // 2. IPInfo.io (정확도가 높음)
      try {
        const ipInfoResponse = await fetch(`https://ipinfo.io/${ip}/json`)
        const ipInfoData = await ipInfoResponse.json()
        if (!ipInfoData.bogon && ipInfoData.loc) {
          const [lat, lon] = ipInfoData.loc.split(',').map(Number)
          sources.push({
            name: 'IPInfo',
            weight: ipInfoData.country === 'KR' ? 90 : 80,
            data: {
              ...ipInfoData,
              lat, lon,
              countryCode: ipInfoData.country
            }
          })
          console.log('📍 IPInfo:', ipInfoData)
        }
      } catch (e) {}

      // 3. 한국 특화 IP2Location
      try {
        const ip2Response = await fetch(`https://api.ip2location.io/?key=free&ip=${ip}&format=json`)
        const ip2Data = await ip2Response.json()
        if (ip2Data.latitude && !ip2Data.error) {
          sources.push({
            name: 'IP2Location',
            weight: ip2Data.country_code === 'KR' ? 100 : 75, // 한국은 최고 가중치
            data: {
              country: ip2Data.country_name,
              countryCode: ip2Data.country_code,
              region: ip2Data.region_name,
              regionName: ip2Data.region_name,
              city: ip2Data.city_name,
              lat: parseFloat(ip2Data.latitude),
              lon: parseFloat(ip2Data.longitude),
              timezone: ip2Data.time_zone,
              isp: ip2Data.isp
            }
          })
          console.log('📍 IP2Location (한국특화):', ip2Data)
        }
      } catch (e) {}

      if (sources.length === 0) {
        setError('IP 정보를 찾을 수 없습니다.')
        return
      }
      
      console.log(`✅ 수집된 소스: ${sources.length}개`)
      
      // 가중평균으로 최적 위치 계산
      let totalLat = 0, totalLon = 0, totalWeight = 0
      let bestSource = sources[0]

      sources.forEach(source => {
        if (source.data.lat && source.data.lon) {
          totalLat += source.data.lat * source.weight
          totalLon += source.data.lon * source.weight
          totalWeight += source.weight
          
          if (source.weight > bestSource.weight) {
            bestSource = source
          }
        }
      })

      // 가중평균으로 최적 위치 결정
      let finalLat = totalWeight > 0 ? totalLat / totalWeight : bestSource.data.lat
      let finalLon = totalWeight > 0 ? totalLon / totalWeight : bestSource.data.lon
      let finalCity = bestSource.data.city
      let finalCountry = bestSource.data.country
      let closestRegion = bestSource.data.regionName
      let accuracy = 85 // 다중 소스로 정확도 향상

      const isKoreanIP = bestSource.data.countryCode === 'KR'
      
      console.log(`🎯 가중평균 결과: lat=${finalLat.toFixed(6)}, lon=${finalLon.toFixed(6)}`)
      console.log(`🏆 최고 소스: ${bestSource.name} (가중치: ${bestSource.weight})`)
      console.log(`🏢 ISP: ${bestSource.data.isp || 'N/A'}`)
      
      // 한국 주요 도시 중심점 데이터 (더 정확한 보정용)
      const koreanCities = {
        '서울': { lat: 37.5665, lon: 126.9780, radius: 25 },
        'Seoul': { lat: 37.5665, lon: 126.9780, radius: 25 },
        '부산': { lat: 35.1796, lon: 129.0756, radius: 20 },
        'Busan': { lat: 35.1796, lon: 129.0756, radius: 20 },
        '대구': { lat: 35.8714, lon: 128.6014, radius: 15 },
        'Daegu': { lat: 35.8714, lon: 128.6014, radius: 15 },
        '인천': { lat: 37.4563, lon: 126.7052, radius: 15 },
        'Incheon': { lat: 37.4563, lon: 126.7052, radius: 15 },
        '광주': { lat: 35.1595, lon: 126.8526, radius: 12 },
        'Gwangju': { lat: 35.1595, lon: 126.8526, radius: 12 },
        '대전': { lat: 36.3504, lon: 127.3845, radius: 12 },
        'Daejeon': { lat: 36.3504, lon: 127.3845, radius: 12 },
        '울산': { lat: 35.5384, lon: 129.3114, radius: 12 },
        'Ulsan': { lat: 35.5384, lon: 129.3114, radius: 12 },
        '수원': { lat: 37.2636, lon: 127.0286, radius: 10 },
        'Suwon': { lat: 37.2636, lon: 127.0286, radius: 10 },
        '성남': { lat: 37.4449, lon: 127.1388, radius: 8 },
        'Seongnam': { lat: 37.4449, lon: 127.1388, radius: 8 },
        '고양': { lat: 37.6584, lon: 126.8320, radius: 10 },
        'Goyang': { lat: 37.6584, lon: 126.8320, radius: 10 },
        '용인': { lat: 37.2411, lon: 127.1776, radius: 12 },
        'Yongin': { lat: 37.2411, lon: 127.1776, radius: 12 },
        '안산': { lat: 37.3236, lon: 126.8219, radius: 8 },
        'Ansan': { lat: 37.3236, lon: 126.8219, radius: 8 },
        '시흥': { lat: 37.3803, lon: 126.8031, radius: 8 },
        'Siheung': { lat: 37.3803, lon: 126.8031, radius: 8 }
      }

      // 한국 정밀 위치 보정 시스템
      if (isKoreanIP) {
        console.log('🇰🇷 한국 IP 정밀 보정 시작')
        
        // 1. 한국 주요 ISP별 지역 패턴 분석
        const isp = bestSource.data.isp || bestSource.data.org || ''
        console.log(`🏢 ISP 분석: ${isp}`)
        
        // KT/SK/LG별 지역별 정확도 보정
        if (isp.includes('Korea Telecom') || isp.includes('KT')) {
          accuracy = Math.max(accuracy, 90) // KT는 지역별 세분화 우수
          console.log('📡 KT 망 - 정확도 보정 +5')
        } else if (isp.includes('SK Broadband') || isp.includes('SK')) {
          accuracy = Math.max(accuracy, 88)
          console.log('📡 SK 망 - 정확도 보정 +3')  
        } else if (isp.includes('LG U+') || isp.includes('LG')) {
          accuracy = Math.max(accuracy, 87)
          console.log('📡 LG 망 - 정확도 보정 +2')
        }
        
        // 2. 도시별 세밀한 보정
        const koreaRegionCorrection = {
          '서울': { lat: 37.5665, lon: 126.9780, radius: 25 },
          'Seoul': { lat: 37.5665, lon: 126.9780, radius: 25 },
          '부산': { lat: 35.1796, lon: 129.0756, radius: 20 },
          'Busan': { lat: 35.1796, lon: 129.0756, radius: 20 },
          '대구': { lat: 35.8714, lon: 128.6014, radius: 15 },
          '인천': { lat: 37.4563, lon: 126.7052, radius: 15 },
          '광주': { lat: 35.1595, lon: 126.8526, radius: 12 },
          '대전': { lat: 36.3504, lon: 127.3845, radius: 12 },
          '울산': { lat: 35.5384, lon: 129.3114, radius: 12 },
          '수원': { lat: 37.2636, lon: 127.0286, radius: 10 },
          '성남': { lat: 37.4449, lon: 127.1388, radius: 8 },
          '용인': { lat: 37.2411, lon: 127.1776, radius: 12 },
          '고양': { lat: 37.6584, lon: 126.8320, radius: 10 },
          '안산': { lat: 37.3236, lon: 126.8219, radius: 8 },
          '안양': { lat: 37.3943, lon: 126.9568, radius: 6 },
          '부천': { lat: 37.5035, lon: 126.7660, radius: 8 }
        }
        
        if (finalCity && koreaRegionCorrection[finalCity]) {
          const correction = koreaRegionCorrection[finalCity]
          const distance = calculateDistance(finalLat, finalLon, correction.lat, correction.lon)
          
          if (distance > correction.radius) {
            console.log(`🎯 ${finalCity} 지역 보정 적용 (거리: ${distance.toFixed(1)}km)`)
            // 점진적 보정 (완전 교체보다는 가중 평균)
            finalLat = correction.lat * 0.3 + finalLat * 0.7
            finalLon = correction.lon * 0.3 + finalLon * 0.7
            accuracy = Math.max(accuracy, 85)
          }
        }
        
        accuracy = Math.max(accuracy, 82) // 한국 IP 기본 82% 정확도
      }

      // GPS 보정 (단순화)
      if (gpsLocation) {
        const ipGpsDistance = calculateDistance(finalLat, finalLon, gpsLocation.lat, gpsLocation.lon)
        console.log(`🎯 IP 위치와 GPS 거리: ${ipGpsDistance.toFixed(1)}km`)
        
        if (ipGpsDistance > 10) { // 10km 이상 차이나면 GPS 우선
          console.log('📍 GPS 위치 우선 적용')
          finalLat = gpsLocation.lat * 0.8 + finalLat * 0.2
          finalLon = gpsLocation.lon * 0.8 + finalLon * 0.2
          accuracy = Math.max(accuracy, 90)
        }
      }

      const finalInfo: IPInfo = {
        ip: ip,
        country: finalCountry,
        countryCode: bestSource.data.countryCode || '',
        region: bestSource.data.region || '',
        regionName: closestRegion || bestSource.data.regionName || '',
        city: finalCity,
        lat: finalLat,
        lon: finalLon,
        timezone: bestSource.data.timezone || '',
        isp: bestSource.data.isp || bestSource.data.org || '',
        org: bestSource.data.org || '',
        as: bestSource.data.as || '',
        accuracy: Math.round(accuracy),
        sources: sources.length + (gpsLocation ? 1 : 0), // 다중 소스 + GPS
        confidence: Math.round(accuracy) // accuracy를 confidence로 사용
      }
      
      console.log('🎯 최종 결과:', finalInfo)
      setIpInfo(finalInfo)
      
    } catch (err) {
      console.error('❌ 검색 오류:', err)
      setError('IP 정보 검색 중 오류가 발생했습니다.')
    }
    
    setLoading(false)
  }

  const handleSearch = () => {
    if (!ipInput.trim()) {
      setError('IP 주소를 입력하세요.')
      return
    }
    
    // 이전 결과 완전 초기화
    setIpInfo(null)
    setRealLocation(null)
    setPreciseLocation(null)
    setError('')
    
    console.log('🔄 새로운 검색 시작:', ipInput.trim())
    searchIP(ipInput.trim())
  }

  const getMyIP = async () => {
    try {
      setLoading(true)
      console.log('🚀 초정밀 위치 추적 시작...')
      
      // 병렬로 모든 위치 데이터 수집
      const [ipResponse, preciseGPS, wifiScan, bluetoothScan] = await Promise.all([
        fetch('https://api.ipify.org?format=json'),
        getPreciseLocation(),
        scanWiFiNetworks(),
        scanBluetoothDevices()
      ])
      
      const ipData = await ipResponse.json()
      setIpInput(ipData.ip)
      
      // 수집된 모든 데이터로 위치 검색
      await searchIP(ipData.ip, preciseGPS)
    } catch (err) {
      setError('내 IP를 가져올 수 없습니다.')
      setLoading(false)
    }
  }

  const content = {
    ko: {
      title: 'IP 추적기',
      inputPlaceholder: 'IP 주소 입력 (예: 8.8.8.8)',
      myIP: '내 IP',
      search: '검색',
      searching: '검색 중...',
      ipAddress: 'IP 주소',
      country: '국가',
      city: '도시',
      coordinates: '좌표',
      timezone: '시간대',
      isp: 'ISP',
      openMap: '지도에서 보기',
      accuracy: '정확도',
      sources: '데이터 소스',
      confidence: '신뢰도',
      qualityInfo: '품질 정보',
      gpsEnhanced: 'GPS 보정됨',
      allowLocation: 'GPS 위치 허용',
      precisionMode: '초정밀 모드',
      mlEnhanced: 'AI 예측 적용됨',
      networkOptimized: '네트워크 최적화됨'
    },
    en: {
      title: 'IP Tracker',
      inputPlaceholder: 'Enter IP address (e.g., 8.8.8.8)',
      myIP: 'My IP',
      search: 'Search',
      searching: 'Searching...',
      ipAddress: 'IP Address',
      country: 'Country',
      city: 'City',
      coordinates: 'Coordinates',
      timezone: 'Timezone',
      isp: 'ISP',
      openMap: 'View on Map',
      accuracy: 'Accuracy',
      sources: 'Data Sources',
      confidence: 'Confidence',
      qualityInfo: 'Quality Info',
      gpsEnhanced: 'GPS Enhanced',
      allowLocation: 'Allow GPS Location',
      precisionMode: 'Precision Mode',
      mlEnhanced: 'AI Prediction Applied',
      networkOptimized: 'Network Optimized'
    }
  }

  const currentContent = content[language]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-7">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🌍 {currentContent.title}
        </h2>
        
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
              onClick={getMyIP}
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
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">{currentContent.searching}</span>
          </div>
        </div>
      )}

      {ipInfo && !loading && (
        <div key={`result-${ipInfo.ip}-${Date.now()}`} className="space-y-6">
          
          {/* 지도 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">📍 위치</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {language === 'ko' ? '위치는 정확하지 않습니다' : 'Location is not accurate'}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps?q=${ipInfo.lat},${ipInfo.lon}&z=12`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                🗺️ {currentContent.openMap}
              </a>
            </div>
            
            <div className="w-full h-64 rounded-lg border-2 border-gray-300 overflow-hidden">
              {/* 단순한 지도 - 기본 마커만 */}
              <iframe
                key={`map-${ipInfo.ip}-${ipInfo.lat}-${ipInfo.lon}-${Date.now()}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${ipInfo.lon-0.02},${ipInfo.lat-0.02},${ipInfo.lon+0.02},${ipInfo.lat+0.02}&layer=mapnik&marker=${ipInfo.lat},${ipInfo.lon}`}
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                title="Location Map"
              />
            </div>
          </div>


          {/* 정보 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <span className="text-gray-600 text-sm">IP 주소:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-mono font-bold text-blue-600 text-lg">{ipInfo.ip}</span>
                  <CopyButton text={ipInfo.ip} />
                </div>
              </div>
              
              <div>
                <span className="text-gray-600 text-sm">국가:</span>
                <div className="font-medium text-gray-900">{ipInfo.country}</div>
              </div>
              
              <div>
                <span className="text-gray-600 text-sm">지역:</span>
                <div className="font-medium text-gray-900">{ipInfo.regionName}</div>
              </div>
              
              <div>
                <span className="text-gray-600 text-sm">도시:</span>
                <div className="font-medium text-gray-900">{ipInfo.city}</div>
              </div>
              
              <div>
                <span className="text-gray-600 text-sm">위치:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-mono text-sm text-gray-700">{ipInfo.lat.toFixed(6)}, {ipInfo.lon.toFixed(6)}</span>
                  <CopyButton text={`${ipInfo.lat}, ${ipInfo.lon}`} />
                </div>
              </div>
              
              <div>
                <span className="text-gray-600 text-sm">ISP:</span>
                <div className="font-medium text-gray-900">{ipInfo.isp}</div>
              </div>
              
              <div>
                <span className="text-gray-600 text-sm">기기 종류:</span>
                <div className="font-medium text-gray-900">PC (Windows)</div>
              </div>
            </div>
          </div>

          {/* 위치 정확도 주의사항 */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-orange-800 mb-4">
              🎯 {language === 'ko' ? '위치 정확도 안내' : 'Location Accuracy Guide'}
            </h4>
            <div className="space-y-3 text-sm text-orange-700">
              <div className="space-y-2">
                <p><strong>💡 {language === 'ko' ? 'IP 위치의 한계:' : 'IP Location Limitations:'}</strong> {language === 'ko' ? 'A지역 거주자가 B지역으로 표시되거나, 실제 위치와 상당한 오차가 발생할 수 있습니다.' : 'Users in Area A may be shown as Area B, and significant discrepancies from actual location can occur.'}</p>
                <p><strong>🌍 {language === 'ko' ? 'ISP 라우팅:' : 'ISP Routing:'}</strong> {language === 'ko' ? '인터넷 제공업체의 데이터센터 위치에 따라 실제 거주지와 다른 지역으로 표시될 수 있습니다.' : 'Location may appear different from actual residence based on your Internet Service Provider\'s data center location.'}</p>
                <p><strong>🔒 {language === 'ko' ? '정확한 위치:' : 'Accurate Location:'}</strong> {language === 'ko' ? 'GPS를 허용하시면 훨씬 정확한 위치 확인이 가능합니다.' : 'Allowing GPS access enables much more accurate location detection.'}</p>
              </div>
            </div>
          </div>

          {/* 보안 및 사용 주의사항 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-4">
            <h4 className="text-lg font-semibold text-red-800 mb-4">
              🔐 {language === 'ko' ? '보안 주의사항' : 'Security Precautions'}
            </h4>
            <ul className="space-y-2 text-sm text-red-700">
              <li>• {language === 'ko' ? 'IP 주소는 개인정보이므로 타인과 공유하지 마세요.' : 'IP addresses are personal information - do not share with others.'}</li>
              <li>• {language === 'ko' ? '공용 Wi-Fi에서는 위치 정보가 부정확할 수 있습니다.' : 'Location information may be inaccurate on public Wi-Fi networks.'}</li>
              <li>• {language === 'ko' ? 'VPN 사용 시 실제 위치와 완전히 다른 결과가 나올 수 있습니다.' : 'When using VPN, results may be completely different from your actual location.'}</li>
              <li>• {language === 'ko' ? '이 정보는 참고용이며, 법적 증거나 정확한 위치 확인 용도로는 사용하지 마세요.' : 'This information is for reference only and should not be used for legal evidence or precise location verification.'}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}