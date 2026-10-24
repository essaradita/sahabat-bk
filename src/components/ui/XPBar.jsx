export default function XPBar({ xp, xpMax, level, levelName, size = 'md' }) {
  const percent = Math.min(100, Math.round((xp / xpMax) * 100))

  if (size === 'sm') {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-slate-500">Lv.{level}</span>
          <span className="text-xs text-slate-500">{xp}/{xpMax} XP</span>
        </div>
        <div className="progress-bar h-2">
          <div
            className="progress-fill bg-gradient-to-r from-yellow-400 to-amber-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 bg-yellow-400 rounded-full text-sm font-black text-yellow-900 shadow">
            {level}
          </span>
          <span className="text-sm font-bold text-slate-700">{levelName}</span>
        </div>
        <span className="text-sm font-bold text-amber-600">{xp} / {xpMax} XP</span>
      </div>
      <div className="progress-bar h-4 bg-slate-200">
        <div
          className="progress-fill bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 relative"
          style={{ width: `${percent}%` }}
        >
          {percent > 15 && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-yellow-900">
              {percent}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
