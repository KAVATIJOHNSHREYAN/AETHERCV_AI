'use client'

import React, { useState, useEffect } from 'react'
import {
  ResumeInputMode,
  JobTargetInputMode,
  SkillGapAnalysisResult,
  SkillGapHistoryItem
} from '@/types/skill-gap'
import { performSkillGapAnalysis, NON_RESUME_ERROR_MESSAGE, EMPTY_JD_ERROR_MESSAGE } from '@/lib/skill-gap/analyzer-engine'
import { ResumeSourceSelector } from '@/components/skill-gap/resume-source-selector'
import { JobTargetSelector } from '@/components/skill-gap/job-target-selector'
import { CircularMatchGauge } from '@/components/skill-gap/circular-match-gauge'
import { DashboardCards } from '@/components/skill-gap/dashboard-cards'
import { MatchedSkillsView } from '@/components/skill-gap/matched-skills-view'
import { MissingSkillsView } from '@/components/skill-gap/missing-skills-view'
import { MissingKeywordsView } from '@/components/skill-gap/missing-keywords-view'
import { ExperienceGapView } from '@/components/skill-gap/experience-gap-view'
import { ProjectGapView } from '@/components/skill-gap/project-gap-view'
import { CertificationsView } from '@/components/skill-gap/certifications-view'
import { LearningRoadmapView } from '@/components/skill-gap/learning-roadmap-view'
import { MarketDemandView } from '@/components/skill-gap/market-demand-view'
import { ResumeImprovementsView } from '@/components/skill-gap/resume-improvements-view'
import { ActionPlanChecklist } from '@/components/skill-gap/action-plan-checklist'
import { HistoryDrawer } from '@/components/skill-gap/history-drawer'
import { ExportModal } from '@/components/skill-gap/export-modal'
import { ComparisonModal } from '@/components/skill-gap/comparison-modal'
import { ScanningAnimation } from '@/components/skill-gap/scanning-animation'
import {
  Target,
  Sparkles,
  ArrowRight,
  History,
  Download,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ListTodo,
  FileText,
  KeyRound,
  Briefcase,
  FolderGit2,
  Award,
  Calendar,
  TrendingUp,
  FileEdit,
  Zap
} from 'lucide-react'

const STORAGE_KEY_HISTORY = 'aethercv_skill_gap_history_v1'

const DEFAULT_SAMPLE_RESUME = `KAVATI JOHN SHREYAN
john.shreyan@example.com | +1 (555) 019-2834 | San Francisco, CA
linkedin.com/in/johnshreyan | github.com/johnshreyan | aethercv-ai.vercel.app

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 2+ years of experience engineering scalable web applications, RESTful microservices, and modern frontend platforms. Proficient in TypeScript, React, Next.js, Python, and PostgreSQL with a passion for high-performance distributed systems.

TECHNICAL SKILLS
- Programming Languages: TypeScript, JavaScript, Python, SQL, C++, HTML5, CSS3
- Frontend Development: React, Next.js, Tailwind CSS, Redux, Responsive UI, WebSockets
- Backend & Databases: Node.js, Express, PostgreSQL, Prisma ORM, REST APIs, Redis
- Tools & Cloud: Git, GitHub, Docker, Jest, Postman, Linux, Agile/Scrum

WORK EXPERIENCE
Software Engineer | NexaTech Solutions (2022 - Present)
- Engineered responsive client dashboards in React & Next.js, elevating Lighthouse performance scores by 35%.
- Built RESTful microservices in Node.js & Express with PostgreSQL, serving 15,000+ daily active users.
- Designed database schemas and optimized indexing in PostgreSQL to reduce query latency by 28%.
- Integrated Redis caching layer for session management and distributed API rate limiting.

Junior Developer Intern | CloudScale Systems (2021 - 2022)
- Collaborated with 5-person engineering team to containerize Node.js microservices using Docker.
- Implemented automated unit test suites using Jest, boosting test coverage from 60% to 85%.
- Participated in weekly agile sprint planning, technical design reviews, and peer code reviews.

KEY PROJECTS
Real-Time Collaborative Document Workspace (TypeScript, Next.js, WebSockets, PostgreSQL)
- Multi-user markdown platform with live WebSocket syncing, operational transformation, and row-level security.
- Deployed on cloud platform with automated CI/CD pipeline via GitHub Actions.

Enterprise API Rate Limiter Gateway (Go, Python, Redis, Docker)
- High-concurrency sliding log reverse proxy handling 4,000 requests per second with sub-5ms overhead.

EDUCATION
Bachelor of Technology in Computer Science & Engineering (2018 - 2022)
KL University | GPA: 8.8 / 10.0`

