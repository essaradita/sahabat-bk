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

    console.log('🔍 Mission Progress dari DB:', missionProgress)

    return demoMissions.slice(0, 6).map((mission, idx) => {
      // Cari progress dari database
      const progress = missionProgress.find(p => p.mission_id === mission.id)
      
      console.log(`Misi ${idx + 1} (${mission.id}):`, progress ? `Found in DB - status: ${progress.status}` : 'Not in DB yet')
      
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
      // Cek semua misi sebelumnya sudah completed atau belum
      if (idx === 0) {
        // Mission pertama always available
        console.log(`  → Status: available (first mission)`)
        return {
          ...mission,
          status: 'available'
        }
      }
      
      // Untuk misi ke-2 dst, cek apakah SEMUA misi sebelumnya completed
      let allPreviousCompleted = true
      
      for (let i = 0; i < idx; i++) {
        const prevMission = demoMissions[i]
        const prevProgress = missionProgress.find(p => p.mission_id === prevMission.id)
        
        if (!prevProgress || prevProgress.status !== 'completed') {
          allPreviousCompleted = false
          console.log(`  ❌ Misi sebelumnya ke-${i+1} (${prevMission.id}) belum completed`)
          break
        } else {
          console.log(`  ✅ Misi sebelumnya ke-${i+1} (${prevMission.id}) sudah completed`)
        }
      }
      
      const status = allPreviousCompleted ? 'available' : 'locked'
      console.log(`  → Status: ${status} (${allPreviousCompleted ? 'all previous completed' : 'previous not completed'})`)
      
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
