'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { siteConfig } from '@/config/site'
import { FileUploader } from '@/components/admin/FileUploader'

interface Tool {
  id: string
  category: string
  regions: string[]
  name: { ko: string; en: string }
  description: { ko: string; en: string }
  keywords: { ko: string; en: string }
  icon: string
  component: string
}

interface Site {
  id: string
  category: string
  name: string
  description: { ko: string; en: string }
  url: string
  thumbnail: string
  customThumbnail?: string
  isPaid: boolean
  rating: number
  tags: string[] | { ko: string[]; en: string[] }
  regions: string[]
}

interface Category {
  id: string
  name: { ko: string; en: string }
  description: { ko: string; en: string }
  icon: string
  color?: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mounted, setMounted] = useState(false)
  
  // 동적 데이터 상태
  const [tools, setTools] = useState<Tool[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [toolCategories, setToolCategories] = useState<Category[]>([])
  const [siteCategories, setSiteCategories] = useState<Category[]>([])
  
  // 폼 상태
  const [showAddTool, setShowAddTool] = useState(false)
  const [showAddSite, setShowAddSite] = useState(false)
  const [showAddToolCategory, setShowAddToolCategory] = useState(false)
  const [showAddSiteCategory, setShowAddSiteCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{type: 'tool' | 'site', category: Category} | null>(null)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [newTool, setNewTool] = useState<Partial<Tool>>({
    regions: ['kr', 'global'],
    name: { ko: '', en: '' },
    description: { ko: '', en: '' },
    keywords: { ko: '', en: '' }
  })
  const [newSite, setNewSite] = useState<Partial<Site>>({
    regions: ['kr', 'global'],
    description: { ko: '', en: '' },
    isPaid: false,
    rating: 4.5,
    tags: { ko: [], en: [] }
  })
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: { ko: '', en: '' },
    description: { ko: '', en: '' }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      loadData()
    }
  }, [mounted])

  const loadData = () => {
    if (!mounted) return
    
    // localStorage에서 데이터 로드, 없으면 기본값 사용
    const savedTools = localStorage.getItem('admin_tools')
    const savedSites = localStorage.getItem('admin_sites')
    const savedToolCategories = localStorage.getItem('admin_tool_categories')
    const savedSiteCategories = localStorage.getItem('admin_site_categories')
    
    // 기본 데이터와 저장된 데이터를 병합
    const baseSites = siteConfig.sites
    const adminSites = savedSites ? JSON.parse(savedSites) : []
    
    // 관리자에서 수정된 사이트가 있으면 해당 사이트를 업데이트
    const mergedSites = baseSites.map(baseSite => {
      const adminSite = adminSites.find(site => site.id === baseSite.id)
      return adminSite ? { ...baseSite, ...adminSite } : baseSite
    })
    
    // 관리자에서 새로 추가된 사이트들도 포함
    const newAdminSites = adminSites.filter(adminSite => 
      !baseSites.some(baseSite => baseSite.id === adminSite.id)
    )
    
    setTools(savedTools ? JSON.parse(savedTools) : siteConfig.tools)
    setSites([...mergedSites, ...newAdminSites])
    setToolCategories(savedToolCategories ? JSON.parse(savedToolCategories) : siteConfig.toolCategories)
    setSiteCategories(savedSiteCategories ? JSON.parse(savedSiteCategories) : siteConfig.siteCategories)
  }

  const saveData = () => {
    localStorage.setItem('admin_tools', JSON.stringify(tools))
    localStorage.setItem('admin_sites', JSON.stringify(sites))
    localStorage.setItem('admin_tool_categories', JSON.stringify(toolCategories))
    localStorage.setItem('admin_site_categories', JSON.stringify(siteCategories))
  }

  // 태그 구조 마이그레이션 함수
  const migrateSiteTags = () => {
    const updatedSites = sites.map(site => {
      // 기본 config에서 해당 사이트 찾기 (우선순위 1)
      const configSite = siteConfig.sites.find(s => s.id === site.id)
      if (configSite && configSite.tags) {
        // config의 태그 구조 사용 (가장 신뢰할 수 있는 소스)
        return { ...site, tags: configSite.tags }
      }
      
      // 이미 올바른 구조인지 확인 (우선순위 2)
      if (site.tags && typeof site.tags === 'object' && !Array.isArray(site.tags) && site.tags.ko && site.tags.en) {
        return site // 이미 올바른 구조
      }
      
      // 배열 형태의 태그를 객체 형태로 변환 (우선순위 3)
      if (Array.isArray(site.tags)) {
        const translations: Record<string, string> = {
          'AI': 'AI',
          '챗봇': 'Chatbot',
          '텍스트 생성': 'Text Generation',
          '어시스턴트': 'Assistant',
          '안전': 'Safety',
          '이미지생성': 'Image Generation',
          '창작': 'Creative',
          '자동화': 'Automation',
          '워크플로우': 'Workflow',
          '통합': 'Integration',
          '시각적': 'Visual',
          '검색': 'Search',
          '연구': 'Research',
          '비디오': 'Video',
          '편집': 'Editing',
          '프레젠테이션': 'Presentation',
          '생성기': 'Generator',
          '디자인': 'Design',
          '협업': 'Collaboration',
          '프로토타입': 'Prototype',
          '애니메이션': 'Animation',
          '웹사이트': 'Website',
          '개발환경': 'Development Environment',
          '버전관리': 'Version Control',
          '배포': 'Deployment',
          '호스팅': 'Hosting',
          '데이터베이스': 'Database',
          '온라인강의': 'Online Course',
          '워크스페이스': 'Workspace',
          '노트': 'Notes',
          '프로젝트관리': 'Project Management'
        }
        return { 
          ...site, 
          tags: { 
            ko: site.tags, 
            en: site.tags.map(tag => translations[tag] || tag)
          }
        }
      }
      
      // 기본값 설정 (마지막 선택)
      return { ...site, tags: { ko: [], en: [] } }
    })
    
    setSites(updatedSites)
    localStorage.setItem('admin_sites', JSON.stringify(updatedSites))
    
    // 마이그레이션 결과 로그
    const migratedCount = updatedSites.filter(site => 
      site.tags && typeof site.tags === 'object' && !Array.isArray(site.tags)
    ).length
    
    alert(`사이트 태그 구조가 마이그레이션되었습니다! (${migratedCount}/${updatedSites.length} 사이트)`)
  }

  const handleLogin = () => {
    if (password === 'wait2894**') {
      setIsAuthenticated(true)
      sessionStorage.setItem('admin_auth', 'true')
      loadData()
    } else {
      alert('잘못된 비밀번호입니다.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('admin_auth')
    setPassword('')
  }

  // 도구 추가
  const handleAddTool = () => {
    if (!newTool.id || !newTool.name?.ko || !newTool.category) {
      alert('필수 항목을 입력해주세요.')
      return
    }

    const tool: Tool = {
      id: newTool.id!,
      category: newTool.category!,
      regions: newTool.regions!,
      name: newTool.name!,
      description: newTool.description!,
      keywords: newTool.keywords!,
      icon: newTool.icon || '🛠️',
      component: newTool.component || 'DefaultTool'
    }

    const updatedTools = [...tools, tool]
    setTools(updatedTools)
    localStorage.setItem('admin_tools', JSON.stringify(updatedTools))
    
    // 폼 리셋
    setNewTool({
      regions: ['kr', 'global'],
      name: { ko: '', en: '' },
      description: { ko: '', en: '' },
      keywords: { ko: '', en: '' }
    })
    setShowAddTool(false)
    alert('도구가 추가되었습니다!')
  }

  // 도구 삭제
  const handleDeleteTool = (toolId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const updatedTools = tools.filter(tool => tool.id !== toolId)
      setTools(updatedTools)
      localStorage.setItem('admin_tools', JSON.stringify(updatedTools))
      alert('도구가 삭제되었습니다!')
    }
  }

  // 사이트 추가
  const handleAddSite = () => {
    if (!newSite.id || !newSite.name || !newSite.url || !newSite.category) {
      alert('필수 항목을 입력해주세요.')
      return
    }

    const site: Site = {
      id: newSite.id!,
      category: newSite.category!,
      name: newSite.name!,
      description: newSite.description!,
      url: newSite.url!,
      thumbnail: newSite.thumbnail || '🌐',
      isPaid: newSite.isPaid!,
      rating: newSite.rating!,
      tags: newSite.tags!,
      regions: newSite.regions!
    }

    const updatedSites = [...sites, site]
    setSites(updatedSites)
    localStorage.setItem('admin_sites', JSON.stringify(updatedSites))
    
    // 폼 리셋
    setNewSite({
      regions: ['kr', 'global'],
      description: { ko: '', en: '' },
      isPaid: false,
      rating: 4.5,
      tags: { ko: [], en: [] }
    })
    setShowAddSite(false)
    alert('사이트가 추가되었습니다!')
  }

  // 사이트 수정
  const handleUpdateSite = (updatedSite: Site) => {
    const updatedSites = sites.map(site => 
      site.id === updatedSite.id ? updatedSite : site
    )
    setSites(updatedSites)
    localStorage.setItem('admin_sites', JSON.stringify(updatedSites))
    setEditingSite(null)
    alert('사이트가 수정되었습니다!')
  }

  // 사이트 삭제
  const handleDeleteSite = (siteId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const updatedSites = sites.filter(site => site.id !== siteId)
      setSites(updatedSites)
      localStorage.setItem('admin_sites', JSON.stringify(updatedSites))
      alert('사이트가 삭제되었습니다!')
    }
  }

  // 카테고리 추가
  const handleAddCategory = (type: 'tool' | 'site') => {
    if (!newCategory.id || !newCategory.name?.ko || !newCategory.icon) {
      alert('필수 항목을 입력해주세요.')
      return
    }

    const category: Category = {
      id: newCategory.id!,
      name: newCategory.name!,
      description: newCategory.description!,
      icon: newCategory.icon!,
      color: newCategory.color
    }

    if (type === 'tool') {
      const updatedCategories = [...toolCategories, category]
      setToolCategories(updatedCategories)
      localStorage.setItem('admin_tool_categories', JSON.stringify(updatedCategories))
    } else {
      const updatedCategories = [...siteCategories, category]
      setSiteCategories(updatedCategories)
      localStorage.setItem('admin_site_categories', JSON.stringify(updatedCategories))
    }

    // 폼 리셋
    setNewCategory({
      name: { ko: '', en: '' },
      description: { ko: '', en: '' }
    })
    setShowAddToolCategory(false)
    setShowAddSiteCategory(false)
    alert('카테고리가 추가되었습니다!')
  }

  // 카테고리 수정
  const handleUpdateCategory = (type: 'tool' | 'site', updatedCategory: Category) => {
    if (type === 'tool') {
      const updatedCategories = toolCategories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
      setToolCategories(updatedCategories)
      localStorage.setItem('admin_tool_categories', JSON.stringify(updatedCategories))
    } else {
      const updatedCategories = siteCategories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
      setSiteCategories(updatedCategories)
      localStorage.setItem('admin_site_categories', JSON.stringify(updatedCategories))
    }
    
    setEditingCategory(null)
    alert('카테고리가 수정되었습니다!')
  }

  // 카테고리 삭제
  const handleDeleteCategory = (type: 'tool' | 'site', categoryId: string) => {
    // 해당 카테고리를 사용하는 항목이 있는지 확인
    const hasItems = type === 'tool' 
      ? tools.some(tool => tool.category === categoryId)
      : sites.some(site => site.category === categoryId)

    if (hasItems) {
      alert(`이 카테고리를 사용하는 ${type === 'tool' ? '도구' : '사이트'}가 있어서 삭제할 수 없습니다.`)
      return
    }

    if (confirm('정말 삭제하시겠습니까?')) {
      if (type === 'tool') {
        const updatedCategories = toolCategories.filter(cat => cat.id !== categoryId)
        setToolCategories(updatedCategories)
        localStorage.setItem('admin_tool_categories', JSON.stringify(updatedCategories))
      } else {
        const updatedCategories = siteCategories.filter(cat => cat.id !== categoryId)
        setSiteCategories(updatedCategories)
        localStorage.setItem('admin_site_categories', JSON.stringify(updatedCategories))
      }
      alert('카테고리가 삭제되었습니다!')
    }
  }

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">로딩중...</p>
      </div>
    </div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Image 
                src="/images/logo_s.svg"
                alt="YouNeedThis Logo"
                width={60}
                height={60}
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              관리자 로그인
            </h1>
            <p className="text-gray-600">YouNeedThis 관리자 페이지입니다</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image 
              src="/images/logo_s.svg"
              alt="YouNeedThis Logo"
              width={32}
              height={32}
            />
            <h1 className="text-2xl font-bold text-gray-900">YouNeedThis 관리자</h1>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            로그아웃
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: '대시보드', icon: '📊' },
              { id: 'categories', name: '카테고리 관리', icon: '📂' },
              { id: 'tools', name: '도구 관리', icon: '🛠️' },
              { id: 'sites', name: '사이트 관리', icon: '🌐' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">🛠️</div>
                  <div>
                    <p className="text-sm text-gray-600">전체 도구</p>
                    <p className="text-2xl font-bold">{tools.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">🌐</div>
                  <div>
                    <p className="text-sm text-gray-600">전체 사이트</p>
                    <p className="text-2xl font-bold">{sites.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-3 rounded-lg mr-4">📂</div>
                  <div>
                    <p className="text-sm text-gray-600">도구 카테고리</p>
                    <p className="text-2xl font-bold">{toolCategories.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">📁</div>
                  <div>
                    <p className="text-sm text-gray-600">사이트 카테고리</p>
                    <p className="text-2xl font-bold">{siteCategories.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 데이터 관리 섹션 */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold mb-4">🔧 데이터 관리</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-red-800">🚨 긴급: localStorage 초기화</h4>
                    <p className="text-sm text-red-600">잘못된 사이트 데이터를 완전히 삭제하고 기본값으로 리셋합니다.</p>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('admin_sites')
                      localStorage.removeItem('admin_tools')
                      localStorage.removeItem('admin_tool_categories')
                      localStorage.removeItem('admin_site_categories')
                      window.location.reload()
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 whitespace-nowrap"
                  >
                    전체 초기화
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-yellow-800">태그 구조 마이그레이션</h4>
                    <p className="text-sm text-yellow-600">기존 사이트들의 태그를 한국어/영어로 분리된 구조로 변환합니다.</p>
                  </div>
                  <button
                    onClick={migrateSiteTags}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 whitespace-nowrap"
                  >
                    마이그레이션 실행
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tools Management Tab */}
        {activeTab === 'tools' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">도구 관리</h2>
              <button
                onClick={() => setShowAddTool(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                ➕ 새 도구 추가
              </button>
            </div>

            {/* Add Tool Modal */}
            {showAddTool && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setShowAddTool(false)}
              >
                <div 
                  className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold mb-4">새 도구 추가</h3>
                  <div className="space-y-4">
                    <input
                      placeholder="도구 ID (예: text-counter)"
                      value={newTool.id || ''}
                      onChange={(e) => setNewTool({...newTool, id: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <select
                      value={newTool.category || ''}
                      onChange={(e) => setNewTool({...newTool, category: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">카테고리 선택</option>
                      {toolCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name.ko}</option>
                      ))}
                    </select>
                    <input
                      placeholder="한국어 이름"
                      value={newTool.name?.ko || ''}
                      onChange={(e) => setNewTool({...newTool, name: {...newTool.name, ko: e.target.value}})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="영어 이름"
                      value={newTool.name?.en || ''}
                      onChange={(e) => setNewTool({...newTool, name: {...newTool.name, en: e.target.value}})}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="한국어 설명"
                      value={newTool.description?.ko || ''}
                      onChange={(e) => setNewTool({...newTool, description: {...newTool.description, ko: e.target.value}})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="아이콘 (이모지)"
                      value={newTool.icon || ''}
                      onChange={(e) => setNewTool({...newTool, icon: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="컴포넌트 이름"
                      value={newTool.component || ''}
                      onChange={(e) => setNewTool({...newTool, component: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex space-x-2 mt-6">
                    <button onClick={handleAddTool} className="bg-blue-600 text-white px-4 py-2 rounded">
                      추가
                    </button>
                    <button onClick={() => setShowAddTool(false)} className="bg-gray-300 px-4 py-2 rounded">
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tools List */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold">등록된 도구 목록</h3>
              </div>
              <div className="divide-y">
                {tools.map(tool => (
                  <div key={tool.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {tool.icon?.startsWith('bi-') ? (
                          <i className={`${tool.icon} text-2xl text-blue-600`}></i>
                        ) : (
                          <span className="text-2xl">{tool.icon}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{tool.name.ko}</h4>
                        <p className="text-sm text-gray-600">{tool.description.ko}</p>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {toolCategories.find(c => c.id === tool.category)?.name.ko}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTool(tool.id)}
                      className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg border border-transparent hover:border-red-200 transition-all duration-200 cursor-pointer relative z-10"
                      type="button"
                    >
                      🗑️ 삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categories Management Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            {/* Tool Categories Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">도구 카테고리 관리</h2>
                <button
                  onClick={() => setShowAddToolCategory(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  ➕ 새 도구 카테고리 추가
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">도구 카테고리 목록</h3>
                </div>
                <div className="divide-y">
                  {toolCategories.map(category => (
                    <div key={category.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center">
                          {category.icon?.startsWith('bi-') ? (
                            <i className={`${category.icon} text-2xl text-orange-600`}></i>
                          ) : (
                            <span className="text-2xl">{category.icon}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{category.name.ko}</h4>
                          <p className="text-sm text-gray-600">{category.description.ko}</p>
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            ID: {category.id}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingCategory({type: 'tool', category})}
                          className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg border border-transparent hover:border-blue-200 transition-all duration-200 cursor-pointer relative z-10"
                          type="button"
                        >
                          ✏️ 수정
                        </button>
                        <button
                          onClick={() => handleDeleteCategory('tool', category.id)}
                          className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg border border-transparent hover:border-red-200 transition-all duration-200 cursor-pointer relative z-10"
                          type="button"
                        >
                          🗑️ 삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Site Categories Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">사이트 카테고리 관리</h2>
                <button
                  onClick={() => setShowAddSiteCategory(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  ➕ 새 사이트 카테고리 추가
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">사이트 카테고리 목록</h3>
                </div>
                <div className="divide-y">
                  {siteCategories.map(category => (
                    <div key={category.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center">
                          {category.icon?.startsWith('bi-') ? (
                            <i className={`${category.icon} text-2xl text-purple-600`}></i>
                          ) : (
                            <span className="text-2xl">{category.icon}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{category.name.ko}</h4>
                          <p className="text-sm text-gray-600">{category.description.ko}</p>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            ID: {category.id}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingCategory({type: 'site', category})}
                          className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg border border-transparent hover:border-blue-200 transition-all duration-200 cursor-pointer relative z-10"
                          type="button"
                        >
                          ✏️ 수정
                        </button>
                        <button
                          onClick={() => handleDeleteCategory('site', category.id)}
                          className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg border border-transparent hover:border-red-200 transition-all duration-200 cursor-pointer relative z-10"
                          type="button"
                        >
                          🗑️ 삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Tool Category Modal */}
            {showAddToolCategory && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setShowAddToolCategory(false)}
              >
                <div 
                  className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold mb-4">새 도구 카테고리 추가</h3>
                  <div className="space-y-4">
                    <input
                      placeholder="카테고리 ID (예: utility)"
                      value={newCategory.id || ''}
                      onChange={(e) => setNewCategory({...newCategory, id: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="한국어 이름"
                      value={newCategory.name?.ko || ''}
                      onChange={(e) => setNewCategory({...newCategory, name: {...newCategory.name, ko: e.target.value}})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="영어 이름"
                      value={newCategory.name?.en || ''}
                      onChange={(e) => setNewCategory({...newCategory, name: {...newCategory.name, en: e.target.value}})}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="한국어 설명"
                      value={newCategory.description?.ko || ''}
                      onChange={(e) => setNewCategory({...newCategory, description: {...newCategory.description, ko: e.target.value}})}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="영어 설명"
                      value={newCategory.description?.en || ''}
                      onChange={(e) => setNewCategory({...newCategory, description: {...newCategory.description, en: e.target.value}})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="아이콘 (이모지)"
                      value={newCategory.icon || ''}
                      onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="색상 (선택사항, 예: #f0f0f0)"
                      value={newCategory.color || ''}
                      onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex space-x-2 mt-6">
                    <button onClick={() => handleAddCategory('tool')} className="bg-orange-600 text-white px-4 py-2 rounded">
                      추가
                    </button>
                    <button onClick={() => setShowAddToolCategory(false)} className="bg-gray-300 px-4 py-2 rounded">
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Site Category Modal */}
            {showAddSiteCategory && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setShowAddSiteCategory(false)}
              >
                <div 
                  className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold mb-4">새 사이트 카테고리 추가</h3>
                  <div className="space-y-4">
                    <input
                      placeholder="카테고리 ID (예: design-tools)"
                      value={newCategory.id || ''}
                      onChange={(e) => setNewCategory({...newCategory, id: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="한국어 이름"
                      value={newCategory.name?.ko || ''}
                      onChange={(e) => setNewCategory({...newCategory, name: {...newCategory.name, ko: e.target.value}})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="영어 이름"
                      value={newCategory.name?.en || ''}
                      onChange={(e) => setNewCategory({...newCategory, name: {...newCategory.name, en: e.target.value}})}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="한국어 설명"
                      value={newCategory.description?.ko || ''}
                      onChange={(e) => setNewCategory({...newCategory, description: {...newCategory.description, ko: e.target.value}})}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="영어 설명"
                      value={newCategory.description?.en || ''}
                      onChange={(e) => setNewCategory({...newCategory, description: {...newCategory.description, en: e.target.value}})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="아이콘 (이모지)"
                      value={newCategory.icon || ''}
                      onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="색상 (선택사항, 예: #f0f0f0)"
                      value={newCategory.color || ''}
                      onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex space-x-2 mt-6">
                    <button onClick={() => handleAddCategory('site')} className="bg-purple-600 text-white px-4 py-2 rounded">
                      추가
                    </button>
                    <button onClick={() => setShowAddSiteCategory(false)} className="bg-gray-300 px-4 py-2 rounded">
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Category Modal */}
            {editingCategory && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setEditingCategory(null)}
              >
                <div 
                  className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold mb-4">
                    {editingCategory.type === 'tool' ? '도구' : '사이트'} 카테고리 수정
                  </h3>
                  <div className="space-y-4">
                    <input
                      placeholder="카테고리 ID"
                      value={editingCategory.category.id}
                      disabled
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                    <input
                      placeholder="한국어 이름"
                      value={editingCategory.category.name.ko}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        category: {
                          ...editingCategory.category,
                          name: { ...editingCategory.category.name, ko: e.target.value }
                        }
                      })}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="영어 이름"
                      value={editingCategory.category.name.en}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        category: {
                          ...editingCategory.category,
                          name: { ...editingCategory.category.name, en: e.target.value }
                        }
                      })}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="한국어 설명"
                      value={editingCategory.category.description.ko}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        category: {
                          ...editingCategory.category,
                          description: { ...editingCategory.category.description, ko: e.target.value }
                        }
                      })}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="영어 설명"
                      value={editingCategory.category.description.en}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        category: {
                          ...editingCategory.category,
                          description: { ...editingCategory.category.description, en: e.target.value }
                        }
                      })}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="아이콘 (이모지)"
                      value={editingCategory.category.icon}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        category: { ...editingCategory.category, icon: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="색상 (선택사항)"
                      value={editingCategory.category.color || ''}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        category: { ...editingCategory.category, color: e.target.value }
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex space-x-2 mt-6">
                    <button 
                      onClick={() => handleUpdateCategory(editingCategory.type, editingCategory.category)} 
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      수정
                    </button>
                    <button onClick={() => setEditingCategory(null)} className="bg-gray-300 px-4 py-2 rounded">
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sites Management Tab */}
        {activeTab === 'sites' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">사이트 관리</h2>
              <button
                onClick={() => setShowAddSite(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                ➕ 새 사이트 추가
              </button>
            </div>

            {/* Add Site Modal */}
            {showAddSite && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setShowAddSite(false)}
              >
                <div 
                  className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold mb-4">새 사이트 추가</h3>
                  <div className="space-y-4">
                    <input
                      placeholder="사이트 ID"
                      value={newSite.id || ''}
                      onChange={(e) => setNewSite({...newSite, id: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <select
                      value={newSite.category || ''}
                      onChange={(e) => setNewSite({...newSite, category: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">카테고리 선택</option>
                      {siteCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name.ko}</option>
                      ))}
                    </select>
                    <input
                      placeholder="사이트 이름"
                      value={newSite.name || ''}
                      onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="사이트 URL"
                      value={newSite.url || ''}
                      onChange={(e) => setNewSite({...newSite, url: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="한국어 설명"
                      value={newSite.description?.ko || ''}
                      onChange={(e) => setNewSite({...newSite, description: {...newSite.description, ko: e.target.value}})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="썸네일 (이모지 또는 Bootstrap 아이콘)"
                      value={newSite.thumbnail || ''}
                      onChange={(e) => setNewSite({...newSite, thumbnail: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">커스텀 썸네일 이미지</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const filename = `site_${newSite.id || Date.now()}_${file.name}`
                            // Note: 실제로는 파일을 public/images/thumbnails/에 저장해야 함
                            setNewSite({...newSite, customThumbnail: filename})
                          }
                        }}
                        className="w-full p-2 border rounded"
                      />
                      <p className="text-xs text-gray-500">
                        이미지를 선택하면 public/images/thumbnails/ 폴더에 직접 저장해주세요.
                      </p>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="평점 (0-5)"
                      value={newSite.rating || ''}
                      onChange={(e) => setNewSite({...newSite, rating: parseFloat(e.target.value)})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="한국어 태그 (쉼표로 구분)"
                      value={(Array.isArray(newSite.tags) ? newSite.tags : (newSite.tags?.ko || [])).join(', ') || ''}
                      onChange={(e) => {
                        const tagsArray = e.target.value.split(', ').filter(Boolean)
                        setNewSite({...newSite, tags: {...newSite.tags, ko: tagsArray}})
                      }}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="영어 태그 (쉼표로 구분)"
                      value={(Array.isArray(newSite.tags) ? [] : (newSite.tags?.en || [])).join(', ') || ''}
                      onChange={(e) => {
                        const tagsArray = e.target.value.split(', ').filter(Boolean)
                        setNewSite({...newSite, tags: {...newSite.tags, en: tagsArray}})
                      }}
                      className="w-full p-2 border rounded"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newSite.isPaid || false}
                        onChange={(e) => setNewSite({...newSite, isPaid: e.target.checked})}
                      />
                      <span>유료 서비스</span>
                    </label>
                  </div>
                  <div className="flex space-x-2 mt-6">
                    <button onClick={handleAddSite} className="bg-green-600 text-white px-4 py-2 rounded">
                      추가
                    </button>
                    <button onClick={() => setShowAddSite(false)} className="bg-gray-300 px-4 py-2 rounded">
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sites List */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold">등록된 사이트 목록</h3>
              </div>
              <div className="divide-y">
                {sites.map(site => (
                  <div key={site.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {site.customThumbnail ? (
                          (() => {
                            const localImage = localStorage.getItem(`thumbnail_${site.customThumbnail}`)
                            return localImage ? (
                              <img 
                                src={localImage}
                                alt={`${typeof site.name === 'string' ? site.name : (site.name as any)?.ko || 'site'} thumbnail`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img 
                                src={`/images/thumbnails/${site.customThumbnail}`}
                                alt={`${typeof site.name === 'string' ? site.name : (site.name as any)?.ko || 'site'} thumbnail`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            )
                          })()
                        ) : site.thumbnail?.startsWith('bi-') ? (
                          <i className={`${site.thumbnail} text-xl text-green-600`}></i>
                        ) : (
                          <span className="text-xl">{site.thumbnail}</span>
                        )}
                        {site.customThumbnail && !localStorage.getItem(`thumbnail_${site.customThumbnail}`) && (
                          <span className="text-xl">{site.thumbnail || '🌐'}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{typeof site.name === 'string' ? site.name : (site.name as any)?.ko || 'Unknown Site'}</h4>
                        <p className="text-sm text-gray-600">{typeof site.description === 'string' ? site.description : (site.description?.ko || '')}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {siteCategories.find(c => c.id === site.category)?.name.ko}
                          </span>
                          <span className="text-xs">⭐ {site.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingSite(site)}
                        className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg border border-transparent hover:border-blue-200 transition-all duration-200 cursor-pointer relative z-10"
                        type="button"
                      >
                        ✏️ 수정
                      </button>
                      <button
                        onClick={() => handleDeleteSite(site.id)}
                        className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg border border-transparent hover:border-red-200 transition-all duration-200 cursor-pointer relative z-10"
                        type="button"
                      >
                        🗑️ 삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Site Modal */}
            {editingSite && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setEditingSite(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
              >
                <div 
                  className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                  onDragOver={(e) => e.stopPropagation()}
                  onDrop={(e) => e.stopPropagation()}
                  onDragEnter={(e) => e.stopPropagation()}
                  onDragLeave={(e) => e.stopPropagation()}
                  style={{ pointerEvents: 'auto' }}
                >
                  <h3 className="text-xl font-bold mb-4">사이트 수정</h3>
                  <div className="space-y-4">
                    <input
                      placeholder="사이트 ID"
                      value={editingSite.id}
                      disabled
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                    <select
                      value={editingSite.category}
                      onChange={(e) => setEditingSite({...editingSite, category: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">카테고리 선택</option>
                      {siteCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name.ko}</option>
                      ))}
                    </select>
                    <input
                      placeholder="사이트 이름"
                      value={editingSite.name}
                      onChange={(e) => setEditingSite({...editingSite, name: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="사이트 URL"
                      value={editingSite.url}
                      onChange={(e) => setEditingSite({...editingSite, url: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="한국어 설명"
                      value={editingSite.description.ko}
                      onChange={(e) => setEditingSite({
                        ...editingSite, 
                        description: {...editingSite.description, ko: e.target.value}
                      })}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="썸네일 (이모지 또는 Bootstrap 아이콘)"
                      value={editingSite.thumbnail}
                      onChange={(e) => setEditingSite({...editingSite, thumbnail: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    
                    {/* 파일 업로더 컴포넌트 */}
                    <FileUploader
                      siteId={editingSite.id}
                      currentFile={editingSite.customThumbnail}
                      onFileSelect={(filename) => setEditingSite({...editingSite, customThumbnail: filename})}
                    />
                    
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="평점 (0-5)"
                      value={editingSite.rating}
                      onChange={(e) => setEditingSite({...editingSite, rating: parseFloat(e.target.value)})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="한국어 태그 (쉼표로 구분)"
                      value={(Array.isArray(editingSite.tags) ? editingSite.tags : (editingSite.tags?.ko || [])).join(', ')}
                      onChange={(e) => {
                        const tagsArray = e.target.value.split(', ').filter(Boolean)
                        setEditingSite({...editingSite, tags: {...editingSite.tags, ko: tagsArray}})
                      }}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="영어 태그 (쉼표로 구분)"
                      value={(Array.isArray(editingSite.tags) ? [] : (editingSite.tags?.en || [])).join(', ')}
                      onChange={(e) => {
                        const tagsArray = e.target.value.split(', ').filter(Boolean)
                        setEditingSite({...editingSite, tags: {...editingSite.tags, en: tagsArray}})
                      }}
                      className="w-full p-2 border rounded"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingSite.isPaid}
                        onChange={(e) => setEditingSite({...editingSite, isPaid: e.target.checked})}
                      />
                      <span>유료 서비스</span>
                    </label>
                  </div>
                  <div className="flex space-x-2 mt-6">
                    <button 
                      onClick={() => handleUpdateSite(editingSite)} 
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      수정
                    </button>
                    <button onClick={() => setEditingSite(null)} className="bg-gray-300 px-4 py-2 rounded">
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}