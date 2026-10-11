'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ParsedResume,
  AtsScoreBreakdown,
  FormattingAnalysisResult,
  ActionVerbAnalysisResult,
  KeywordAnalysisResult,
  SectionDetectionResult,
  AIFeedbackReport,
  ResumeAnalysisHistoryItem
} from '@/lib/resume/types'
import { parseRawResume, extractSections, detectSectionsStatus } from '@/lib/resume/parser'
import { analyzeFormatting } from '@/lib/resume/formatting-analyzer'
import { analyzeActionVerbs } from '@/lib/resume/action-verb-analyzer'
import { analyzeKeywords } from '@/lib/resume/keyword-analyzer'
import { calculateAtsScore } from '@/lib/resume/ats-engine'
import { generateAIFeedback } from '@/lib/resume/ai-engine'
import { extractTextFromPdfInBrowser, extractTextFromDocxInBrowser } from '@/lib/resume/client-pdf-extractor'
import { validateIsResume } from '@/lib/resume/validator'
import { SAMPLE_RESUMES } from '@/lib/resume/sample-resumes'

// Components
import { ResumeUploadZone } from '@/components/resume/resume-upload-zone'
import { AtsCircularScore } from '@/components/resume/ats-circular-score'
import { CategoryBreakdown } from '@/components/resume/category-breakdown'
import { SectionAuditView } from '@/components/resume/section-audit-view'
import { SkillsRadarView } from '@/components/resume/skills-radar-view'
import { KeywordsActionsView } from '@/components/resume/keywords-actions-view'
import { ProjectExperienceView } from '@/components/resume/project-experience-view'
import { AIFeedbackView } from '@/components/resume/ai-feedback-view'
import { JdMatcherView } from '@/components/resume/jd-matcher-view'
import { AiRewriterView } from '@/components/resume/ai-rewriter-view'
import { ResumeHistoryDrawer } from '@/components/resume/resume-history-drawer'
import { ExportReportModal } from '@/components/resume/export-report-modal'
import { AiScanningOverlay } from '@/components/resume/ai-scanning-overlay'
import { Button } from '@/components/ui/button'

