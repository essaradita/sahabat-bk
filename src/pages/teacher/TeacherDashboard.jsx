import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { apiClient } from '../../lib/api'
import { demoMissions } from '../../data/demoData'
import { Users, GraduationCap, ClipboardList, BookOpen, ChevronRight, TrendingUp, Activity, CheckCircle, FileText, UsersRound, Play, Loader2 } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className={`rounded-2xl p-4 ${color} flex items-center gap-3`}>
      <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center shrink-0">
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-white/80 text-xs font-semibold">{label}</p>
        <p className="text-white font-black text-2xl leading-tight">{value}</p>
        {sub && <p className="text-white/70 text-xs">{sub}</p>}
      </div>
    </div>
  )
}

function RecentActivityItem({ student, action, time }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 shrink-0">
        {student[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{student}</p>
        <p className="text-xs text-slate-500">{action}</p>
      </div>
      <span className="text-xs text-slate-400 shrink-0">{time}</span>
    </div>
  )
}

function ActiveMissionCard({ mission }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg shrink-0">
        {mission.id === 'mission-1' ? '🏝️' : mission.id === 'mission-2' ? '🌲' : '⛰️'}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-800 truncate">{mission.title}</h4>
        <p className="text-xs text-slate-500">
          <span className="text-amber-600">+{mission.xpReward} XP</span> • {mission.estimatedMinutes} menit
        </p>
      </div>
      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
        mission.status === 'available' || mission.status === 'active' 
          ? 'bg-emerald-100 text-emerald-700' 
          : 'bg-slate-100 text-slate-600'
      }`}>
        {mission.status === 'available' || mission.status === 'active' ? 'Aktif' : 'Draft'}
      </span>
    </div>
  )
}

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await apiClient.getStudents()
        setStudents(data || [])
      } catch (err) {
        console.error('Failed to fetch students:', err)
        setStudents([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const teacher = profile || { name: 'Guru BK' }
  const activeMissions = demoMissions.filter(m => m.status !== 'locked').slice(0, 3)
  const totalStudents = students.length
  const totalClasses = students.length > 0 ? [...new Set(students.map(s => s.kelas).filter(Boolean))].length : 0
  const avgCompletion = students.length > 0 
    ? Math.round(students.reduce((sum, s) => sum + (s.missionsCompleted || 0), 0) / students.length / 6 * 100)
    : 0

  const recentActivity = students.length > 0
    ? students
        .filter(s => s.lastActive)
        .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
        .slice(0, 4)
        .map(s => ({
          student: s.name,
          action: s.missionsCompleted > 0 ? `Menyelesaikan ${s.missionsCompleted} misi` : 'Baru bergabung',
          time: new Date(s.lastActive).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        }))
    : []

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-5 mb-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="relative">
          <p className="text-blue-200 text-sm">Selamat datang kembali,</p>
          <h1 className="text-2xl font-black">{teacher.name || 'Guru BK'}</h1>
          <p className="text-blue-200 text-sm mt-1">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} label="Total Siswa" value={totalStudents} color="bg-blue-500" sub="aktif" />
        <StatCard icon={GraduationCap} label="Kelas Aktif" value={totalClasses} color="bg-emerald-500" />
        <StatCard icon={CheckCircle} label="Misi Aktif" value={activeMissions.length} color="bg-purple-500" />
        <StatCard icon={TrendingUp} label="Penyelesaian" value={`${avgCompletion}%`} color="bg-amber-500" sub="rata-rata" />
      </div>

      {/* Quick Action Menu - Bank Soal & Preview Game */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {/* Bank Soal Individu */}
        <button
          onClick={() => navigate('/teacher/question-bank')}
          className="bg-white rounded-2xl p-4 border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all text-left group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <FileText size={22} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-slate-800 text-sm">Bank Soal Individu</h3>
              <p className="text-xs text-slate-500">6 Misi tersedia</p>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <p className="text-xs text-slate-600">Kelola soal untuk mode individu (6 misi petualangan)</p>
        </button>

        {/* Bank Soal Kelompok */}
        <button
          onClick={() => navigate('/teacher/case-studies')}
          className="bg-white rounded-2xl p-4 border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all text-left group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <UsersRound size={22} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-slate-800 text-sm">Bank Soal Kelompok</h3>
              <p className="text-xs text-slate-500">3 Studi kasus</p>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <p className="text-xs text-slate-600">Kelola studi kasus untuk mode kelompok (4 misi + challenge)</p>
        </button>

        {/* Preview Game */}
        <button
          onClick={() => navigate('/teacher/preview-game')}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 border-2 border-emerald-400 hover:shadow-lg transition-all text-left group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Play size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-white text-sm">Preview Game</h3>
              <p className="text-xs text-emerald-100">Lihat tampilan siswa</p>
            </div>
            <ChevronRight size={18} className="text-white/60 group-hover:text-white transition-colors" />
          </div>
          <p className="text-xs text-white/90">Coba game seperti yang dilihat siswa</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Attendance summary - Hapus dulu karena belum ada data */}
        {/* <AttendanceSummary /> */}

        {/* Active missions */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <BookOpen size={16} className="text-purple-600" />
              Misi Terbaru
            </h3>
            <button
              onClick={() => navigate('/teacher/question-bank')}
              className="text-blue-600 text-xs font-bold flex items-center gap-1"
            >
              Lihat Semua <ChevronRight size={12} />
            </button>
          </div>
          {activeMissions.map(m => <ActiveMissionCard key={m.id} mission={m} />)}
        </div>
      </div>

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Activity size={16} className="text-blue-600" />
              Aktivitas Terbaru
            </h3>
          </div>
          {recentActivity.map((a, i) => (
            <RecentActivityItem key={i} {...a} />
          ))}
        </div>
      )}
    </div>
  )
}
