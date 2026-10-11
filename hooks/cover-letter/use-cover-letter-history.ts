import { useState, useEffect } from 'react'
import { SavedCoverLetterRecord, GeneratedCoverLetter } from '@/types/cover-letter'
import {
  getCoverLetterHistory,
  saveCoverLetterToHistory,
  deleteCoverLetterFromHistory,
  renameCoverLetterRecord,
  duplicateCoverLetterRecord
} from '@/services/cover-letter/history'

export function useCoverLetterHistory() {
  const [history, setHistory] = useState<SavedCoverLetterRecord[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setHistory(getCoverLetterHistory())
    setIsLoaded(true)
  }, [])

  const saveRecord = (letter: GeneratedCoverLetter, title?: string) => {
    const record: SavedCoverLetterRecord = {
      id: letter.id,
      title: title || `${letter.jobTitle} at ${letter.companyName}`,
      companyName: letter.companyName,
      jobRole: letter.jobTitle,
      tone: letter.toneUsed,
      createdAt: letter.createdAt,
      updatedAt: new Date().toISOString(),
      letter,
      resumeSummary: {
        candidateName: letter.candidateName,
        skillsCount: letter.matchedSkills.length,
        experienceCount: letter.experienceParagraph ? 1 : 0
      }
    }
    const updated = saveCoverLetterToHistory(record)
    setHistory(updated)
    return record
  }

  const deleteRecord = (id: string) => {
    const updated = deleteCoverLetterFromHistory(id)
    setHistory(updated)
  }

  const renameRecord = (id: string, newTitle: string) => {
    const updated = renameCoverLetterRecord(id, newTitle)
    setHistory(updated)
  }

  const duplicateRecord = (id: string) => {
    const updated = duplicateCoverLetterRecord(id)
    setHistory(updated)
  }

  return {
    history,
    isLoaded,
    saveRecord,
    deleteRecord,
    renameRecord,
    duplicateRecord
  }
}