import {
  Sparkles, History, Download, RefreshCw, BarChart3, Cpu,
  CheckCircle2, Target, Edit3, Code2, ArrowLeft, ShieldCheck,
  Award, FileText, Check
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ResumeAnalyzerPage() {
  const [analysisData, setAnalysisData] = useState<{
    fileName: string
    fileSize: number
    fileType: string
    timestamp: string
    parsedData: ParsedResume
    atsBreakdown: AtsScoreBreakdown
    formatting: FormattingAnalysisResult
    actionVerbs: ActionVerbAnalysisResult
    keywords: KeywordAnalysisResult
    sectionsDetection: SectionDetectionResult
    aiFeedback: AIFeedbackReport
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'sections' | 'feedback' | 'matcher' | 'rewriter' | 'json'>('overview')
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [history, setHistory] = useState<ResumeAnalysisHistoryItem[]>([])

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('resumeAnalysisHistory')
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load resume history:', e)
    }
  }, [])

  // Auto-save history item
  const saveToHistory = (item: ResumeAnalysisHistoryItem) => {
    try {
      const updated = [item, ...history.filter(h => h.id !== item.id)].slice(0, 15)
      setHistory(updated)
      localStorage.setItem('resumeAnalysisHistory', JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to persist history:', e)
    }
  }

  const handleClearHistory = () => {
    setHistory([])
    localStorage.removeItem('resumeAnalysisHistory')
  }

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter(h => h.id !== id)
    setHistory(updated)
    localStorage.setItem('resumeAnalysisHistory', JSON.stringify(updated))
  }

  // Load analysis from history
  const handleSelectHistoryItem = (item: ResumeAnalysisHistoryItem) => {
    const sectionsRaw = extractSections(item.parsedData.rawText)
    const sectionsDetection = detectSectionsStatus(sectionsRaw)
    const actionVerbs = analyzeActionVerbs(item.parsedData.rawText)
    const keywords = analyzeKeywords(item.parsedData.rawText, item.parsedData.rawSkillsList)

    setAnalysisData({
      fileName: item.fileName,
      fileSize: item.fileSize,
      fileType: item.fileType,
      timestamp: item.timestamp,
      parsedData: item.parsedData,
      atsBreakdown: item.atsBreakdown,
      formatting: item.formatting,
      actionVerbs,
      keywords,
      sectionsDetection,
      aiFeedback: item.aiFeedback
    })
    setActiveTab('overview')
  }

  // Core Analysis Handler
  const handleAnalyze = async (file: File | null, textContent: string, fileName: string) => {
    setIsLoading(true)

    try {
      let resultData: any = null

      // 1. Client-Side Document Extraction Pre-Flight:
      // If a PDF file was uploaded and textContent is empty, extract text in browser via PDF.js!
      if (file && (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') && !textContent) {
        try {
          console.log('[Resume Analyzer] Extracting PDF text in browser via PDF.js...')
          const extractedPdf = await extractTextFromPdfInBrowser(file)
          if (extractedPdf && extractedPdf.trim().length > 20) {
            textContent = extractedPdf.trim()
            console.log(`[Resume Analyzer] Browser extracted ${textContent.length} characters from PDF.`)
          }
        } catch (pdfErr) {
          console.warn('[Resume Analyzer] Browser PDF extraction note:', pdfErr)
        }
      }

      // If a DOCX file was uploaded and textContent is empty, attempt client-side DOCX extraction
      if (file && (file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc')) && !textContent) {
        try {
          console.log('[Resume Analyzer] Extracting DOCX text in browser...')
          const extractedDocx = await extractTextFromDocxInBrowser(file)
          if (extractedDocx && extractedDocx.trim().length > 20) {
            textContent = extractedDocx.trim()
            console.log(`[Resume Analyzer] Browser extracted ${textContent.length} characters from DOCX.`)
          }
        } catch (docxErr) {
          console.warn('[Resume Analyzer] Browser DOCX extraction note:', docxErr)
        }
      }

      // If plain text file (.txt, .md)
      if (file && (file.name.endsWith('.txt') || file.name.endsWith('.md')) && !textContent) {
        try {
          textContent = await file.text()
        } catch (readErr) {
          console.warn('Failed to read text file on client:', readErr)
        }
      }

      // 2. Authenticity Pre-Flight Validation
      if (textContent) {
        const validation = validateIsResume(textContent, fileName || file?.name || '')
        if (!validation.isValid) {
          console.warn('[Resume Analyzer] Document failed authenticity check:', validation.reason)
          throw new Error(validation.reason)
        }
      }

      // 3. Server API Route Call:
      // If we have textContent, send text! If not, send file.
      if (file || textContent) {
        try {
          const formData = new FormData()
          if (textContent) {
            formData.append('text', textContent)
            formData.append('fileName', fileName || file?.name || 'resume.pdf')
          } else if (file) {
            formData.append('file', file)
          }

          const res = await fetch('/api/resume/parse', {
            method: 'POST',
            body: formData
          })

          if (res.ok) {
            const json = await res.json()
            if (json.success) {
              resultData = json
            }
          } else {
            const errData = await res.json().catch(() => null)
            const errorMsg = errData?.error || `Server responded with status ${res.status}`
            console.warn('[Resume Analyzer] Server error during parse:', errorMsg)
            // If the document is specifically rejected as non-resume, throw immediately!
            if (errData?.stage === 'resume_authenticity_check' || errData?.validation?.isValid === false) {
              throw new Error(errorMsg)
            }
            // If we already have textContent, do NOT throw, we will process it locally!
            if (!textContent) {
              throw new Error(errorMsg)
            }
          }
        } catch (apiErr: any) {
          console.warn('[Resume Analyzer] API route call failed:', apiErr.message)
          // If this is an authenticity rejection, always bubble up
          if (apiErr.message.includes('not a resume') || apiErr.message.includes('assignment') || apiErr.message.includes('homework')) {
            throw apiErr
          }
          // If we have textContent, we fall through to the self-contained local pipeline below
          if (!textContent) {
            throw apiErr
          }
        }
      }

      // 4. Client-Side Self-Contained Engine Execution:
      // If API route was skipped or returned direct text, run self-contained local pipeline
      if (!resultData && textContent) {
        const validation = validateIsResume(textContent, fileName || file?.name || '')
        if (!validation.isValid) {
          throw new Error(validation.reason)
        }

        const parsedData = parseRawResume(textContent)
        const formatting = analyzeFormatting(textContent)
        const actionVerbs = analyzeActionVerbs(textContent)
        const keywords = analyzeKeywords(textContent, parsedData.rawSkillsList)
        const atsBreakdown = calculateAtsScore(parsedData, formatting, actionVerbs, keywords)
        const aiFeedback = generateAIFeedback(parsedData, atsBreakdown)
        const sectionsRaw = extractSections(textContent)
        const sectionsDetection = detectSectionsStatus(sectionsRaw)

        resultData = {
          meta: {
            fileName,
            fileSize: Buffer.byteLength(textContent, 'utf-8'),
            fileType: 'text/plain',
            timestamp: new Date().toISOString()
          },
          parsedData,
          atsBreakdown,
          formatting,
          actionVerbs,
          keywords,
          sectionsDetection,
          aiFeedback
        }
      }

      if (!resultData) {
        throw new Error('Unable to extract text from document. Please ensure the document contains readable text.')
      }

      const newAnalysis = {
        fileName: resultData.meta.fileName,
        fileSize: resultData.meta.fileSize,
        fileType: resultData.meta.fileType,
        timestamp: resultData.meta.timestamp,
        parsedData: resultData.parsedData,
        atsBreakdown: resultData.atsBreakdown,
        formatting: resultData.formatting,
        actionVerbs: resultData.actionVerbs,
        keywords: resultData.keywords,
        sectionsDetection: resultData.sectionsDetection,
        aiFeedback: resultData.aiFeedback
      }

      setAnalysisData(newAnalysis)

      // Save to History
      const historyItem: ResumeAnalysisHistoryItem = {
        id: `analysis-${Date.now()}`,
        fileName: newAnalysis.fileName,
        fileSize: newAnalysis.fileSize,
        fileType: newAnalysis.fileType,
        timestamp: newAnalysis.timestamp,
        candidateName: newAnalysis.parsedData.contact.name || 'Candidate',
        atsScore: newAnalysis.atsBreakdown.overallScore,
        parsedData: newAnalysis.parsedData,
        atsBreakdown: newAnalysis.atsBreakdown,
        aiFeedback: newAnalysis.aiFeedback,
        formatting: newAnalysis.formatting
      }
      saveToHistory(historyItem)
    } finally {
      setIsLoading(false)
    }
  }

  // Allow clean start for real user resume uploads

  const navTabs = [
    { id: 'overview' as const, label: 'ATS Overview', icon: BarChart3 },
    { id: 'skills' as const, label: 'Skills & Keywords', icon: Cpu },
    { id: 'sections' as const, label: 'Sections & Projects', icon: CheckCircle2 },
    { id: 'feedback' as const, label: 'AI Review & Rewrites', icon: Sparkles },
    { id: 'matcher' as const, label: 'Job Matcher', icon: Target },
    { id: 'rewriter' as const, label: 'Rewriter Studio', icon: Edit3 },
    { id: 'json' as const, label: 'Structured JSON', icon: Code2 }
  ]

  return (
    <div className="min-h-screen bg-[#08111F] text-slate-100 py-4 sm:py-8 px-2 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Premium AI Glowing Ambient Background */}
      <div className="absolute top-[-100px] left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-100px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-100px] w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none -z-10" />

      {/* History Drawer */}
      <ResumeHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistoryItem}
        onClear={handleClearHistory}
        onDelete={handleDeleteHistoryItem}
      />

      {/* Export Report Modal */}
      {analysisData && (
        <ExportReportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          resume={analysisData.parsedData}
          atsBreakdown={analysisData.atsBreakdown}
          aiFeedback={analysisData.aiFeedback}
          formatting={analysisData.formatting}
        />
      )}

      {/* AI Scanning Animation Overlay */}
      <AiScanningOverlay isLoading={isLoading} />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-blue-500/20">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden border border-blue-400/40 shadow-[0_0_25px_rgba(59,130,246,0.4)] bg-[#0F172A]/90 p-1 group hover:scale-105 transition-transform">
              <Image
                src="/aethercv-logo.png"
                alt="AETHERCV AI Emblem"
                width={80}
                height={80}
                className="w-full h-full object-contain rounded-xl"
                priority
              />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-300 border border-blue-500/30 backdrop-blur-md shadow-[0_0_15px_-3px_rgba(59,130,246,0.25)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Enterprise AI Resume Intelligence</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-poppins tracking-tight text-white">
                AI Resume <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300">Analyzer</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 font-outfit max-w-2xl leading-relaxed">
                Upload your resume for instant rule-based ATS scoring (100 pts), 8-cluster skill taxonomy categorization, action verb audits, recruiter simulation, and job description alignment.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsHistoryOpen(true)}
              className="gap-2 font-outfit text-xs bg-[#0F172A]/80 border-blue-500/30 text-sky-200 hover:bg-blue-600/20 hover:border-blue-400/50 hover:text-white transition-all shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]"
            >
              <History className="w-4 h-4 text-sky-400" />
              <span>History ({history.length})</span>
            </Button>

            {analysisData && (
              <Button
                size="sm"
                onClick={() => setIsExportOpen(true)}
                className="gap-2 font-outfit text-xs bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] hover:from-[#3b37b3] hover:to-[#1e50da] text-white shadow-[0_0_20px_rgba(77,72,230,0.5)] transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                <span>Export Reports</span>
              </Button>
            )}
          </div>
        </div>

        {/* Upload Zone */}
        <ResumeUploadZone onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Analysis Dashboard Section */}
        {analysisData && (
          <div className="space-y-8 pt-4">
            {/* Candidate Quick Info Card */}
            <div className="p-6 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_30px_-5px_rgba(30,80,218,0.2)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4D48E6] via-[#2662EB] to-[#1E50DA] text-white flex items-center justify-center font-bold text-xl font-poppins shadow-[0_0_20px_-3px_rgba(77,72,230,0.6)]">
                  {(analysisData.parsedData.contact.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-poppins text-white flex items-center gap-2">
                    {analysisData.parsedData.contact.name || 'Candidate Profile'}
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#4D48E6]/15 text-[#818cf8] border border-[#4D48E6]/40 shadow-[0_0_10px_rgba(77,72,230,0.25)]">
                      Verified Scan
                    </span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-outfit mt-1">
                    {analysisData.parsedData.contact.email && (
                      <span className="text-slate-300">{analysisData.parsedData.contact.email}</span>
                    )}
                    {analysisData.parsedData.contact.phone && (
                      <>
                        <span className="text-blue-500">•</span>
                        <span className="text-slate-300">{analysisData.parsedData.contact.phone}</span>
                      </>
                    )}
                    <span className="text-blue-500">•</span>
                    <span className="font-mono text-blue-300">{analysisData.fileName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnalysisData(null)}
                  className="gap-1.5 text-xs font-outfit bg-[#0F172A] border-blue-500/30 text-blue-200 hover:bg-[#4D48E6]/20 hover:border-[#4D48E6]/50 hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#818cf8]" />
                  Analyze Another Resume
                </Button>

                <Button
                  size="sm"
                  onClick={() => setIsExportOpen(true)}
                  className="gap-1.5 text-xs font-outfit bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] hover:from-[#3b37b3] hover:to-[#1e50da] text-white shadow-[0_0_15px_rgba(77,72,230,0.45)]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Package
                </Button>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-blue-500/20 pb-3">
              {navTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] text-white shadow-[0_0_15px_rgba(77,72,230,0.5)] border border-[#818cf8]/50'
                        : 'bg-[#0F172A]/70 hover:bg-[#1E293B] text-slate-300 hover:text-white border border-blue-500/20'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#818cf8]'}`} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Tab Panels */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  <div className="lg:col-span-1 space-y-6">
                    <AtsCircularScore breakdown={analysisData.atsBreakdown} />

                    {/* Quick Formatting Health Card */}
                    <div className="p-5 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_25px_-5px_rgba(37,99,235,0.15)] space-y-3">
                      <h4 className="text-sm font-bold font-poppins text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-sky-400" />
                        Formatting &amp; Readability Index
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#0B132B]/80 border border-blue-500/15">
                          <span className="text-slate-400 block text-[11px]">Word Count</span>
                          <span className="font-bold text-white">{analysisData.formatting.wordCount} words</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#0B132B]/80 border border-blue-500/15">
                          <span className="text-slate-400 block text-[11px]">Length</span>
                          <span className="font-bold text-white">~{analysisData.formatting.estimatedPages} pages</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#0B132B]/80 border border-blue-500/15">
                          <span className="text-slate-400 block text-[11px]">Reading Ease</span>
                          <span className="font-bold text-cyan-400">
                            {analysisData.formatting.fleschReadingEase}/100
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#0B132B]/80 border border-blue-500/15">
                          <span className="text-slate-400 block text-[11px]">Bullet Points</span>
                          <span className="font-bold text-white">{analysisData.formatting.bulletPointCount}</span>
                        </div>
                      </div>
                      {analysisData.formatting.warnings.length > 0 && (
                        <div className="pt-2 text-[11px] text-sky-300 font-outfit flex items-center gap-1.5">
                          <span className="text-sky-400">ℹ</span> {analysisData.formatting.warnings[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <CategoryBreakdown breakdown={analysisData.atsBreakdown} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <SkillsRadarView
                    skills={analysisData.parsedData.skills}
                    totalSkillsCount={analysisData.parsedData.rawSkillsList.length}
                  />
                  <KeywordsActionsView
                    keywords={analysisData.keywords}
                    actionVerbs={analysisData.actionVerbs}
                  />
                </motion.div>
              )}

              {activeTab === 'sections' && (
                <motion.div
                  key="sections"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <SectionAuditView sectionsDetection={analysisData.sectionsDetection} />
                  <ProjectExperienceView resume={analysisData.parsedData} />
                </motion.div>
              )}

              {activeTab === 'feedback' && (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <AIFeedbackView aiFeedback={analysisData.aiFeedback} />
                </motion.div>
              )}

              {activeTab === 'matcher' && (
                <motion.div
                  key="matcher"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <JdMatcherView resume={analysisData.parsedData} />
                </motion.div>
              )}

              {activeTab === 'rewriter' && (
                <motion.div
                  key="rewriter"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <AiRewriterView resume={analysisData.parsedData} />
                </motion.div>
              )}

              {activeTab === 'json' && (
                <motion.div
                  key="json"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 rounded-2xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_25px_-5px_rgba(37,99,235,0.15)] space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
                    <h3 className="text-sm font-bold font-poppins text-white flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-cyan-400" />
                      Structured Parsed Resume JSON
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(analysisData.parsedData, null, 2))
                      }}
                      className="text-xs font-outfit bg-[#0B132B] border-blue-500/30 text-sky-200 hover:bg-blue-600/20 hover:text-white"
                    >
                      Copy JSON
                    </Button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#08111F] border border-blue-500/20 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed shadow-inner">
                    {JSON.stringify(analysisData.parsedData, null, 2)}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
