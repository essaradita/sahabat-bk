import { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, CheckCircle2, Timer } from 'lucide-react'

export default function CaseStudyPlay() {
  const { caseId, missionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { groupName, members, caseData } = location.state || {}

  // Set current mission based on missionId from URL
  const isChallenge = missionId === 'challenge'
  const [currentMission, setCurrentMission] = useState(isChallenge ? 0 : (missionId ? parseInt(missionId) - 1 : 0))
  const [answers, setAnswers] = useState({})
  const [showChallenge, setShowChallenge] = useState(isChallenge)
  const [challengeCompleted, setChallengeCompleted] = useState(false)

  // Data misi untuk studi kasus "Rani dan Presentasi"
  const missions = [
    {
      id: 1,
      title: 'Detektif Pikiran',
      icon: '🔍',
      questions: [
        {
          id: 'q1',
          text: 'Apa pikiran negatif Rani?',
          type: 'textarea',
          placeholder: 'Tuliskan pikiran negatif yang ada di benak Rani...'
        },
        {
          id: 'q2',
          text: 'Apa perasaan yang muncul?',
          type: 'textarea',
          placeholder: 'Tuliskan perasaan yang Rani alami...'
        },
        {
          id: 'q3',
          text: 'Apa yang menyebabkan Rani menjadi tidak percaya diri?',
          type: 'textarea',
          placeholder: 'Jelaskan penyebabnya...'
        }
      ]
    },
    {
      id: 2,
      title: 'Cari Kekuatan',
      icon: '💪',
      questions: [
        {
          id: 'q1',
          text: 'Apa bukti bahwa Rani sebenarnya memiliki kemampuan?',
          type: 'textarea',
          placeholder: 'Tuliskan bukti kemampuan Rani...'
        },
        {
          id: 'q2',
          text: 'Sebutkan minimal 2 kekuatan Rani.',
          type: 'textarea',
          placeholder: '1. ...\n2. ...'
        }
      ]
    },
    {
      id: 3,
      title: 'Ubah Pikiran',
      icon: '🔄',
      questions: [
        {
          id: 'q1',
          text: 'Ubah pikiran negatif: "Aku pasti salah dan ditertawakan" menjadi pikiran yang lebih realistis dan mendukung.',
          type: 'textarea',
          placeholder: 'Tuliskan pikiran baru yang lebih positif...'
        }
      ]
    },
    {
      id: 4,
      title: 'Pilih Strategi',
      icon: '🎯',
      questions: [
        {
          id: 'q1',
          text: 'Pilih 3 strategi paling tepat untuk membantu Rani menghadapi presentasi dan jelaskan alasannya.',
          type: 'checkbox',
          options: [
            'Berlatih presentasi di depan cermin atau keluarga',
            'Menghindari presentasi dan meminta teman menggantikan',
            'Menggunakan teknik pernapasan untuk menenangkan diri',
            'Fokus pada materi yang sudah disiapkan, bukan pada penilaian orang',
            'Mengingat pengalaman sukses di masa lalu',
            'Meminta bantuan guru untuk tips presentasi'
          ]
        },
        {
          id: 'q2',
          text: 'Jelaskan alasan memilih strategi tersebut:',
          type: 'textarea',
          placeholder: 'Tuliskan alasan untuk setiap strategi yang dipilih...'
        }
      ]
    }
  ]

  const challenge = {
    title: 'Challenge Akhir',
    icon: '🏁',
    description: 'Setiap anggota mencoba berbicara 30 detik menyampaikan pendapat dengan suara jelas.',
    instruction: 'Praktikkan secara bergantian! Timer akan dimulai saat tombol diklik.',
    duration: 30
  }

  function handleAnswerChange(questionId, value) {
    setAnswers({
      ...answers,
      [`m${currentMission + 1}_${questionId}`]: value
    })
  }

  function handleCheckboxChange(questionId, option, checked) {
    const key = `m${currentMission + 1}_${questionId}`
    const current = answers[key] || []
    
    if (checked) {
      setAnswers({
        ...answers,
        [key]: [...current, option]
      })
    } else {
      setAnswers({
        ...answers,
        [key]: current.filter(o => o !== option)
      })
    }
  }

  function handleNext() {
    // Validasi: cek apakah semua pertanyaan sudah dijawab
    const currentQuestions = missions[currentMission].questions
    let allAnswered = true
    
    for (let question of currentQuestions) {
      const answerKey = `m${currentMission + 1}_${question.id}`
      const answer = answers[answerKey]
      
      if (question.type === 'textarea') {
        if (!answer || answer.trim() === '') {
          allAnswered = false
          break
        }
      } else if (question.type === 'checkbox') {
        if (!answer || answer.length === 0) {
          allAnswered = false
          break
        }
      }
    }
    
    if (!allAnswered) {
      alert('⚠️ Mohon jawab semua pertanyaan terlebih dahulu!')
      return
    }
    
    if (currentMission < missions.length - 1) {
      // Jika masih ada misi berikutnya, kembali ke peta
      navigate(`/student/group-map/${caseId}`, {
        state: {
          groupName,
          members,
          caseData,
          completedMission: missions[currentMission].id
        }
      })
    } else {
      // Jika sudah misi terakhir, tampilkan challenge
      setShowChallenge(true)
    }
  }

  function handleBack() {
    if (currentMission > 0) {
      setCurrentMission(currentMission - 1)
      window.scrollTo(0, 0)
    }
  }

  function handleFinish() {
    // Save results and navigate to summary
    navigate('/student/case-study-complete', {
      state: {
        groupName,
        members,
        caseData,
        answers,
        challengeCompleted
      }
    })
  }

  const currentMissionData = missions[currentMission]
  const progress = ((currentMission + 1) / missions.length) * 100

  // Check if all questions are answered
  const isAllAnswered = () => {
    const currentQuestions = missions[currentMission]?.questions || []
    for (let question of currentQuestions) {
      const answerKey = `m${currentMission + 1}_${question.id}`
      const answer = answers[answerKey]
      
      if (question.type === 'textarea') {
        if (!answer || answer.trim() === '') return false
      } else if (question.type === 'checkbox') {
        if (!answer || answer.length === 0) return false
      }
    }
    return true
  }

  if (!caseData) {
    navigate('/student/group-mode')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-32">
      <div className="max-w-md mx-auto px-4">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 -mx-4 px-4 pt-6 pb-6 mb-4 sticky top-0 z-20 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => {
                if (window.confirm('Yakin ingin keluar? Progress akan hilang.')) {
                  navigate('/student/group-mode')
                }
              }}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1">
              <h1 className="text-white text-base font-black leading-tight">{caseData.title}</h1>
              <div className="flex items-center gap-2 text-purple-100 text-xs mt-0.5">
                <Users size={12} />
                <span>{groupName}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {!showChallenge && (
            <div>
              <div className="flex justify-between text-white text-[10px] mb-1">
                <span>Misi {currentMission + 1} dari {missions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {!showChallenge ? (
          <>
            {/* Mission Content */}
            <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                  {currentMissionData.icon}
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-800">📍 Misi {currentMission + 1}</h2>
                  <p className="text-xs font-bold text-purple-600">{currentMissionData.title}</p>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {currentMissionData.questions.map((question, idx) => (
                  <div key={question.id} className="border-t-2 border-slate-100 pt-4 first:border-0 first:pt-0">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      {idx + 1}. {question.text}
                    </label>
                    
                    {question.type === 'textarea' && (
                      <textarea
                        value={answers[`m${currentMission + 1}_${question.id}`] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder={question.placeholder}
                        rows={4}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none text-sm resize-none"
                      />
                    )}

                    {question.type === 'checkbox' && (
                      <div className="space-y-2">
                        {question.options.map((option) => {
                          const isChecked = (answers[`m${currentMission + 1}_${question.id}`] || []).includes(option)
                          return (
                            <label
                              key={option}
                              className={`flex items-start gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                isChecked
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-slate-200 hover:border-purple-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                                className="mt-0.5 w-4 h-4 text-purple-600 rounded border-slate-300"
                              />
                              <span className="text-xs text-slate-700 flex-1">{option}</span>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Collaboration Tip */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-3 mb-4">
              <p className="text-yellow-800 text-xs leading-relaxed">
                💡 <strong>Diskusikan bersama!</strong> Setiap anggota boleh memberikan pendapat sebelum menulis jawaban final.
              </p>
            </div>

            {/* Navigation Buttons - INLINE */}
            <div className="flex gap-3 mb-6">
              {currentMission > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  ← Kembali
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!isAllAnswered()}
                className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all ${
                  isAllAnswered()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg active:scale-95'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {currentMission < missions.length - 1 ? 'Selesai & Kembali ke Peta 🗺️' : 'Ke Challenge 🏁'}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Challenge Section */}
            <div className="bg-white rounded-2xl p-5 shadow-lg mb-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-4xl shadow-lg">
                  {challenge.icon}
                </div>
                <h2 className="text-lg font-black text-slate-800 mb-1">{challenge.title}</h2>
                <p className="text-sm text-slate-600">{challenge.description}</p>
              </div>

              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-4">
                <p className="text-xs text-orange-800 leading-relaxed mb-3">
                  <strong>📋 Instruksi:</strong><br />
                  {challenge.instruction}
                </p>
                <div className="flex items-center justify-center gap-2 text-orange-700">
                  <Timer size={16} />
                  <span className="text-sm font-bold">{challenge.duration} detik per orang</span>
                </div>
              </div>

              {/* Member Checklist */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-bold text-slate-700 mb-2">Centang setelah anggota selesai:</p>
                {members.map((member, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 p-3 rounded-xl border-2 border-slate-200 hover:border-purple-300 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm text-slate-700">{member}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => setChallengeCompleted(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                Challenge Selesai!
              </button>
            </div>

            {/* Challenge Navigation Button - INLINE */}
            {challengeCompleted && (
              <div className="mb-6">
                <button
                  onClick={handleFinish}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm hover:shadow-lg transition-all active:scale-95"
                >
                  Selesai & Lihat Hasil ✨
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}
