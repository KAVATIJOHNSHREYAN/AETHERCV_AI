'use client'

import { useState, useEffect, useCallback } from 'react'
import { ResumeBuilderData, ResumeVersion } from '@/types/resume-builder'
import { defaultResumeData } from '@/lib/resume-builder/default-data'
import { calculateLiveAtsScore } from '@/lib/resume-builder/ats-calculator'

const LOCAL_STORAGE_MANUAL_SAVED_KEY = 'aethercv_ats_manual_saved_resume_v1'
const LOCAL_STORAGE_VERSIONS_KEY = 'aethercv_ats_resume_versions_v2'

export function useResumeVersions() {
  // STATE 1 — Always starts with the official built-in sample resume on every visit/refresh
  const [resumeData, setResumeData] = useState<ResumeBuilderData>(() =>
    JSON.parse(JSON.stringify(defaultResumeData))
  )
  const [isUserEdited, setIsUserEdited] = useState<boolean>(false)
  const [hasSavedResume, setHasSavedResume] = useState<boolean>(false)
  const [activeVersionId, setActiveVersionId] = useState<string>('sample')
  const [saveStatus, setSaveStatus] = useState<'sample' | 'unsaved' | 'saved'>('sample')

  const initialScore = calculateLiveAtsScore(defaultResumeData).overallScore
  const sampleVersion: ResumeVersion = {
    id: 'sample',
    name: 'Sample Resume (Demo)',
    updatedAt: new Date().toISOString(),
    data: defaultResumeData,
    atsScore: initialScore
  }

  const [versions, setVersions] = useState<ResumeVersion[]>([sampleVersion])

  // On mount: Check if a manually saved resume exists, but DO NOT auto-load it.
  // Every fresh visit, refresh, or tab MUST display the official sample resume.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MANUAL_SAVED_KEY)
      if (saved) {
        setHasSavedResume(true)
      }
    } catch (_) {}
  }, [])

  // Update resume data directly when user edits: transitions to STATE 2 (User Resume)
  // Autosave is OFF: data exists only in the current session unless user explicitly clicks Save.
  const updateResumeData = useCallback(
    (updater: Partial<ResumeBuilderData> | ((prev: ResumeBuilderData) => ResumeBuilderData)) => {
      setIsUserEdited(true)
      setSaveStatus('unsaved')
      setResumeData((prev) => {
        if (typeof updater === 'function') {
          return updater(prev)
        }
        return { ...prev, ...updater }
      })
    },
    []
  )

  // ACTION: Reset to Sample -> Restores the original demo resume instantly
  const resetToSample = useCallback(() => {
    const freshSample = JSON.parse(JSON.stringify(defaultResumeData))
    setResumeData(freshSample)
    setIsUserEdited(false)
    setActiveVersionId('sample')
    setSaveStatus('sample')
  }, [])

  // ACTION: New Resume -> Clears all user-entered fields and reloads official sample
  const newResume = useCallback(() => {
    const freshSample = JSON.parse(JSON.stringify(defaultResumeData))
    setResumeData(freshSample)
    setIsUserEdited(false)
    setActiveVersionId('sample')
    setSaveStatus('sample')
  }, [])

  // ACTION: Save Resume -> Saves ONLY when user explicitly clicks Save
  const saveResume = useCallback((): boolean => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MANUAL_SAVED_KEY, JSON.stringify(resumeData))
      const currentScore = calculateLiveAtsScore(resumeData).overallScore
      const userVersion: ResumeVersion = {
        id: `user-saved-${Date.now()}`,
        name: `Saved Resume (${dataCandidateName(resumeData)})`,
        updatedAt: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(resumeData)),
        atsScore: currentScore
      }

      setVersions((prev) => {
        const filtered = prev.filter((v) => v.id !== 'sample' && !v.id.startsWith('user-saved-'))
        const updated = [userVersion, sampleVersion, ...filtered]
        try {
          localStorage.setItem(LOCAL_STORAGE_VERSIONS_KEY, JSON.stringify(updated))
        } catch (_) {}
        return updated
      })

      setActiveVersionId(userVersion.id)
      setHasSavedResume(true)
      setSaveStatus('saved')
      return true
    } catch (e) {
      console.warn('Failed to manually save resume:', e)
      return false
    }
  }, [resumeData])

  // ACTION: Load Saved Resume -> Loads ONLY manually saved resume
  const loadSavedResume = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MANUAL_SAVED_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.personalInfo) {
          setResumeData(parsed)
          setIsUserEdited(true)
          setSaveStatus('saved')
          return true
        }
      }
      return false
    } catch (e) {
      console.warn('Failed to load manually saved resume:', e)
      return false
    }
  }, [])

  // Version management
  const loadVersion = useCallback(
    (id: string) => {
      if (id === 'sample') {
        resetToSample()
        return
      }
      const found = versions.find((v) => v.id === id)
      if (found) {
        setActiveVersionId(id)
        setResumeData(found.data)
        setIsUserEdited(true)
        setSaveStatus('saved')
      }
    },
    [versions, resetToSample]
  )

  const saveAsNewVersion = useCallback(
    (name: string) => {
      const newId = `ver-${Date.now()}`
      const atsScore = calculateLiveAtsScore(resumeData).overallScore
      const newVersion: ResumeVersion = {
        id: newId,
        name: name.trim() || `Resume V${versions.length + 1}`,
        updatedAt: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(resumeData)),
        atsScore
      }

      setVersions((prev) => {
        const next = [newVersion, ...prev]
        try {
          localStorage.setItem(LOCAL_STORAGE_VERSIONS_KEY, JSON.stringify(next))
        } catch (_) {}
        return next
      })
      setActiveVersionId(newId)
      setIsUserEdited(true)
      setSaveStatus('saved')
    },
    [resumeData, versions.length]
  )

  const duplicateVersion = useCallback(
    (id: string) => {
      const target = versions.find((v) => v.id === id)
      if (!target) return
      const newId = `ver-${Date.now()}`
      const duplicated: ResumeVersion = {
        id: newId,
        name: `${target.name} (Copy)`,
        updatedAt: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(target.data)),
        atsScore: target.atsScore
      }

      setVersions((prev) => {
        const next = [duplicated, ...prev]
        try {
          localStorage.setItem(LOCAL_STORAGE_VERSIONS_KEY, JSON.stringify(next))
        } catch (_) {}
        return next
      })
      setActiveVersionId(newId)
      setResumeData(duplicated.data)
      setIsUserEdited(true)
      setSaveStatus('saved')
    },
    [versions]
  )

  const renameVersion = useCallback((id: string, newName: string) => {
    setVersions((prev) => {
      const next = prev.map((v) => (v.id === id ? { ...v, name: newName.trim() || v.name } : v))
      try {
        localStorage.setItem(LOCAL_STORAGE_VERSIONS_KEY, JSON.stringify(next))
      } catch (_) {}
      return next
    })
  }, [])

  const deleteVersion = useCallback(
    (id: string) => {
      if (versions.length <= 1) return
      setVersions((prev) => {
        const next = prev.filter((v) => v.id !== id)
        try {
          localStorage.setItem(LOCAL_STORAGE_VERSIONS_KEY, JSON.stringify(next))
        } catch (_) {}
        return next
      })
      if (activeVersionId === id) {
        resetToSample()
      }
    },
    [activeVersionId, versions, resetToSample]
  )

  return {
    resumeData,
    updateResumeData,
    versions,
    activeVersionId,
    saveStatus,
    isUserEdited,
    hasSavedResume,
    loadVersion,
    saveAsNewVersion,
    duplicateVersion,
    renameVersion,
    deleteVersion,
    resetToDefault: resetToSample,
    resetToSample,
    newResume,
    saveResume,
    loadSavedResume
  }
}

function dataCandidateName(data: ResumeBuilderData): string {
  const first = data.personalInfo?.firstName || ''
  const last = data.personalInfo?.lastName || ''
  return `${first} ${last}`.trim() || 'Candidate'
}
