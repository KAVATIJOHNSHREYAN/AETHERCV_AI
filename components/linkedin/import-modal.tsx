'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  FileText,
  Upload,
  Sparkles,
  Clipboard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Edit3
} from 'lucide-react'
import { LinkedInProfileData } from '@/types/linkedin'
import { convertResumeToLinkedIn, parsePastedLinkedInText } from '@/lib/linkedin/import-export'
import { extractTextFromPdfInBrowser, extractTextFromDocxInBrowser } from '@/lib/resume/client-pdf-extractor'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: Partial<LinkedInProfileData>) => void
}

type TabType = 'paste' | 'upload' | 'resume-builder' | 'manual'

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('resume-builder')
  const [pastedText, setPastedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Resume builder data detection
  const [hasResumeData, setHasResumeData] = useState(false)
  const [resumeSummary, setResumeSummary] = useState<{
    name: string
    title: string
    expCount: number
    skillsCount: number
  } | null>(null)

  useEffect(() => {
    if (isOpen) {
      checkStoredResume()
    }
  }, [isOpen])

  const checkStoredResume = () => {
    try {
      const stored =
        localStorage.getItem('aethercv_ats_active_resume_v2') ||
        localStorage.getItem('aethercv_active_resume')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.personalInfo?.firstName || parsed?.personalInfo?.professionalTitle) {
          setHasResumeData(true)
          setResumeSummary({
            name: `${parsed.personalInfo.firstName || ''} ${parsed.personalInfo.lastName || ''}`.trim() || 'Active Candidate',
            title: parsed.personalInfo.professionalTitle || 'Software Engineer',
            expCount: parsed.experience?.length || 0,
            skillsCount: (parsed.skills || []).flatMap((s: any) => s.skills || []).length || 0
          })
          return
        }
      }
    } catch {
      // ignore
    }
    setHasResumeData(false)
  }

  if (!isOpen) return null

  // Tab 1: Paste Handler
  const handleParsePasted = () => {
    if (!pastedText.trim()) {
      setErrorMsg('Please paste your LinkedIn profile text or bio.')
      return
    }
    setIsProcessing(true)
    setErrorMsg(null)
    try {
      const parsed = parsePastedLinkedInText(pastedText)
      onImport(parsed)
      setSuccessMsg('LinkedIn profile text extracted and imported successfully!')
      setTimeout(() => {
        onClose()
      }, 700)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to parse profile text.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Tab 2: Upload Resume Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      let extractedText = ''
      const isPdf = file.name.endsWith('.pdf') || file.type.includes('pdf')
      const isDocx = file.name.endsWith('.docx')

      if (isPdf) {
        extractedText = await extractTextFromPdfInBrowser(file)
      } else if (isDocx) {
        extractedText = await extractTextFromDocxInBrowser(file)
      } else {
        extractedText = await file.text()
      }

      if (!extractedText || extractedText.length < 50) {
        throw new Error('Document content could not be read. Please upload a valid text-readable resume.')
      }

      const parsed = parsePastedLinkedInText(extractedText)
      onImport(parsed)
      setSuccessMsg(`Extracted ${extractedText.length} characters from ${file.name}. Profile imported!`)
      setTimeout(() => {
        onClose()
      }, 800)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error processing resume file.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Tab 3: Resume Builder Direct Import
  const handleImportFromBuilder = () => {
    setIsProcessing(true)
    setErrorMsg(null)
    try {
      const stored =
        localStorage.getItem('aethercv_ats_active_resume_v2') ||
        localStorage.getItem('aethercv_active_resume')
      if (!stored) {
        throw new Error('No active resume found in AI Resume Builder. Create one first or paste text.')
      }
      const parsed = JSON.parse(stored)
      const linkedInData = convertResumeToLinkedIn(parsed)
      onImport(linkedInData)
      setSuccessMsg('Successfully synchronized resume data into LinkedIn Optimizer!')
      setTimeout(() => {
        onClose()
      }, 700)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to import from Resume Builder.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Tab 4: Manual Starter
  const handleManualReset = () => {
    onImport({
      fullName: 'Alex Johnson',
      headline: 'Software Engineer | Distributed Systems & Cloud Platforms',
      about: 'Experienced software engineer focused on building resilient high-throughput cloud architectures.',
      skills: ['TypeScript', 'Node.js', 'React', 'AWS', 'Docker', 'PostgreSQL']
    })
    setSuccessMsg('Starter profile created. You can now edit each section manually!')
    setTimeout(() => {
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0B1528] border border-blue-500/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#07101F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Import Profile or Resume</h2>
              <p className="text-xs text-slate-400">Choose an input method to instantly generate your optimized LinkedIn profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#0A1322] px-4 pt-2 gap-2 overflow-x-auto">
          {[
            { id: 'resume-builder', label: 'Import from Resume Builder', icon: Sparkles, badge: hasResumeData ? 'Detected' : null },
            { id: 'paste', label: 'Paste Profile Text', icon: Clipboard },
            { id: 'upload', label: 'Upload Resume (PDF/DOCX)', icon: Upload },
            { id: 'manual', label: 'Manual Starter', icon: Edit3 }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType)
                  setErrorMsg(null)
                  setSuccessMsg(null)
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Status alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Tab: Resume Builder */}
          {activeTab === 'resume-builder' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 to-indigo-950/30 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white">Instant 1-Click Resume Synchronization</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Automatically transfer your professional summary, verified experience, metrics, projects, and skills from the AI Resume Builder into LinkedIn format.
                    </p>
                  </div>
                </div>

                {hasResumeData && resumeSummary ? (
                  <div className="mt-4 p-3 rounded-lg bg-[#07101F]/80 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active Resume Detected
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">localStorage</span>
                    </div>
                    <div className="text-xs text-slate-200 font-medium">
                      {resumeSummary.name} • <span className="text-blue-300">{resumeSummary.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>• {resumeSummary.expCount} Experience Entries</span>
                      <span>• {resumeSummary.skillsCount} Skills</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    No active resume saved in your browser yet. You can paste your profile text or create a resume in the AI Resume Builder first.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportFromBuilder}
                  disabled={isProcessing || !hasResumeData}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <span>Import Active Resume</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Tab: Paste Profile Text */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Paste LinkedIn Profile Text or Bio
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Copy-paste your current headline, About section, or full profile text directly from LinkedIn.
                </p>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Example:&#10;Alex Johnson&#10;Senior Full Stack Engineer at TechCorp | React, TypeScript, Cloud Architect&#10;&#10;About&#10;Passionate engineer with 6+ years designing high-throughput web applications and scalable cloud backends..."
                  rows={8}
                  className="w-full p-3 rounded-xl bg-[#07101F] border border-white/10 text-slate-200 text-xs focus:border-blue-500 focus:outline-none transition font-mono resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  {pastedText.length} characters entered
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleParsePasted}
                    disabled={isProcessing || !pastedText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Parsing...</span>
                      </>
                    ) : (
                      <>
                        <span>Extract & Optimize</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Upload Resume (PDF / DOCX) */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="block p-8 border-2 border-dashed border-blue-500/30 hover:border-blue-400/60 rounded-2xl bg-[#07101F]/70 text-center cursor-pointer transition group">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isProcessing}
                />
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                  {isProcessing ? (
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  {isProcessing ? 'Analyzing Document Text...' : 'Click to Upload Resume'}
                </div>
                <p className="text-xs text-slate-400">
                  Supports PDF, DOCX, and TXT (Client-Side Parsing 100% Private)
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[11px] font-medium border border-blue-500/20">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Converts resume bullets into LinkedIn sections</span>
                </div>
              </label>

              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tab: Manual Starter */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#07101F] border border-white/10 space-y-2">
                <h3 className="text-sm font-semibold text-white">Start With a Clean Template</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Start with a recruiter-friendly pre-formatted starter template. You can manually edit your headline, About section, experience metrics, projects, and skills with AI assistance at each step.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualReset}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <span>Load Starter Template</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
