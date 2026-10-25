import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/api'
import { Search, User, TrendingUp, Award, Loader2, Plus, Edit2, Trash2, GraduationCap } from 'lucide-react'

const levelColors = ['bg-slate-200', 'bg-blue-200', 'bg-blue-400', 'bg-purple-400', 'bg-amber-400']

export default function StudentData() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([]) // Data kelas dari database
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('semua')
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', kelas: '' })

  // Fetch students dan classes dari API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch students
        const studentsData = await apiClient.getStudents()
        setStudents(studentsData)
        
        // Fetch classes untuk mendapat wali kelas
        const classesData = await apiClient.getClasses()
        setClasses(classesData || [])
        
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Get wali kelas from class data
  const getWaliKelas = (kelasName) => {
    const kelas = classes.find(c => c.name.replace('Kelas ', '') === kelasName)
    return kelas?.teacher_name || '-'
  }

  // Add new student
  const handleAddStudent = async () => {
    if (!newStudent.name.trim() || !newStudent.kelas.trim()) {
      alert('Nama dan kelas wajib diisi!')
      return
    }

    try {
      const result = await apiClient.addStudent({
        name: newStudent.name.trim(),
        kelas: newStudent.kelas.trim()
      })

      if (result.success && result.student) {
        // Refresh student list
        const updatedStudents = await apiClient.getStudents()
        setStudents(updatedStudents || [])
        
        setNewStudent({ name: '', kelas: '' })
        setShowAddStudent(false)
        
        alert(`✅ Siswa berhasil ditambahkan!\n\nUsername: ${result.student.username}\nPassword: ${result.student.password}\n\nBerikan username dan password ini kepada siswa untuk login.`)
      }
    } catch (err) {
      console.error('Add student error:', err)
      alert('Gagal menambah siswa: ' + err.message)
    }
  }

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.username?.toLowerCase().includes(search.toLowerCase())
    const matchClass = filterClass === 'semua' || s.kelas === filterClass
    return matchSearch && matchClass
  })

  const uniqueClasses = ['semua', ...new Set(students.map(s => s.kelas).filter(Boolean))]

  if (loading) {
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
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Data Siswa</h1>
          <p className="text-slate-500 text-sm">{students.length} siswa terdaftar</p>
        </div>
        <button
          onClick={() => setShowAddStudent(true)}
          className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm"
        >
          <Plus size={16} />
          Tambah Siswa
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
          {uniqueClasses.map(c => (
            <button
              key={c}
              onClick={() => setFilterClass(c)}
              className={`px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                filterClass === c ? 'bg-blue-600 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c === 'semua' ? 'Semua' : `Kelas ${c}`}
            </button>
          ))}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-black text-slate-800 mb-4">Tambah Siswa Baru</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Siswa *</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kelas *</label>
                <select
                  value={newStudent.kelas}
                  onChange={e => setNewStudent({ ...newStudent, kelas: e.target.value })}
                  className="input-field"
                >
                  <option value="">Pilih Kelas</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.name.replace('Kelas ', '')}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  {newStudent.kelas && `Wali Kelas: ${getWaliKelas(newStudent.kelas)}`}
                </p>
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

      {/* Student Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
          <User size={48} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">Belum Ada Siswa</h3>
          <p className="text-slate-500 text-sm">
            Klik tombol "Tambah Siswa" untuk menambahkan siswa baru
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-6 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wide">
            <span className="col-span-2">Nama Siswa</span>
            <span className="text-center">Kelas</span>
            <span className="text-center">Wali Kelas</span>
            <span className="text-center">Level</span>
            <span className="text-center">Misi Selesai</span>
          </div>

          {filtered.map((student) => (
            <div
              key={student.id}
              className="flex flex-col sm:grid sm:grid-cols-6 items-start sm:items-center px-4 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            >
              {/* Name */}
              <div className="flex items-center gap-3 w-full sm:col-span-2 mb-2 sm:mb-0">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm shrink-0">
                  {student.name[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                  <p className="text-slate-400 text-xs">@{student.username}</p>
                </div>
              </div>

              {/* Class */}
              <div className="sm:text-center mb-1 sm:mb-0">
                <span className="badge bg-slate-100 text-slate-600 text-xs font-bold">{student.kelas}</span>
              </div>

              {/* Wali Kelas */}
              <div className="sm:text-center mb-1 sm:mb-0">
                <div className="flex items-center gap-1 justify-start sm:justify-center">
                  <GraduationCap size={12} className="text-purple-600" />
                  <span className="text-xs text-slate-700 font-semibold">{getWaliKelas(student.kelas)}</span>
                </div>
              </div>

              {/* Level */}
              <div className="sm:text-center mb-1 sm:mb-0">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-black shadow ${levelColors[student.level] || 'bg-blue-400'}`}>
                  {student.level}
                </span>
              </div>

              {/* Missions */}
              <div className="sm:text-center">
                <span className="badge bg-emerald-50 text-emerald-700 text-xs font-bold">
                  {student.missionsCompleted || 0} misi
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
