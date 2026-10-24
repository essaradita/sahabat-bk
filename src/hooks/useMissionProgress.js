import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { demoMissions } from '../data/demoData'

export function useMissionProgress() {
  const [missionProgress, setMissionProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // Deteksi preview mode - jika guru sedang preview
  const isPreviewMode = sessionStorage.getItem('teacher_preview_mode') === 'true'

  useEffect(() => {
    if (isPreviewMode) {
      // Jika preview mode, langsung gunakan data demo tanpa API call
      setLoading(false)
    } else {
      loadMissionProgress()
    }
  }, [isPreviewMode])

  async function loadMissionProgress() {
    try {
      const progress = await apiClient.getStudentMissions()
      setMissionProgress(progress)
    } catch (err) {
      console.error('Failed to load mission progress:', err)
      setMissionProgress([])
    } finally {
      setLoading(false)
    }
  }

  // Merge demo missions dengan progress dari database
  function getMissionsWithStatus() {
    // Jika preview mode, semua misi available (untuk demo)
    if (isPreviewMode) {
      return demoMissions.slice(0, 6).map((mission, idx) => ({
        ...mission,
        status: 'available' // Semua available di preview mode
      }))
    }

    return demoMissions.slice(0, 6).map((mission, idx) => {
      // Cari progress dari database
      const progress = missionProgress.find(p => p.mission_id === mission.id)
      
      if (progress) {
        // Jika ada di database, gunakan status dari database
        return {
          ...mission,
          status: progress.status,
          score: progress.score,
          completed_at: progress.completed_at
        }
      }
      
      // Jika tidak ada di database, gunakan logika unlock bertahap
      const previousMissions = demoMissions.slice(0, idx)
      const previousProgress = previousMissions.map(m => 
        missionProgress.find(p => p.mission_id === m.id)
      )
      const allPreviousCompleted = previousProgress.every(p => p && p.status === 'completed')
      
      // Mission pertama available, sisanya locked kecuali sudah selesai
      const status = idx === 0 ? 'available' : (allPreviousCompleted ? 'available' : 'locked')
      
      return {
        ...mission,
        status
      }
    })
  }

  return {
    missions: getMissionsWithStatus(),
    loading,
    refresh: isPreviewMode ? () => {} : loadMissionProgress
  }
}
