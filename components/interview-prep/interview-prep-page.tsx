'use client'

import React, { useState, useEffect } from 'react'
import {
  InterviewInput,
  InterviewQuestion,
  OverallInterviewResult
} from '@/types/interview-prep'
import {
  generateMockInterviewQuestions,
  compileOverallInterviewResult
} from '@/lib/interview-prep/interview-engine'
import { saveInterviewSession } from '@/lib/interview-prep/storage'
import { LiveTrendsBanner } from './live-trends-banner'
import { InterviewSetupForm } from './interview-setup-form'
import { MockInterviewRoom } from './mock-interview-room'
import { InterviewEvaluationView } from './interview-evaluation-view'
import { InterviewExportModal } from './interview-export-modal'
import { InterviewHistoryModal } from './interview-history-modal'
import {
  Sparkles,
  Bot,
  History,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react'

const DEFAULT_INPUT: InterviewInput = {
  inputSource: 'manual',
  resumeText: '',
  resumeFileName: '',
  jobDescription: '',
  company: 'Google',
  jobRole: 'Software Engineer',
  country: 'United States',
  experienceLevel: 'senior',
  difficulty: 'company_level',
  interviewType: 'complete',
  customFocusAreas: ['Distributed Systems', 'Low Latency APIs', 'System Design']
}

export function InterviewPrepPage() {
  const [mode, setMode] = useState<'setup' | 'interview' | 'evaluation'>('setup')
  const [input, setInput] = useState<InterviewInput>(DEFAULT_INPUT)
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [result, setResult] = useState<OverallInterviewResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Start interview flow
  const handleStartInterview = async () => {
    setIsLoading(true)
    try {
      // Simulate quick AI orchestration
      await new Promise(resolve => setTimeout(resolve, 600))
      const generated = generateMockInterviewQuestions(input)
      setQuestions(generated)
      setMode('interview')
    } catch (err) {
      console.error('Failed to generate interview:', err)
      alert('Error generating interview room. Please check your inputs.')
    } finally {
      setIsLoading(false)
    }
  }

  // Complete interview flow
  const handleCompleteInterview = (
    updatedQuestions: InterviewQuestion[],
    durationMinutes: number
  ) => {
    const finalResult = compileOverallInterviewResult(input, updatedQuestions, durationMinutes)
    setResult(finalResult)
    saveInterviewSession(finalResult)
    setMode('evaluation')
  }

  // Sample Profile Loader
  const handleLoadSample = () => {
    setInput({
      inputSource: 'manual',
      resumeText: `CANDIDATE: Alex Rivera
TITLE: Senior Staff Backend Engineer
SUMMARY: 7+ years architecting high-throughput distributed microservices in Go, Python, and TypeScript. Specializing in low-latency event processing, Redis caching, and Kafka pipelines.
SKILLS: Go, Python, TypeScript, PostgreSQL, Redis, Kafka, Kubernetes, AWS, System Design, GraphQL, Microservices
EXPERIENCE:
- Senior Engineer at TechCorp: Scaled event bus to 350k events/sec with sub-10ms p99 latency using Kafka and Redis.
- Backend Lead at CloudScale: Led database migration from MySQL to PostgreSQL with zero downtime across 4 million active users.
PROJECTS:
- Distributed Rate Limiter: Built sliding window counter in Go handling 500k RPS with multi-region Redis cluster.
- AI Embeddings Search Service: Designed sub-30ms vector search retrieval engine using pgvector and FastAPI.`,
      resumeFileName: 'Sample_Senior_Engineer_Resume.pdf',
      jobDescription: `Looking for a Senior Software Engineer to design, build, and maintain mission-critical distributed systems. Must have deep experience in concurrency, database internals, and high-availability architecture.`,
      company: 'Google',
      jobRole: 'Senior Software Engineer',
      country: 'United States',
      experienceLevel: 'senior',
      difficulty: 'company_level',
      interviewType: 'complete',
      customFocusAreas: ['Concurrency', 'Distributed Caching', 'System Design']
    })
  }

  // Reset Form
  const handleReset = () => {
    setInput(DEFAULT_INPUT)
    setQuestions([])
    setResult(null)
    setMode('setup')
  }

  // Retake Session
  const handleRetake = () => {
    if (questions.length > 0) {
      const resetQs = questions.map(q => ({
        ...q,
        userAnswer: undefined,
        evaluation: undefined,
        followUpAnswer: undefined,
        isFollowUpActive: false,
        activeFollowUpQuestion: undefined
      }))
      setQuestions(resetQs)
      setMode('interview')
    } else {
      handleStartInterview()
    }
  }

  return (
    <div className="min-h-screen bg-[#07101F] text-slate-100 py-24 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">
      {/* Background radial gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Interview Preparation Suite • Live Recruiter Simulation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Master Every Interview With{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
              AI Recruiter Intelligence
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed">
            Generate deeply personalized mock interviews calibrated to your real resume, target company,
            and current candidate-reported hiring rounds. Practice with speech voice mode, live follow-ups,
            and receive recruiter scoring.
          </p>

          {/* Quick Stats Bar */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 pt-2 text-[11px] sm:text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>200+ Global Companies</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Voice Speech-to-Text Mode</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Probing Follow-Ups</span>
            </span>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold underline ml-1"
            >
              <History className="w-3.5 h-3.5" />
              <span>View Past Sessions</span>
            </button>
          </div>
        </div>

        {/* Live Trends Banner (Always visible in Setup mode) */}
        {mode === 'setup' && (
          <LiveTrendsBanner
            onSelectTopic={topic => {
              setInput(prev => ({
                ...prev,
                customFocusAreas: Array.from(new Set([...prev.customFocusAreas, topic])).slice(0, 5)
              }))
            }}
          />
        )}

        {/* Dynamic Mode Controller */}
        {mode === 'setup' && (
          <InterviewSetupForm
            input={input}
            onChange={setInput}
            onStartInterview={handleStartInterview}
            isLoading={isLoading}
            onLoadSample={handleLoadSample}
            onReset={handleReset}
          />
        )}

        {mode === 'interview' && (
          <MockInterviewRoom
            input={input}
            questions={questions}
            onCompleteInterview={handleCompleteInterview}
            onExit={() => setMode('setup')}
          />
        )}

        {mode === 'evaluation' && result && (
          <InterviewEvaluationView
            result={result}
            onRetake={handleRetake}
            onNewInterview={handleReset}
            onOpenExportModal={() => setIsExportOpen(true)}
          />
        )}
      </div>

      {/* Export Modal */}
      <InterviewExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        result={result}
      />

      {/* History Modal */}
      <InterviewHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectSession={savedResult => {
          setResult(savedResult)
          setInput(savedResult.input)
          setQuestions(savedResult.questions)
          setMode('evaluation')
        }}
      />
    </div>
  )
}
