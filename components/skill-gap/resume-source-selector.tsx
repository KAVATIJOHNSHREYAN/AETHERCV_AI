'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ResumeInputMode } from '@/types/skill-gap'
import { extractTextFromPdfInBrowser, extractTextFromDocxInBrowser } from '@/lib/resume/client-pdf-extractor'
import { defaultResumeData } from '@/lib/resume-builder/default-data'
import {
  Upload,
  FileText,
  Sparkles,
  ClipboardPaste,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  RefreshCw
} from 'lucide-react'

interface ResumeSourceSelectorProps {
  mode: ResumeInputMode
  onModeChange: (mode: ResumeInputMode) => void
  resumeText: string
  onResumeTextChange: (text: string, fileName?: string) => void
  fileName: string
}

export function ResumeSourceSelector({
  mode,
  onModeChange,
  resumeText,
  onResumeTextChange,
  fileName
}: ResumeSourceSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractError, setExtractError] = useState<string | null>(null)
  const [hasBuilderData, setHasBuilderData] = useState(false)
  const [hasAnalyzerData, setHasAnalyzerData] = useState(false)

  // Check availability of local resume builder / analyzer items on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const savedBuilder = localStorage.getItem('aethercv_ats_manual_saved_resume_v1')
      setHasBuilderData(Boolean(savedBuilder) || Boolean(defaultResumeData))

      const savedAnalyzer = localStorage.getItem('resumeAnalysisHistory')
      setHasAnalyzerData(Boolean(savedAnalyzer))
    } catch {
      // Ignore storage errors
    }
  }, [])

  // Handle file drop / upload
  const handleFileUpload = async (file: File) => {
    if (!file) return
    setIsExtracting(true)
    setExtractError(null)

    try {
      let extracted = ''
      const name = file.name.toLowerCase()

      if (name.endsWith('.pdf')) {
        extracted = await extractTextFromPdfInBrowser(file)
      } else if (name.endsWith('.docx')) {
        extracted = await extractTextFromDocxInBrowser(file)
      } else if (name.endsWith('.txt')) {
        extracted = await file.text()
      } else {
        throw new Error('Unsupported file format. Please upload .PDF, .DOCX, or .TXT.')
      }

      if (!extracted || extracted.trim().length < 40) {
        throw new Error('Unable to extract sufficient text from file. Please paste your text or upload a standard text PDF.')
      }

      onResumeTextChange(extracted, file.name)
    } catch (err: any) {
      setExtractError(err.message || 'Failed to parse file text.')
    } finally {
      setIsExtracting(false)
    }
  }

  // Converts Resume Builder JSON into structured resume text
  const loadFromResumeBuilder = () => {
    try {
      let resumeObj = defaultResumeData
      const saved = localStorage.getItem('aethercv_ats_manual_saved_resume_v1')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed && parsed.data) {
            resumeObj = parsed.data
          } else if (parsed && parsed.personalInfo) {
            resumeObj = parsed
          }
        } catch {
          // Fall back to default
        }
      }

      const p = resumeObj.personalInfo || {}
      const sections: string[] = [
        `${p.fullName || 'Candidate'}\n${p.email || ''} | ${p.phone || ''} | ${p.location || ''} | ${p.linkedin || ''} | ${p.github || ''}`,
        `SUMMARY\n${p.summary || ''}`,
        `EXPERIENCE\n` +
          (resumeObj.experience || [])
            .map(
              (e: any) =>
                `${e.role || ''} at ${e.company || ''} (${e.duration || ''})\n${e.description || (e.bullets ? e.bullets.join('\n') : '')}`
            )
            .join('\n\n'),
        `EDUCATION\n` +
          (resumeObj.education || [])
            .map((ed: any) => `${ed.degree || ''} - ${ed.school || ''} (${ed.year || ''})`)
            .join('\n'),
        `SKILLS\n` +
          (Array.isArray(resumeObj.skills)
            ? resumeObj.skills.map((s: any) => (typeof s === 'string' ? s : `${s.category}: ${s.items?.join(', ')}`)).join('\n')
            : ''),
        `PROJECTS\n` +
          (resumeObj.projects || [])
            .map(
              (pr: any) =>
                `${pr.name || pr.title || ''} (${pr.technologies || pr.techStack || ''})\n${pr.description || (pr.bullets ? pr.bullets.join('\n') : '')}`
            )
            .join('\n\n')
      ]

      const text = sections.filter(Boolean).join('\n\n')
      onResumeTextChange(text, 'ResumeBuilder_Resume.txt')
      onModeChange('builder')
    } catch (err: any) {
      setExtractError('Could not sync with Resume Builder: ' + err.message)
    }
  }

  // Load from Resume Analyzer history
  const loadFromResumeAnalyzer = () => {
    try {
      const historyStr = localStorage.getItem('resumeAnalysisHistory')
      if (!historyStr) {
        throw new Error('No analyzed resumes found in your local history. Please upload or paste a resume.')
      }

      const history = JSON.parse(historyStr)
      if (!Array.isArray(history) || history.length === 0) {
        throw new Error('No previous analysis history available.')
      }

      const latest = history[0]
      const textToUse = latest.rawText || latest.extractedText || latest.data?.extractedText || ''

      if (!textToUse || textToUse.length < 50) {
        throw new Error('Previous analysis did not store full resume text. Please upload or paste directly.')
      }

      onResumeTextChange(textToUse, latest.fileName || 'Analyzed_Resume.txt')
      onModeChange('analyzer')
    } catch (err: any) {
      setExtractError(err.message)
    }
  }

  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Step 1: Provide Your Resume
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose your preferred resume input source for intelligent ATS skill extraction.
          </p>
        </div>
        {resumeText && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready ({resumeText.length} chars)</span>
          </div>
        )}
      </div>

      {/* Tabs / Mode Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
        <button
          type="button"
          onClick={() => {
            onModeChange('upload')
            setExtractError(null)
          }}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            mode === 'upload'
              ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </button>

        <button
          type="button"
          onClick={() => {
            loadFromResumeBuilder()
          }}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            mode === 'builder'
              ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Resume Builder</span>
        </button>

        <button
          type="button"
          onClick={() => {
            loadFromResumeAnalyzer()
          }}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            mode === 'analyzer'
              ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400 shadow-md shadow-cyan-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Resume Analyzer</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onModeChange('paste')
            setExtractError(null)
          }}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            mode === 'paste'
              ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ClipboardPaste className="w-4 h-4" />
          <span>Paste Text</span>
        </button>
      </div>

      {/* Mode 1: File Upload */}
      {mode === 'upload' && (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0])
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`group cursor-pointer border-2 border-dashed rounded-xl p-7 text-center transition-all ${
            fileName
              ? 'border-blue-500/60 bg-blue-950/20'
              : 'border-slate-700/80 hover:border-blue-500/50 bg-slate-950/40 hover:bg-slate-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0])
              }
            }}
          />

          {isExtracting ? (
            <div className="flex flex-col items-center justify-center py-4">
              <RefreshCw className="w-9 h-9 text-blue-400 animate-spin mb-3" />
              <p className="text-sm font-semibold text-white">Extracting text from document...</p>
              <p className="text-xs text-slate-400 mt-1">Parsing sections with client-side OCR engine</p>
            </div>
          ) : fileName ? (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">{fileName}</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Extracted successfully ({resumeText.length} characters)
              </p>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="mt-3 text-xs text-slate-400 hover:text-blue-400 underline"
              >
                Choose a different file
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/40 transition-colors mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Click or drag & drop your resume here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports <strong className="text-slate-300">.PDF</strong>,{' '}
                <strong className="text-slate-300">.DOCX</strong>, and{' '}
                <strong className="text-slate-300">.TXT</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Resume Builder Sync */}
      {mode === 'builder' && (
        <div className="border border-blue-500/30 bg-blue-950/20 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Synced with Resume Builder</h4>
                <button
                  type="button"
                  onClick={loadFromResumeBuilder}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Re-sync
                </button>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Imported structured profile, experience, projects, and skills directly from your Resume Builder workspace.
              </p>
              <div className="mt-3 text-xs text-blue-300 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 max-h-24 overflow-y-auto">
                {resumeText.substring(0, 240)}...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Resume Analyzer Sync */}
      {mode === 'analyzer' && (
        <div className="border border-cyan-500/30 bg-cyan-950/20 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Imported from Resume Analyzer</h4>
                <button
                  type="button"
                  onClick={loadFromResumeAnalyzer}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reload
                </button>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Extracted resume text from your most recent ATS Resume Analyzer session.
              </p>
              <div className="mt-3 text-xs text-cyan-300 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 max-h-24 overflow-y-auto">
                {resumeText.substring(0, 240)}...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 4: Paste Resume Text */}
      {mode === 'paste' && (
        <div>
          <textarea
            rows={7}
            value={resumeText}
            onChange={e => onResumeTextChange(e.target.value, 'Pasted_Resume.txt')}
            placeholder="Paste your complete resume text here (Summary, Work Experience, Education, Technical Skills, Projects)..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono leading-relaxed"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5 px-1">
            <span>Minimum 50 characters required</span>
            <span>{resumeText.length} characters</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {extractError && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{extractError}</span>
        </div>
      )}
    </div>
  )
}
