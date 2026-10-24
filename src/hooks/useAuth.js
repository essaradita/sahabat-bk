import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { apiClient } from '../lib/api'
import { demoStudent, demoTeacher } from '../data/demoData'

const AuthContext = createContext(null)

const API_MODE = import.meta.env.VITE_API_MODE || 'local'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured)

  useEffect(() => {
    async function loadSession() {
      // Mode API lokal (MySQL)
      if (API_MODE === 'local') {
        const token = localStorage.getItem('sahabatbk_token')
        if (token) {
          try {
            const profile = await apiClient.getProfile()
            setUser({ id: profile.id, email: profile.email })
            setProfile(profile)
          } catch (err) {
            console.error('Load session error:', err)
            apiClient.logout()
          }
        }
        setLoading(false)
        return
      }

      // Mode Supabase (fallback)
      if (!isSupabaseConfigured) {
        const demoSession = localStorage.getItem('sahabatbk_demo_session')
        if (demoSession) {
          try {
            const parsed = JSON.parse(demoSession)
            setUser(parsed.user)
            setProfile(parsed.profile)
          } catch {
            localStorage.removeItem('sahabatbk_demo_session')
          }
        }
        setLoading(false)
        return
      }

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user)
          fetchProfile(session.user.id)
        } else {
          setLoading(false)
        }
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUser(session.user)
          fetchProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      })

      return () => subscription.unsubscribe()
    }

    loadSession()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  // Demo login — disabled
  async function demoLogin(role) {
    return { error: { message: 'Mode demo tidak tersedia.' } }
  }

  // ── REGISTER SISWA ──────────────────────────────────────────
  async function registerStudent({ name, username, password, kelas, gender }) {
    // Prioritas: Kalau API_MODE=local, langsung pakai backend
    if (API_MODE === 'local') {
      try {
        const data = await apiClient.registerStudent({ name, username, password, kelas, gender })
        setUser(data.user)
        setProfile(data.profile)
        return { error: null }
      } catch (err) {
        console.error('Register student error:', err)
        return { error: { message: err.message || 'Gagal mendaftar. Pastikan backend jalan.' } }
      }
    }

    if (!isSupabaseConfigured) {
      // Simpan dengan password (untuk validasi login nanti)
      const saved = localStorage.getItem('sahabatbk_local_users')
      const users = saved ? JSON.parse(saved) : []
      
      // Cek username sudah ada
      if (users.find(u => u.username === username)) {
        return { error: { message: 'Username sudah dipakai. Coba username lain.' } }
      }
      
      const newUser = { 
        id: `local-student-${Date.now()}`, 
        email: `${username}@local`, 
        role: 'student',
        username,
        password, // Simpan password untuk validasi login
        name,
        kelas,
        gender
      }
      const newProfile = {
        ...newUser, 
        avatar: gender === 'female' ? 'girl1' : 'boy1',
        xp: 0, xpMax: 100, level: 1, levelName: 'Petualang Baru',
        coins: 0, badgeCount: 0, missionsCompleted: 0, missionsTotal: 10,
      }
      
      // Simpan ke list users
      users.push(newUser)
      localStorage.setItem('sahabatbk_local_users', JSON.stringify(users))
      
      // Set session
      setUser(newUser)
      setProfile(newProfile)
      localStorage.setItem('sahabatbk_demo_session', JSON.stringify({ user: newUser, profile: newProfile }))
      return { error: null }
    }

    // Cek username sudah dipakai belum
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (existing) {
      return { error: { message: 'Username sudah dipakai. Coba username lain.' } }
    }

    // Buat email internal dari username (siswa login pakai username, bukan email)
    const email = `${username}@sahabatbk.internal`

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: 'student', name, username, kelas },
      },
    })

    if (error) return { error }

    // Update profil tambahan
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        role: 'student',
        name,
        username,
        kelas,
        email,
        avatar: 'boy1',
      })

      // Buat progress awal
      await supabase.from('student_progress').upsert({
        student_id: data.user.id,
        xp: 0,
        level: 1,
        coins: 0,
      })
    }

    return { error: null }
  }

  // ── REGISTER GURU ───────────────────────────────────────────
  async function registerTeacher({ name, email, password, school }) {
    if (API_MODE === 'local') {
      try {
        const data = await apiClient.registerTeacher({ name, email, password, school })
        setUser(data.user)
        setProfile(data.profile)
        return { error: null }
      } catch (err) {
        return { error: { message: err.message } }
      }
    }

    if (!isSupabaseConfigured) {
      // Simpan dengan password
      const saved = localStorage.getItem('sahabatbk_local_users')
      const users = saved ? JSON.parse(saved) : []
      
      // Cek email sudah ada
      if (users.find(u => u.email === email)) {
        return { error: { message: 'Email sudah terdaftar.' } }
      }
      
      const newUser = { 
        id: `local-teacher-${Date.now()}`, 
        email, 
        role: 'teacher',
        password, // Simpan password
        name,
        school
      }
      const newProfile = { ...newUser, totalStudents: 0, totalClasses: 0 }
      
      // Simpan ke list users
      users.push(newUser)
      localStorage.setItem('sahabatbk_local_users', JSON.stringify(users))
      
      // Set session
      setUser(newUser)
      setProfile(newProfile)
      localStorage.setItem('sahabatbk_demo_session', JSON.stringify({ user: newUser, profile: newProfile }))
      return { error: null }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: 'teacher', name, school },
      },
    })

    if (error) return { error }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        role: 'teacher',
        name,
        email,
        school,
      })
    }

    return { error: null }
  }

  // ── LOGIN GURU ──────────────────────────────────────────────
  async function loginTeacher(email, password) {
    if (API_MODE === 'local') {
      try {
        const data = await apiClient.loginTeacher(email, password)
        setUser(data.user)
        setProfile(data.profile)
        return { error: null }
      } catch (err) {
        return { error: { message: err.message } }
      }
    }

    if (!isSupabaseConfigured) {
      // Cek akun lokal dari list users
      const saved = localStorage.getItem('sahabatbk_local_users')
      if (saved) {
        try {
          const users = JSON.parse(saved)
          const user = users.find(u => u.role === 'teacher' && u.email === email)
          
          if (user) {
            // Validasi password
            if (user.password !== password) {
              return { error: { message: 'Password salah.' } }
            }
            
            // Login berhasil
            const profile = {
              id: user.id,
              role: user.role,
              name: user.name,
              email: user.email,
              school: user.school,
              totalStudents: 0,
              totalClasses: 0
            }
            
            setUser({ id: user.id, email: user.email })
            setProfile(profile)
            localStorage.setItem('sahabatbk_demo_session', JSON.stringify({ user: { id: user.id, email: user.email }, profile }))
            return { error: null }
          }
        } catch (err) {
          console.error('Login parse error:', err)
        }
      }
      return { error: { message: 'Email atau password salah.' } }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileData?.role !== 'teacher') {
      await supabase.auth.signOut()
      return { error: { message: 'Akun ini bukan akun Guru BK.' } }
    }

    return { error: null }
  }

  // ── LOGIN SISWA ─────────────────────────────────────────────
  async function loginStudent(username, password) {
    if (API_MODE === 'local') {
      try {
        const data = await apiClient.loginStudent(username, password)
        setUser(data.user)
        setProfile(data.profile)
        return { error: null }
      } catch (err) {
        return { error: { message: err.message } }
      }
    }

    if (!isSupabaseConfigured) {
      // Cek akun lokal dari list users
      const saved = localStorage.getItem('sahabatbk_local_users')
      if (saved) {
        try {
          const users = JSON.parse(saved)
          const user = users.find(u => u.role === 'student' && u.username === username)
          
          if (user) {
            // Validasi password
            if (user.password !== password) {
              return { error: { message: 'Password salah.' } }
            }
            
            // Login berhasil
            const profile = {
              id: user.id,
              role: user.role,
              name: user.name,
              username: user.username,
              kelas: user.kelas,
              gender: user.gender,
              avatar: user.avatar || (user.gender === 'female' ? 'girl1' : 'boy1'),
              xp: 0,
              xpMax: 100,
              level: 1,
              levelName: 'Petualang Baru',
              coins: 0,
              badgeCount: 0,
              missionsCompleted: 0,
              missionsTotal: 10
            }
            
            setUser({ id: user.id, email: user.email })
            setProfile(profile)
            localStorage.setItem('sahabatbk_demo_session', JSON.stringify({ user: { id: user.id, email: user.email }, profile }))
            return { error: null }
          }
        } catch (err) {
          console.error('Login parse error:', err)
        }
      }
      return { error: { message: 'Username atau password salah.' } }
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', username)
      .eq('role', 'student')
      .single()

    if (profileError || !profileData) {
      return { error: { message: 'Username tidak ditemukan.' } }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: profileData.email,
      password,
    })

    return { error }
  }

  // ── LOGOUT ──────────────────────────────────────────────────
  async function logout() {
    if (API_MODE === 'local') {
      apiClient.logout()
      setUser(null)
      setProfile(null)
      return
    }

    if (!isSupabaseConfigured) {
      localStorage.removeItem('sahabatbk_demo_session')
      setUser(null)
      setProfile(null)
      return
    }
    await supabase.auth.signOut()
  }

  // ── REFRESH PROFILE ─────────────────────────────────────────
  async function refreshProfile() {
    if (API_MODE === 'local' && user) {
      try {
        const updatedProfile = await apiClient.getProfile()
        setProfile(updatedProfile)
      } catch (err) {
        console.error('Refresh profile error:', err)
      }
    }
  }

  const value = {
    user,
    profile,
    loading,
    isDemoMode,
    loginTeacher,
    loginStudent,
    registerStudent,
    registerTeacher,
    demoLogin,
    logout,
    refreshProfile,
    isTeacher: profile?.role === 'teacher',
    isStudent: profile?.role === 'student',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
