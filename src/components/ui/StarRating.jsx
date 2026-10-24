import { useState, useEffect } from 'react'

export default function StarRating({ score, maxScore, size = 'md' }) {
  const [animated, setAnimated] = useState(false)
  const percent = score / maxScore
  const stars = percent >= 0.9 ? 3 : percent >= 0.6 ? 2 : 1

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(t)
  }, [])

  const sizes = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-5xl' }

  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3].map(s => (
        <span
          key={s}
          className={`${sizes[size]} transition-all duration-500`}
          style={{
            transform: animated && s <= stars ? 'scale(1.2)' : 'scale(0.8)',
            opacity: animated ? 1 : 0.3,
            transitionDelay: `${s * 200}ms`,
            filter: s <= stars ? 'drop-shadow(0 0 8px rgba(250,204,21,0.8))' : 'grayscale(1)',
          }}
        >
          ⭐
        </span>
      ))}
    </div>
  )
}
