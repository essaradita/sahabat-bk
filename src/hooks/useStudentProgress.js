import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { demoStudent, demoMissions, demoBadges, demoProgress } from '../data/demoData'

export function useStudentProgress(userId) {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    if (!isSupabaseConfigured) {
      setProgress({
        xp: demoStudent.xp,
        xpMax: demoStudent.xpMax,
        level: demoStudent.level,
        levelName: demoStudent.levelName,
        coins: demoStudent.coins,
        badges: demoBadges.filter(b => b.earned),
        missionProgress: demoProgress,
        completedMissions: demoMissions.filter(m => m.status === 'completed').map(m => m.id),
      })
      setLoading(false)
      return
    }

    fetchProgress()
  }, [userId])

  async function fetchProgress() {
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', userId)
        .single()

      if (error) throw error
      setProgress(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function updateProgress(updates) {
    if (!isSupabaseConfigured) {
      setProgress(prev => ({ ...prev, ...updates }))
      return
    }

    const { error } = await supabase
      .from('student_progress')
      .upsert({ student_id: userId, ...updates })

    if (!error) await fetchProgress()
  }

  return { progress, loading, updateProgress }
}

// XP thresholds per level
export function getLevelFromXP(xp) {
  const levels = [
    { level: 1, name: 'Petualang Baru', minXP: 0 },
    { level: 2, name: 'Penjelajah', minXP: 50 },
    { level: 3, name: 'Penjelajah Muda', minXP: 100 },
    { level: 4, name: 'Petualang Berani', minXP: 200 },
    { level: 5, name: 'Pahlawan Muda', minXP: 350 },
    { level: 6, name: 'Ksatria BK', minXP: 500 },
    { level: 7, name: 'Master BK', minXP: 700 },
    { level: 8, name: 'Legenda BK', minXP: 1000 },
  ]

  let current = levels[0]
  let next = levels[1]

  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].minXP) {
      current = levels[i]
      next = levels[i + 1] || null
    }
  }

  return {
    ...current,
    nextLevel: next,
    xpForNext: next ? next.minXP : current.minXP,
    progress: next ? Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100) : 100,
  }
}
