import { useState } from 'react'
import { BookOpen, Plus, Calendar, Lock, Heart, Smile, Meh, Frown, X, MessageSquare } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const moods = [
  { id: 'happy', icon: '😊', label: 'Senang', color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-300' },
  { id: 'okay', icon: '😐', label: 'Biasa', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-300' },
  { id: 'sad', icon: '😢', label: 'Sedih', color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-300' },
  { id: 'angry', icon: '😠', label: 'Marah', color: 'text-red-500', bg: 'bg-red-50 border-red-300' },
  { id: 'excited', icon: '🤩', label: 'Bersemangat', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-300' },
  { id: 'anxious', icon: '😰', label: 'Cemas', color: 'text-purple-500', bg: 'bg-purple-50 border-purple-300' },
]

const demoEntries = [
  {
    id: 'j1',
    date: '2025-05-12',
    mood: 'happy',
    title: 'Hari yang menyenangkan',
    content: 'Hari ini aku berhasil menyelesaikan misi Detektif Emosi. Aku jadi lebih paham tentang cara mengelola perasaan marah.',
    private: true,
  },
  {
    id: 'j2',
    date: '2025-05-10',
    mood: 'anxious',
    title: 'Sebelum ujian',
    content: 'Besok ada ulangan matematika. Sedikit cemas, tapi sudah belajar. Ingat kata Bu Rina: cemas itu wajar, yang penting tetap coba!',
    private: true,
  },
]

function JournalEntry({ entry }) {
  const mood = moods.find(m => m.id === entry.mood)
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{mood?.icon || '📔'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-black text-slate-800 text-sm truncate">{entry.title}</h3>
            <div className="flex items-center gap-1 shrink-0">
              {entry.private && <Lock size={12} className="text-slate-400" />}
              <span className="text-xs text-slate-400">
                {new Date(entry.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-600 line-clamp-2">{entry.content}</p>
          {mood && <span className={`badge text-xs mt-2 ${mood.bg} border ${mood.color}`}>{mood.icon} {mood.label}</span>}
        </div>
      </div>
    </div>
  )
}

function NewEntryForm({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', content: '', mood: '', isPrivate: true })

  function handleSave() {
    if (!form.title.trim() || !form.content.trim() || !form.mood) return
    onSave({ ...form, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-slate-800">📝 Jurnal Baru</h3>
          <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Mood picker */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Bagaimana perasaanmu hari ini?</label>
            <div className="grid grid-cols-3 gap-2">
              {moods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setForm(p => ({ ...p, mood: m.id }))}
                  className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${form.mood === m.id ? `${m.bg} border-current ${m.color}` : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-xs font-bold">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Judul</label>
            <input
              type="text"
              placeholder="Ceritakan harimu dalam satu kalimat..."
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Cerita</label>
            <textarea
              placeholder="Apa yang terjadi hari ini? Bagaimana perasaanmu? Apa yang kamu pelajari?"
              value={form.content}
              onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3">
            <Lock size={16} className="text-slate-500" />
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-700">Jurnal Privat</p>
              <p className="text-xs text-slate-500">Hanya kamu yang bisa membaca</p>
            </div>
            <button
              onClick={() => setForm(p => ({ ...p, isPrivate: !p.isPrivate }))}
              className={`w-12 h-6 rounded-full transition-colors ${form.isPrivate ? 'bg-blue-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={!form.title.trim() || !form.content.trim() || !form.mood}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simpan Jurnal 💾
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StudentJournal() {
  const { profile } = useAuth()
  const [entries, setEntries] = useState(demoEntries)
  const [showForm, setShowForm] = useState(false)
  const [showCounseling, setShowCounseling] = useState(false)
  const [counselingForm, setCounselingForm] = useState({ topic: '', message: '', preferred: '' })
  const [counselingSent, setCounselingSent] = useState(false)

  function handleSaveEntry(entry) {
    setEntries(prev => [entry, ...prev])
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-700 to-indigo-700 px-5 pt-12 pb-6">
        <h1 className="text-2xl font-black text-white mb-1">Jurnal Diri 📔</h1>
        <p className="text-purple-200 text-sm">Tempat pribadimu untuk berrefleksi</p>

        <div className="mt-4 bg-white/10 rounded-2xl p-3 flex items-center gap-2">
          <Lock size={16} className="text-purple-200" />
          <p className="text-purple-100 text-xs">Semua entri jurnal bersifat privat dan hanya bisa dilihat olehmu.</p>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={18} />
            Tulis Jurnal
          </button>
          <button
            onClick={() => setShowCounseling(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            <MessageSquare size={18} />
            Konsultasi BK
          </button>
        </div>

        {/* Mood summary */}
        <div className="card">
          <h3 className="font-black text-slate-800 mb-3 text-sm">Perasaanmu Minggu Ini</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, i) => {
              const dayMoods = ['happy', 'okay', 'excited', 'anxious', 'happy', null, null]
              const m = moods.find(x => x.id === dayMoods[i])
              return (
                <div key={day} className="flex flex-col items-center gap-1 min-w-[36px]">
                  <span className="text-xl">{m ? m.icon : '○'}</span>
                  <span className="text-xs text-slate-400">{day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Entries */}
        <div>
          <h2 className="font-black text-slate-800 mb-3">Entri Terbaru</h2>
          {entries.length > 0 ? (
            <div className="space-y-3">
              {entries.map(entry => (
                <JournalEntry key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <span className="text-5xl">📔</span>
              <p className="text-slate-500 mt-3 font-semibold">Belum ada entri jurnal</p>
              <p className="text-slate-400 text-sm">Mulai tulis perasaanmu hari ini!</p>
            </div>
          )}
        </div>

        {/* Counseling form */}
        {showCounseling && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowCounseling(false)}>
            <div
              className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-800">💬 Konsultasi BK</h3>
                <button onClick={() => setShowCounseling(false)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>

              {!counselingSent ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-2xl p-3">
                    <p className="text-blue-700 text-sm font-semibold">Permintaan konsultasimu akan diterima Guru BK secara privat.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Topik</label>
                    <select
                      value={counselingForm.topic}
                      onChange={e => setCounselingForm(p => ({ ...p, topic: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Pilih topik...</option>
                      <option value="masalah_pribadi">Masalah Pribadi</option>
                      <option value="masalah_sosial">Masalah dengan Teman</option>
                      <option value="masalah_belajar">Kesulitan Belajar</option>
                      <option value="karier">Pilihan Masa Depan</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Ceritakan masalahmu</label>
                    <textarea
                      placeholder="Ceritakan apa yang ingin kamu diskusikan dengan Guru BK..."
                      value={counselingForm.message}
                      onChange={e => setCounselingForm(p => ({ ...p, message: e.target.value }))}
                      rows={4}
                      className="input-field resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Waktu pilihan (opsional)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Rabu jam istirahat"
                      value={counselingForm.preferred}
                      onChange={e => setCounselingForm(p => ({ ...p, preferred: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (counselingForm.topic && counselingForm.message) setCounselingSent(true)
                    }}
                    disabled={!counselingForm.topic || !counselingForm.message}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    Kirim Permintaan 📨
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-5xl">✅</span>
                  <h3 className="text-xl font-black text-emerald-700 mt-3">Terkirim!</h3>
                  <p className="text-slate-500 text-sm mt-2">Guru BK akan menghubungimu segera. Tetap semangat ya!</p>
                  <button
                    onClick={() => { setShowCounseling(false); setCounselingSent(false) }}
                    className="btn-primary mt-4"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showForm && <NewEntryForm onClose={() => setShowForm(false)} onSave={handleSaveEntry} />}
    </div>
  )
}
