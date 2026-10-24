import { AlertCircle, X } from 'lucide-react'
import { useState } from 'react'

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="bg-amber-500 text-white px-4 py-2 flex items-center gap-2 text-sm font-semibold">
      <AlertCircle size={16} className="shrink-0" />
      <span className="flex-1">
        🎮 Mode Demo — Data tersimpan sementara. Hubungkan Supabase untuk fitur lengkap.
      </span>
      <button onClick={() => setDismissed(true)} className="shrink-0 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  )
}
