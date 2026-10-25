import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/api'
import { useToast } from '../../components/ui/Toast'
import { Calendar, Download, Plus, Save, CheckCircle, Users, Loader2 } from 'lucide-react'

const statusConfig = {
  hadir: { label: 'Hadir', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', dot: 'bg-emerald-500' },
  izin: { label: 'Izin', color: 'bg-blue-100 text-blue-700 border-blue-300', dot: 'bg-blue-500' },
  sakit: { label: 'Sakit', color: 'bg-amber-100 text-amber-700 border-amber-300', dot: 'bg-amber-500' },
  alpa: { label: 'Alpa', color: 'bg-red-100 text-red-700 border-red-300', dot: 'bg-red-500' },
}

export default function AttendancePage() {
  const { toast } = useToast()
  const [attendanceStudents, setAttendanceStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState('semua')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [records, setRecords] = useState([])
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('input')
  const [loading, setLoading] = useState(true)

  // Load students from API
  useEffect(() => {
    async function fetchAttendanceStudents() {
      try {
        setLoading(true)
        const data = await apiClient.getAttendanceStudents()
        setAttendanceStudents(data || [])
        
        if (data && data.length > 0) {
          const uniqueClasses = [...new Set(data.map(s => s.kelas).filter(Boolean))]
          if (uniqueClasses.length > 0 && selectedClass === 'semua') {
            setSelectedClass(uniqueClasses[0])
          }
        }
      } catch (err) {
        toast('Gagal memuat data siswa: ' + err.message, 'error')
        setAttendanceStudents([])
      } finally {
        setLoading(false)
      }
    }
    fetchAttendanceStudents()
  }, [])

  // Get unique classes
  const classes = attendanceStudents.length > 0 
    ? [...new Set(attendanceStudents.map(s => s.kelas).filter(Boolean))]
    : []

  // Filter students by class
  const filteredStudents = selectedClass === 'semua' 
    ? attendanceStudents 
    : attendanceStudents.filter(s => s.kelas === selectedClass)

  // Generate records when students, date or class changes
  useEffect(() => {
    if (filteredStudents.length === 0) {
      setRecords([])
      return
    }

    const newRecords = filteredStudents.map(student => {
      const attendanceRecord = student.attendance?.find(a => a.date === selectedDate)
      
      return {
        id: `${student.id}-${selectedDate}`,
        studentId: student.id,
        studentName: student.name,
        status: attendanceRecord?.status || null,
        date: selectedDate,
        kelas: student.kelas
      }
    })

    setRecords(newRecords)
    setSaved(false)
  }, [filteredStudents, selectedDate])

  // Calculate summary
  const summary = {
    hadir: records.filter(r => r.status === 'hadir').length,
    izin: records.filter(r => r.status === 'izin').length,
    sakit: records.filter(r => r.status === 'sakit').length,
    alpa: records.filter(r => r.status === 'alpa').length,
    belumDiabsen: records.filter(r => r.status === null).length,
  }

  // Update status handler
  const handleStatusClick = (recordId, newStatus) => {
    setRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === recordId 
          ? { ...record, status: newStatus }
          : record
      )
    )
    setSaved(false)
  }

  // Save to database
  function handleSave() {
    const hasAnyStatus = records.some(r => r.status !== null)
    if (!hasAnyStatus) {
      toast('Pilih minimal satu status absensi', 'error')
      return
    }

    const recordsToSave = records.filter(r => r.status !== null)
    
    const promises = recordsToSave.map(record => 
      apiClient.markAttendance(record.studentId, selectedDate, record.status)
        .catch(err => {
          console.error(`Failed to mark attendance for ${record.studentName}:`, err)
          throw err
        })
    )

    Promise.all(promises)
      .then(() => {
        return apiClient.getAttendanceStudents()
      })
      .then(updatedStudents => {
        setAttendanceStudents(updatedStudents)
        
        const updatedRecords = records.map(record => {
          const student = updatedStudents.find(s => s.id === record.studentId)
          const attendanceRecord = student?.attendance?.find(a => a.date === selectedDate)
          return {
            ...record,
            status: attendanceRecord?.status || record.status
          }
        })
        setRecords(updatedRecords)
        
        setSaved(true)
        toast(`Absensi ${recordsToSave.length} siswa berhasil disimpan! ✅`, 'success')
        
        setTimeout(() => setSaved(false), 3000)
      })
      .catch(err => {
        toast('Gagal menyimpan absensi: ' + err.message, 'error')
      })
  }

  function handleDownloadCSV() {
    if (records.length === 0) {
      toast('Tidak ada data untuk diunduh', 'error')
      return
    }

    const header = 'No,Nama Siswa,Kelas,Status,Tanggal\n'
    const rows = records.map((r, i) =>
      `${i + 1},${r.studentName},${r.kelas},${r.status || 'Belum diabsen'},${selectedDate}`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `absensi_${selectedClass}_${selectedDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast('File CSV berhasil diunduh!', 'success')
  }

  function markAllPresent() {
    setRecords(prev => prev.map(r => ({ ...r, status: 'hadir' })))
    setSaved(false)
  }

  // Get attendance history for recap tab
  const getAttendanceHistory = () => {
    const history = []
    const dates = new Set()
    
    const studentsToCheck = selectedClass === 'semua' 
      ? attendanceStudents 
      : attendanceStudents.filter(s => s.kelas === selectedClass)
    
    studentsToCheck.forEach(student => {
      student.attendance?.forEach(a => {
        dates.add(a.date)
      })
    })

    Array.from(dates).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
      const dateRecords = studentsToCheck.map(student => {
        const record = student.attendance?.find(a => a.date === date)
        return {
          status: record?.status || null,
          kelas: student.kelas
        }
      }).filter(r => r.status)

      const summary = {
        date,
        hadir: dateRecords.filter(r => r.status === 'hadir').length,
        izin: dateRecords.filter(r => r.status === 'izin').length,
        sakit: dateRecords.filter(r => r.status === 'sakit').length,
        alpa: dateRecords.filter(r => r.status === 'alpa').length,
        total: dateRecords.length
      }

      history.push(summary)
    })

    return history
  }

  const history = getAttendanceHistory()

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500">Memuat data absensi...</p>
        </div>
      </div>
    )
  }

  if (attendanceStudents.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-800">Absensi Digital</h1>
          <p className="text-slate-500 text-sm">Catat kehadiran siswa dengan mudah</p>
        </div>
        <div className="card p-12 text-center">
          <Users size={48} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Belum Ada Data Siswa</h3>
          <p className="text-slate-500 text-sm mb-4">
            Tambahkan siswa terlebih dahulu di menu <strong>Data Siswa</strong> → Tab <strong>Data Absensi</strong>
          </p>
          <a
            href="/teacher/students"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all"
          >
            <Plus size={16} />
            Tambah Siswa Sekarang
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Absensi Digital</h1>
          <p className="text-slate-500 text-sm">Catat kehadiran siswa dengan mudah</p>
        </div>
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all"
        >
          <Download size={16} />
          Unduh CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
        <button
          onClick={() => setActiveTab('input')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'input' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          ✏️ Input Absensi
        </button>
        <button
          onClick={() => setActiveTab('recap')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'recap' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          📊 Rekap
        </button>
      </div>

      {activeTab === 'input' && (
        <>
          {/* Controls */}
          <div className="card mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Users size={14} /> Kelas
                </label>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="input-field"
                >
                  {classes.map(c => (
                    <option key={c} value={c}>Kelas {c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Calendar size={14} /> Tanggal
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className={`rounded-xl p-2.5 border text-center ${cfg.color}`}>
                <p className="font-black text-lg">{summary[key]}</p>
                <p className="text-xs font-semibold">{cfg.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Action */}
          <div className="flex gap-2 mb-3">
            <button 
              onClick={markAllPresent} 
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-sm transition-all"
            >
              <CheckCircle size={15} />
              Semua Hadir
            </button>
            <span className="text-slate-400 text-sm flex items-center px-2">
              {records.length} siswa
            </span>
          </div>

          {/* Student List */}
          <div className="space-y-2 mb-4">
            {records.map(record => {
              const cfg = record.status 
                ? statusConfig[record.status] 
                : { label: 'Belum diabsen', color: 'bg-slate-100 text-slate-600 border-slate-300', dot: 'bg-slate-400' }
              
              return (
                <div key={record.id} className="card p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm shrink-0">
                    {record.studentName[0]}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm">{record.studentName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      <span className={`text-xs font-semibold ${cfg.color.split(' ')[1]}`}>{cfg.label}</span>
                    </div>
                  </div>

                  {/* Status Buttons */}
                  <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                    <button
                      onClick={() => handleStatusClick(record.id, 'hadir')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        record.status === 'hadir'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-300 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      Hadir
                    </button>
                    
                    <button
                      onClick={() => handleStatusClick(record.id, 'izin')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        record.status === 'izin'
                          ? 'bg-blue-100 text-blue-700 border-blue-300 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      Izin
                    </button>
                    
                    <button
                      onClick={() => handleStatusClick(record.id, 'sakit')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        record.status === 'sakit'
                          ? 'bg-amber-100 text-amber-700 border-amber-300 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      Sakit
                    </button>
                    
                    <button
                      onClick={() => handleStatusClick(record.id, 'alpa')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        record.status === 'alpa'
                          ? 'bg-red-100 text-red-700 border-red-300 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      Alpa
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saved}
            className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
              saved 
                ? 'bg-emerald-500 text-white cursor-default' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } shadow-lg disabled:opacity-90`}
          >
            {saved ? (
              <>
                <CheckCircle size={20} /> Absensi Tersimpan
              </>
            ) : (
              <>
                <Save size={20} /> Simpan Absensi
              </>
            )}
          </button>
        </>
      )}

      {activeTab === 'recap' && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="card p-12 text-center">
              <Calendar size={48} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">Belum Ada Riwayat Absensi</h3>
              <p className="text-slate-500 text-sm">
                Mulai isi absensi untuk melihat rekap di sini
              </p>
            </div>
          ) : (
            history.map((session, idx) => (
              <div key={idx} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-black text-slate-800">Kelas {selectedClass}</h3>
                    <p className="text-slate-500 text-sm">
                      {new Date(session.date).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span className="badge bg-blue-100 text-blue-700">{session.total} siswa</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-emerald-50 rounded-xl p-2 text-center">
                    <p className="font-black text-emerald-700 text-lg">{session.hadir}</p>
                    <p className="text-xs text-emerald-600">Hadir</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-2 text-center">
                    <p className="font-black text-blue-700 text-lg">{session.izin}</p>
                    <p className="text-xs text-blue-600">Izin</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-2 text-center">
                    <p className="font-black text-amber-700 text-lg">{session.sakit}</p>
                    <p className="text-xs text-amber-600">Sakit</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-2 text-center">
                    <p className="font-black text-red-700 text-lg">{session.alpa}</p>
                    <p className="text-xs text-red-600">Alpa</p>
                  </div>
                </div>

                {session.total > 0 && (
                  <>
                    <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.round((session.hadir / session.total) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-right">
                      {Math.round((session.hadir / session.total) * 100)}% kehadiran
                    </p>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
