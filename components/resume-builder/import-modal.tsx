'use client'

import React, { useState, useEffect } from 'react'
import { ResumeBuilderData } from '@/types/resume-builder'
import {
  Upload, Github, FileText, CheckCircle2, AlertCircle, RefreshCw,
  X, Sparkles, Download, Layers, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { convertParsedResumeToBuilder, importGitHubProjects } from '@/lib/resume-builder/import-export'
import { ParsedResume } from '@/lib/resume/types'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (imported: Partial<ResumeBuilderData>) => void
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [activeTab, setActiveTab] = useState<'existing' | 'file' | 'github' | 'json'>('existing')
  const [cachedResume, setCachedResume] = useState<ParsedResume | null>(null)

  // File upload state
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // GitHub state
  const [githubUser, setGithubUser] = useState('')
  const [isFetchingGithub, setIsFetchingGithub] = useState(false)
  const [githubError, setGithubError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem('aethercv_parsed_resume_v1')
        if (raw) {
          setCachedResume(JSON.parse(raw))
        }
      } catch (_) {}
    }
  }, [isOpen])

  if (!isOpen) return null

  // 1. Handle Import from Analyzed Resume
  const handleImportCached = () => {
    if (!cachedResume) return
    const converted = convertParsedResumeToBuilder(cachedResume)
    onImport(converted)
    onClose()
  }

  // 2. Handle File Upload (PDF/DOCX/TXT)
  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to parse resume document.')
      }

      const json = await res.json()
      const parsedResume = json.parsedData || json.resume
      if (!parsedResume) throw new Error('No readable resume data extracted.')

      const converted = convertParsedResumeToBuilder(parsedResume)
      onImport(converted)
      onClose()
    } catch (err: any) {
      setUploadError(err.message || 'File import failed.')
    } finally {
      setIsUploading(false)
    }
  }

  // 3. Handle GitHub Portfolio Import
  const handleGithubImport = async () => {
    if (!githubUser.trim()) return
    setIsFetchingGithub(true)
    setGithubError(null)
    try {
      const projects = await importGitHubProjects(githubUser)
      if (projects.length === 0) {
        throw new Error('No public repositories found for this GitHub account.')
      }
      onImport({
        personalInfo: {
          ...({} as any),
          github: `https://github.com/${githubUser.trim().replace(/^https?:\/\/github\.com\//, '')}`
        },
        projects
      })
      onClose()
    } catch (err: any) {
      setGithubError(err.message || 'GitHub import failed.')
    } finally {
      setIsFetchingGithub(false)
    }
  }

  // 4. Handle JSON Restore
  const handleJsonUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string)
        if (parsed.personalInfo) {
          onImport(parsed)
          onClose()
        } else {
          setUploadError('Invalid Resume Builder JSON format.')
        }
      } catch (_) {
        setUploadError('Could not parse JSON file.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0C162B] border border-blue-500/25 p-6 shadow-2xl space-y-5 font-outfit text-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-blue-500/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#818cf8] flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-poppins text-white">Import Resume Data</h3>
              <p className="text-xs text-slate-400">Populate your resume from existing files or platforms</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#07101F] border border-blue-500/20 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('existing')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'existing' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analyzed Resume
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'file' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            PDF / DOCX
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'github' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            GitHub Portfolio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'json' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            JSON Backup
          </button>
        </div>

        {/* TAB 1: Analyzed Resume from LocalStorage */}
        {activeTab === 'existing' && (
          <div className="space-y-4 py-2">
            {cachedResume ? (
              <div className="p-4 rounded-2xl bg-[#07101F] border border-blue-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white font-poppins">{cachedResume.contact.name || 'Candidate Profile'}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                    Ready to Populate
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {cachedResume.contact.email} • {cachedResume.experience.length} experiences • {cachedResume.projects.length} projects • {cachedResume.education.length} degrees
                </p>
                <Button
                  onClick={handleImportCached}
                  className="w-full bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] hover:brightness-110 text-white font-semibold text-xs py-2 rounded-xl"
                >
                  Import All Analyzed Fields
                </Button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#07101F] border border-blue-500/15 text-center space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-500" />
                <h4 className="text-sm font-bold text-white">No Analyzed Resume Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You haven&apos;t analyzed a resume yet in the AI Resume Analyzer. You can upload a PDF/DOCX below or import from GitHub.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Document File Upload */}
        {activeTab === 'file' && (
          <div className="space-y-4 py-2">
            <label className="border-2 border-dashed border-blue-500/30 hover:border-blue-500 transition-all rounded-2xl p-6 text-center block cursor-pointer bg-[#07101F]/60">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt,.png,.jpg"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFileUpload(f)
                }}
                className="hidden"
              />
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/15 text-sky-400 flex items-center justify-center mb-2">
                {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              </div>
              <h4 className="text-sm font-bold text-white font-poppins">
                {isUploading ? 'Extracting & Parsing Document...' : 'Upload PDF, DOCX, or Image Resume'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">Our OCR and parser engine will automatically extract all fields.</p>
            </label>
            {uploadError && <p className="text-xs text-red-400 bg-red-950/30 p-2.5 rounded-xl border border-red-500/20">{uploadError}</p>}
          </div>
        )}

        {/* TAB 3: GitHub Portfolio Import */}
        {activeTab === 'github' && (
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">GitHub Username or Profile URL</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Github className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    placeholder="e.g. KAVATIJOHNSHREYAN"
                    className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl pl-9 pr-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <Button
                  onClick={handleGithubImport}
                  disabled={isFetchingGithub || !githubUser.trim()}
                  className="bg-[#2563EB] text-white text-xs px-4"
                >
                  {isFetchingGithub ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Fetch Repos'}
                </Button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Fetches your top repositories, descriptions, languages, and star counts directly into your Projects section.
              </p>
            </div>
            {githubError && <p className="text-xs text-red-400 bg-red-950/30 p-2.5 rounded-xl border border-red-500/20">{githubError}</p>}
          </div>
        )}

        {/* TAB 4: JSON Backup Restore */}
        {activeTab === 'json' && (
          <div className="space-y-4 py-2">
            <label className="border-2 border-dashed border-blue-500/30 hover:border-blue-500 transition-all rounded-2xl p-6 text-center block cursor-pointer bg-[#07101F]/60">
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleJsonUpload(f)
                }}
                className="hidden"
              />
              <Layers className="w-8 h-8 mx-auto text-sky-400 mb-2" />
              <h4 className="text-sm font-bold text-white font-poppins">Select JSON Backup File</h4>
              <p className="text-xs text-slate-400 mt-1">Restores all 10 sections, customizations, and settings.</p>
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
