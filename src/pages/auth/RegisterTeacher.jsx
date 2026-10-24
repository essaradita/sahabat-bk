import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Eye, EyeOff, Mail, Lock, User, Building2, Loader2, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react'
import bgSmp from '../../gambar/beground 1.png'
import anakSmp from '../../gambar/anaksmp7.png'

export default function RegisterTeacher() {
  const navigate = useNavigate()
  const { registerTeacher } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', school: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function validate() {
    if (!form.name.trim() || form.name.trim().length < 3) return 'Nama minimal 3 karakter.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Format email tidak valid.'
    if (!form.school.trim()) return 'Nama sekolah wajib diisi.'
    if (form.password.length < 8) return 'Password minimal 8 karakter.'
    if (form.password !== form.confirmPassword) return 'Konfirmasi password tidak cocok.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const err = validate()
    if (err) return setError(err)
    setLoading(true)
    const { error: regError } = await registerTeacher({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      school: form.school.trim(),
    })
    setLoading(false)
    if (regError) {
      const msg = regError.message || ''
      setError(msg.includes('already') ? 'Email sudah terdaftar. Silakan login.' : msg || 'Pendaftaran gagal.')
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/teacher/dashboard', { replace: true }), 1500)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${bgSmp})` }} />
        <div className="absolute inset-0 bg-sky-400/15" />
        <div className="relative z-10 text-center animate-fade-in bg-white/85 backdrop-blur-md rounded-3xl p-10 mx-4 shadow-2xl border border-white/60">
          <CheckCircle size={52} className="text-emerald-500 mx-auto mb-3" />
          <h2 className="text-xl font-black text-slate-800">Akun Berhasil Dibuat! 🎉</h2>
          <p className="text-slate-500 text-sm mt-1">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">

      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${bgSmp})` }} />
      <div className="absolute inset-0 bg-sky-400/15" />

      {/* Tombol Kembali */}
      <button onClick={() => navigate('/login/teacher')}
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

          <h1 className="text-base font-black text-slate-800 mt-0.5">Daftar Guru BK 👩‍🏫</h1>
          <p className="text-slate-400 text-xs mb-3">Buat akun untuk mengelola kelas BK</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-2.5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-start gap-2">
                <AlertCircle size={13} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Nama */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nama Lengkap</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Contoh: Rina Sari, S.Pd"
                  value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setError('') }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none bg-white text-slate-800 placeholder-slate-400 text-sm transition-colors" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" placeholder="guru@sekolah.sch.id"
                  value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setError('') }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none bg-white text-slate-800 placeholder-slate-400 text-sm transition-colors" />
              </div>
            </div>

            {/* Sekolah */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nama Sekolah</label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="SMP Negeri 1 ..."
                  value={form.school} onChange={e => { setForm(p => ({ ...p, school: e.target.value })); setError('') }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none bg-white text-slate-800 placeholder-slate-400 text-sm transition-colors" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} placeholder="Minimal 8 karakter"
                  value={form.password} onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError('') }}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none bg-white text-slate-800 placeholder-slate-400 text-sm transition-colors" />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Konfirmasi Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showConfirm ? 'text' : 'password'} placeholder="Ulangi password"
                  value={form.confirmPassword} onChange={e => { setForm(p => ({ ...p, confirmPassword: e.target.value })); setError('') }}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none bg-white text-slate-800 placeholder-slate-400 text-sm transition-colors" />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {form.confirmPassword && (
                <p className={`text-xs mt-1 font-semibold ${form.password === form.confirmPassword ? 'text-emerald-600' : 'text-red-500'}`}>
                  {form.password === form.confirmPassword ? '✅ Password cocok' : '❌ Tidak cocok'}
                </p>
              )}
            </div>

            {/* Tombol */}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:-translate-y-0.5 text-sm mt-1">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Mendaftar...</> : 'Buat Akun Guru BK →'}
            </button>
          </form>

          <p className="text-slate-400 text-xs mt-3">
            Sudah punya akun?{' '}
            <Link to="/login/teacher" className="font-black text-blue-600 hover:text-blue-700">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
