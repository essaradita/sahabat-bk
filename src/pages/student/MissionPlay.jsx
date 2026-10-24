import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { demoMissions, demoQuestions } from '../../data/demoData'
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, Lightbulb, PenLine } from 'lucide-react'

// Fallback questions if no specific questions exist
const fallbackQuestions = [
  {
    id: 'fallback-1',
    type: 'multiple_choice',
    question: 'Menurutmu, bimbingan dan konseling berguna untuk...',
    options: [
      { id: 'A', text: 'Menghukum siswa yang bermasalah' },
      { id: 'B', text: 'Membantu siswa berkembang dan mengatasi masalah' },
      { id: 'C', text: 'Hanya untuk siswa yang punya masalah besar' },
      { id: 'D', text: 'Mengisi waktu luang di sekolah' },
    ],
    correctAnswer: 'B',
    explanation: 'BK hadir untuk semua siswa — bukan hanya yang bermasalah! Tujuannya membantu kamu berkembang, menemukan potensi, dan menghadapi tantangan dengan lebih baik.',
  },
]

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function OptionButton({ option, selected, correct, revealed, onClick }) {
  let style = 'border-2 border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50'

  if (selected && !revealed) {
    style = 'border-2 border-blue-500 bg-blue-50 text-blue-700'
  } else if (revealed && option.id === correct) {
    style = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700'
  } else if (revealed && selected && option.id !== correct) {
    style = 'border-2 border-red-400 bg-red-50 text-red-600'
  } else if (revealed) {
    style = 'border-2 border-slate-200 bg-slate-50 text-slate-400 opacity-70'
  }

  return (
    <button
      onClick={() => !revealed && onClick(option.id)}
      disabled={revealed}
      className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-start gap-3 ${style} ${!revealed ? 'active:scale-98' : ''}`}
    >
      <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-sm font-black shrink-0 mt-0.5">
        {option.id}
      </span>
      <span className="text-sm font-semibold leading-relaxed flex-1">{option.text}</span>
      {revealed && option.id === correct && <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />}
      {revealed && selected && option.id !== correct && <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />}
    </button>
  )
}

export default function MissionPlay() {
  const { missionId } = useParams()
  const navigate = useNavigate()
  const mission = demoMissions.find(m => m.id === missionId)
  const questions = demoQuestions[missionId] || fallbackQuestions

  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [reflectionText, setReflectionText] = useState('')
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])

  const question = questions[currentQ]
  const isLastQuestion = currentQ === questions.length - 1
  const isReflection = question?.type === 'reflection'
  const isNoWrongAnswer = question?.correctAnswer === null

  if (!mission || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-5">
          <p className="text-5xl mb-3">🔍</p>
          <p className="font-bold text-slate-700">Data misi tidak ditemukan.</p>
          <button onClick={() => navigate('/student/map')} className="btn-primary mt-4">Ke Peta</button>
        </div>
      </div>
    )
  }

  function handleSelect(optionId) {
    if (revealed) return
    setSelected(optionId)
  }

  function handleSubmit() {
    if (isReflection) {
      setRevealed(true)
      setAnswers(prev => [...prev, { questionId: question.id, answer: reflectionText, isReflection: true }])
      return
    }
    if (!selected) return

    const isCorrect = isNoWrongAnswer || selected === question.correctAnswer
    if (isCorrect) setScore(s => s + 1)
    setAnswers(prev => [...prev, { questionId: question.id, selected, isCorrect }])
    setRevealed(true)
  }

  function handleNext() {
    if (isLastQuestion) {
      navigate(`/student/mission/${missionId}/complete`, {
        state: { score, total: questions.length, missionId, answers }
      })
    } else {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setRevealed(false)
      setReflectionText('')
    }
  }

  const gradients = {
    pribadi: 'from-blue-500 to-blue-700',
    sosial: 'from-emerald-500 to-emerald-700',
    belajar: 'from-purple-500 to-purple-700',
    karier: 'from-amber-500 to-amber-700',
  }
  const gradient = gradients[mission.category] || 'from-blue-500 to-blue-700'

  return (
    <div className="max-w-lg mx-auto min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradient} px-5 pt-10 pb-5`}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(`/student/mission/${missionId}`)}
            className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex-1">
            <p className="text-white/80 text-xs">{mission.title}</p>
            <p className="text-white font-bold text-sm">
              Soal {currentQ + 1} dari {questions.length}
            </p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-1.5">
            <span className="text-white font-black text-sm">{score} ✓</span>
          </div>
        </div>
        <ProgressBar current={currentQ + 1} total={questions.length} />
      </div>

      {/* Question */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-4">
        {/* Type badge */}
        <div className="flex items-center gap-2">
          {isReflection ? (
            <span className="badge bg-purple-100 text-purple-700 text-xs">✍️ Refleksi</span>
          ) : question.type === 'true_false' ? (
            <span className="badge bg-blue-100 text-blue-700 text-xs">⚖️ Benar atau Salah</span>
          ) : question.type === 'situational' ? (
            <span className="badge bg-amber-100 text-amber-700 text-xs">🎭 Skenario</span>
          ) : (
            <span className="badge bg-slate-100 text-slate-600 text-xs">📝 Pilihan Ganda</span>
          )}
        </div>

        {/* Question text */}
        <div className="card bg-white shadow-sm">
          <p className="text-slate-800 font-bold text-base leading-relaxed">{question.question}</p>
        </div>

        {/* Options or text input */}
        {isReflection ? (
          <div className="space-y-2">
            <textarea
              value={reflectionText}
              onChange={e => setReflectionText(e.target.value)}
              placeholder="Tuliskan jawabanmu di sini..."
              rows={4}
              disabled={revealed}
              className="input-field resize-none"
            />
          </div>
        ) : (
          <div className="space-y-2">
            {question.options?.map(opt => (
              <OptionButton
                key={opt.id}
                option={opt}
                selected={selected === opt.id}
                correct={question.correctAnswer}
                revealed={revealed}
                onClick={handleSelect}
              />
            ))}
          </div>
        )}

        {/* Explanation */}
        {revealed && question.explanation && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 animate-slide-up">
            <div className="flex items-start gap-2">
              <Lightbulb size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-blue-700 text-sm mb-1">Penjelasan</p>
                <p className="text-blue-600 text-sm leading-relaxed">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action button */}
        <div className="pb-2">
          {!revealed ? (
            <button
              onClick={handleSubmit}
              disabled={!isReflection && !selected}
              className={`w-full py-4 rounded-2xl font-black text-white text-base transition-all ${
                (isReflection || selected)
                  ? `bg-gradient-to-r ${gradient} shadow-lg hover:shadow-xl hover:-translate-y-0.5`
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              {isReflection ? 'Simpan Refleksi ✍️' : 'Jawab →'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={`w-full py-4 rounded-2xl font-black text-white text-base bg-gradient-to-r ${gradient} shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2`}
            >
              {isLastQuestion ? '🏆 Lihat Hasil!' : 'Lanjut →'}
              {!isLastQuestion && <ChevronRight size={20} />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
