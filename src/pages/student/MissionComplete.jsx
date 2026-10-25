import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { demoMissions } from '../../data/demoData'
import { apiClient } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import StarRating from '../../components/ui/StarRating'
import Confetti from '../../components/ui/Confetti'
import { Home, Map, ChevronRight, PenLine } from 'lucide-react'

export default function MissionComplete() {
  const { missionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshProfile } = useAuth()
  const { score = 0, total = 1, answers = [] } = location.state || {}
  const mission = demoMissions.find(m => m.id === missionId)

  const [showConfetti, setShowConfetti] = useState(false)
  const [animated, setAnimated] = useState(false)
  const [reflection, setReflection] = useState('')
  const [reflectionSaved, setReflectionSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const percentage = Math.round((score / (total - (answers.filter(a => a.isReflection).length))) * 100) || 100
  const nonReflectionTotal = total - answers.filter(a => a.isReflection).length || 1

  useEffect(() => {
    const t1 = setTimeout(() => setShowConfetti(true), 300)
    const t2 = setTimeout(() => setAnimated(true), 500)
    
    // Save mission completion to database
    saveMissionCompletion()
    
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  async function saveMissionCompletion() {
    try {
      console.log('🎯 Saving mission completion:', {
        missionId,
        percentage,
        xp: mission.xpReward,
        coins: mission.coinReward
      })
      
      const result = await apiClient.completeMission(
        missionId,
        percentage,
        mission.xpReward,
        mission.coinReward
      )
      
      console.log('✅ Mission completion saved:', result)
      
      // Refresh profile to get updated XP and coins
      await refreshProfile()
      
      console.log('✅ Profile refreshed')
    } catch (err) {
      console.error('❌ Failed to save mission completion:', err)
      console.error('Error details:', err.message, err.response)
    }
  }

  if (!mission) {
    navigate('/student/map')
    return null
  }

  const xpEarned = mission.xpReward
  const coinsEarned = mission.coinReward

  function handleSaveReflection() {
    // In demo mode, just mark as saved; in production would save to DB
    setReflectionSaved(true)
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gradient-to-b from-indigo-700 via-purple-700 to-blue-800 flex flex-col items-center justify-start pt-10 px-5 pb-10">
      <Confetti active={showConfetti} />

      {/* Shield trophy */}
      <div
        className="transition-all duration-700"
        style={{ transform: animated ? 'scale(1)' : 'scale(0)', opacity: animated ? 1 : 0 }}
      >
        <div className="w-36 h-36 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 flex items-center justify-center shadow-2xl border-8 border-yellow-200 mb-4">
          <span className="text-6xl">🏆</span>
        </div>
      </div>

      {/* Title */}
      <div
        className="text-center mb-6 transition-all duration-700 delay-300"
        style={{ transform: animated ? 'translateY(0)' : 'translateY(20px)', opacity: animated ? 1 : 0 }}
      >
        <h1 className="text-3xl font-black text-white mb-1">MISI SELESAI!</h1>
        <p className="text-purple-200">Hebat! Kamu berhasil menyelesaikan</p>
        <p className="text-white font-bold">"{mission.title}"</p>
      </div>

      {/* Stars */}
      <div className="mb-6">
        <StarRating score={score} maxScore={nonReflectionTotal} size="lg" />
        <p className="text-center text-white/80 text-sm mt-2">
          {score} / {nonReflectionTotal} jawaban benar
        </p>
      </div>

      {/* Rewards */}
      <div
        className="w-full bg-white/10 rounded-3xl p-5 mb-5 backdrop-blur-sm transition-all duration-700 delay-500"
        style={{ transform: animated ? 'translateY(0)' : 'translateY(30px)', opacity: animated ? 1 : 0 }}
      >
        <h3 className="text-white font-black text-center mb-4 text-lg">Hadiahmu 🎁</h3>
        <div className="flex justify-around">
          <div className="text-center">
            <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-yellow-300 font-black text-xl">+{xpEarned}</p>
            <p className="text-white/70 text-xs">XP</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <span className="text-2xl">🪙</span>
            </div>
            <p className="text-amber-300 font-black text-xl">+{coinsEarned}</p>
            <p className="text-white/70 text-xs">Koin</p>
          </div>
          {mission.badgeReward && (
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                <span className="text-2xl">🏅</span>
              </div>
              <p className="text-purple-200 font-black text-xs mt-1">Badge Baru!</p>
              <p className="text-white/70 text-xs">{mission.badgeReward}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reflection prompt */}
      <div className="w-full bg-white/10 rounded-3xl p-4 mb-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <PenLine size={18} className="text-purple-200" />
          <h3 className="text-white font-black text-sm">Refleksi Singkat</h3>
        </div>
        {!reflectionSaved ? (
          <>
            <p className="text-purple-200 text-xs mb-2">Apa yang kamu pelajari dari misi ini?</p>
            <textarea
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Tulis di sini..."
              rows={2}
              className="w-full bg-white/10 text-white placeholder-white/40 rounded-xl px-3 py-2 text-sm border border-white/20 focus:outline-none focus:border-white/50 resize-none"
            />
            <button
              onClick={handleSaveReflection}
              className="mt-2 bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors w-full"
            >
              Simpan Refleksi
            </button>
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-emerald-300 font-bold text-sm">✅ Refleksi tersimpan! Terima kasih.</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="w-full space-y-3">
        <button
          onClick={() => {
            // Force refresh dengan state untuk trigger reload di AdventureMap
            navigate('/student/map', { state: { refreshMissions: true } })
          }}
          className="w-full bg-white text-blue-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-blue-50 transition-all"
        >
          Lanjut ke Misi Berikutnya <ChevronRight size={20} />
        </button>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="w-full bg-white/20 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/30 transition-all"
        >
          <Home size={18} /> Kembali ke Beranda
        </button>
      </div>
    </div>
  )
}
