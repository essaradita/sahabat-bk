import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useMissionProgress } from '../../hooks/useMissionProgress'
import { ArrowLeft, Coins } from 'lucide-react'
import petaImg from '../../gambar/petahp1.png'
import anakKecilImg from '../../gambar/anakkecil.png'
import kunciImg from '../../gambar/kunci.png'

export default function AdventureMap() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useAuth()
  const { missions, loading, refresh } = useMissionProgress()
  const [selectedMission, setSelectedMission] = useState(null)

  // Auto-refresh missions jika ada flag dari MissionComplete
  useEffect(() => {
    if (location.state?.refreshMissions) {
      console.log('🔄 Refreshing missions after completion...')
      refresh()
      // Clear state setelah refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state, refresh])

  // Hitung misi yang completed
  const completedMissions = missions.filter(m => m.status === 'completed')
  const totalMissions = missions.length

  // Posisi misi di peta (dalam %) - dari BAWAH ke ATAS
  // Adjusted berdasarkan kotak di gambar
  const missionPositions = [
    { id: 'mission-1', top: '75%', left: '78%' }, // Misi 1 - Kotak PINK (lebih atas lagi)
    { id: 'mission-2', top: '55%', left: '65%' }, // Misi 2 - Kotak BIRU di jembatan
    { id: 'mission-3', top: '48%', left: '22%' }, // Misi 3 - Kotak BIRU di rumah
    { id: 'mission-4', top: '35%', left: '35%' }, // Misi 4 - TETAP
    { id: 'mission-5', top: '24%', left: '65%' }, // Misi 5 - TETAP
    { id: 'mission-6', top: '12%', left: '30%' }, // Misi 6 - TETAP
  ]

  // Tentukan posisi karakter (misi terakhir yang available/in_progress)
  const currentMissionIndex = missions.findIndex(
    m => m.status === 'available' || m.status === 'in_progress'
  )
  const characterPosition = missionPositions[currentMissionIndex >= 0 ? currentMissionIndex : 0]

  function handleMissionClick(mission) {
    if (mission.status === 'locked') return
    if (mission.status === 'available' || mission.status === 'in_progress') {
      navigate(`/student/mission/${mission.id}`)
    } else {
      setSelectedMission(mission)
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200">
        <div className="text-white text-lg font-bold">Memuat peta...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full overflow-hidden relative bg-gradient-to-b from-sky-400 to-sky-200 flex flex-col">
      
      {/* Header - Fixed height, compact */}
      <div className="flex-shrink-0 z-20 bg-gradient-to-b from-blue-600 to-transparent pt-2 pb-3 px-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <ArrowLeft size={18} />
          </button>
          
          <h1 className="text-white text-base font-black drop-shadow-lg">Peta Petualangan</h1>
          
          <div className="flex items-center gap-1 bg-amber-400 rounded-full px-2.5 py-1 shadow-lg">
            <Coins size={14} className="text-amber-800" />
            <span className="text-amber-900 font-black text-xs">{profile?.coins || 250}</span>
          </div>
        </div>
      </div>

      {/* Peta Background - FLEX GROW (fills available space) */}
      <div className="flex-grow relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Background image - cover full screen */}
          <img 
            src={petaImg} 
            alt="Peta" 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Mission Nodes */}
          {missions.map((mission, idx) => {
            const pos = missionPositions[idx]
            const isCompleted = mission.status === 'completed'
            const isAvailable = mission.status === 'available' || mission.status === 'in_progress'
            const isLocked = mission.status === 'locked'

            return (
              <div
                key={mission.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ top: pos.top, left: pos.left }}
              >
                {/* Layout Vertikal: Icon KECIL di ATAS, Card MINI di BAWAH */}
                <div className="flex flex-col items-center gap-1">
                  
                  {/* Badge Icon Bulat - LEBIH KECIL */}
                  <button
                    onClick={() => handleMissionClick(mission)}
                    disabled={isLocked}
                    className={`relative flex-shrink-0 ${isLocked ? 'opacity-90' : 'hover:scale-110'} transition-transform duration-200`}
                  >
                    <div className={`
                      relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-gradient-to-br from-amber-400 to-amber-600' : ''}
                      ${isAvailable ? 'bg-gradient-to-br from-blue-500 to-blue-700' : ''}
                      ${isLocked ? 'bg-gradient-to-br from-slate-700 to-slate-900' : ''}
                      border-[3px] sm:border-[4px] border-white shadow-xl
                    `}>
                      {/* Logika Icon: Completed = Bintang, Locked/Available = Kunci */}
                      {isCompleted ? (
                        <span className="text-xl sm:text-2xl">⭐</span>
                      ) : (
                        <img src={kunciImg} alt="Lock" className="w-5 h-5 sm:w-5 sm:h-5 object-contain" />
                      )}
                      
                      {/* Glow effect untuk available */}
                      {isAvailable && !isCompleted && (
                        <div className="absolute inset-0 rounded-full bg-blue-300/50 animate-ping" />
                      )}
                    </div>
                  </button>

                  {/* Mission Label Card - MINI SIZE */}
                  <button
                    onClick={() => handleMissionClick(mission)}
                    disabled={isLocked}
                    className={`
                      px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg text-center shadow-lg 
                      w-[85px] sm:w-[95px]
                      ${isCompleted ? 'bg-gradient-to-br from-teal-700 to-teal-900 border-2 border-teal-500' : ''}
                      ${isAvailable ? 'bg-gradient-to-br from-blue-700 to-blue-900 border-2 border-blue-500' : ''}
                      ${isLocked ? 'bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-slate-600 opacity-95' : ''}
                      ${!isLocked ? 'hover:scale-105' : ''} transition-transform duration-200
                    `}
                  >
                    <p className="text-white text-[7px] sm:text-[8px] font-black leading-tight mb-0.5 uppercase tracking-wide">
                      MISI {idx + 1}
                    </p>
                    <p className="text-white text-[9px] sm:text-[10px] font-bold leading-tight">
                      {mission.title.length > 15 ? mission.title.slice(0, 13) + '...' : mission.title}
                    </p>
                  </button>
                </div>
              </div>
            )
          })}

          {/* Karakter Anak Kecil - Animated, LEBIH BESAR */}
          <div
            className="absolute transform -translate-x-1/2 transition-all duration-1000 ease-in-out z-20"
            style={{
              top: `calc(${characterPosition.top} + 50px)`,
              left: `calc(${characterPosition.left} - 15px)`,
            }}
          >
            <img
              src={anakKecilImg}
              alt="Character"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-2xl animate-bounce"
              style={{ animationDuration: '2s' }}
            />
          </div>
        </div>
      </div>

      {/* Mission Detail Modal (opsional) */}
      {selectedMission && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedMission(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-black text-slate-800 mb-2">{selectedMission.title}</h3>
            <p className="text-slate-600 text-sm mb-4">{selectedMission.description}</p>
            <div className="flex gap-3">
              <span className="badge bg-amber-50 text-amber-700">+{selectedMission.xpReward} XP</span>
              <span className="badge bg-blue-50 text-blue-700">⏱ {selectedMission.estimatedMinutes} menit</span>
            </div>
            <button
              onClick={() => setSelectedMission(null)}
              className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
