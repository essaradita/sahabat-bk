import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useMissionProgress } from '../../hooks/useMissionProgress'
import { demoStudent, demoBadges, demoWorlds } from '../../data/demoData'
import AvatarDisplay from '../../components/ui/AvatarDisplay'
import { Bell, Map, BookOpen, User, RotateCcw, AlertTriangle } from 'lucide-react'
import { apiClient } from '../../lib/api'
import { useState } from 'react'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useAuth()
  const { missions, loading: loadingMissions, refresh } = useMissionProgress()
  
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetXP, setResetXP] = useState(false)
  const [resetting, setResetting] = useState(false)
  
  // Check if in preview mode
  const isPreviewMode = sessionStorage.getItem('teacher_preview_mode') === 'true'
  
  // Use demo student data if in preview mode, otherwise use actual profile
  const student = isPreviewMode ? demoStudent : (profile?.role === 'student' ? profile : demoStudent)

  // Debug log
  console.log('Student profile:', student)
  console.log('Gender:', student.gender)

  const completedCount = missions.filter(m => m.status === 'completed').length
  const earnedBadges = demoBadges.filter(b => b.earned).length

  // Hitung progress XP
  const xpProgress = Math.round((student.xp / student.xpMax) * 100)

  const handleResetProgress = async () => {
    try {
      setResetting(true)
      const result = await apiClient.resetProgress(resetXP)
      
      alert(`✅ ${result.message}\n\nSemua misi kembali ke awal dan soal akan diambil dari bank soal terbaru!`)
      
      // Refresh missions
      await refresh()
      
      // Reload page to update XP/level if resetXP was true
      if (resetXP) {
        window.location.reload()
      }
      
      setShowResetDialog(false)
      setResetXP(false)
    } catch (err) {
      alert('❌ Gagal mereset progress: ' + err.message)
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="max-w-md lg:max-w-4xl mx-auto px-4 lg:px-8">
        
        {/* Header dengan gradient */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 -mx-4 lg:-mx-8 px-4 lg:px-8 pt-6 lg:pt-8 pb-6 lg:pb-8 mb-4 lg:mb-6 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 lg:w-36 lg:h-36 bg-white/5 rounded-full -ml-8 -mb-8" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5 lg:gap-4">
              <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 lg:border-3 border-white/30 shrink-0 bg-white">
                <AvatarDisplay type={student.avatar || 'boy1'} gender={student.gender} size="md" />
              </div>
              <div>
                <h1 className="text-white text-lg lg:text-3xl font-black leading-tight">
                  Halo, {student.name?.split(' ')[0] || 'Penjelajah'}! 👋
                </h1>
                <p className="text-blue-100 text-xs lg:text-base">Semangat terus belajar!</p>
              </div>
            </div>
            <button className="w-9 h-9 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Bell size={18} className="lg:w-6 lg:h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Profile Card dengan Level & XP */}
        <div className="bg-white rounded-3xl shadow-lg shadow-blue-100/50 p-4 lg:p-6 mb-4 lg:mb-6 -mt-10 lg:-mt-14 relative z-10 border border-blue-50">
          <div className="flex items-center gap-3 lg:gap-5 mb-3 lg:mb-4">
            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-2xl overflow-hidden bg-white flex items-center justify-center shrink-0 shadow-md">
              <AvatarDisplay type={student.avatar || 'boy1'} gender={student.gender} size="lg" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 lg:gap-3 mb-1.5 lg:mb-2">
                <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-[10px] lg:text-sm font-black">Lv.{student.level || 3}</span>
                </div>
                <span className="text-slate-700 font-bold text-sm lg:text-lg truncate">{student.levelName || 'Penjelajah Muda'}</span>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 lg:mb-1.5">
                  <span className="text-[10px] lg:text-xs text-slate-500">Progress XP</span>
                  <span className="text-[10px] lg:text-sm font-bold text-orange-500">
                    {student.xp || 120} / {student.xpMax || 300} XP
                  </span>
                </div>
                <div className="h-2.5 lg:h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats: Koin & Badge */}
          <div className="grid grid-cols-2 gap-2.5 lg:gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-3 lg:p-5 border border-amber-100">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-9 h-9 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md">
                  <span className="text-xl lg:text-3xl">🪙</span>
                </div>
                <div>
                  <p className="text-[10px] lg:text-xs text-slate-500 font-semibold">Koin</p>
                  <p className="text-xl lg:text-3xl font-black text-slate-800">{student.coins || 250}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-3 lg:p-5 border border-purple-100">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-9 h-9 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-md">
                  <span className="text-xl lg:text-3xl">🏅</span>
                </div>
                <div>
                  <p className="text-[10px] lg:text-xs text-slate-500 font-semibold">Badge</p>
                  <p className="text-xl lg:text-3xl font-black text-slate-800">{earnedBadges}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigation - Tambah Mode Game */}
        <div className="mb-5 lg:mb-8">
          <h3 className="text-sm lg:text-xl font-black text-slate-800 mb-2.5 lg:mb-4 px-1">Pilih Mode Bermain</h3>
          <div className="grid grid-cols-2 gap-2.5 lg:gap-5">
            <button
              onClick={() => navigate('/student/map')}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl lg:rounded-3xl p-3 lg:p-6 text-left shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 lg:w-32 lg:h-32 bg-white/10 rounded-full -mr-8 lg:-mr-16 -mt-8 lg:-mt-16" />
              <div className="relative">
                <div className="w-10 h-10 lg:w-16 lg:h-16 mb-2 lg:mb-3 rounded-xl lg:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl lg:text-4xl">👤</span>
                </div>
                <p className="text-white text-xs lg:text-lg font-black mb-0.5 lg:mb-1">Mode Individu</p>
                <p className="text-blue-100 text-[9px] lg:text-sm leading-tight">Main sendiri dengan misi</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/student/group-mode')}
              className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl lg:rounded-3xl p-3 lg:p-6 text-left shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 lg:w-32 lg:h-32 bg-white/10 rounded-full -mr-8 lg:-mr-16 -mt-8 lg:-mt-16" />
              <div className="relative">
                <div className="w-10 h-10 lg:w-16 lg:h-16 mb-2 lg:mb-3 rounded-xl lg:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl lg:text-4xl">👥</span>
                </div>
                <p className="text-white text-xs lg:text-lg font-black mb-0.5 lg:mb-1">Mode Kelompok</p>
                <p className="text-purple-100 text-[9px] lg:text-sm leading-tight">Kerja sama dengan teman</p>
              </div>
            </button>
          </div>
        </div>

        {/* Menu Navigation Lainnya */}
        <div className="grid grid-cols-3 gap-2.5 lg:gap-5 mb-5 lg:mb-8">
          <button
            onClick={() => navigate('/student/map')}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl lg:rounded-3xl p-3 lg:p-6 text-center shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all active:scale-95"
          >
            <div className="w-11 h-11 lg:w-16 lg:h-16 mx-auto mb-1.5 lg:mb-3 rounded-xl lg:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Map size={22} className="lg:w-8 lg:h-8 text-white" />
            </div>
            <p className="text-white text-[10px] lg:text-sm font-bold leading-tight">Peta Misi</p>
          </button>

          <button
            onClick={() => navigate('/student/journal')}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl lg:rounded-3xl p-3 lg:p-6 text-center shadow-lg shadow-blue-200/50 hover:shadow-xl transition-all active:scale-95"
          >
            <div className="w-11 h-11 lg:w-16 lg:h-16 mx-auto mb-1.5 lg:mb-3 rounded-xl lg:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BookOpen size={22} className="lg:w-8 lg:h-8 text-white" />
            </div>
            <p className="text-white text-[10px] lg:text-sm font-bold leading-tight">Misi Saya</p>
          </button>

          <button
            onClick={() => navigate('/student/profile')}
            className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl lg:rounded-3xl p-3 lg:p-6 text-center shadow-lg shadow-purple-200/50 hover:shadow-xl transition-all active:scale-95"
          >
            <div className="w-11 h-11 lg:w-16 lg:h-16 mx-auto mb-1.5 lg:mb-3 rounded-xl lg:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <User size={22} className="lg:w-8 lg:h-8 text-white" />
            </div>
            <p className="text-white text-[10px] lg:text-sm font-bold leading-tight">Profil</p>
          </button>
        </div>

        {/* Reset Progress Button - Only show if there are completed missions */}
        {completedCount > 0 && !isPreviewMode && (
          <div className="mb-5 lg:mb-8">
            <button
              onClick={() => setShowResetDialog(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl lg:rounded-3xl p-4 lg:p-5 shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 lg:gap-3"
            >
              <RotateCcw size={20} className="lg:w-6 lg:h-6" />
              <div className="text-left">
                <p className="font-black text-sm lg:text-base">Reset Progress & Ulangi Misi</p>
                <p className="text-xs lg:text-sm text-white/90 font-medium">Mulai dari awal dengan soal terbaru</p>
              </div>
            </button>
          </div>
        )}

        {/* Misi Terbaru */}
        <div className="mb-5 lg:mb-8">
          <div className="flex items-center justify-between mb-2.5 lg:mb-4">
            <h2 className="text-base lg:text-2xl font-black text-slate-800">Misi Terbaru</h2>
            <button 
              onClick={() => navigate('/student/map')}
              className="text-blue-600 text-xs lg:text-base font-bold hover:text-blue-700"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="space-y-2.5 lg:space-y-4">
            {loadingMissions ? (
              <div className="text-center py-8 lg:py-12 text-slate-500 text-sm lg:text-base">Memuat misi...</div>
            ) : (
              missions.map((mission, idx) => {
                const world = demoWorlds.find(w => w.id === mission.worldId)
                const isLocked = mission.status === 'locked'
                const isCompleted = mission.status === 'completed'
                
                return (
                  <div
                    key={mission.id}
                    className="bg-white rounded-2xl lg:rounded-3xl shadow-md overflow-hidden border border-slate-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex gap-3 lg:gap-5 p-3 lg:p-5">
                      {/* Thumbnail */}
                      <div className={`w-20 h-20 lg:w-28 lg:h-28 rounded-xl lg:rounded-2xl bg-gradient-to-br ${world?.color || 'from-blue-400 to-indigo-500'} flex items-center justify-center text-3xl lg:text-5xl shrink-0 shadow-md relative overflow-hidden`}>
                        {world?.icon || '🗺️'}
                        {isLocked && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-white/90 flex items-center justify-center">
                              <span className="text-base lg:text-2xl">🔒</span>
                            </div>
                          </div>
                        )}
                        {isCompleted && (
                          <div className="absolute top-1 right-1 lg:top-2 lg:right-2">
                            <div className="w-5 h-5 lg:w-7 lg:h-7 rounded-full bg-green-500 flex items-center justify-center">
                              <span className="text-xs lg:text-base">✓</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 lg:mb-2">
                          <p className="text-[10px] lg:text-sm text-blue-600 font-bold mb-0.5">Misi {idx + 1}</p>
                          <h3 className="font-black text-slate-800 text-xs lg:text-lg leading-tight mb-1 lg:mb-2">
                            {mission.title}
                          </h3>
                        </div>
                        <p className="text-[10px] lg:text-sm text-slate-500 mb-2 lg:mb-3 line-clamp-2 leading-snug">
                          {mission.description}
                        </p>

                        {isCompleted ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl bg-green-100 text-green-700 text-[10px] lg:text-sm font-bold">
                            <span>✓</span>
                            <span>Selesai</span>
                          </div>
                        ) : isLocked ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl bg-slate-100 text-slate-500 text-[10px] lg:text-sm font-bold">
                            <span>🔒</span>
                            <span>Terkunci</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => navigate(`/student/mission/${mission.id}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 lg:px-5 lg:py-2.5 rounded-lg lg:rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-800 text-[10px] lg:text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-95"
                          >
                            <span>Mulai</span>
                            <span>→</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            )}
          </div>
        </div>

      </div>

      {/* Reset Progress Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">Reset Progress?</h3>
                <p className="text-sm text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 mb-4">
              <p className="text-sm text-slate-700 mb-3">
                <strong>Yang akan terjadi:</strong>
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Semua progress misi akan dihapus</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Semua misi kembali belum selesai</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Soal akan diambil dari bank soal terbaru guru</span>
                </li>
              </ul>
            </div>

            <label className="flex items-center gap-3 p-3 bg-red-50 rounded-xl mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={resetXP}
                onChange={(e) => setResetXP(e.target.checked)}
                className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-700">Reset XP, Level & Koin</p>
                <p className="text-xs text-red-600">Kembali ke level 1 dengan 0 XP dan 0 koin</p>
              </div>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResetDialog(false)
                  setResetXP(false)
                }}
                disabled={resetting}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleResetProgress}
                disabled={resetting}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {resetting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mereset...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={18} />
                    <span>Ya, Reset!</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
