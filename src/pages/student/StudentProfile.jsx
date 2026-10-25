import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { demoStudent, demoBadges, demoMissions, demoProgress, demoWorlds } from '../../data/demoData'
import AvatarDisplay from '../../components/ui/AvatarDisplay'
import XPBar from '../../components/ui/XPBar'
import { Settings, LogOut, Trophy, Star, Target } from 'lucide-react'

function ProgressSection() {
  const categories = [
    { key: 'pribadi', label: 'Pribadi', icon: '🏝️', color: 'bg-blue-500' },
    { key: 'sosial', label: 'Sosial', icon: '🌲', color: 'bg-emerald-500' },
    { key: 'belajar', label: 'Belajar', icon: '⛰️', color: 'bg-purple-500' },
    { key: 'karier', label: 'Karier', icon: '🏰', color: 'bg-amber-500' },
  ]

  return (
    <div className="card mb-4">
      <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
        <Target size={18} className="text-blue-600" />
        Progres Materi
      </h3>
      <div className="space-y-3">
        {categories.map(cat => {
          const pct = demoProgress[cat.key] || 0
          return (
            <div key={cat.key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <span>{cat.icon}</span>
                  {cat.label}
                </span>
                <span className="text-sm font-bold text-slate-600">{pct}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function StudentProfile() {
  const navigate = useNavigate()
  const { profile, logout } = useAuth()
  const student = (profile?.role === 'student' ? profile : demoStudent)

  const completedMissions = demoMissions.filter(m => m.status === 'completed')
  const earnedBadges = demoBadges.filter(b => b.earned)
  const lockedBadges = demoBadges.filter(b => !b.earned)

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-700 px-5 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-5 right-5 w-20 h-20 bg-white/10 rounded-full" />
        </div>
        <div className="flex items-center justify-between mb-1 relative">
          <h1 className="text-2xl font-black text-white">Profil Saya</h1>
          <div className="flex gap-2">
            <button className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Settings size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile card */}
      <div className="px-5 -mt-6 mb-4">
        <div className="card shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <AvatarDisplay type={student.avatar || 'boy1'} size="lg" showLevel level={student.level} />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-slate-800">{student.name}</h2>
              <p className="text-slate-500 text-sm">Kelas {student.kelas}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="badge bg-yellow-100 text-yellow-700 text-xs">🪙 {student.coins || demoStudent.coins}</span>
                <span className="badge bg-purple-100 text-purple-700 text-xs">🏅 {earnedBadges.length} Badge</span>
              </div>
            </div>
          </div>
          <XPBar
            xp={student.xp || demoStudent.xp}
            xpMax={student.xpMax || demoStudent.xpMax}
            level={student.level || demoStudent.level}
            levelName={student.levelName || demoStudent.levelName}
          />
        </div>
      </div>

      <div className="px-5 pb-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center py-3 bg-emerald-50">
            <p className="text-2xl font-black text-emerald-700">{completedMissions.length}</p>
            <p className="text-xs text-emerald-600 font-semibold">Misi Selesai</p>
          </div>
          <div className="card text-center py-3 bg-blue-50">
            <p className="text-2xl font-black text-blue-700">{earnedBadges.length}</p>
            <p className="text-xs text-blue-600 font-semibold">Badge Diraih</p>
          </div>
          <div className="card text-center py-3 bg-amber-50">
            <p className="text-2xl font-black text-amber-700">{student.level || 3}</p>
            <p className="text-xs text-amber-600 font-semibold">Level</p>
          </div>
        </div>

        {/* Progress */}
        <ProgressSection />

        {/* Badges */}
        <div className="card">
          <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            Badge Saya
          </h3>

          {earnedBadges.length > 0 && (
            <>
              <p className="text-xs font-bold text-emerald-600 mb-2">✅ Sudah Diraih</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className={`${badge.color} rounded-2xl p-3 text-center`}>
                    <div className="text-3xl mb-1">{badge.icon}</div>
                    <p className="text-xs font-bold leading-tight">{badge.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {lockedBadges.length > 0 && (
            <>
              <p className="text-xs font-bold text-slate-400 mb-2">🔒 Belum Diraih</p>
              <div className="grid grid-cols-3 gap-2">
                {lockedBadges.map(badge => (
                  <div key={badge.id} className="bg-slate-100 rounded-2xl p-3 text-center opacity-50">
                    <div className="text-3xl mb-1 grayscale">{badge.icon}</div>
                    <p className="text-xs font-bold leading-tight text-slate-500">{badge.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all"
        >
          <LogOut size={18} />
          Keluar
        </button>

        {/* Creator Credit */}
        <div className="card bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100">
          <div className="text-center">
            <p className="text-slate-400 text-xs font-medium mb-1">Sistem dikembangkan oleh</p>
            <p className="text-slate-400 text-sm font-semibold">Kartika Wulandari, S.Sos.</p>
            <p className="text-slate-300 text-[10px] mt-2">Sahabat BK © 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}
