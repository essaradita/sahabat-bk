import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/ui/Toast'
import { User, Lock, Bell, LogOut, Save, Eye, EyeOff } from 'lucide-react'
import { demoTeacher } from '../../data/demoData'

export default function TeacherSettings() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const teacher = profile?.role === 'teacher' ? profile : demoTeacher

  const [profileForm, setProfileForm] = useState({ name: teacher.name || '', email: teacher.email || '', school: teacher.school || '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false })

  function handleSaveProfile() {
    if (!profileForm.name.trim()) { toast('Nama tidak boleh kosong', 'error'); return }
    toast('Profil berhasil diperbarui!', 'success')
  }

  function handleChangePassword() {
    if (!passwordForm.current) { toast('Masukkan password saat ini', 'error'); return }
    if (passwordForm.newPass.length < 6) { toast('Password baru minimal 6 karakter', 'error'); return }
    if (passwordForm.newPass !== passwordForm.confirm) { toast('Konfirmasi password tidak cocok', 'error'); return }
    toast('Password berhasil diubah!', 'success')
    setPasswordForm({ current: '', newPass: '', confirm: '' })
  }

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="mb-2">
        <h1 className="text-2xl font-black text-slate-800">Pengaturan</h1>
        <p className="text-slate-500 text-sm">Kelola akun dan preferensi</p>
      </div>

      {/* Profile */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <h3 className="font-black text-slate-800">Profil Akun</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Sekolah</label>
            <input
              type="text"
              value={profileForm.school}
              onChange={e => setProfileForm(p => ({ ...p, school: e.target.value }))}
              className="input-field"
            />
          </div>
          <button onClick={handleSaveProfile} className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm">
            <Save size={15} />
            Simpan Profil
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Lock size={20} className="text-purple-600" />
          </div>
          <h3 className="font-black text-slate-800">Ubah Password</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: 'current', label: 'Password Saat Ini', field: 'current' },
            { key: 'new', label: 'Password Baru', field: 'newPass' },
            { key: 'confirm', label: 'Konfirmasi Password Baru', field: 'confirm' },
          ].map(({ key, label, field }) => (
            <div key={key}>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>
              <div className="relative">
                <input
                  type={showPass[key] ? 'text' : 'password'}
                  value={passwordForm[field]}
                  onChange={e => setPasswordForm(p => ({ ...p, [field]: e.target.value }))}
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => ({ ...p, [key]: !p[key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}
          <button onClick={handleChangePassword} className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm">
            <Lock size={15} />
            Ubah Password
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all"
      >
        <LogOut size={18} />
        Keluar dari Akun
      </button>
    </div>
  )
}
