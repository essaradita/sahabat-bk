import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export default function CaseStudyEditor() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const isEdit = !!caseId && caseId !== 'new'
  
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Sosial Emosional',
    story: '',
    missionsCount: 4,
    status: 'active'
  })

  // Load case study jika edit mode
  useEffect(() => {
    if (isEdit) {
      async function loadCaseStudy() {
        try {
          setLoading(true)
          const cases = await apiClient.getCaseStudies()
          const caseData = cases.find(c => c.id === caseId)
          
          if (caseData) {
            setFormData({
              title: caseData.title || '',
              description: caseData.description || '',
              category: caseData.category || 'Sosial Emosional',
              story: caseData.story || '',
              missionsCount: caseData.missions_count || 4,
              status: caseData.status || 'active'
            })
          } else {
            alert('Studi kasus tidak ditemukan')
            navigate('/teacher/case-studies')
          }
        } catch (err) {
          console.error('Load case study error:', err)
          
          // Fallback: Load from demo data if API fails
          const demoCase = {
            id: caseId,
            title: 'Studi Kasus Demo',
            description: 'Deskripsi demo',
            category: 'Sosial Emosional',
            story: '',
            missions_count: 4,
            status: 'active'
          }
          
          setFormData({
            title: demoCase.title,
            description: demoCase.description,
            category: demoCase.category,
            story: demoCase.story || '',
            missionsCount: demoCase.missions_count,
            status: demoCase.status
          })
          
          console.log('⚠️ API error, menggunakan data demo untuk editing')
        } finally {
          setLoading(false)
        }
      }
      loadCaseStudy()
    }
  }, [isEdit, caseId, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Judul wajib diisi!')
      return
    }

    setSaving(true)
    try {
      if (isEdit) {
        await apiClient.updateCaseStudy(caseId, formData)
        alert('Studi kasus berhasil diupdate!')
      } else {
        await apiClient.createCaseStudy(formData)
        alert('Studi kasus berhasil dibuat!')
      }
      navigate('/teacher/case-studies')
    } catch (err) {
      console.error('Save case study error:', err)
      alert('Gagal menyimpan: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-3" />
          <p className="text-slate-500">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/teacher/case-studies')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-3 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-semibold text-sm">Kembali</span>
        </button>
        <h1 className="text-2xl font-black text-slate-800">
          {isEdit ? 'Edit Studi Kasus' : 'Buat Studi Kasus Baru'}
        </h1>
        <p className="text-slate-500 text-sm">
          {isEdit ? 'Update informasi studi kasus' : 'Tambah studi kasus untuk mode kelompok'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Judul */}
        <div className="card">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Judul Studi Kasus <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Contoh: Rani dan Presentasi"
            className="input-field"
            required
          />
        </div>

        {/* Kategori */}
        <div className="card">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Kategori
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Sosial Emosional">Sosial Emosional</option>
            <option value="Kepercayaan Diri">Kepercayaan Diri</option>
            <option value="Kerja Sama">Kerja Sama</option>
            <option value="Komunikasi">Komunikasi</option>
            <option value="Problem Solving">Problem Solving</option>
          </select>
        </div>

        {/* Deskripsi Singkat */}
        <div className="card">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Deskripsi Singkat
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Deskripsi singkat tentang studi kasus ini..."
            rows="3"
            className="input-field resize-none"
          />
        </div>

        {/* Cerita Lengkap */}
        <div className="card">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Cerita Lengkap
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Cerita ini akan ditampilkan di halaman intro sebelum siswa memulai misi
          </p>
          <textarea
            name="story"
            value={formData.story}
            onChange={handleChange}
            placeholder="Tulis cerita lengkap di sini..."
            rows="8"
            className="input-field resize-none"
          />
        </div>

        {/* Jumlah Misi */}
        <div className="card">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Jumlah Misi
          </label>
          <input
            type="number"
            name="missionsCount"
            value={formData.missionsCount}
            onChange={handleChange}
            min="1"
            max="10"
            className="input-field"
          />
          <p className="text-xs text-slate-500 mt-1">
            Jumlah misi yang harus diselesaikan dalam studi kasus ini
          </p>
        </div>

        {/* Status */}
        <div className="card">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="active">Aktif (Bisa diakses siswa)</option>
            <option value="draft">Draft (Belum bisa diakses)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/teacher/case-studies')}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            disabled={saving}
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEdit ? 'Update' : 'Simpan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
