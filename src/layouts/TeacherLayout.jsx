import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  BarChart2, MessageSquare, Settings, LogOut, Menu, X, GraduationCap
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

const navItems = [
  { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/teacher/classes', icon: GraduationCap, label: 'Kelola Kelas' },
  { to: '/teacher/students', icon: Users, label: 'Data Siswa' },
  { to: '/teacher/question-bank', icon: BookOpen, label: 'Bank Soal' },
  { to: '/teacher/attendance', icon: ClipboardList, label: 'Absensi Digital' },
  { to: '/teacher/reports', icon: BarChart2, label: 'Laporan & Analitik' },
  { to: '/teacher/counseling', icon: MessageSquare, label: 'Layanan BK' },
  { to: '/teacher/settings', icon: Settings, label: 'Pengaturan' },
]

export default function TeacherLayout() {
  const { profile, logout, isDemoMode } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Fixed on all screen sizes */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-900 to-blue-800 
        flex flex-col transition-transform duration-300 shadow-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-5 border-b border-blue-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-blue-800 font-black text-sm">BK</span>
            </div>
            <div>
              <h1 className="text-white font-black text-lg leading-tight">Sahabat BK</h1>
              <p className="text-blue-300 text-xs">Guru BK</p>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 border-b border-blue-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow">
              {profile?.name?.[0] || 'G'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{profile?.name || 'Guru BK'}</p>
              <p className="text-blue-300 text-xs truncate">{profile?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Nav - Scrollable */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-blue-800 font-bold shadow-md'
                    : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-blue-700 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-200 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold">Keluar</span>
          </button>
          
          {/* Creator credit */}
          <div className="mt-3 pt-3 border-t border-blue-700/50">
            <p className="text-blue-300 text-[10px] text-center leading-relaxed">
              Dikembangkan oleh<br />
              <span className="text-white font-semibold">Kartika Wulandari, S.Sos.</span>
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content - With left margin for sidebar on desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top bar (mobile) */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <Menu size={22} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">BK</span>
            </div>
            <span className="font-black text-blue-800">Sahabat BK</span>
          </div>
        </header>

        {isDemoMode && null}

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
