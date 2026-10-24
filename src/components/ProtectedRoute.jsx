import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from './ui/LoadingScreen'
import { useEffect } from 'react'

export default function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen />

  if (!user || !profile) {
    return <Navigate to="/" replace />
  }

  // Check if teacher is in preview mode
  // Teachers can access student routes when:
  // 1. Location state has previewMode: true (initial navigation)
  // 2. Or, teacher is on any student route (persisted preview)
  const isPreviewMode = location.state?.previewMode === true
  const isOnStudentRoute = location.pathname.startsWith('/student')
  const isTeacherPreviewingStudent = profile.role === 'teacher' && role === 'student' && (isPreviewMode || isOnStudentRoute)

  // Store preview mode in sessionStorage when first activated
  useEffect(() => {
    if (isPreviewMode && profile.role === 'teacher') {
      sessionStorage.setItem('teacher_preview_mode', 'true')
    }
  }, [isPreviewMode, profile.role])

  // Check if teacher is in preview mode (from state or sessionStorage)
  const isInPreviewMode = isPreviewMode || (
    profile.role === 'teacher' && 
    sessionStorage.getItem('teacher_preview_mode') === 'true' && 
    isOnStudentRoute
  )

  // Allow teacher to access student routes in preview mode
  if (profile.role === 'teacher' && role === 'student' && isInPreviewMode) {
    return children
  }

  if (role && profile.role !== role) {
    // Redirect to correct dashboard
    if (profile.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
    if (profile.role === 'student') return <Navigate to="/student/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return children
}
