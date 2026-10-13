'use client'

import React, { useState } from 'react'
import {
  OverallInterviewResult,
  InterviewQuestion
} from '@/types/interview-prep'
import {
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  RotateCcw,
  Plus,
  Building2,
  Briefcase,
  Globe2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Star,
  Layers,
  Code2,
  MessageSquare
} from 'lucide-react'

interface InterviewEvaluationViewProps {
  result: OverallInterviewResult
  onRetake: () => void
  onNewInterview: () => void
  onOpenExportModal: () => void
}

export function InterviewEvaluationView({
  result,
  onRetake,
  onNewInterview,
  onOpenExportModal
}: InterviewEvaluationViewProps) {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    result.questions[0]?.id || null
  )

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'Strong Hire':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
          badge: 'bg-emerald-500 text-slate-950'
        }
      case 'Hire':
        return {
          bg: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
          badge: 'bg-blue-500 text-white'
        }
      case 'Leaning Hire':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
          badge: 'bg-amber-500 text-slate-950'
        }
      default:
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
          badge: 'bg-rose-500 text-white'
        }
    }
  }

  const verdictStyle = getVerdictStyle(result.verdict)

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Hero Verdict Card */}
      <div className="bg-[#0C162B] border border-blue-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                Official Mock Interview Dossier
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                {new Date(result.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {result.input.jobRole} @ {result.input.company}
            </h2>

            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                {result.input.country}
              </span>
              <span>•</span>
              <span className="capitalize">{result.input.experienceLevel} Level</span>
              <span>•</span>
              <span className="capitalize">{result.input.difficulty.replace('_', ' ')} Difficulty</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {result.durationMinutes} mins
              </span>
            </div>
          </div>

          {/* Overall Score & Verdict Badge */}
          <div className="flex items-center gap-4 self-start md:self-auto bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Overall Score
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mt-0.5">
                {result.overallScore}
                <span className="text-sm font-normal text-slate-500">/100</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-800" />

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Recruiter Verdict
              </span>
              <div
                className={`mt-1 text-xs sm:text-sm font-bold px-3 py-1 rounded-xl border ${verdictStyle.bg}`}
              >
                {result.verdict}
              </div>
            </div>
          </div>
        </div>

        {/* Recruiter Impression Quote */}
        <div className="p-4 sm:p-5 rounded-2xl bg-blue-950/20 border border-blue-500/25 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Executive Recruiter Evaluation & Impression</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
            &quot;{result.recruiterImpression}&quot;
          </p>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onOpenExportModal}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Interview Report (PDF / TXT / MD)</span>
          </button>

          <button
            type="button"
            onClick={onRetake}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs transition flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Retake This Session</span>
          </button>

          <button
            type="button"
            onClick={onNewInterview}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-slate-400" />
            <span>Start Fresh Interview</span>
          </button>
        </div>
      </div>

      {/* Row 2: Competency Breakdown Grid & Company Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Competency Scorecard (7 cols) */}
        <div className="lg:col-span-7 bg-[#0C162B] border border-blue-500/20 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>Core Competency Scorecard</span>
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Technical Accuracy & Depth', value: result.metrics.technicalAccuracy, color: 'bg-blue-500' },
              { label: 'Problem Solving & Logic', value: result.metrics.problemSolving, color: 'bg-cyan-500' },
              { label: 'Executive Communication', value: result.metrics.communication, color: 'bg-sky-500' },
              { label: 'Confidence & Delivery Poise', value: result.metrics.confidence, color: 'bg-emerald-500' },
              { label: 'STAR Method Storytelling', value: result.metrics.starMethod, color: 'bg-amber-500' },
              { label: 'Leadership & Engineering Ownership', value: result.metrics.leadership, color: 'bg-purple-500' },
              { label: 'Professionalism & Grammar', value: result.metrics.grammarProfessionalism, color: 'bg-indigo-500' }
            ].map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{metric.label}</span>
                  <span className="font-mono font-bold text-white">{metric.value} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${metric.color} transition-all duration-500`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Specific Insights (5 cols) */}
        <div className="lg:col-span-5 bg-[#0C162B] border border-blue-500/20 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                {result.companyInsights.companyName} Hiring Trends
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono">
              {result.companyInsights.interviewDifficulty} Bar
            </span>
          </div>

          <p className="text-[11px] text-slate-400 flex items-center gap-1 italic">
            <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>{result.companyInsights.candidateReportDisclaimer}</span>
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-300 block mb-1">Frequently Tested Skills:</span>
              <div className="flex flex-wrap gap-1">
                {result.companyInsights.mostTestedSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-300 block mb-1">Top Tested Topics:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {result.companyInsights.frequentlyAskedTopics.join(' • ')}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-300 block mb-1">Reported Interview Flow:</span>
              <ul className="space-y-1 text-[11px] text-slate-400">
                {result.companyInsights.commonInterviewFlow.slice(0, 4).map((f, i) => (
                  <li key={i} className="line-clamp-1">{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Question by Question Deep Dive Accordion */}
      <div className="bg-[#0C162B] border border-blue-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span>Round-by-Round Question Transcripts & Evaluations</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed breakdown of your answers, strengths, weaknesses, and ideal recruiter responses.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {result.questions.map((q, idx) => {
            const isExpanded = expandedQuestionId === q.id
            const evalScore = q.evaluation?.score || 0

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-3 hover:bg-slate-850 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-blue-400">
                        ROUND {idx + 1}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-semibold text-slate-400 uppercase">
                        {q.category.replace('_', ' ')}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">
                        {q.interviewerPersona} ({q.interviewerTitle})
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                      {q.questionText}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {evalScore} / 100
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-slate-800/80 space-y-4 bg-slate-950/40 text-xs animate-in fade-in duration-150">
                    {/* Full Question */}
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-blue-400 uppercase">
                        Full Question:
                      </span>
                      <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                        {q.questionText}
                      </p>
                    </div>

                    {/* Candidate Answer */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-cyan-400 uppercase">
                        Your Submitted Response:
                      </span>
                      <p className="text-slate-300 font-mono text-[11px] sm:text-xs whitespace-pre-wrap leading-relaxed">
                        {q.userAnswer || 'No response recorded.'}
                      </p>
                    </div>

                    {/* Follow-Up if any */}
                    {q.followUpAnswer && (
                      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                        <span className="text-[11px] font-bold text-amber-400 uppercase">
                          Recruiter Probing Follow-Up:
                        </span>
                        <p className="text-xs text-white italic">{q.activeFollowUpQuestion}</p>
                        <p className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap">
                          {q.followUpAnswer}
                        </p>
                      </div>
                    )}

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                        <span className="font-bold text-emerald-300 block">Strengths:</span>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                          {q.evaluation?.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                        <span className="font-bold text-rose-300 block">Areas to Improve:</span>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                          {q.evaluation?.weaknesses.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Better Answer & Ideal Answer */}
                    <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/25 space-y-2">
                      <span className="font-bold text-blue-300 block">
                        Ideal Recruiter Answer & Structure:
                      </span>
                      <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed italic">
                        {q.evaluation?.idealRecruiterAnswer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Row 4: Actionable Preparation Next Steps */}
      <div className="bg-[#0C162B] border border-blue-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Recommended Next Steps Before Your Real Interview</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {result.actionableNextSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5"
            >
              <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono mt-0.5">
                {idx + 1}
              </div>
              <p className="text-slate-300 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
