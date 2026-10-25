import { useParams, useNavigate } from 'react-router-dom'
import { demoMissions, demoWorlds } from '../../data/demoData'
import { useMissionProgress } from '../../hooks/useMissionProgress'
import { ArrowLeft, Clock, Zap, Target, Trophy, Lock, Play } from 'lucide-react'

export default function MissionDetail() {
  const { missionId } = useParams()
  const navigate = useNavigate()
  const { missions, loading } = useMissionProgress()
  
  // Get mission with updated status from hook
  const mission = missions.find(m => m.id === missionId)
  const world = mission ? demoWorlds.find(w => w.id === mission.worldId) : null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Memuat misi...</p>
        </div>
      </div>
    )
  }

  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-xl font-black text-slate-700">Misi tidak ditemukan</h2>
          <button onClick={() => navigate('/student/map')} className="btn-primary mt-4">Kembali ke Peta</button>
        </div>
      </div>
    )
  }

  const difficultyConfig = {
    mudah: { label: 'Mudah', color: 'bg-emerald-100 text-emerald-700' },
    sedang: { label: 'Sedang', color: 'bg-amber-100 text-amber-700' },
    sulit: { label: 'Sulit', color: 'bg-red-100 text-red-700' },
  }
  const diff = difficultyConfig[mission.difficulty] || difficultyConfig.mudah

  const gradients = {
    pribadi: 'from-blue-500 to-blue-700',
    sosial: 'from-emerald-500 to-emerald-700',
    belajar: 'from-purple-500 to-purple-700',
    karier: 'from-amber-500 to-amber-700',
  }
  const gradient = gradients[mission.category] || 'from-blue-500 to-blue-700'

  return (
    <div className="max-w-lg mx-auto">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${gradient} px-5 pt-12 pb-8 relative overflow-hidden`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-5 w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute bottom-5 left-10 w-32 h-32 bg-white/5 rounded-full" />
        </div>

        <button
          onClick={() => navigate('/student/map')}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-5 relative"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-semibold">Kembali ke Peta</span>
        </button>

        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-4xl shadow-lg shrink-0">
              {world?.icon || '🎯'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`badge text-xs ${diff.color}`}>{diff.label}</span>
                <span className="badge text-xs bg-white/20 text-white capitalize">{mission.category}</span>
              </div>
              <h1 className="text-2xl font-black text-white leading-tight">{mission.title}</h1>
            </div>
          </div>

          {/* Story intro */}
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-white/90 text-sm leading-relaxed">💬 {mission.storyText}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-5 py-5 space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center py-3">
            <Clock size={20} className="text-slate-400 mx-auto mb-1" />
            <p className="text-lg font-black text-slate-800">{mission.estimatedMinutes}</p>
            <p className="text-xs text-slate-500">menit</p>
          </div>
          <div className="card text-center py-3">
            <Zap size={20} className="text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-black text-amber-600">+{mission.xpReward}</p>
            <p className="text-xs text-slate-500">XP</p>
          </div>
          <div className="card text-center py-3">
            <span className="text-xl mx-auto block mb-1">🪙</span>
            <p className="text-lg font-black text-yellow-600">+{mission.coinReward}</p>
            <p className="text-xs text-slate-500">Koin</p>
          </div>
        </div>

        {/* Objective */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target size={16} className="text-blue-600" />
            </div>
            <h3 className="font-black text-slate-800">Tujuan Pembelajaran</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{mission.objective}</p>
        </div>

        {/* Badge reward */}
        {mission.badgeReward && (
          <div className="card bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">🏅</div>
              <div>
                <p className="text-xs text-amber-600 font-bold">Badge Spesial</p>
                <p className="font-black text-amber-800">{mission.badgeReward}</p>
                <p className="text-xs text-amber-600">Selesaikan misi ini untuk mendapatkan badge!</p>
              </div>
            </div>
          </div>
        )}

        {/* Status notice */}
        {mission.status === 'completed' && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-black text-emerald-700">Misi Sudah Selesai!</p>
              <p className="text-emerald-600 text-sm">Kamu sudah menyelesaikan misi ini. Main lagi untuk review?</p>
            </div>
          </div>
        )}

        {mission.status === 'locked' && (
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <Lock size={28} className="text-slate-400 shrink-0" />
            <div>
              <p className="font-black text-slate-600">Misi Terkunci</p>
              <p className="text-slate-500 text-sm">Selesaikan misi sebelumnya terlebih dahulu.</p>
            </div>
          </div>
        )}

        {/* CTA */}
        {mission.status !== 'locked' && (
          <button
            onClick={() => navigate(`/student/mission/${missionId}/play`)}
            className={`w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-3 shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 bg-gradient-to-r ${gradient} hover:shadow-2xl`}
          >
            <Play size={22} fill="white" />
            {mission.status === 'completed' ? 'Main Lagi 🔄' : 'Mulai Misi! 🚀'}
          </button>
        )}
      </div>
    </div>
  )
}
