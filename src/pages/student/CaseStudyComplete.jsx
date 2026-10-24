import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, Trophy } from 'lucide-react'
import Confetti from '../../components/ui/Confetti'

export default function CaseStudyComplete() {
  const location = useLocation()
  const navigate = useNavigate()
  const { groupName, members, caseData, answers, challengeCompleted } = location.state || {}

  if (!caseData) {
    navigate('/student/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 via-pink-700 to-orange-600 flex flex-col items-center justify-start pt-10 px-4 pb-10">
      <Confetti active={true} />

      {/* Trophy */}
      <div className="w-32 h-32 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 flex items-center justify-center shadow-2xl border-8 border-yellow-200 mb-4 animate-bounce">
        <span className="text-6xl">🏆</span>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-white mb-2">STUDI KASUS SELESAI!</h1>
        <p className="text-purple-200 text-sm mb-1">Hebat! Kelompokmu berhasil menyelesaikan</p>
        <p className="text-white font-bold text-lg">"{caseData.title}"</p>
      </div>

      {/* Group Info */}
      <div className="w-full max-w-md bg-white/10 rounded-3xl p-5 mb-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <Users size={20} className="text-white" />
          <h3 className="text-white font-black">Kelompok: {groupName}</h3>
        </div>
        <div className="space-y-1">
          {members?.map((member, idx) => (
            <div key={idx} className="flex items-center gap-2 text-white/90 text-sm">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <span>{member}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="w-full max-w-md bg-white/10 rounded-3xl p-5 mb-5 backdrop-blur-sm">
        <h3 className="text-white font-black text-center mb-4 text-lg">Pencapaian 🎁</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center bg-white/10 rounded-2xl p-4">
            <div className="w-12 h-12 bg-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <span className="text-2xl">📍</span>
            </div>
            <p className="text-white font-black text-2xl">{caseData.missions}</p>
            <p className="text-white/70 text-xs">Misi Selesai</p>
          </div>
          <div className="text-center bg-white/10 rounded-2xl p-4">
            <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <span className="text-2xl">🏁</span>
            </div>
            <p className="text-white font-black text-2xl">{challengeCompleted ? '✓' : '○'}</p>
            <p className="text-white/70 text-xs">Challenge</p>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="w-full max-w-md bg-white/10 rounded-3xl p-4 mb-5 backdrop-blur-sm">
        <h3 className="text-white font-black text-sm mb-2">💭 Refleksi Kelompok (Opsional)</h3>
        <textarea
          placeholder="Apa yang kelompokmu pelajari dari studi kasus ini?"
          rows={3}
          className="w-full bg-white/10 text-white placeholder-white/40 rounded-xl px-3 py-2 text-sm border border-white/20 focus:outline-none focus:border-white/50 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="w-full max-w-md space-y-3">
        <button
          onClick={() => navigate('/student/group-mode')}
          className="w-full bg-white text-purple-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-purple-50 transition-all"
        >
          <Trophy size={20} />
          Coba Studi Kasus Lain
        </button>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="w-full bg-white/20 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/30 transition-all"
        >
          <Home size={18} />
          Kembali ke Beranda
        </button>
      </div>
    </div>
  )
}
