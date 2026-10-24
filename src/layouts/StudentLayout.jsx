import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, Map, BookOpen, User, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/student/dashboard', icon: Home, label: 'Beranda' },
  { to: '/student/map', icon: Map, label: 'Peta Misi' },
  { to: '/student/journal', icon: BookOpen, label: 'Jurnal' },
  { to: '/student/profile', icon: User, label: 'Profil' },
]

export default function StudentLayout() {
  const { isDemoMode, profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Check if teacher is in preview mode
  const isTeacherPreview = profile?.role === 'teacher' && location.pathname.startsWith('/student')

  function exitPreview() {
    // Clear preview mode from sessionStorage
    sessionStorage.removeItem('teacher_preview_mode')
    // Navigate back to teacher dashboard
    navigate('/teacher/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {isDemoMode && null}

      {/* Preview Mode Banner untuk Guru */}
      {isTeacherPreview && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between gap-3 sticky top-0 z-50 shadow-lg">
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-lg lg:text-2xl">👁️</span>
            <div>
              <p className="text-xs lg:text-base font-black">Mode Preview</p>
              <p className="text-[10px] lg:text-sm text-amber-100">Anda melihat sebagai siswa</p>
            </div>
          </div>
          <button
            onClick={exitPreview}
            className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all text-xs lg:text-sm font-bold"
          >
            <X size={14} className="lg:w-5 lg:h-5" />
            <span>Keluar</span>
          </button>
        </div>
      )}

      <main className="flex-1 page-with-bottom-nav">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-bottom z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg lg:max-w-4xl mx-auto flex">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 lg:py-3 px-1 gap-0.5 lg:gap-1 transition-colors duration-200 ${
                  isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 lg:p-2 rounded-xl transition-colors ${isActive ? 'bg-blue-100' : ''}`}>
                    <Icon size={20} className="lg:w-7 lg:h-7" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] lg:text-xs font-bold">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
