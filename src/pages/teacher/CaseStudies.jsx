import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Plus, Edit2, Eye, Trash2, Copy, Users, BookOpen, Loader2 } from 'lucide-react'

export default function CaseStudies() {
  const navigate = useNavigate()
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCases() {
      try {
        setLoading(true)
        const data = await apiClient.getCaseStudies()
        if (data && data.length > 0) {
          setCases(data)
        } else {
          // Default cases
          setCases([
            {
              id: 'case-1',
              title: 'Rani dan Presentasi',
              category: 'Kepercayaan Diri',
              description: 'Rani ditunjuk untuk mempresentasikan hasil diskusi kelompok...',
              missions_count: 4,
              missions: 4,
              groups: 0,
              status: 'active'
            },
            {
              id: 'case-2',
              title: 'Budi dan Tugas Kelompok',
              category: 'Kerja Sama',
              description: 'Budi merasa kesal karena dalam tugas kelompok, hanya dia yang bekerja...',
              missions_count: 4,
              missions: 4,
              groups: 0,
              status: 'active'
            },
            {
              id: 'case-3',
              title: 'Siti dan Pertemanan',
              category: 'Sosial Emosional',
              description: 'Siti tidak diajak bermain oleh teman-temannya...',
              missions_count: 4,
              missions: 4,
              groups: 0,
              status: 'active'
            }
          ])
        }
      } catch (err) {
        console.error('Failed to fetch cases:', err)
        // Fallback to default cases on error
        setCases([
          {
            id: 'case-1',
            title: 'Rani dan Presentasi',
            category: 'Kepercayaan Diri',
            description: 'Rani ditunjuk untuk mempresentasikan hasil diskusi kelompok...',
            missions_count: 4,
            missions: 4,
            groups: 0,
            status: 'active'
          },
          {
            id: 'case-2',
            title: 'Budi dan Tugas Kelompok',
            category: 'Kerja Sama',
            description: 'Budi merasa kesal karena dalam tugas kelompok, hanya dia yang bekerja...',
            missions_count: 4,
            missions: 4,
            groups: 0,
            status: 'active'
          },
          {
            id: 'case-3',
            title: 'Siti dan Pertemanan',
            category: 'Sosial Emosional',
            description: 'Siti tidak diajak bermain oleh teman-temannya...',
            missions_count: 4,
            missions: 4,
            groups: 0,
            status: 'active'
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [])

  function handleEdit(caseId) {
    navigate(`/teacher/case-studies/edit/${caseId}`)
  }

  function handlePreview(caseItem) {
    navigate(`/student/case-study-intro/${caseItem.id}`, {
      state: {
        groupName: 'Preview Guru',
        members: ['Guru (Preview)'],
        caseData: caseItem
      }
    })
  }

  async function handleDuplicate(caseItem) {
    try {
      const newCase = {
        title: caseItem.title + ' (Copy)',
        description: caseItem.description,
        category: caseItem.category,
        story: caseItem.story || '',
        missionsCount: caseItem.missions_count || 4,
        status: 'active'
      }
      
      const result = await apiClient.createCaseStudy(newCase)
      setCases([result.caseStudy, ...cases])
      alert('Studi kasus berhasil diduplikasi!')
    } catch (err) {
      console.error('Duplicate error:', err)
      alert('Gagal menduplikasi: ' + err.message)
    }
  }

  async function handleDelete(caseId) {
    if (!window.confirm('Yakin ingin menghapus studi kasus ini?')) return
    
    try {
      await apiClient.deleteCaseStudy(caseId)
      setCases(cases.filter(c => c.id !== caseId))
      alert('Studi kasus berhasil dihapus!')
    } catch (err) {
      console.error('Delete error:', err)
      alert('Gagal menghapus: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={40} className="animate-spin text-purple-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800">Bank Soal Kelompok</h1>
            <p className="text-slate-600 text-sm">Kelola studi kasus untuk mode kelompok</p>
          </div>
          <button
            onClick={() => navigate('/teacher/case-studies/create')}
            className="hidden sm:flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors"
          >
            <Plus size={18} />
            Buat Studi Kasus
          </button>
        </div>
      </div>

      {/* Mobile Create Button */}
      <button
        onClick={() => navigate('/teacher/case-studies/create')}
        className="sm:hidden w-full mb-4 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors"
      >
        <Plus size={18} />
        Buat Studi Kasus Baru
      </button>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
              <BookOpen size={22} className="text-purple-700" />
            </div>
            <div>
              <p className="text-purple-600 text-xs font-semibold">Total Studi Kasus</p>
              <p className="text-purple-900 font-black text-2xl">{cases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
              <Users size={22} className="text-blue-700" />
            </div>
            <div>
              <p className="text-blue-600 text-xs font-semibold">Kelompok Aktif</p>
              <p className="text-blue-900 font-black text-2xl">{cases.reduce((sum, c) => sum + (c.groups || 0), 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📍</span>
            </div>
            <div>
              <p className="text-emerald-600 text-xs font-semibold">Total Misi</p>
              <p className="text-emerald-900 font-black text-2xl">{cases.reduce((sum, c) => sum + (c.missions_count || c.missions || 0), 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Case List */}
      <div className="space-y-3">
        {cases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="bg-white rounded-2xl border-2 border-slate-100 hover:border-purple-200 transition-all p-4 sm:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              
              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shrink-0">
                📚
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-slate-800 mb-1">{caseItem.title}</h3>
                    <span className="inline-block px-2 py-0.5 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold">
                      {caseItem.category}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 ${
                    caseItem.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {caseItem.status === 'active' ? '● Aktif' : '○ Draft'}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{caseItem.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <span className="text-base">📍</span>
                    {caseItem.missions_count || caseItem.missions || 4} Misi
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {caseItem.groups || 0} Kelompok
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-base">🏁</span>
                    1 Challenge
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(caseItem.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 size={14} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => handlePreview(caseItem)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
                  >
                    <Eye size={14} />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                  <button
                    onClick={() => handleDuplicate(caseItem)}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(caseItem.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-bold hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {cases.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={40} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Belum ada studi kasus</h3>
          <p className="text-slate-600 mb-4">Buat studi kasus pertama untuk mode kelompok</p>
          <button
            onClick={() => navigate('/teacher/case-studies/create')}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
          >
            <Plus size={18} />
            Buat Studi Kasus
          </button>
        </div>
      )}
    </div>
  )
}
