import { SavedInterviewSession, OverallInterviewResult } from '@/types/interview-prep'

const STORAGE_KEY = 'aethercv_interview_sessions_v1'

export function getSavedInterviewSessions(): SavedInterviewSession[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Failed to load interview sessions:', err)
    return []
  }
}

export function saveInterviewSession(result: OverallInterviewResult): void {
  if (typeof window === 'undefined') return
  try {
    const current = getSavedInterviewSessions()
    const newSession: SavedInterviewSession = {
      id: result.id,
      date: result.createdAt,
      company: result.input.company,
      role: result.input.jobRole,
      interviewType: result.input.interviewType,
      overallScore: result.overallScore,
      verdict: result.verdict,
      questionsCount: result.questions.length,
      result
    }

    const updated = [newSession, ...current.filter(s => s.id !== result.id)].slice(0, 30)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save interview session:', err)
  }
}

export function deleteInterviewSession(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const current = getSavedInterviewSessions()
    const updated = current.filter(s => s.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to delete interview session:', err)
  }
}

export function clearAllInterviewSessions(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('Failed to clear interview sessions:', err)
  }
}
