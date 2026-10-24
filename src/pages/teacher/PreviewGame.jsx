import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Users, Map, ArrowLeft } from 'lucide-react'

export default function PreviewGame() {
  const navigate = useNavigate()
  const [selectedMode, setSelectedMode] = useState(null)

  function handlePreviewIndividual() {
    // Navigate to student dashboard in preview mode
    navigate('/student/dashboard', {
      state: { previewMode: true }
    })
  }

  function handlePreviewGroup() {
    // Navigate to group mode in preview
    navigate('/student/group-mode', {
      state: { previewMode: true }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            Kembali ke Dashboard
          </button>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2">Preview Game</h1>
          <p className="text-slate-600">Coba game seperti yang dilihat siswa</p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Individual Mode */}
          <button
            onClick={handlePreviewIndividual}
            className="group bg-white rounded-3xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all p-6 sm:p-8 text-left"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Map size={32} className="text-white" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">Mode Individu</h2>
            <p className="text-slate-600 text-sm mb-4">Jelajahi 6 misi petualangan mandiri</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">✓</span>
                <span>6 Misi Petualangan</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">✓</span>
                <span>Soal Pilihan Ganda</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">✓</span>
                <span>XP & Koin Rewards</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">✓</span>
                <span>Progressive Unlock</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:gap-3 transition-all">
              <Play size={18} />
              <span>Mulai Preview</span>
              <span className="text-blue-400">→</span>
            </div>
          </button>

          {/* Group Mode */}
          <button
            onClick={handlePreviewGroup}
            className="group bg-white rounded-3xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-2xl transition-all p-6 sm:p-8 text-left"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users size={32} className="text-white" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">Mode Kelompok</h2>
            <p className="text-slate-600 text-sm mb-4">Selesaikan studi kasus bersama tim</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">✓</span>
                <span>3 Studi Kasus</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">✓</span>
                <span>4 Misi + Challenge</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">✓</span>
                <span>Soal Essay/Diskusi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">✓</span>
                <span>Kolaborasi Tim</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-purple-600 font-bold text-sm group-hover:gap-3 transition-all">
              <Play size={18} />
              <span>Mulai Preview</span>
              <span className="text-purple-400">→</span>
            </div>
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h3 className="font-black text-blue-900 text-sm mb-1">Mode Preview</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Anda akan melihat tampilan yang sama persis seperti yang dilihat siswa. 
                Semua fitur berfungsi normal kecuali data tidak akan tersimpan ke database. 
                Cocok untuk testing sebelum memberikan ke siswa.
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 space-y-3">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 rounded-lg p-4">
            <p className="text-emerald-900 text-sm"><strong>Tips:</strong> Coba selesaikan beberapa misi untuk merasakan pengalaman siswa secara lengkap</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-lg p-4">
            <p className="text-purple-900 text-sm"><strong>Responsive:</strong> Tampilan otomatis menyesuaikan di HP, tablet, dan laptop</p>
          </div>
        </div>
      </div>
    </div>
  )
}
