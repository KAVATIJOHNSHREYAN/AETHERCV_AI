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
import { Button } from '@/components/ui/button'

import {
  Sparkles, History, Download, RefreshCw, BarChart3, Cpu,
  CheckCircle2, Target, Edit3, Code2, ArrowLeft, ShieldCheck,
  Award, FileText, Check
} from 'lucide-react'
import Link from 'next/link'

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

      // Attempt API Route first
      if (file || textContent) {
        try {
          const formData = new FormData()
          if (file) {
            formData.append('file', file)
          } else {
            formData.append('text', textContent)
            formData.append('fileName', fileName)
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
          }
        } catch (apiErr) {
          console.warn('API route call fallback to client-side pipeline:', apiErr)
        }
      }

      // If API route was skipped or returned direct text, run self-contained local pipeline
      if (!resultData && textContent) {
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
        throw new Error('Failed to parse document text. Please try uploading another file or pasting plain text.')
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

  // Pre-load a sample on initial mount if desired (or let user upload)
  useEffect(() => {
    if (!analysisData && SAMPLE_RESUMES.length > 0) {
      // Initialize with first sample for immediate wow factor
      const sample = SAMPLE_RESUMES[0]
      const text = sample.content
      const parsedData = parseRawResume(text)
      const formatting = analyzeFormatting(text)
      const actionVerbs = analyzeActionVerbs(text)
      const keywords = analyzeKeywords(text, parsedData.rawSkillsList)
      const atsBreakdown = calculateAtsScore(parsedData, formatting, actionVerbs, keywords)
      const aiFeedback = generateAIFeedback(parsedData, atsBreakdown)
      const sectionsRaw = extractSections(text)
      const sectionsDetection = detectSectionsStatus(sectionsRaw)

      setAnalysisData({
        fileName: `${sample.title}.pdf`,
        fileSize: 42000,
        fileType: 'application/pdf',
        timestamp: new Date().toISOString(),
        parsedData,
        atsBreakdown,
        formatting,
        actionVerbs,
        keywords,
        sectionsDetection,
        aiFeedback
      })
    }
  }, [])

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
    <div className="min-h-screen bg-background text-foreground py-20 px-4 sm:px-6 lg:px-8">
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

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Self-Contained AI Resume Analyzer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-poppins tracking-tight text-foreground">
              AI Resume <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-rose-500 to-amber-500">Analyzer</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-outfit max-w-2xl">
              Upload your resume for instant rule-based ATS scoring (100 pts), 8-cluster skill taxonomy categorization, action verb audits, recruiter simulation, and job description alignment.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsHistoryOpen(true)}
              className="gap-2 font-outfit text-xs"
            >
              <History className="w-4 h-4 text-muted-foreground" />
              <span>History ({history.length})</span>
            </Button>

            {analysisData && (
              <Button
                size="sm"
                onClick={() => setIsExportOpen(true)}
                className="gap-2 font-outfit text-xs shadow-md"
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
            <div className="p-6 rounded-3xl bg-card/60 backdrop-blur-md border border-border/50 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-rose-500 text-white flex items-center justify-center font-bold text-xl font-poppins shadow-md">
                  {(analysisData.parsedData.contact.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-poppins text-foreground flex items-center gap-2">
                    {analysisData.parsedData.contact.name || 'Candidate Profile'}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Verified Scan
                    </span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-outfit mt-1">
                    {analysisData.parsedData.contact.email && (
                      <span>{analysisData.parsedData.contact.email}</span>
                    )}
                    {analysisData.parsedData.contact.phone && (
                      <>
                        <span>•</span>
                        <span>{analysisData.parsedData.contact.phone}</span>
                      </>
                    )}
                    <span>•</span>
                    <span className="font-mono">{analysisData.fileName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExportOpen(true)}
                  className="gap-1.5 text-xs font-outfit"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Package
                </Button>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border/40 pb-3">
              {navTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
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
                    <div className="p-5 rounded-3xl bg-card/60 backdrop-blur-md border border-border/50 space-y-3">
                      <h4 className="text-sm font-bold font-poppins text-foreground flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Formatting & Readability Index
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-secondary/30">
                          <span className="text-muted-foreground block text-[11px]">Word Count</span>
                          <span className="font-bold text-foreground">{analysisData.formatting.wordCount} words</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-secondary/30">
                          <span className="text-muted-foreground block text-[11px]">Length</span>
                          <span className="font-bold text-foreground">~{analysisData.formatting.estimatedPages} pages</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-secondary/30">
                          <span className="text-muted-foreground block text-[11px]">Reading Ease</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {analysisData.formatting.fleschReadingEase}/100
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-secondary/30">
                          <span className="text-muted-foreground block text-[11px]">Bullet Points</span>
                          <span className="font-bold text-foreground">{analysisData.formatting.bulletPointCount}</span>
                        </div>
                      </div>
                      {analysisData.formatting.warnings.length > 0 && (
                        <div className="pt-2 text-[11px] text-amber-600 dark:text-amber-400 font-outfit">
                          ⚠️ {analysisData.formatting.warnings[0]}
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
                  className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <h3 className="text-sm font-bold font-poppins text-foreground flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-primary" />
                      Structured Parsed Resume JSON
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(analysisData.parsedData, null, 2))
                      }}
                      className="text-xs font-outfit"
                    >
                      Copy JSON
                    </Button>
                  </div>
                  <pre className="p-4 rounded-xl bg-background border border-border/50 text-xs font-mono text-muted-foreground overflow-x-auto max-h-[500px] leading-relaxed">
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
