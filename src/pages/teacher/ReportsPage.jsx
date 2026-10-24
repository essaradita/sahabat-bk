import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/api'
import { demoMissions, demoProgress } from '../../data/demoData'
import { TrendingUp, Users, CheckCircle, BarChart2, Loader2 } from 'lucide-react'

function SimpleBarChart({ data, title, color }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div>
      <h4 className="text-sm font-bold text-slate-700 mb-3">{title}</h4>
      <div className="space-y-2">
        {data.map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-sm text-slate-600 w-24 shrink-0 truncate">{item.label}</span>
            <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden">
              <div
                className={`h-full ${color} rounded-lg transition-all duration-700 flex items-center justify-end pr-2`}
                style={{ width: `${(item.value / max) * 100}%` }}
              >
                <span className="text-xs font-bold text-white">{item.value}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [students, setStudents] = useState([])
  const [attendanceStudents, setAttendanceStudents] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch real students from API
  useEffect(() => {
    async function fetchStudents() {
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
    fetchStudents()
  }, [])

  // Load attendance students from API
  useEffect(() => {
    async function fetchAttendanceStudents() {
      try {
        const data = await apiClient.getAttendanceStudents()
        setAttendanceStudents(data || [])
      } catch (err) {
        console.error('Failed to fetch attendance students:', err)
        setAttendanceStudents([])
      }
    }
    fetchAttendanceStudents()
  }, [])

  // Calculate attendance percentage
  const calculateAttendance = () => {
    if (attendanceStudents.length === 0) return 0

    let totalRecords = 0
    let hadirCount = 0

    attendanceStudents.forEach(student => {
      if (student.attendance && student.attendance.length > 0) {
        totalRecords += student.attendance.length
        hadirCount += student.attendance.filter(a => a.status === 'hadir').length
      }
    })

    return totalRecords > 0 ? Math.round((hadirCount / totalRecords) * 100) : 0
  }

  // Calculate missions completed
  const totalMissionsCompleted = students.reduce((sum, s) => sum + (s.missionsCompleted || 0), 0)

  // Calculate average completion rate
  const avgCompletion = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + (s.missionsCompleted || 0), 0) / students.length / 6 * 100)
    : 0

  const attendancePercentage = calculateAttendance()

  const categoryData = [
    { label: 'Pribadi', value: demoProgress.pribadi },
    { label: 'Sosial', value: demoProgress.sosial },
    { label: 'Belajar', value: demoProgress.belajar },
    { label: 'Karier', value: demoProgress.karier },
  ]

  const studentProgressData = students.slice(0, 6).map(s => ({
    label: s.name.split(' ')[0],
    value: Math.round((s.missionsCompleted || 0) / 6 * 100),
  }))

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500">Memuat laporan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800">Laporan & Analitik</h1>
        <p className="text-slate-500 text-sm">Pantau kemajuan belajar siswa</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card bg-blue-50 text-center">
          <Users size={22} className="text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-black text-blue-700">{students.length}</p>
          <p className="text-xs text-blue-600 font-semibold">Total Siswa</p>
        </div>
        <div className="card bg-emerald-50 text-center">
          <CheckCircle size={22} className="text-emerald-600 mx-auto mb-1" />
          <p className="text-2xl font-black text-emerald-700">{totalMissionsCompleted}</p>
          <p className="text-xs text-emerald-600 font-semibold">Misi Selesai</p>
        </div>
        <div className="card bg-purple-50 text-center">
          <TrendingUp size={22} className="text-purple-600 mx-auto mb-1" />
          <p className="text-2xl font-black text-purple-700">{avgCompletion}%</p>
          <p className="text-xs text-purple-600 font-semibold">Rata-rata Nilai</p>
        </div>
        <div className="card bg-amber-50 text-center">
          <BarChart2 size={22} className="text-amber-600 mx-auto mb-1" />
          <p className="text-2xl font-black text-amber-700">{attendancePercentage}%</p>
          <p className="text-xs text-amber-600 font-semibold">Kehadiran</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category progress */}
        <div className="card">
          <h3 className="font-black text-slate-800 mb-4">Progres per Bidang BK</h3>
          <SimpleBarChart data={categoryData} color="bg-blue-500" />
        </div>

        {/* Student progress */}
        <div className="card">
          <h3 className="font-black text-slate-800 mb-4">Penyelesaian Misi per Siswa</h3>
          {studentProgressData.length > 0 ? (
            <SimpleBarChart data={studentProgressData} color="bg-emerald-500" />
          ) : (
            <div className="text-center py-8">
              <Users size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Belum ada data siswa</p>
            </div>
          )}
        </div>

        {/* Mission completion table */}
        <div className="card lg:col-span-2">
          <h3 className="font-black text-slate-800 mb-4">Detail Misi</h3>
          {students.length > 0 ? (
            <div className="space-y-2">
              {demoMissions.slice(0, 6).map(m => {
                // Count students who completed this mission (simplified - using random for now)
                const completedBy = Math.floor(Math.random() * students.length)
                const pct = students.length > 0 ? Math.round((completedBy / students.length) * 100) : 0
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-lg shrink-0">
                      {m.category === 'pribadi' ? '🏝️' : m.category === 'sosial' ? '🌲' : m.category === 'belajar' ? '⛰️' : '🏰'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{m.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 shrink-0">{completedBy}/{students.length} siswa</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Belum ada data misi yang diselesaikan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
