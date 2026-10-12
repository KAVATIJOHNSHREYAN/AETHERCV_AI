'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ResumeBuilderData, ResumeVersion } from '@/types/resume-builder'
import { defaultResumeData } from '@/lib/resume-builder/default-data'
import { calculateLiveAtsScore } from '@/lib/resume-builder/ats-calculator'

const LOCAL_STORAGE_ACTIVE_KEY = 'aethercv_ats_active_resume_v2'
const LOCAL_STORAGE_VERSIONS_KEY = 'aethercv_ats_resume_versions_v2'

export function useResumeVersions() {
  const [resumeData, setResumeData] = useState<ResumeBuilderData>(defaultResumeData)
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [activeVersionId, setActiveVersionId] = useState<string>('default')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved')
  const [isInitialized, setIsInitialized] = useState(false)

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedActive = localStorage.getItem(LOCAL_STORAGE_ACTIVE_KEY)
      const savedVersions = localStorage.getItem(LOCAL_STORAGE_VERSIONS_KEY)

      let initialData = defaultResumeData
      if (savedActive) {
        try {
          const parsed = JSON.parse(savedActive)
          if (parsed && parsed.personalInfo) {
            initialData = parsed
          }
        } catch (_) {}
      }

      let parsedVersions: ResumeVersion[] = []
      if (savedVersions) {
        try {
          parsedVersions = JSON.parse(savedVersions)
        } catch (_) {}
      }

      if (parsedVersions.length === 0) {
        const initialScore = calculateLiveAtsScore(initialData).overallScore
        const defaultVer: ResumeVersion = {
          id: 'default',
          name: 'Resume V1 (Master)',
          updatedAt: new Date().toISOString(),
          data: initialData,
          atsScore: initialScore
        }
        parsedVersions = [defaultVer]
      }

      setResumeData(initialData)
      setVersions(parsedVersions)
      setActiveVersionId(parsedVersions[0]?.id || 'default')
    } catch (e) {
      console.warn('Failed to load resume builder versions:', e)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Auto-Save Effect
  useEffect(() => {
    if (!isInitialized) return

    setSaveStatus('saving')
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(resumeData))

        // Update current version in list
        const currentScore = calculateLiveAtsScore(resumeData).overallScore
        setVersions((prev) => {
          const updated = prev.map((v) =>
            v.id === activeVersionId
              ? { ...v, data: resumeData, updatedAt: new Date().toISOString(), atsScore: currentScore }
              : v
          )
          try {
            localStorage.setItem(LOCAL_STORAGE_VERSIONS_KEY, JSON.stringify(updated))
          } catch (_) {}
          return updated
        })

        setSaveStatus('saved')
      } catch (err) {
        console.warn('Failed to auto-save resume builder state:', err)
        setSaveStatus('saved')
      }
    }, 1500)

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [resumeData, activeVersionId, isInitialized])

  // Update resume data directly with partial or updater
  const updateResumeData = useCallback(
    (updater: Partial<ResumeBuilderData> | ((prev: ResumeBuilderData) => ResumeBuilderData)) => {
      setResumeData((prev) => {
        if (typeof updater === 'function') {
          return updater(prev)
        }
        return { ...prev, ...updater }
      })
    },
    []
  )

  // Switch / Load a specific version
  const loadVersion = useCallback(
    (id: string) => {
      const found = versions.find((v) => v.id === id)
      if (found) {
        setActiveVersionId(id)
        setResumeData(found.data)
      }
    },
    [versions]
  )

  // Save current state as a new named version (e.g. "Google Resume", "Amazon SDE")
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
    },
    [resumeData, versions.length]
  )

  // Duplicate an existing version
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
    },
    [versions]
  )

  // Rename a version
  const renameVersion = useCallback((id: string, newName: string) => {
    setVersions((prev) => {
      const next = prev.map((v) => (v.id === id ? { ...v, name: newName.trim() || v.name } : v))
      try {
        localStorage.setItem(LOCAL_STORAGE_VERSIONS_KEY, JSON.stringify(next))
      } catch (_) {}
      return next
    })
  }, [])

  // Delete a version
  const deleteVersion = useCallback(
    (id: string) => {
      if (versions.length <= 1) return // Keep at least one
      setVersions((prev) => {
        const next = prev.filter((v) => v.id !== id)
        try {
          localStorage.setItem(LOCAL_STORAGE_VERSIONS_KEY, JSON.stringify(next))
        } catch (_) {}
        return next
      })
      if (activeVersionId === id) {
        const fallback = versions.find((v) => v.id !== id)
        if (fallback) {
          setActiveVersionId(fallback.id)
          setResumeData(fallback.data)
        }
      }
    },
    [activeVersionId, versions]
  )

  // Reset to default sample resume
  const resetToDefault = useCallback(() => {
    setResumeData(defaultResumeData)
  }, [])

  return {
    resumeData,
    updateResumeData,
    versions,
    activeVersionId,
    saveStatus,
    loadVersion,
    saveAsNewVersion,
    duplicateVersion,
    renameVersion,
    deleteVersion,
    resetToDefault
  }
}
