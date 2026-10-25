import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { demoMissions, demoQuestions } from '../../data/demoData'
import { useToast } from '../../components/ui/Toast'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import {
  ArrowLeft, Plus, Trash2, Copy, GripVertical, Eye,
  Save, Send, ChevronDown, ChevronUp, AlertCircle, CheckCircle
} from 'lucide-react'

const questionTypes = [
  { value: 'multiple_choice', label: 'Pilihan Ganda' },
  { value: 'true_false', label: 'Benar atau Salah' },
  { value: 'situational', label: 'Skenario Situasional' },
  { value: 'reflection', label: 'Pertanyaan Refleksi' },
]

function emptyQuestion(order) {
  return {
    id: `new-${Date.now()}-${Math.random()}`,
    type: 'multiple_choice',
    question: '',
    options: [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' },
    ],
    correctAnswer: 'A',
    explanation: '',
    order,
    isNew: true,
  }
}

function QuestionCard({ q, index, onChange, onDelete, onDuplicate }) {
  const [expanded, setExpanded] = useState(q.isNew)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isReflection = q.type === 'reflection'
  const isTrueFalse = q.type === 'true_false'

  function updateOption(optId, text) {
    const newOptions = q.options.map(o => o.id === optId ? { ...o, text } : o)
    onChange({ ...q, options: newOptions })
  }

  function addOption() {
    if (q.options.length >= 6) return
    const letters = ['A', 'B', 'C', 'D', 'E', 'F']
    const newId = letters[q.options.length]
    onChange({ ...q, options: [...q.options, { id: newId, text: '' }] })
  }

  function removeOption(optId) {
    if (q.options.length <= 2) return
    const newOptions = q.options.filter(o => o.id !== optId)
    onChange({ ...q, options: newOptions })
  }

  return (
    <>
      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => onDelete(q.id)}
        title="Hapus Soal?"
        message="Soal ini akan dihapus permanen dan tidak bisa dikembalikan."
        confirmLabel="Hapus Soal"
      />

      <div className="card border-2 border-slate-200">
        {/* Question header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-700 truncate">
              {q.question || 'Soal baru...'}
            </p>
            <p className="text-xs text-slate-400">{questionTypes.find(t => t.value === q.type)?.label}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => onDuplicate(q)} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center" title="Duplikat">
              <Copy size={14} className="text-slate-600" />
            </button>
            <button onClick={() => setConfirmDelete(true)} className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center" title="Hapus">
              <Trash2 size={14} className="text-red-500" />
            </button>
            <button onClick={() => setExpanded(p => !p)} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            {/* Type */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Jenis Soal</label>
              <select
                value={q.type}
                onChange={e => {
                  const newType = e.target.value
                  let newOptions = q.options
                  if (newType === 'true_false') {
                    newOptions = [{ id: 'A', text: 'Benar' }, { id: 'B', text: 'Salah' }]
                  } else if (newType === 'reflection') {
                    newOptions = []
                  } else if (q.type === 'true_false' || q.type === 'reflection') {
                    newOptions = [{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }]
                  }
                  onChange({ ...q, type: newType, options: newOptions, correctAnswer: newType === 'reflection' ? null : 'A' })
                }}
                className="input-field text-sm py-2"
              >
                {questionTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Question text */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Pertanyaan *</label>
              <textarea
                value={q.question}
                onChange={e => onChange({ ...q, question: e.target.value })}
                placeholder="Tuliskan pertanyaan di sini..."
                rows={2}
                className="input-field text-sm resize-none"
              />
            </div>

            {/* Options (not for reflection) */}
            {!isReflection && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Pilihan Jawaban *</label>
                <div className="space-y-2">
                  {q.options.map(opt => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <button
                        onClick={() => !isTrueFalse && onChange({ ...q, correctAnswer: opt.id })}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0 transition-all ${
                          q.correctAnswer === opt.id
                            ? 'bg-emerald-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Tandai sebagai jawaban benar"
                        disabled={isTrueFalse && q.correctAnswer !== opt.id}
                      >
                        {opt.id}
                      </button>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={e => updateOption(opt.id, e.target.value)}
                        placeholder={`Pilihan ${opt.id}`}
                        disabled={isTrueFalse}
                        className="input-field text-sm py-2 flex-1"
                      />
                      {!isTrueFalse && q.options.length > 2 && (
                        <button onClick={() => removeOption(opt.id)} className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}

                  {!isTrueFalse && q.options.length < 6 && (
                    <button
                      onClick={addOption}
                      className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:text-blue-700"
                    >
                      <Plus size={14} /> Tambah Pilihan
                    </button>
                  )}
                </div>
                {!isReflection && (
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">
                    ✅ Kunci jawaban: {q.correctAnswer} — Klik huruf pilihan untuk mengubahnya
                  </p>
                )}
              </div>
            )}

            {/* Explanation */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Pembahasan / Penjelasan {isReflection ? '(opsional)' : '*'}
              </label>
              <textarea
                value={q.explanation}
                onChange={e => onChange({ ...q, explanation: e.target.value })}
                placeholder="Tuliskan penjelasan edukatif yang akan ditampilkan setelah siswa menjawab..."
                rows={3}
                className="input-field text-sm resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default function MissionEditor() {
  const { missionId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isNew = missionId === 'new'

  const existingMission = isNew ? null : demoMissions.find(m => m.id === missionId)
  
  const [mission, setMission] = useState(existingMission || {
    title: '',
    category: 'pribadi',
    description: '',
    objective: '',
    difficulty: 'mudah',
    estimatedMinutes: 10,
    xpReward: 20,
    status: 'draft',
  })

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('mission') // 'mission' | 'questions'

  // Load questions from database on mount
  useEffect(() => {
    if (!isNew && missionId) {
      loadQuestionsFromDB()
    } else {
      setLoading(false)
    }
  }, [missionId, isNew])

  async function loadQuestionsFromDB() {
    try {
      setLoading(true)
      const { apiClient } = await import('../../lib/api')
      const dbQuestions = await apiClient.getMissionQuestions(missionId)
      
      if (dbQuestions && dbQuestions.length > 0) {
        // Parse questions from DB
        const parsedQuestions = dbQuestions.map(q => ({
          id: q.id,
          type: q.type,
          question: q.question,
          options: q.options || [],
          correctAnswer: q.correct_answer || q.correctAnswer,
          explanation: q.explanation || '',
          order: q.order_num || q.order,
          isNew: false
        }))
        setQuestions(parsedQuestions)
      } else {
        // Fallback ke demoData jika DB kosong
        const demoQs = demoQuestions[missionId] || []
        setQuestions(demoQs.map(q => ({ ...q, isNew: false })))
      }
    } catch (err) {
      console.error('Failed to load questions:', err)
      // Fallback ke demoData
      const demoQs = demoQuestions[missionId] || []
      setQuestions(demoQs.map(q => ({ ...q, isNew: false })))
    } finally {
      setLoading(false)
    }
  }

  function handleMissionChange(field, value) {
    setMission(p => ({ ...p, [field]: value }))
  }

  function handleAddQuestion() {
    setQuestions(prev => [...prev, emptyQuestion(prev.length + 1)])
    setActiveTab('questions')
  }

  function handleDeleteQuestion(id) {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  function handleDuplicateQuestion(q) {
    const dup = { ...q, id: `dup-${Date.now()}`, isNew: true }
    setQuestions(prev => [...prev, dup])
  }

  function handleUpdateQuestion(updated) {
    setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q))
  }

  function validateMission() {
    if (!mission.title.trim()) return 'Nama misi wajib diisi.'
    if (!mission.description.trim()) return 'Deskripsi misi wajib diisi.'
    if (!mission.objective.trim()) return 'Tujuan pembelajaran wajib diisi.'
    if (questions.length === 0) return 'Misi harus memiliki minimal 1 soal.'
    for (const q of questions) {
      if (!q.question.trim()) return 'Semua soal harus memiliki pertanyaan.'
      if (q.type !== 'reflection' && q.options.some(o => !o.text.trim())) {
        return `Soal "${q.question.slice(0, 30)}..." memiliki pilihan jawaban yang kosong.`
      }
    }
    return null
  }

  async function handleSave(publish = false) {
    const err = validateMission()
    if (err) { toast(err, 'error'); return }

    setSaving(true)
    
    try {
      const { apiClient } = await import('../../lib/api')
      
      // Simpan questions ke database
      const result = await apiClient.saveMissionQuestions(missionId, questions)
      
      console.log('✅ Questions saved:', result)
      
      // Update mission status jika publish
      if (publish) {
        await apiClient.updateMission(missionId, { ...mission, status: 'active' })
      }
      
      toast(
        publish 
          ? `Misi berhasil dipublikasikan! ${result.count} soal tersimpan 🎉` 
          : `Draft tersimpan! ${result.count} soal berhasil disimpan`, 
        publish ? 'success' : 'info'
      )
      
      // Reload questions untuk memastikan sinkronisasi
      await loadQuestionsFromDB()
      
      if (publish) {
        setTimeout(() => navigate('/teacher/question-bank'), 1000)
      }
    } catch (error) {
      console.error('Save failed:', error)
      toast(`Gagal menyimpan: ${error.message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/teacher/question-bank')}
          className="w-10 h-10 bg-white rounded-xl shadow flex items-center justify-center hover:bg-slate-50"
        >
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black text-slate-800">{isNew ? 'Buat Misi Baru' : `Edit: ${existingMission?.title}`}</h1>
          <p className="text-slate-500 text-sm">{questions.length} soal ditambahkan</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Menyimpan...' : 'Simpan Draft'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving || loading}
            className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm disabled:opacity-50"
          >
            <Send size={15} />
            Publikasikan
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 mt-3">Memuat soal...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 mb-5 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab('mission')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'mission' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              📋 Info Misi
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'questions' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              ✏️ Soal ({questions.length})
            </button>
          </div>

      {activeTab === 'mission' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-black text-slate-800 mb-4">Informasi Misi</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Misi *</label>
                <input
                  type="text"
                  value={mission.title}
                  onChange={e => handleMissionChange('title', e.target.value)}
                  placeholder="Contoh: Detektif Emosi"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Bidang BK *</label>
                  <select value={mission.category} onChange={e => handleMissionChange('category', e.target.value)} className="input-field">
                    <option value="pribadi">Pribadi</option>
                    <option value="sosial">Sosial</option>
                    <option value="belajar">Belajar</option>
                    <option value="karier">Karier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Kesulitan</label>
                  <select value={mission.difficulty} onChange={e => handleMissionChange('difficulty', e.target.value)} className="input-field">
                    <option value="mudah">Mudah</option>
                    <option value="sedang">Sedang</option>
                    <option value="sulit">Sulit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Estimasi Waktu (menit)</label>
                  <input
                    type="number"
                    min={5} max={60}
                    value={mission.estimatedMinutes}
                    onChange={e => handleMissionChange('estimatedMinutes', parseInt(e.target.value))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">XP Reward</label>
                  <input
                    type="number"
                    min={5} max={200}
                    value={mission.xpReward}
                    onChange={e => handleMissionChange('xpReward', parseInt(e.target.value))}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Deskripsi *</label>
                <textarea
                  value={mission.description}
                  onChange={e => handleMissionChange('description', e.target.value)}
                  placeholder="Deskripsi singkat tentang misi ini..."
                  rows={2}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tujuan Pembelajaran *</label>
                <textarea
                  value={mission.objective}
                  onChange={e => handleMissionChange('objective', e.target.value)}
                  placeholder="Setelah menyelesaikan misi ini, siswa dapat..."
                  rows={2}
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="space-y-3">
          {questions.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <span className="text-5xl">✏️</span>
              <p className="font-bold text-slate-600 mt-3">Belum ada soal</p>
              <p className="text-slate-400 text-sm mt-1">Klik tombol di bawah untuk menambahkan soal pertama</p>
            </div>
          )}

          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              q={q}
              index={i}
              onChange={handleUpdateQuestion}
              onDelete={handleDeleteQuestion}
              onDuplicate={handleDuplicateQuestion}
            />
          ))}

          <button
            onClick={handleAddQuestion}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Tambah Soal
          </button>
        </div>
      )}
        </>
      )}
    </div>
  )
}