export default function SkillGapAnalyzerPage() {
  // Input states
  const [resumeMode, setResumeMode] = useState<ResumeInputMode>('upload')
  const [jobMode, setJobMode] = useState<JobTargetInputMode>('role')
  const [resumeText, setResumeText] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('Software Engineer')
  const [jobDescriptionText, setJobDescriptionText] = useState<string>('')

  // Engine state
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<SkillGapAnalysisResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('matched')

  // Modals and Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [historyItems, setHistoryItems] = useState<SkillGapHistoryItem[]>([])
  const [compareItems, setCompareItems] = useState<{
    itemA: SkillGapHistoryItem | null
    itemB: SkillGapHistoryItem | null
  }>({ itemA: null, itemB: null })

  // Load history from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setHistoryItems(parsed)
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  // Save item to history
  const saveToHistory = (res: SkillGapAnalysisResult) => {
    const historyItem: SkillGapHistoryItem = {
      id: res.id,
      title: `${res.targetRole} (${res.overallScore}%)`,
      targetRole: res.targetRole,
      overallScore: res.overallScore,
      matchLevel: res.matchLevel,
      timestamp: res.timestamp,
      candidateName: res.candidateName,
      data: res
    }

    setHistoryItems(prev => {
      const updated = [historyItem, ...prev.filter(h => h.id !== res.id)].slice(0, 30)
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated))
      } catch {
        // Storage limit reached fallback
      }
      return updated
    })
  }

  // Handle run analysis
  const handleRunAnalysis = async () => {
    setErrorMessage(null)

    // Validation 1: Resume text present
    if (!resumeText.trim()) {
      setErrorMessage('Please upload a resume or paste your resume text before running analysis.')
      return
    }

    // Validation 2: Job Target present
    if (jobMode === 'jd' && !jobDescriptionText.trim()) {
      setErrorMessage('Please provide a complete job description before running the skill gap analysis.')
      return
    }
    if (jobMode === 'role' && !selectedRole.trim()) {
      setErrorMessage('Please select a target job role before running the skill gap analysis.')
      return
    }

    setIsAnalyzing(true)

    try {
      // Add minimum animation delay for neural visual effect
      const [result] = await Promise.all([
        performSkillGapAnalysis(
          resumeText,
          {
            mode: jobMode,
            roleName: selectedRole,
            jobDescriptionText
          },
          fileName
        ),
        new Promise(r => setTimeout(r, 1400))
      ])

      setAnalysisResult(result)
      saveToHistory(result)
      setActiveTab('matched')

      // Scroll smoothly to results
      setTimeout(() => {
        const resultsEl = document.getElementById('analysis-results-section')
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (err: any) {
      setErrorMessage(err.message || NON_RESUME_ERROR_MESSAGE)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Quick Load Demo Sample Resume
  const handleLoadSampleResume = () => {
    setResumeText(DEFAULT_SAMPLE_RESUME)
    setFileName('Sample_Software_Engineer_Resume.txt')
    setResumeMode('paste')
    setErrorMessage(null)
  }

  // Clear / Reset
  const handleReset = () => {
    setResumeText('')
    setFileName('')
    setJobDescriptionText('')
    setAnalysisResult(null)
    setErrorMessage(null)
  }

  // History operations
  const handleDeleteHistory = (id: string) => {
    setHistoryItems(prev => {
      const updated = prev.filter(h => h.id !== id)
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const handleRenameHistory = (id: string, newTitle: string) => {
    setHistoryItems(prev => {
      const updated = prev.map(h => (h.id === id ? { ...h, title: newTitle } : h))
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const handleCompareHistory = (itemA: SkillGapHistoryItem, itemB: SkillGapHistoryItem) => {
    setCompareItems({ itemA, itemB })
    setIsHistoryOpen(false)
  }

  const tabs = [
    { id: 'matched', label: 'Matched Skills', icon: CheckCircle2, count: analysisResult?.matchedSkills.length },
    { id: 'missing', label: 'Missing Skills', icon: AlertCircle, count: analysisResult?.missingSkills.length },
    { id: 'keywords', label: 'Missing Keywords', icon: KeyRound, count: analysisResult?.missingKeywords.length },
    { id: 'experience', label: 'Experience Gap', icon: Briefcase },
    { id: 'projects', label: 'Portfolio Projects', icon: FolderGit2, count: analysisResult?.projectRecommendations.length },
    { id: 'certifications', label: 'Certifications', icon: Award, count: analysisResult?.certifications.length },
    { id: 'roadmap', label: '12-Week Roadmap', icon: Calendar },
    { id: 'market', label: 'Market Demand', icon: TrendingUp },
    { id: 'improvements', label: 'Resume Improvements', icon: FileEdit },
    { id: 'action-plan', label: 'Action Checklist', icon: ListTodo, count: analysisResult?.actionPlan.length }
  ]

  return (
    <div className="min-h-screen bg-[#07101F] text-slate-100 pt-20 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-blue-600/30 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide uppercase shadow-lg shadow-blue-500/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Skill Gap Analyzer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Bridge the Gap Between Your Resume & Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400">
              Dream Tech Role
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Compare your resume against 200+ industry job roles or an exact job vacancy.
            Identify missing keywords, estimate your ATS match score, and generate a 12-week employability roadmap.
          </p>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleLoadSampleResume}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Sample Resume</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>View History ({historyItems.length})</span>
            </button>
          </div>
        </div>

        {/* Validation Error Message */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto bg-rose-950/30 border border-rose-500/40 rounded-2xl p-4.5 flex items-start gap-3 shadow-lg shadow-rose-900/10 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                Document Validation Notice
              </h4>
              <p className="text-xs text-rose-200 mt-1 leading-relaxed">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Step 1: Resume Source */}
          <ResumeSourceSelector
            mode={resumeMode}
            onModeChange={setResumeMode}
            resumeText={resumeText}
            onResumeTextChange={(txt, name) => {
              setResumeText(txt)
              if (name) setFileName(name)
              setErrorMessage(null)
            }}
            fileName={fileName}
          />

          {/* Step 2: Job Target */}
          <JobTargetSelector
            mode={jobMode}
            onModeChange={setJobMode}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            jobDescriptionText={jobDescriptionText}
            onJobDescriptionChange={txt => {
              setJobDescriptionText(txt)
              setErrorMessage(null)
            }}
          />
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            <Target className="w-5 h-5 text-sky-200" />
            <span>Run AI Skill Gap Analysis</span>
            <ArrowRight className="w-4 h-4 text-sky-200" />
          </button>

          {(resumeText || analysisResult) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-4 rounded-2xl bg-[#0B172E] hover:bg-[#102244] border border-blue-500/30 text-slate-300 hover:text-white font-semibold text-xs transition flex items-center gap-2 shadow-md"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Scanning Animation State */}
        {isAnalyzing && (
          <div className="py-8">
            <ScanningAnimation targetRole={selectedRole} />
          </div>
        )}

        {/* Results Workspace Section */}
        {analysisResult && !isAnalyzing && (
          <div id="analysis-results-section" className="space-y-8 pt-6 border-t border-slate-800/80">
            {/* Top Results Card: Gauge & Executive Summary */}
            <div className="bg-gradient-to-b from-[#0C1F42] via-[#091733] to-[#061226] border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(37,99,235,0.2)] relative overflow-hidden backdrop-blur-xl">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left: Animated Score Gauge */}
                <div className="shrink-0 flex justify-center">
                  <CircularMatchGauge
                    score={analysisResult.overallScore}
                    matchLevel={analysisResult.matchLevel}
                    size={210}
                    strokeWidth={14}
                  />
                </div>

                {/* Right: Summary & Role Insights */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-xs font-bold text-sky-300 bg-sky-500/20 border border-sky-400/40 px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Target: {analysisResult.targetRole}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      Candidate: <strong className="text-white">{analysisResult.candidateName}</strong>
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {analysisResult.summaryHeadline}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    Our AI cross-referenced {analysisResult.parsedResumeSnippet.textLength} characters from your resume against {analysisResult.targetRole} competencies. We detected{' '}
                    <strong className="text-emerald-300 font-bold">{analysisResult.matchedSkills.length} matched skills</strong> and identified{' '}
                    <strong className="text-amber-300 font-bold">{analysisResult.missingSkills.length} actionable skill gaps</strong>.
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsExportOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Reports (PDF / TXT / MD)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsHistoryOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#091833] border border-blue-500/30 text-slate-200 hover:text-white hover:border-blue-400/60 font-semibold text-xs transition flex items-center gap-2 shadow-sm"
                    >
                      <History className="w-4 h-4 text-sky-400" />
                      <span>History</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Metric Cards */}
            <DashboardCards data={analysisResult} />

            {/* Tab Navigation Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin border-b border-blue-950/60">
              {tabs.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white border-sky-400/80 shadow-md shadow-blue-600/30'
                        : 'bg-[#0A1730] border-blue-900/40 text-slate-200 hover:text-white hover:bg-[#10244B] hover:border-blue-500/50 shadow-sm'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-400'}`} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-white/20 text-white font-bold' : 'bg-blue-950 border border-blue-500/30 text-sky-300'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Active Tab Content */}
            <div className="transition-all duration-200">
              {activeTab === 'matched' && (
                <MatchedSkillsView matchedSkills={analysisResult.matchedSkills} />
              )}
              {activeTab === 'missing' && (
                <MissingSkillsView missingSkills={analysisResult.missingSkills} />
              )}
              {activeTab === 'keywords' && (
                <MissingKeywordsView missingKeywords={analysisResult.missingKeywords} />
              )}
              {activeTab === 'experience' && (
                <ExperienceGapView experienceGap={analysisResult.experienceGap} />
              )}
              {activeTab === 'projects' && (
                <ProjectGapView
                  projects={analysisResult.projectRecommendations}
                  roleName={analysisResult.targetRole}
                />
              )}
              {activeTab === 'certifications' && (
                <CertificationsView
                  certifications={analysisResult.certifications}
                  roleName={analysisResult.targetRole}
                />
              )}
              {activeTab === 'roadmap' && (
                <LearningRoadmapView
                  roadmap={analysisResult.learningRoadmap}
                  roleName={analysisResult.targetRole}
                />
              )}
              {activeTab === 'market' && (
                <MarketDemandView marketDemand={analysisResult.marketDemand} />
              )}
              {activeTab === 'improvements' && (
                <ResumeImprovementsView improvements={analysisResult.resumeImprovements} />
              )}
              {activeTab === 'action-plan' && (
                <ActionPlanChecklist initialItems={analysisResult.actionPlan} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyItems={historyItems}
        onSelect={res => {
          setAnalysisResult(res)
          setSelectedRole(res.targetRole)
          setActiveTab('matched')
        }}
        onDelete={handleDeleteHistory}
        onRename={handleRenameHistory}
        onCompare={handleCompareHistory}
      />

      {/* Export Modal */}
      {analysisResult && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          data={analysisResult}
        />
      )}

      {/* Comparison Modal */}
      <ComparisonModal
        itemA={compareItems.itemA}
        itemB={compareItems.itemB}
        onClose={() => setCompareItems({ itemA: null, itemB: null })}
      />
    </div>
  )
}
