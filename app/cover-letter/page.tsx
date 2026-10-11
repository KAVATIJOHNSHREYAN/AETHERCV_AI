'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ParsedResume } from '@/lib/resume/types'
import { JobDetails, GeneratedCoverLetter, WritingTone } from '@/types/cover-letter'
import { ResumeSourcePicker } from '@/components/cover-letter/resume-source-picker'
import { JobDetailsForm } from '@/components/cover-letter/job-details-form'
import { CoverLetterLoadingAnimation } from '@/components/cover-letter/loading-animation'
import { CoverLetterEditor } from '@/components/cover-letter/cover-letter-editor'
import { CoverLetterHistoryModal } from '@/components/cover-letter/history-modal'
import { useCoverLetterHistory } from '@/hooks/cover-letter/use-cover-letter-history'
import { generateCoverLetterFromResumeAndJD } from '@/lib/cover-letter/generator'
import { Button } from '@/components/ui/button'
import {
  Sparkles, FileText, History, ArrowLeft, Send,
  ShieldCheck, Wand2, Briefcase, RefreshCw, AlertCircle
} from 'lucide-react'

export default function CoverLetterGeneratorPage() {
  // 1. Resume State
  const [analyzedResume, setAnalyzedResume] = useState<ParsedResume | null>(null)
  const [activeResume, setActiveResume] = useState<ParsedResume | null>(null)
  const [isUploadingResume, setIsUploadingResume] = useState(false)

  // 2. Job Details State
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    companyName: '',
    jobTitle: '',
    hiringManager: '',
    jobDescription: '',
    yearsOfExperience: '',
    location: '',
    employmentType: 'full-time',
    workplaceType: 'remote',
    tone: 'professional'
  })

  // 3. Generation & Editor State
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [currentLetter, setCurrentLetter] = useState<GeneratedCoverLetter | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // 4. History Hook
  const {
    history,
    saveRecord,
    deleteRecord,
    renameRecord,
    duplicateRecord
  } = useCoverLetterHistory()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Load existing parsed resume from session/storage if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem('aethercv_parsed_resume_v1')
      if (raw) {
        const parsed = JSON.parse(raw) as ParsedResume
        setAnalyzedResume(parsed)
        setActiveResume(parsed)
      }
    } catch (e) {
      console.warn('No cached resume found in local storage:', e)
    }
  }, [])

  // Handle uploading an alternative resume
  const handleUploadNewResume = async (file: File) => {
    setIsUploadingResume(true)
    setErrorMsg(null)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to parse resume document.')
      }

      const data = await res.json()
      if (data.resume) {
        setActiveResume(data.resume)
      } else {
        throw new Error('No resume data returned.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse document.')
    } finally {
      setIsUploadingResume(false)
    }
  }

  // Trigger Asynchronous Generation with Step Animation
  const handleGenerateCoverLetter = async () => {
    if (!activeResume) {
      setErrorMsg('Please select or upload a resume first.')
      return
    }
    if (!jobDetails.companyName.trim()) {
      setErrorMsg('Company Name is required.')
      return
    }
    if (!jobDetails.jobTitle.trim()) {
      setErrorMsg('Job Title is required.')
      return
    }
    if (!jobDetails.jobDescription.trim()) {
      setErrorMsg('Job Description is required so we can tailor the letter.')
      return
    }

    setErrorMsg(null)
    setIsGenerating(true)
    setLoadingStep(0)

    // Smooth multi-step progression
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < 4) return prev + 1
        return prev
      })
    }, 550)

    try {
      const res = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: activeResume, jobDetails })
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.error || 'Failed to generate cover letter.')
      }

      const data = await res.json()
      if (data.coverLetter) {
        clearInterval(interval)
        setLoadingStep(4)
        setTimeout(() => {
          setCurrentLetter(data.coverLetter)
          saveRecord(data.coverLetter)
          setIsGenerating(false)
        }, 500)
      }
    } catch (err: any) {
      clearInterval(interval)
      setIsGenerating(false)
      setErrorMsg(err.message || 'Generation failed. Please try again.')
    }
  }

  // Regenerate with specific tone
  const handleRegenerateWithTone = (tone: WritingTone) => {
    if (!activeResume) return
    const updatedDetails = { ...jobDetails, tone }
    setJobDetails(updatedDetails)
    const newLetter = generateCoverLetterFromResumeAndJD(activeResume, updatedDetails)
    setCurrentLetter(newLetter)
    saveRecord(newLetter)
  }

  // Length adjust
  const handleAdjustLength = (direction: 'shorter' | 'longer') => {
    if (!currentLetter) return
    let updatedText = currentLetter.fullPlainText
    if (direction === 'shorter') {
      // Condense opening and closing
      updatedText = updatedText
        .replace(/I am writing to express my enthusiastic interest in/g, 'I am excited to apply for')
        .replace(/Throughout my career, I have cultivated deep proficiencies/g, 'I have proven expertise')
    } else {
      // Elaborate
      updatedText = updatedText.replace(
        /Sincerely,/g,
        'I am eager to contribute to your team and look forward to the possibility of discussing this role in greater depth.\n\nSincerely,'
      )
    }
    setCurrentLetter({
      ...currentLetter,
      fullPlainText: updatedText
    })
  }

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 font-outfit selection:bg-[#4D48E6]/40 selection:text-white pt-24 pb-20 px-3 sm:px-6 relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#4D48E6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 right-1/4 w-96 h-96 bg-[#1E50DA]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Breadcrumb Navigation & Top Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/resume-analyzer"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to AI Resume Analyzer
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsHistoryOpen(true)}
            className="text-xs font-outfit border-blue-500/30 text-sky-200 hover:bg-blue-600/20 hover:text-white flex items-center gap-1.5 self-start sm:self-auto"
          >
            <History className="w-3.5 h-3.5" />
            Cover Letter History ({history.length})
          </Button>
        </div>

        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-blue-500/20">
          <div className="flex items-start gap-4">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4D48E6] via-[#2662EB] to-[#1E50DA] p-0.5 shadow-[0_0_25px_rgba(77,72,230,0.35)] shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#08111F] flex items-center justify-center overflow-hidden">
                <Image
                  src="/aethercv-logo.png"
                  alt="AETHERCV AI Emblem"
                  width={56}
                  height={56}
                  className="w-12 h-12 object-contain"
                  priority
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#4D48E6]/15 border border-[#4D48E6]/30 text-[#818cf8] text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Enterprise Cover Letter Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white tracking-tight">
                AI Cover Letter <span className="bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] bg-clip-text text-transparent">Generator</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-outfit">
                Generate highly tailored, recruiter-ready cover letters aligned with your verified resume, job description keywords, and selected tone—with strict zero-hallucination guarantees.
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-200 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading Step Overlay */}
        {isGenerating ? (
          <CoverLetterLoadingAnimation step={loadingStep} />
        ) : currentLetter ? (
          /* Live Editor Mode */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentLetter(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back to Job Details Form
              </Button>
              <Button
                size="sm"
                onClick={handleGenerateCoverLetter}
                className="text-xs bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] text-white"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Regenerate Full Letter
              </Button>
            </div>

            <CoverLetterEditor
              letter={currentLetter}
              onUpdateText={(txt) => {
                setCurrentLetter({ ...currentLetter, fullPlainText: txt })
              }}
              onRegenerateWithTone={handleRegenerateWithTone}
              onAdjustLength={handleAdjustLength}
            />
          </div>
        ) : (
          /* Input Configuration Mode */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Resume Selection & Guarantees (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                  <h3 className="text-sm font-bold font-poppins text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#818cf8]" />
                    Step 1: Select Resume Source
                  </h3>
                </div>

                <ResumeSourcePicker
                  analyzedResume={analyzedResume}
                  activeResume={activeResume}
                  onSelectResume={setActiveResume}
                  onUploadNewResume={handleUploadNewResume}
                  isUploading={isUploadingResume}
                />
              </div>

              {/* Zero Hallucination Guarantee Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#4D48E6]/10 to-[#1E50DA]/10 border border-[#4D48E6]/25 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold font-poppins text-white">
                  <ShieldCheck className="w-4 h-4 text-[#818cf8]" />
                  Verified Zero-Hallucination Guard
                </div>
                <p className="text-[11px] text-slate-300 font-outfit leading-relaxed">
                  Unlike generic AI chatbots that invent fake past employers or fabricated metric percentages, AETHERCV AI strictly grounds every sentence in your verified resume and the job requisition.
                </p>
                <ul className="text-[11px] text-slate-400 font-outfit space-y-1">
                  <li>• Only references companies and projects you actually worked on</li>
                  <li>• Naturally weaves in matched competencies from the target JD</li>
                  <li>• Formats cleanly for immediate export to PDF or DOCX</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Job Details & Tone Selection (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-7 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                  <h3 className="text-sm font-bold font-poppins text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#818cf8]" />
                    Step 2: Job Requisition &amp; Style Tone
                  </h3>
                </div>

                <JobDetailsForm
                  jobDetails={jobDetails}
                  onChange={setJobDetails}
                />

                <div className="pt-4 border-t border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-[11px] text-slate-400 font-outfit">
                    * Required fields for tailored matching
                  </span>

                  <Button
                    onClick={handleGenerateCoverLetter}
                    disabled={isGenerating || !activeResume}
                    className="gap-2 font-outfit text-xs bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] hover:opacity-95 text-white shadow-[0_0_20px_rgba(77,72,230,0.4)] transition-all hover:scale-[1.02] py-5 px-6"
                  >
                    <Wand2 className="w-4 h-4" />
                    Generate Tailored Cover Letter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        <CoverLetterHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          records={history}
          onSelectRecord={(rec) => setCurrentLetter(rec.letter)}
          onDeleteRecord={deleteRecord}
          onDuplicateRecord={duplicateRecord}
          onRenameRecord={renameRecord}
        />
      </div>
    </div>
  )
}
