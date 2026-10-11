import { SavedCoverLetterRecord } from '@/types/cover-letter'

const STORAGE_KEY = 'aethercv_saved_cover_letters_v1'

export function getCoverLetterHistory(): SavedCoverLetterRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedCoverLetterRecord[]
  } catch (e) {
    console.error('Failed to load cover letter history:', e)
    return []
  }
}

export function saveCoverLetterToHistory(record: SavedCoverLetterRecord): SavedCoverLetterRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const current = getCoverLetterHistory()
    const existingIndex = current.findIndex(c => c.id === record.id)
    let updated: SavedCoverLetterRecord[]
    if (existingIndex >= 0) {
      updated = [...current]
      updated[existingIndex] = record
    } else {
      updated = [record, ...current].slice(0, 30)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (e) {
    console.error('Failed to save cover letter record:', e)
    return []
  }
}

export function deleteCoverLetterFromHistory(id: string): SavedCoverLetterRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const current = getCoverLetterHistory()
    const updated = current.filter(c => c.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (e) {
    console.error('Failed to delete cover letter:', e)
    return []
  }
}

export function renameCoverLetterRecord(id: string, newTitle: string): SavedCoverLetterRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const current = getCoverLetterHistory()
    const updated = current.map(item =>
      item.id === id ? { ...item, title: newTitle, updatedAt: new Date().toISOString() } : item
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (e) {
    console.error('Failed to rename cover letter:', e)
    return []
  }
}

export function duplicateCoverLetterRecord(id: string): SavedCoverLetterRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const current = getCoverLetterHistory()
    const target = current.find(item => item.id === id)
    if (!target) return current
    const duplicated: SavedCoverLetterRecord = {
      ...target,
      id: `cl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updated = [duplicated, ...current]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (e) {
    console.error('Failed to duplicate cover letter:', e)
    return []
  }
}
