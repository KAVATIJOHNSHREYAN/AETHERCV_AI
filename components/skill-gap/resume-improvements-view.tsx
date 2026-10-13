'use client'

import React from 'react'
import { ResumeImprovements } from '@/types/skill-gap'
import {
  FileEdit,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  FileCheck2
} from 'lucide-react'

interface ResumeImprovementsViewProps {
  improvements: ResumeImprovements
}

export function ResumeImprovementsView({ improvements }: ResumeImprovementsViewProps) {
  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/80 mb-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-sky-400" />
          Targeted Resume & ATS Improvements
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Actionable bullet point rewrites, missing metrics, and recruiter-approved optimizations.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Bullet Point Rewrites (Before vs After with STAR method) */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            Weak Bullet Points — High-Impact Rewrites
          </h4>

          <div className="space-y-3.5">
            {improvements.weakBulletPoints.map((bp, i) => (
              <div
                key={i}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2.5"
              >
                {/* Original */}
                <div className="bg-rose-950/20 border border-rose-500/20 rounded-lg p-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-0.5">
                    Original (Passive / Low Detail):
                  </span>
                  <p className="text-xs text-slate-300 font-mono italic">
                    &quot;{bp.original}&quot;
                  </p>
                </div>

                {/* Improved */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Improved (STAR Method + Metrics):</span>
                  </div>
                  <p className="text-xs text-emerald-200 font-mono font-medium">
                    &quot;{bp.improved}&quot;
                  </p>
                </div>

                {/* Why it works */}
                <p className="text-[11px] text-slate-400 italic">
                  <strong>Rationale:</strong> {bp.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Missing Sections & Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Missing Metrics */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Missing Quantitative Metrics
            </h4>
            <ul className="space-y-2">
              {improvements.missingMetrics.map((met, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{met}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Sections */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-sky-400" />
              Section Recommendations
            </h4>
            <div className="space-y-2">
              {improvements.missingSections.length > 0 ? (
                improvements.missingSections.map((sec, i) => (
                  <div
                    key={i}
                    className="text-xs text-rose-300 bg-rose-950/20 border border-rose-500/30 p-2.5 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Missing: {sec}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-emerald-300 bg-emerald-950/20 border border-emerald-500/30 p-2.5 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>All core resume sections detected successfully (Summary, Experience, Projects, Skills, Education).</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Recruiter Tips & Summary Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Summary & Skills Guidance */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
              Summary & Skills Section Tips
            </h4>
            <ul className="space-y-2">
              {improvements.weakSummaryTips.map((tip, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
              {improvements.weakSkillsTips.map((tip, i) => (
                <li key={`skill-${i}`} className="text-xs text-slate-300 flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recruiter Insider Tips */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Recruiter Insider Tips
            </h4>
            <ul className="space-y-2">
              {improvements.recruiterTips.map((tip, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
