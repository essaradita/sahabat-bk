import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Eye, EyeOff, User, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import bgSmp from '../../gambar/beground 1.png'
import anakSmp from '../../gambar/anaksmp7.png'

export default function LoginStudent() {
  const navigate = useNavigate()
  const { loginStudent } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.username.trim()) return setError('Username tidak boleh kosong.')
    if (!form.password) return setError('Password tidak boleh kosong.')
    setLoading(true)
    const { error: authError } = await loginStudent(form.username.trim(), form.password)
    setLoading(false)
    if (authError) {
      setError(authError.message || 'Login gagal. Periksa username dan password.')
    } else {
      navigate('/student/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">

      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${bgSmp})` }} />
      <div className="absolute inset-0 bg-sky-400/15" />

      {/* Tombol Kembali */}
      <button onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-30 flex items-center gap-1.5 text-white text-sm font-semibold bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-black/35 transition-all">
        <ArrowLeft size={14} /> Kembali
      </button>

      {/* Card */}
      <div className="relative z-10 w-full flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-xs bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl px-5 pt-3 pb-6 border border-white/60 flex flex-col items-center"
          style={{ boxShadow: '0 8px 40px rgba(0,80,180,0.18)' }}>

          {/* Gambar karakter */}
          <div className="w-36 h-28 -mt-1 mb-1 drop-shadow-xl">
            <img src={anakSmp} alt="Karakter" className="w-full h-full object-contain object-bottom" draggable={false} />
          </div>

          {/* Logo */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <svg viewBox="0 0 48 32" width="34" height="22">
              <circle cx="15" cy="11" r="8" fill="#1D4ED8"/>
              <ellipse cx="15" cy="27" rx="10" ry="7" fill="#1D4ED8"/>
              <circle cx="33" cy="11" r="8" fill="#F59E0B"/>
              <ellipse cx="33" cy="27" rx="10" ry="7" fill="#F59E0B"/>
            </svg>
            <span className="text-xl font-black text-blue-800">Sahabat </span>
            <span className="text-xl font-black text-yellow-500">BK</span>
          </div>

          <h1 className="text-base font-black text-slate-800 mt-0.5">Masuk Siswa 🎒</h1>
          <p className="text-slate-400 text-xs mb-3">Masukkan username dan password-mu</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-2.5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-start gap-2">
                <AlertCircle size={13} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Username</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="contoh: andi.pratama"
                  value={form.username}
                  onChange={e => { setForm(p => ({ ...p, username: e.target.value })); setError('') }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none bg-white text-slate-800 placeholder-slate-400 text-sm transition-colors"
                  autoComplete="username" autoCapitalize="none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} placeholder="Masukkan password"
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError('') }}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none bg-white text-slate-800 placeholder-slate-400 text-sm transition-colors"
                  autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Tombol */}
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:-translate-y-0.5 text-sm mt-1">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Masuk...</> : 'Masuk ke Game 🎮'}
            </button>
          </form>

          <p className="text-slate-400 text-xs mt-3">
            Belum punya akun?{' '}
            <Link to="/register/student" className="font-black text-emerald-600 hover:text-emerald-700">Daftar</Link>
          </p>

          {/* Creator Credit */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <p className="text-slate-400 text-[10px] text-center">
              Dikembangkan oleh
            </p>
            <p className="text-emerald-700 text-xs font-bold text-center">
              Kartika Wulandari, S.Sos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
