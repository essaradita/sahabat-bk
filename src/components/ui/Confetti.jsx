import { useEffect, useState } from 'react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#7C3AED', '#F97316', '#EF4444']

function ConfettiPiece({ color, x, delay }) {
  return (
    <div
      className="absolute w-3 h-3 rounded-sm pointer-events-none"
      style={{
        left: `${x}%`,
        top: '-20px',
        backgroundColor: color,
        animation: `fall ${1.5 + Math.random()}s ease-in forwards`,
        animationDelay: `${delay}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  )
}

export default function Confetti({ active }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!active) return
    const arr = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
    }))
    setPieces(arr)
    const t = setTimeout(() => setPieces([]), 3000)
    return () => clearTimeout(t)
  }, [active])

  if (!pieces.length) return null

  return (
    <>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {pieces.map(p => (
          <ConfettiPiece key={p.id} color={p.color} x={p.x} delay={p.delay} />
        ))}
      </div>
    </>
  )
}
