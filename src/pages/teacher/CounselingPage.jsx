import { useState } from 'react'
import { MessageSquare, Clock, CheckCircle, User, ChevronRight, X } from 'lucide-react'

const demoRequests = [
  { id: 'cr1', student: 'Andi Pratama', kelas: '8A', topic: 'masalah_belajar', message: 'Saya kesulitan fokus belajar, sering teralihkan oleh game. Ingin konsultasi cara mengatasi kecanduan game.', preferred: 'Rabu jam istirahat', status: 'pending', date: '2025-05-12' },
  { id: 'cr2', student: 'Citra Lestari', kelas: '8A', topic: 'masalah_sosial', message: 'Ada masalah dengan teman sekelas, ingin cerita lebih lanjut.', preferred: 'Kamis setelah pelajaran', status: 'scheduled', date: '2025-05-11' },
  { id: 'cr3', student: 'Budi Santoso', kelas: '8A', topic: 'karier', message: 'Bingung dengan cita-cita, ingin berdiskusi tentang pilihan studi lanjut.', preferred: 'Fleksibel', status: 'done', date: '2025-05-10' },
]

const topicLabels = {
  masalah_pribadi: 'Masalah Pribadi',
  masalah_sosial: 'Masalah dengan Teman',
  masalah_belajar: 'Kesulitan Belajar',
  karier: 'Pilihan Masa Depan',
  lainnya: 'Lainnya',
}

const statusConfig = {
  pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700' },
  scheduled: { label: 'Dijadwalkan', color: 'bg-blue-100 text-blue-700' },
  done: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700' },
}

export default function CounselingPage() {
  const [requests, setRequests] = useState(demoRequests)
  const [selected, setSelected] = useState(null)
  const [filterStatus, setFilterStatus] = useState('semua')

  const filtered = requests.filter(r => filterStatus === 'semua' || r.status === filterStatus)

  function updateStatus(id, status) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800">Layanan BK</h1>
        <p className="text-slate-500 text-sm">Kelola permintaan konsultasi siswa</p>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {['semua', 'pending', 'scheduled', 'done'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterStatus === s ? 'bg-blue-600 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            {s === 'semua' ? 'Semua' : statusConfig[s]?.label}
            <span className="ml-1.5 text-xs opacity-70">
              ({s === 'semua' ? requests.length : requests.filter(r => r.status === s).length})
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(req => {
          const cfg = statusConfig[req.status]
          return (
            <div
              key={req.id}
              className="card hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelected(req)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 shrink-0">
                  {req.student[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-black text-slate-800 text-sm">{req.student}</p>
                    <span className="badge bg-slate-100 text-slate-600 text-xs">{req.kelas}</span>
                    <span className={`badge text-xs ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <p className="text-xs font-bold text-blue-600">{topicLabels[req.topic]}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{req.message}</p>
                  <p className="text-xs text-slate-400 mt-1">⏰ {req.preferred}</p>
                </div>
                <ChevronRight size={16} className="text-slate-400 mt-1 shrink-0" />
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl">
            <MessageSquare size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">Tidak ada permintaan konsultasi</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-800">Detail Konsultasi</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                  {selected.student[0]}
                </div>
                <div>
                  <p className="font-black text-slate-800">{selected.student}</p>
                  <p className="text-sm text-slate-500">Kelas {selected.kelas}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Topik</p>
                <p className="font-bold text-blue-800">{topicLabels[selected.topic]}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3">
                <p className="text-xs font-bold text-slate-500 mb-1">Pesan</p>
                <p className="text-sm text-slate-700 leading-relaxed">{selected.message}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock size={14} />
                <span>Waktu pilihan: {selected.preferred}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 flex-wrap">
                {selected.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(selected.id, 'scheduled')}
                    className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl text-sm"
                  >
                    ✅ Jadwalkan
                  </button>
                )}
                {selected.status === 'scheduled' && (
                  <button
                    onClick={() => updateStatus(selected.id, 'done')}
                    className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm"
                  >
                    ✅ Tandai Selesai
                  </button>
                )}
                {selected.status !== 'done' && (
                  <button
                    onClick={() => { updateStatus(selected.id, 'done'); setSelected(null) }}
                    className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl text-sm"
                  >
                    Tutup
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
