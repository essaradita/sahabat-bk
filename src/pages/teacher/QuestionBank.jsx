import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { demoMissions, demoWorlds } from '../../data/demoData'
import { apiClient } from '../../lib/api'
import { Plus, Search, Edit2, Eye, Filter, BookOpen, User, Users, Copy, Trash2, Loader2 } from 'lucide-react'

const categoryColors = {
  pribadi: 'bg-blue-100 text-blue-700',
  sosial: 'bg-emerald-100 text-emerald-700',
  belajar: 'bg-purple-100 text-purple-700',
  karier: 'bg-amber-100 text-amber-700',
}

const categoryIcons = {
  'world-1': '🏝️', 'world-2': '🌲', 'world-3': '⛰️', 'world-4': '🏰',
}

const difficultyColors = {
  mudah: 'bg-emerald-50 text-emerald-600',
  sedang: 'bg-amber-50 text-amber-600',
  sulit: 'bg-red-50 text-red-600',
}

export default function QuestionBank() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('individu')
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('semua')
  const [missions, setMissions] = useState([])
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [questionCounts, setQuestionCounts] = useState({})

  const categories = ['semua', 'pribadi', 'sosial', 'belajar', 'karier']

  // Fetch data from backend
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch missions
        try {
          const missionsData = await apiClient.getMissions()
          if (missionsData && missionsData.length > 0) {
            setMissions(missionsData)
            // Fetch question counts for each mission
            fetchQuestionCounts(missionsData)
          } else {
            // Jika belum ada di database, gunakan demo data
            setMissions(demoMissions)
          }
        } catch (err) {
          console.error('Failed to fetch missions:', err)
          setMissions(demoMissions)
        }

        // Fetch case studies
        try {
          const casesData = await apiClient.getCaseStudies()
          if (casesData && casesData.length > 0) {
            setCases(casesData)
          } else {
            // Default cases jika belum ada di database
            setCases([
              {
                id: 'case-1',
                title: 'Rani dan Presentasi',
                category: 'Kepercayaan Diri',
                description: 'Rani ditunjuk untuk mempresentasikan hasil diskusi kelompok...',
                missions_count: 4,
                groups: 0,
                status: 'active'
              },
              {
                id: 'case-2',
                title: 'Budi dan Tugas Kelompok',
                category: 'Kerja Sama',
                description: 'Budi merasa kesal karena dalam tugas kelompok, hanya dia yang bekerja...',
                missions_count: 4,
                groups: 0,
                status: 'active'
              },
              {
                id: 'case-3',
                title: 'Siti dan Pertemanan',
                category: 'Sosial Emosional',
                description: 'Siti tidak diajak bermain oleh teman-temannya...',
                missions_count: 4,
                groups: 0,
                status: 'active'
              }
            ])
          }
        } catch (err) {
          console.error('Failed to fetch case studies:', err)
          setCases([
            {
              id: 'case-1',
              title: 'Rani dan Presentasi',
              category: 'Kepercayaan Diri',
              description: 'Rani ditunjuk untuk mempresentasikan hasil diskusi kelompok...',
              missions_count: 4,
              groups: 0,
              status: 'active'
            },
            {
              id: 'case-2',
              title: 'Budi dan Tugas Kelompok',
              category: 'Kerja Sama',
              description: 'Budi merasa kesal karena dalam tugas kelompok, hanya dia yang bekerja...',
              missions_count: 4,
              groups: 0,
              status: 'active'
            },
            {
              id: 'case-3',
              title: 'Siti dan Pertemanan',
              category: 'Sosial Emosional',
              description: 'Siti tidak diajak bermain oleh teman-temannya...',
              missions_count: 4,
              groups: 0,
              status: 'active'
            }
          ])
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
        // Fallback to demo data
        setMissions(demoMissions)
        setCases([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  
  // Fetch question counts for missions
  async function fetchQuestionCounts(missionsData) {
    const counts = {}
    for (const mission of missionsData) {
      try {
        const questions = await apiClient.getMissionQuestions(mission.id)
        counts[mission.id] = questions.length
      } catch (err) {
        console.error(`Failed to fetch questions for ${mission.id}:`, err)
        counts[mission.id] = 0
      }
    }
    setQuestionCounts(counts)
  }
  
  async function handleDeleteMission(missionId) {
    const confirmed = window.confirm('Yakin ingin menghapus misi ini? Data akan hilang permanent.')
    if (!confirmed) return
    
    try {
      console.log('Deleting mission:', missionId)
      await apiClient.deleteMission(missionId)
      setMissions(missions.filter(m => m.id !== missionId))
      alert('✅ Misi berhasil dihapus!')
    } catch (err) {
      console.error('Delete mission error:', err)
      alert('❌ Gagal menghapus misi: ' + err.message)
    }
  }

  async function handleDeleteCase(caseId) {
    const confirmed = window.confirm('Yakin ingin menghapus studi kasus ini? Data akan hilang permanent.')
    if (!confirmed) return
    
    try {
      console.log('Deleting case:', caseId)
      await apiClient.deleteCaseStudy(caseId)
      setCases(cases.filter(c => c.id !== caseId))
      alert('✅ Studi kasus berhasil dihapus!')
    } catch (err) {
      console.error('Delete case error:', err)
      alert('❌ Gagal menghapus studi kasus: ' + err.message)
    }
  }

  async function handleDuplicateMission(mission) {
    if (!window.confirm(`Duplikasi misi "${mission.title}"?`)) return
    
    try {
      console.log('Duplicating mission:', mission)
      const newMission = {
        title: mission.title + ' (Copy)',
        description: mission.description,
        category: mission.category,
        difficulty: mission.difficulty,
        worldId: mission.worldId || mission.world_id,
        xpReward: mission.xpReward || mission.xp_reward || 20,
        coinReward: mission.coinReward || mission.coin_reward || 50,
        estimatedMinutes: mission.estimatedMinutes || mission.estimated_minutes || 10,
        status: 'draft'
      }
      
      const result = await apiClient.createMission(newMission)
      if (result && result.mission) {
        setMissions([result.mission, ...missions])
        alert('✅ Misi berhasil diduplikasi!')
      } else {
        throw new Error('Response tidak valid dari server')
      }
    } catch (err) {
      console.error('Duplicate mission error:', err)
      alert('❌ Gagal menduplikasi misi: ' + err.message)
    }
  }

  async function handleDuplicateCase(caseItem) {
    if (!window.confirm(`Duplikasi studi kasus "${caseItem.title}"?`)) return
    
    try {
      console.log('Duplicating case:', caseItem)
      const newCase = {
        title: caseItem.title + ' (Copy)',
        description: caseItem.description,
        category: caseItem.category,
        story: caseItem.story || '',
        missionsCount: caseItem.missions_count || 4,
        status: 'draft'
      }
      
      const result = await apiClient.createCaseStudy(newCase)
      if (result && result.caseStudy) {
        setCases([result.caseStudy, ...cases])
        alert('✅ Studi kasus berhasil diduplikasi!')
      } else {
        throw new Error('Response tidak valid dari server')
      }
    } catch (err) {
      console.error('Duplicate case error:', err)
      alert('❌ Gagal menduplikasi studi kasus: ' + err.message)
    }
  }

  const filtered = missions.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = filterCategory === 'semua' || m.category === filterCategory
    return matchSearch && matchCategory
  })

  const filteredCases = cases.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Bank Soal</h1>
          <p className="text-slate-500 text-sm">Kelola misi dan soal untuk siswa</p>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'individu') {
              navigate('/teacher/question-bank/mission/new')
            } else {
              navigate('/teacher/case-studies/create')
            }
          }}
          className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm"
        >
          <Plus size={18} />
          {activeTab === 'individu' ? 'Misi Baru' : 'Studi Kasus Baru'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('individu')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'individu'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <User size={18} />
          Bank Soal Individu
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'individu' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {missions.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('kelompok')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'kelompok'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users size={18} />
          Bank Soal Kelompok
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'kelompok' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {cases.length}
          </span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'individu' ? 'Cari soal atau misi...' : 'Cari studi kasus...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>

        {activeTab === 'individu' && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'individu' ? (
        /* Individual Mission list */
        <div className="space-y-3">
        {filtered.map(mission => {
          const questionCount = questionCounts[mission.id] ?? 0
          return (
            <div key={mission.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                  {categoryIcons[mission.worldId] || '📚'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-black text-slate-800 text-sm">{mission.title}</h3>
                    <span className={`badge text-xs ${categoryColors[mission.category]}`}>
                      {mission.category}
                    </span>
                    <span className={`badge text-xs ${difficultyColors[mission.difficulty]}`}>
                      {mission.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{mission.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">{questionCount} soal</span>
                    <span className="text-xs text-amber-600">+{mission.xp_reward || mission.xpReward} XP</span>
                    <span className="text-xs text-slate-400">⏱ {mission.estimated_minutes || mission.estimatedMinutes} mnt</span>
                    <span className={`badge text-xs ${mission.status === 'completed' || mission.status === 'available' || mission.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {mission.status === 'locked' || mission.status === 'draft' ? 'Draft' : 'Aktif'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/teacher/question-bank/mission/${mission.id}`)}
                    className="w-9 h-9 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={15} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDuplicateMission(mission)}
                    className="w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center transition-colors"
                    title="Duplicate"
                  >
                    <Copy size={15} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteMission(mission.id)}
                    className="w-9 h-9 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={15} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl">📭</span>
            <p className="font-bold text-slate-600 mt-3">Tidak ada misi yang ditemukan</p>
            <p className="text-slate-400 text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        )}
      </div>
      ) : (
        /* Group Case Studies list */
        <div className="space-y-3">
          {filteredCases.map(caseItem => (
            <div key={caseItem.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                  📚
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-black text-slate-800 text-sm">{caseItem.title}</h3>
                    <span className="badge text-xs bg-purple-100 text-purple-700">
                      {caseItem.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{caseItem.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">{caseItem.missions_count || caseItem.missions || 4} misi</span>
                    <span className="text-xs text-purple-600">{caseItem.groups || 0} kelompok</span>
                    <span className="text-xs text-slate-400">🏁 1 challenge</span>
                    <span className={`badge text-xs ${caseItem.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {caseItem.status === 'active' ? 'Aktif' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/teacher/case-studies/edit/${caseItem.id}`)}
                    className="w-9 h-9 bg-purple-50 hover:bg-purple-100 rounded-xl flex items-center justify-center transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={15} className="text-purple-600" />
                  </button>
                  <button
                    onClick={() => {
                      // Preview as student
                      navigate(`/student/case-study-intro/${caseItem.id}`, {
                        state: {
                          groupName: 'Preview Guru',
                          members: ['Guru (Preview)'],
                          caseData: caseItem
                        }
                      })
                    }}
                    className="w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center transition-colors"
                    title="Preview"
                  >
                    <Eye size={15} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => handleDuplicateCase(caseItem)}
                    className="w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center transition-colors"
                    title="Duplicate"
                  >
                    <Copy size={15} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteCase(caseItem.id)}
                    className="w-9 h-9 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={15} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredCases.length === 0 && (
            <div className="text-center py-16">
              <span className="text-5xl">📭</span>
              <p className="font-bold text-slate-600 mt-3">Tidak ada studi kasus yang ditemukan</p>
              <p className="text-slate-400 text-sm mt-1">Coba ubah kata kunci pencarian</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
