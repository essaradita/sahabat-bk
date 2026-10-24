import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
import petaImg from '../../gambar/petahp1.png'
import anakKecilImg from '../../gambar/anakkecil.png'
import kunciImg from '../../gambar/kunci.png'

export default function GroupMap() {
  const { caseId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { groupName, members, caseData, completedMission } = location.state || {}
  const [selectedMission, setSelectedMission] = useState(null)
  
  // Load completed missions from localStorage
  const storageKey = `group_progress_${caseId}`
  const [completedMissions, setCompletedMissions] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : []
  })

  if (!caseData) {
    navigate('/student/group-mode')
    return null
  }

  // Update completed missions ketika ada misi yang baru selesai
  useEffect(() => {
    if (completedMission && !completedMissions.includes(completedMission)) {
      const updated = [...completedMissions, completedMission]
      setCompletedMissions(updated)
      localStorage.setItem(storageKey, JSON.stringify(updated))
    }
  }, [completedMission, completedMissions, storageKey])

  // 4 Misi untuk studi kasus
  const missions = [
    { 
      id: 1, 
      title: 'Detektif Pikiran', 
      icon: '🔍', 
      status: completedMissions.includes(1) ? 'completed' : 'available' 
    },
    { 
      id: 2, 
      title: 'Cari Kekuatan', 
      icon: '💪', 
      status: completedMissions.includes(2) ? 'completed' : (completedMissions.includes(1) ? 'available' : 'locked')
    },
    { 
      id: 3, 
      title: 'Ubah Pikiran', 
      icon: '🔄', 
      status: completedMissions.includes(3) ? 'completed' : (completedMissions.includes(2) ? 'available' : 'locked')
    },
    { 
      id: 4, 
      title: 'Pilih Strategi', 
      icon: '🎯', 
      status: completedMissions.includes(4) ? 'completed' : (completedMissions.includes(3) ? 'available' : 'locked')
    }
  ]

  // Posisi misi di peta (sama seperti AdventureMap tapi hanya 4 misi)
  const missionPositions = [
    { id: 1, top: '75%', left: '78%' }, // Misi 1 - bawah kanan
    { id: 2, top: '55%', left: '65%' }, // Misi 2 - tengah kanan
    { id: 3, top: '48%', left: '22%' }, // Misi 3 - tengah kiri
    { id: 4, top: '28%', left: '50%' }, // Misi 4 - atas tengah
  ]

  // Karakter di posisi misi pertama yang available
  const currentMissionIndex = missions.findIndex(m => m.status === 'available')
  const characterPosition = missionPositions[currentMissionIndex >= 0 ? currentMissionIndex : 0]

  function handleMissionClick(mission) {
    if (mission.status === 'locked') return
    if (mission.status === 'available') {
      // Ke halaman play misi dengan missionId yang sesuai
      navigate(`/student/case-study/${caseId}/mission/${mission.id}`, {
        state: {
          groupName,
          members,
          caseData,
          missionData: mission
        }
      })
    } else if (mission.status === 'completed') {
      setSelectedMission(mission)
    }
  }

  return (
    <div className="h-screen w-full overflow-hidden relative bg-gradient-to-b from-sky-400 to-sky-200 flex flex-col">
      
      {/* Header - compact */}
      <div className="flex-shrink-0 z-20 bg-gradient-to-b from-purple-600 to-transparent pt-2 pb-3 px-3 relative">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate('/student/group-mode')}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex-1 text-center">
            <h1 className="text-white text-sm font-black drop-shadow-lg leading-tight">{caseData.title}</h1>
            <p className="text-purple-100 text-[10px]">{caseData.category}</p>
          </div>
          
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
            <Users size={12} className="text-white" />
            <span className="text-white font-black text-[10px]">{members.length}</span>
          </div>
        </div>

        {/* Group Name */}
        <div className="text-center">
          <p className="text-white/90 text-xs font-bold">Kelompok: {groupName}</p>
        </div>

        {/* Reset button for testing (can be removed in production) */}
        {completedMissions.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Reset progress studi kasus ini?')) {
                localStorage.removeItem(storageKey)
                setCompletedMissions([])
              }
            }}
            className="absolute top-2 right-2 text-white/60 hover:text-white text-[10px] px-2 py-1 bg-white/10 rounded-lg"
          >
            Reset
          </button>
        )}
      </div>

      {/* Peta Background - FLEX GROW */}
      <div className="flex-grow relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Background image */}
          <img 
            src={petaImg} 
            alt="Peta" 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Mission Nodes */}
          {missions.map((mission, idx) => {
            const pos = missionPositions[idx]
            const isCompleted = mission.status === 'completed'
            const isAvailable = mission.status === 'available'
            const isLocked = mission.status === 'locked'

            return (
              <div
                key={mission.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ top: pos.top, left: pos.left }}
              >
                {/* Layout Vertikal: Icon di ATAS, Card di BAWAH */}
                <div className="flex flex-col items-center gap-1">
                  
                  {/* Badge Icon Bulat */}
                  <button
                    onClick={() => handleMissionClick(mission)}
                    disabled={isLocked}
                    className={`relative flex-shrink-0 ${isLocked ? 'opacity-90' : 'hover:scale-110'} transition-transform duration-200`}
                  >
                    <div className={`
                      relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-gradient-to-br from-amber-400 to-amber-600' : ''}
                      ${isAvailable ? 'bg-gradient-to-br from-purple-500 to-pink-600' : ''}
                      ${isLocked ? 'bg-gradient-to-br from-slate-700 to-slate-900' : ''}
                      border-[3px] sm:border-[4px] border-white shadow-xl
                    `}>
                      {/* Icon - Bintang untuk completed, Kunci untuk locked, Icon misi untuk available */}
                      {isCompleted ? (
                        <span className="text-xl sm:text-2xl">⭐</span>
                      ) : isLocked ? (
                        <img src={kunciImg} alt="Lock" className="w-5 h-5 sm:w-5 sm:h-5 object-contain" />
                      ) : (
                        <span className="text-xl sm:text-2xl">{mission.icon}</span>
                      )}
                      
                      {/* Glow effect untuk available */}
                      {isAvailable && !isCompleted && (
                        <div className="absolute inset-0 rounded-full bg-purple-300/50 animate-ping" />
                      )}
                    </div>
                  </button>

                  {/* Mission Label Card - MINI */}
                  <button
                    onClick={() => handleMissionClick(mission)}
                    disabled={isLocked}
                    className={`
                      px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg text-center shadow-lg 
                      w-[85px] sm:w-[95px]
                      ${isCompleted ? 'bg-gradient-to-br from-teal-700 to-teal-900 border-2 border-teal-500' : ''}
                      ${isAvailable ? 'bg-gradient-to-br from-purple-700 to-pink-800 border-2 border-purple-400' : ''}
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

          {/* Karakter Anak Kecil - Animated */}
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

          {/* Challenge Badge - Di atas */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            {completedMissions.length === 4 ? (
              <button
                onClick={() => {
                  navigate(`/student/case-study/${caseId}/mission/challenge`, {
                    state: {
                      groupName,
                      members,
                      caseData
                    }
                  })
                }}
                className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl px-4 py-2 shadow-2xl border-3 border-white hover:scale-105 transition-transform active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏁</span>
                  <div>
                    <p className="text-white text-[9px] font-black uppercase leading-tight">Challenge Final</p>
                    <p className="text-orange-100 text-[8px] leading-tight">Klik untuk mulai!</p>
                  </div>
                </div>
              </button>
            ) : (
              <div className="bg-gradient-to-br from-slate-500 to-slate-700 rounded-2xl px-4 py-2 shadow-2xl border-3 border-white opacity-80">
                <div className="flex items-center gap-2">
                  <span className="text-2xl grayscale">🏁</span>
                  <div>
                    <p className="text-white text-[9px] font-black uppercase leading-tight">Challenge Final</p>
                    <p className="text-slate-300 text-[8px] leading-tight">Selesaikan 4 misi dulu</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mission Detail Modal */}
      {selectedMission && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedMission(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-3xl">
                ✓
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-1">{selectedMission.title}</h3>
              <p className="text-sm text-slate-600">Misi sudah selesai!</p>
            </div>
            <button
              onClick={() => setSelectedMission(null)}
              className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
