import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ChevronRight } from 'lucide-react'

// Import gambar lokal
import bgSmp from '../../gambar/beground 1.png'
import anakSmp from '../../gambar/anaksmp7.png'

export default function LandingPage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'teacher') navigate('/teacher/dashboard', { replace: true })
      else if (profile.role === 'student') navigate('/student/dashboard', { replace: true })
    }
  }, [user, profile, navigate])

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">

      {/* ── Background foto SMP penuh ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${bgSmp})` }}
      />

      {/* Overlay biru langit tipis biar warna lebih hidup */}
      <div className="absolute inset-0 bg-sky-400/20" />

      {/* ── LAYOUT MOBILE: card di tengah vertikal ── */}
      {/* ── LAYOUT LAPTOP: card di tengah horizontal ── */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 py-8">

        {/* Card utama — frosted glass */}
        <div
          className="
            relative w-full max-w-sm
            md:max-w-md
            bg-white/80 backdrop-blur-md
            rounded-3xl shadow-2xl
            px-6 pt-4 pb-8
            border border-white/60
            flex flex-col items-center
          "
          style={{ boxShadow: '0 8px 40px rgba(0,80,180,0.18), 0 2px 12px rgba(0,0,0,0.10)' }}
        >

          {/* ── Karakter siswa (muncul dari atas card) ── */}
          <div className="w-56 h-44 md:w-64 md:h-52 -mt-2 mb-1 flex items-end justify-center drop-shadow-2xl">
            <img
              src={anakSmp}
              alt="Karakter siswa SMP"
              className="w-full h-full object-contain object-bottom"
              draggable={false}
            />
          </div>

          {/* ── Logo Sahabat BK ── */}
          <div className="flex items-center gap-2 mb-1">
            {/* Ikon dua orang */}
            <svg viewBox="0 0 48 32" width="44" height="30" className="shrink-0">
              {/* Orang kiri - biru */}
              <circle cx="15" cy="11" r="8" fill="#1D4ED8"/>
              <ellipse cx="15" cy="27" rx="10" ry="7" fill="#1D4ED8"/>
              {/* Orang kanan - kuning */}
              <circle cx="33" cy="11" r="8" fill="#F59E0B"/>
              <ellipse cx="33" cy="27" rx="10" ry="7" fill="#F59E0B"/>
            </svg>
            <div className="leading-none">
              <span className="text-3xl md:text-4xl font-black text-blue-800 tracking-tight">Sahabat </span>
              <span className="text-3xl md:text-4xl font-black text-yellow-500 tracking-tight">BK</span>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-slate-500 text-sm font-semibold mb-5 text-center tracking-wide">
            Belajar &nbsp;•&nbsp; Bertumbuh &nbsp;•&nbsp; Jadi Versi Terbaik
          </p>

          {/* ── Divider Pilih Jenis Akun ── */}
          <div className="flex items-center gap-3 w-full mb-4">
            <div className="flex-1 h-px bg-blue-200" />
            <span className="text-slate-700 font-black text-base whitespace-nowrap">Pilih Jenis Akun</span>
            <div className="flex-1 h-px bg-blue-200" />
          </div>

          {/* ── Tombol Guru BK ── */}
          <button
            onClick={() => navigate('/login/teacher')}
            className="
              w-full mb-3 flex items-center gap-3
              bg-blue-600 hover:bg-blue-700 active:bg-blue-800
              text-white rounded-2xl px-4 py-3.5
              shadow-lg hover:shadow-xl
              transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
              group
            "
          >
            {/* Ikon guru */}
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" width="28" height="28" fill="white">
                <circle cx="18" cy="10" r="7"/>
                <path d="M4 30 Q4 22 18 22 Q32 22 32 30"/>
                <rect x="14" y="18" width="8" height="3" rx="1.5"/>
                <rect x="10" y="20" width="16" height="2" rx="1"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <div className="font-black text-base leading-tight">Guru BK</div>
              <div className="text-blue-200 text-xs font-medium mt-0.5">Kelola kelas, soal, dan laporan</div>
            </div>
            <ChevronRight size={20} className="text-white/70 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          {/* ── Tombol Siswa ── */}
          <button
            onClick={() => navigate('/login/student')}
            className="
              w-full flex items-center gap-3
              bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700
              text-white rounded-2xl px-4 py-3.5
              shadow-lg hover:shadow-xl
              transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
              group
            "
          >
            {/* Ikon siswa */}
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" width="28" height="28" fill="white">
                <circle cx="18" cy="10" r="7"/>
                <path d="M4 30 Q4 22 18 22 Q32 22 32 30"/>
                <rect x="13" y="20" width="10" height="7" rx="2"/>
                <rect x="11" y="22" width="14" height="2" rx="1"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <div className="font-black text-base leading-tight">Siswa</div>
              <div className="text-emerald-100 text-xs font-medium mt-0.5">Mulai petualanganmu di dunia BK</div>
            </div>
            <ChevronRight size={20} className="text-white/70 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          {/* Footer card */}
          <div className="mt-5 text-center">
            <p className="text-slate-400 text-xs font-medium">
              Sahabat BK &nbsp;·&nbsp; Platform Pembelajaran BK untuk SMP
            </p>
            <p className="text-slate-500 text-xs font-medium mt-2 flex items-center justify-center gap-1.5">
              <span className="text-slate-300">Dikembangkan oleh</span>
              <span className="text-slate-400">Kartika Wulandari, S.Sos.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Dekorasi daun pojok kiri atas — opsional nuansa alam */}
      <div className="absolute top-0 left-0 w-40 h-40 pointer-events-none opacity-70"
        style={{ background: 'radial-gradient(circle at 0% 0%, rgba(34,197,94,0.3) 0%, transparent 70%)' }}
      />
      <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none opacity-70"
        style={{ background: 'radial-gradient(circle at 100% 0%, rgba(34,197,94,0.25) 0%, transparent 70%)' }}
      />
    </div>
  )
}
