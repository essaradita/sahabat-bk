import { useState, useEffect } from 'react'
import { demoClasses, demoStudents } from '../../data/demoData'
import { apiClient } from '../../lib/api'
import { useToast } from '../../components/ui/Toast'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Plus, Users, Edit2, Trash2, Copy, X, BookOpen, Loader2 } from 'lucide-react'

function ClassCard({ cls, onEdit, onDelete, students }) {
  const teacher = cls.teacher_name || cls.teacher || 'Ibu Rina'
  const studentCount = cls.student_count || cls.studentCount || 0
  
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
          {cls.grade}
        </div>
        <div className="flex-1">
          <h3 className="font-black text-slate-800">{cls.name}</h3>
          <p className="text-slate-500 text-sm">{studentCount} siswa · Wali: {teacher}</p>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => onEdit(cls)} className="w-8 h-8 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center">
            <Edit2 size={14} className="text-blue-600" />
          </button>
          <button onClick={() => onDelete(cls.id)} className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center">
            <Trash2 size={14} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Student preview */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex -space-x-2">
          {students.slice(0, 4).map((s, i) => (
            <div
              key={s.id}
              className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
              style={{ zIndex: 4 - i }}
            >
              {s.name[0]}
            </div>
          ))}
        </div>
        {students.length > 4 && (
          <span className="text-xs text-slate-500">+{students.length - 4} lainnya</span>
        )}
      </div>

      {/* Kode kelas */}
      <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2.5">
        <div>
          <p className="text-xs text-slate-500">Kode Kelas</p>
          <p className="font-black text-slate-800 font-mono tracking-widest">
            {cls.id.replace('cls-', 'BK').toUpperCase()}2025
          </p>
        </div>
        <button
          onClick={() => navigator.clipboard?.writeText(`${cls.id.replace('cls-', 'BK').toUpperCase()}2025`)}
          className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:text-blue-700"
        >
          <Copy size={12} />
          Salin
        </button>
      </div>
    </div>
  )
}

export default function ManageClasses() {
  const { toast } = useToast()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [form, setForm] = useState({ name: '', grade: '7', teacherName: 'Ibu Rina', studentCount: 0 })

  // Load classes from API
  useEffect(() => {
    async function fetchClasses() {
      try {
        setLoading(true)
        const data = await apiClient.getClasses()
        console.log('Classes loaded:', data)
        
        if (data && data.length > 0) {
          setClasses(data)
        } else {
          // If no classes in database, use demo data and save to database
          console.log('No classes found, using demo data')
          setClasses(demoClasses)
          
          // Save demo classes to database
          for (const cls of demoClasses) {
            try {
              await apiClient.createClass({
                name: cls.name,
                grade: cls.grade,
                teacherName: cls.teacher,
                studentCount: cls.studentCount
              })
            } catch (err) {
              console.error('Failed to save demo class:', err)
            }
          }
          
          // Reload classes
          const refreshed = await apiClient.getClasses()
          setClasses(refreshed || demoClasses)
        }
      } catch (err) {
        console.error('Failed to fetch classes:', err)
        toast('Gagal memuat data kelas: ' + err.message, 'error')
        setClasses(demoClasses)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [])

  function handleEdit(cls) {
    setEditingClass(cls)
    setForm({ 
      name: cls.name, 
      grade: String(cls.grade), 
      teacherName: cls.teacher_name || cls.teacher || 'Ibu Rina',
      studentCount: cls.studentCount || cls.student_count || 0 
    })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name.trim()) { 
      toast('Nama kelas wajib diisi', 'error')
      return 
    }
    
    try {
      console.log('Saving class:', form)
      
      if (editingClass) {
        // Update existing class
        const result = await apiClient.updateClass(editingClass.id, {
          name: form.name,
          grade: parseInt(form.grade),
          teacherName: form.teacherName,
          studentCount: form.studentCount
        })
        
        if (result && result.class) {
          setClasses(prev => prev.map(c => c.id === editingClass.id ? result.class : c))
          toast('Kelas berhasil diperbarui!', 'success')
        }
      } else {
        // Create new class
        const result = await apiClient.createClass({
          name: form.name,
          grade: parseInt(form.grade),
          teacherName: form.teacherName,
          studentCount: 0
        })
        
        if (result && result.class) {
          setClasses(prev => [result.class, ...prev])
          toast('Kelas baru berhasil dibuat!', 'success')
        }
      }
      
      setShowForm(false)
      setEditingClass(null)
      setForm({ name: '', grade: '7', teacherName: 'Ibu Rina', studentCount: 0 })
    } catch (err) {
      console.error('Save class error:', err)
      toast('Gagal menyimpan kelas: ' + err.message, 'error')
    }
  }

  async function handleDelete(id) {
    try {
      console.log('Deleting class:', id)
      await apiClient.deleteClass(id)
      setClasses(prev => prev.filter(c => c.id !== id))
      toast('Kelas berhasil dihapus', 'success')
      setDeleteId(null)
    } catch (err) {
      console.error('Delete class error:', err)
      toast('Gagal menghapus kelas: ' + err.message, 'error')
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500">Memuat data kelas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Kelola Kelas</h1>
          <p className="text-slate-500 text-sm">{classes.length} kelas aktif</p>
        </div>
        <button onClick={() => { setEditingClass(null); setForm({ name: '', grade: '7', teacherName: 'Ibu Rina', studentCount: 0 }); setShowForm(true) }} className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm">
          <Plus size={18} />
          Tambah Kelas
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {classes.map(cls => {
          const students = demoStudents.filter(s => s.kelas === cls.name.replace('Kelas ', ''))
          return (
            <ClassCard
              key={cls.id}
              cls={cls}
              students={students}
              onEdit={handleEdit}
              onDelete={id => setDeleteId(id)}
            />
          )
        })}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black">{editingClass ? 'Edit Kelas' : 'Tambah Kelas'}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Kelas *</label>
                <input type="text" placeholder="Contoh: Kelas 8A" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tingkat</label>
                <select value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} className="input-field">
                  <option value="7">Kelas 7</option>
                  <option value="8">Kelas 8</option>
                  <option value="9">Kelas 9</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 py-2.5">Batal</button>
                <button onClick={handleSave} className="btn-primary flex-1 py-2.5">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        title="Hapus Kelas?"
        message="Data kelas dan semua keanggotaan siswa akan dihapus. Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  )
}
