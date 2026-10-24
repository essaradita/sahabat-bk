import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, BookOpen } from 'lucide-react'

export default function GroupMode() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Form, 2: Pilih Studi Kasus
  const [groupName, setGroupName] = useState('')
  const [members, setMembers] = useState(['', '', ''])
  const [selectedCase, setSelectedCase] = useState(null)

  // Demo studi kasus dari guru
  const cases = [
    {
      id: 'case-1',
      title: 'Rani dan Presentasi',
      description: 'Rani ditunjuk untuk mempresentasikan hasil diskusi kelompok. Ia sudah menyiapkan materi dengan rapi, tetapi berpikir, "Nanti aku salah bicara dan ditertawakan," serta "Teman-temanku lebih pintar dariku." Tangannya terasa dingin dan suaranya gemetar.',
      category: 'Kepercayaan Diri',
      missions: 4,
      challenge: true
    },
    {
      id: 'case-2',
      title: 'Budi dan Tugas Kelompok',
      description: 'Budi merasa kesal karena dalam tugas kelompok, hanya dia yang bekerja. Teman-temannya lebih suka bermain HP dan berbicara hal lain.',
      category: 'Kerja Sama',
      missions: 4,
      challenge: true
    },
    {
      id: 'case-3',
      title: 'Siti dan Pertemanan',
      description: 'Siti tidak diajak bermain oleh teman-temannya. Ia merasa kesepian dan berpikir tidak ada yang menyukainya.',
      category: 'Sosial Emosional',
      missions: 4,
      challenge: true
    }
  ]

  function addMember() {
    setMembers([...members, ''])
  }

  function updateMember(index, value) {
    const newMembers = [...members]
    newMembers[index] = value
    setMembers(newMembers)
  }

  function removeMember(index) {
    if (members.length > 2) {
      setMembers(members.filter((_, i) => i !== index))
    }
  }

  function handleNext() {
    if (step === 1) {
      // Validasi form
      if (!groupName.trim()) {
        alert('Nama kelompok wajib diisi!')
        return
      }
      const filledMembers = members.filter(m => m.trim())
      if (filledMembers.length < 2) {
        alert('Minimal 2 anggota kelompok!')
        return
      }
      setStep(2)
    } else if (step === 2 && selectedCase) {
      // Ke halaman intro studi kasus (penjelasan)
      navigate(`/student/case-study-intro/${selectedCase}`, {
        state: {
          groupName,
          members: members.filter(m => m.trim()),
          caseData: cases.find(c => c.id === selectedCase)
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-24">
      <div className="max-w-md lg:max-w-4xl mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 -mx-4 px-4 pt-6 pb-6 mb-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1">
              <h1 className="text-white text-lg font-black">Mode Kelompok 👥</h1>
              <p className="text-purple-100 text-xs">Belajar bersama lebih seru!</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-2">
            <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-white' : 'bg-white/30'}`} />
            <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
          </div>
        </div>

        {/* Step 1: Form Kelompok */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users size={20} className="text-purple-600" />
                <h2 className="text-sm font-black text-slate-800">Data Kelompok</h2>
              </div>

              {/* Nama Kelompok */}
              <div className="mb-3">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Kelompok <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Contoh: Kelompok Hebat"
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none text-sm"
                />
              </div>

              {/* Anggota Kelompok */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Anggota Kelompok <span className="text-red-500">*</span>
                  <span className="text-slate-500 font-normal ml-1">(Min. 2 orang)</span>
                </label>
                
                <div className="space-y-2">
                  {members.map((member, idx) => (
                    <div key={idx} className="flex gap-2">
                      <div className="w-8 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <input
                        type="text"
                        value={member}
                        onChange={(e) => updateMember(idx, e.target.value)}
                        placeholder={`Nama anggota ${idx + 1}`}
                        className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none text-sm"
                      />
                      {members.length > 2 && (
                        <button
                          onClick={() => removeMember(idx)}
                          className="w-10 h-10 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center text-lg"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {members.length < 6 && (
                  <button
                    onClick={addMember}
                    className="w-full mt-2 py-2 rounded-xl border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 transition-colors text-xs font-bold"
                  >
                    + Tambah Anggota
                  </button>
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-purple-100 border-2 border-purple-300 rounded-2xl p-3">
              <p className="text-purple-800 text-xs leading-relaxed">
                💡 <strong>Tips:</strong> Kelompok yang solid adalah yang saling mendukung dan berkomunikasi dengan baik!
              </p>
            </div>

            {/* Button Lanjut - Di dalam content */}
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:shadow-lg active:scale-95 transition-all"
            >
              Lanjut ke Pilih Studi Kasus →
            </button>
          </div>
        )}

        {/* Step 2: Pilih Studi Kasus */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 shadow-lg mb-3">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={20} className="text-purple-600" />
                <h2 className="text-sm font-black text-slate-800">Pilih Studi Kasus</h2>
              </div>
              <p className="text-xs text-slate-600">Pilih satu studi kasus untuk dikerjakan bersama kelompokmu.</p>
            </div>

            {cases.map((caseItem) => (
              <button
                key={caseItem.id}
                onClick={() => setSelectedCase(caseItem.id)}
                className={`w-full text-left bg-white rounded-2xl p-4 shadow-md border-2 transition-all ${
                  selectedCase === caseItem.id
                    ? 'border-purple-500 shadow-lg'
                    : 'border-slate-100 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-slate-800 mb-1">{caseItem.title}</h3>
                    <span className="inline-block px-2 py-0.5 rounded-lg bg-purple-100 text-purple-700 text-[10px] font-bold mb-2">
                      {caseItem.category}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedCase === caseItem.id
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-slate-300'
                  }`}>
                    {selectedCase === caseItem.id && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  {caseItem.description}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span>📍 {caseItem.missions} Misi</span>
                  <span>🏁 {caseItem.challenge ? '1 Challenge' : 'No Challenge'}</span>
                </div>
              </button>
            ))}

            {/* Action Buttons - Di dalam content */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                ← Kembali
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedCase}
                className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all ${
                  !selectedCase
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg active:scale-95'
                }`}
              >
                Lihat Peta Misi →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
