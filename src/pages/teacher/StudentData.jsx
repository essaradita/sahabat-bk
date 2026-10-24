import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/api'
import { Search, Filter, User, TrendingUp, Award, Loader2, Users, ClipboardCheck, Plus, Calendar } from 'lucide-react'

const levelColors = ['bg-slate-200', 'bg-blue-200', 'bg-blue-400', 'bg-purple-400', 'bg-amber-400']

// Component: Game Data Table
function GameDataTable({ students }) {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
        <User size={48} className="text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-700 mb-1">Belum Ada Siswa</h3>
        <p className="text-slate-500 text-sm">
          Siswa akan muncul di sini setelah mereka mendaftar
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="hidden sm:grid grid-cols-5 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wide">
        <span>Nama Siswa</span>
        <span className="text-center">Kelas</span>
        <span className="text-center">Level</span>
        <span className="text-center">Misi Selesai</span>
        <span className="text-center">Terakhir Aktif</span>
      </div>

      {students.map((student) => (
        <div
          key={student.id}
          className="flex flex-col sm:grid sm:grid-cols-5 items-start sm:items-center px-4 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
        >
          {/* Name */}
          <div className="flex items-center gap-3 w-full sm:w-auto mb-2 sm:mb-0">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm shrink-0">
              {student.name[0]}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">{student.name}</p>
              <p className="text-slate-400 text-xs">@{student.username}</p>
            </div>
          </div>

          {/* Class */}
          <div className="sm:text-center">
            <span className="badge bg-slate-100 text-slate-600 text-xs">{student.kelas}</span>
          </div>

          {/* Level */}
          <div className="sm:text-center">
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-black shadow ${levelColors[student.level] || 'bg-blue-400'}`}>
              {student.level}
            </span>
          </div>

          {/* Missions */}
          <div className="sm:text-center">
            <span className="badge bg-emerald-50 text-emerald-700 text-xs">
              {student.missionsCompleted || 0} misi
            </span>
          </div>

          {/* Last active */}
          <div className="sm:text-center">
            <span className="text-xs text-slate-500">
              {student.lastActive 
                ? new Date(student.lastActive).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                : '-'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Component: Attendance Table
function AttendanceTable({ students, markAttendance }) {
  const today = new Date().toISOString().split('T')[0]

  const getTodayAttendance = (student) => {
    const todayRecord = student.attendance?.find(a => a.date === today)
    return todayRecord?.status || null
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
        <ClipboardCheck size={48} className="text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-700 mb-1">Belum Ada Data Siswa</h3>
        <p className="text-slate-500 text-sm mb-4">
          Tambahkan siswa untuk mulai mengisi absensi
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="hidden sm:grid grid-cols-4 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wide">
        <span>Nama Siswa</span>
        <span className="text-center">Kelas</span>
        <span className="text-center">Status Hari Ini</span>
        <span className="text-center">Aksi</span>
      </div>

      {students.map((student) => {
        const status = getTodayAttendance(student)
        return (
          <div
            key={student.id}
            className="flex flex-col sm:grid sm:grid-cols-4 items-start sm:items-center px-4 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
          >
            {/* Name */}
            <div className="flex items-center gap-3 w-full sm:w-auto mb-2 sm:mb-0">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-sm shrink-0">
                {student.name[0]}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{student.name}</p>
              </div>
            </div>

            {/* Class */}
            <div className="sm:text-center mb-2 sm:mb-0">
              <span className="badge bg-slate-100 text-slate-600 text-xs">{student.kelas}</span>
            </div>

            {/* Status Today */}
            <div className="sm:text-center mb-2 sm:mb-0">
              {status === 'hadir' && (
                <span className="badge bg-emerald-100 text-emerald-700 text-xs">✓ Hadir</span>
              )}
              {status === 'sakit' && (
                <span className="badge bg-amber-100 text-amber-700 text-xs">🏥 Sakit</span>
              )}
              {status === 'izin' && (
                <span className="badge bg-blue-100 text-blue-700 text-xs">📝 Izin</span>
              )}
              {status === 'alpha' && (
                <span className="badge bg-red-100 text-red-700 text-xs">✗ Alpha</span>
              )}
              {!status && (
                <span className="text-slate-400 text-xs">Belum diabsen</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="sm:text-center flex gap-1 justify-center w-full sm:w-auto">
              <button
                onClick={() => markAttendance(student.id, 'hadir')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  status === 'hadir' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
                title="Hadir"
              >
                Hadir
              </button>
              <button
                onClick={() => markAttendance(student.id, 'sakit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  status === 'sakit' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
                title="Sakit"
              >
                Sakit
              </button>
              <button
                onClick={() => markAttendance(student.id, 'izin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  status === 'izin' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
                title="Izin"
              >
                Izin
              </button>
              <button
                onClick={() => markAttendance(student.id, 'alpha')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  status === 'alpha' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
                title="Alpha"
              >
                Alpha
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function StudentData() {
  const [activeTab, setActiveTab] = useState('game') // 'game' or 'attendance'
  const [students, setStudents] = useState([])
  const [attendanceStudents, setAttendanceStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('semua')
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', kelas: '' })

  // Fetch students dari API (untuk game data)
  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true)
        console.log('🔍 Fetching students...')
        const data = await apiClient.getStudents()
        console.log('✅ Students data:', data)
        setStudents(data)
      } catch (err) {
        console.error('❌ Failed to fetch students:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  // Load attendance students from API
  useEffect(() => {
    async function fetchAttendanceStudents() {
      if (activeTab === 'attendance') {
        try {
          const data = await apiClient.getAttendanceStudents()
          setAttendanceStudents(data || [])
        } catch (err) {
          console.error('Failed to fetch attendance students:', err)
          setAttendanceStudents([])
        }
      }
    }
    fetchAttendanceStudents()
  }, [activeTab])

  // Add new student for attendance
  const handleAddStudent = async () => {
    if (!newStudent.name.trim() || !newStudent.kelas.trim()) {
      alert('Nama dan kelas wajib diisi!')
      return
    }

    try {
      const result = await apiClient.addAttendanceStudent({
        name: newStudent.name.trim(),
        kelas: newStudent.kelas.trim()
      })

      setAttendanceStudents([result.student, ...attendanceStudents])
      setNewStudent({ name: '', kelas: '' })
      setShowAddStudent(false)
      alert('Siswa berhasil ditambahkan!')
    } catch (err) {
      console.error('Add student error:', err)
      alert('Gagal menambah siswa: ' + err.message)
    }
  }

  // Mark attendance
  const markAttendance = async (studentId, status) => {
    const today = new Date().toISOString().split('T')[0]
    
    try {
      await apiClient.markAttendance(studentId, today, status)
      
      // Update local state
      const updated = attendanceStudents.map(s => {
        if (s.id === studentId) {
          const existing = s.attendance?.find(a => a.date === today)
          let newAttendance
          
          if (existing) {
            newAttendance = s.attendance.map(a =>
              a.date === today ? { date: today, status } : a
            )
          } else {
            newAttendance = [...(s.attendance || []), { date: today, status }]
          }
          
          return { ...s, attendance: newAttendance }
        }
        return s
      })
      
      setAttendanceStudents(updated)
    } catch (err) {
      console.error('Mark attendance error:', err)
      alert('Gagal menyimpan absensi: ' + err.message)
    }
  }

  const filtered = (activeTab === 'game' ? students : attendanceStudents).filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.username?.toLowerCase().includes(search.toLowerCase())
    const matchClass = filterClass === 'semua' || s.kelas === filterClass
    return matchSearch && matchClass
  })

  const classes = ['semua', ...new Set((activeTab === 'game' ? students : attendanceStudents).map(s => s.kelas).filter(Boolean))]

  if (loading && activeTab === 'game') {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500">Memuat data siswa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800">Data Siswa</h1>
        <p className="text-slate-500 text-sm">
          {activeTab === 'game' 
            ? `${students.length} siswa terdaftar di game` 
            : `${attendanceStudents.length} siswa untuk absensi`}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('game')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'game'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users size={18} />
          Data Akun Game
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'game' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {students.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'attendance'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ClipboardCheck size={18} />
          Data Absensi
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'attendance' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {attendanceStudents.length}
          </span>
        </button>
      </div>

      {/* Search & filter */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari siswa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {classes.map(c => (
            <button
              key={c}
              onClick={() => setFilterClass(c)}
              className={`px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                filterClass === c ? 'bg-blue-600 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c === 'semua' ? 'Semua' : c}
            </button>
          ))}
        </div>
        {activeTab === 'attendance' && (
          <button
            onClick={() => setShowAddStudent(true)}
            className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm whitespace-nowrap"
          >
            <Plus size={16} />
            Tambah Siswa
          </button>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-black text-slate-800 mb-4">Tambah Siswa Baru</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Siswa</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Masukkan nama siswa"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kelas</label>
                <input
                  type="text"
                  value={newStudent.kelas}
                  onChange={e => setNewStudent({ ...newStudent, kelas: e.target.value })}
                  placeholder="Contoh: 7A, 8B"
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddStudent(false)
                  setNewStudent({ name: '', kelas: '' })
                }}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddStudent}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'game' ? (
        <GameDataTable students={filtered} />
      ) : (
        <AttendanceTable students={filtered} markAttendance={markAttendance} />
      )}
    </div>
  )
}
