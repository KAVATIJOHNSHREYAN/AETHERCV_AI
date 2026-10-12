'use client'

import React from 'react'
import { AtsBuilderScore } from '@/types/resume-builder'
import {
  Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight,
  TrendingUp, Award, Layers, ShieldCheck
} from 'lucide-react'

interface AtsScoreWidgetProps {
  score: AtsBuilderScore
  onSelectSuggestion?: (suggestion: string) => void
}

export function AtsScoreWidget({ score }: AtsScoreWidgetProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'from-emerald-500 to-teal-600 text-emerald-400 border-emerald-500/30'
      case 'B':
        return 'from-blue-500 to-indigo-600 text-sky-400 border-blue-500/30'
      case 'C':
        return 'from-amber-500 to-yellow-600 text-amber-400 border-amber-500/30'
      default:
        return 'from-[#4D48E6] to-[#2662EB] text-[#818cf8] border-indigo-500/30'
    }
  }

  return (
    <div className="bg-[#0C162B]/90 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4 sm:p-5 shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between gap-4">
        {/* Score Ring / Badge */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#07101F] border border-blue-500/30 shadow-inner">
            <div className="text-center">
              <span className="text-xl font-black font-poppins text-white leading-none">
                {score.overallScore}
              </span>
              <span className="text-[10px] text-slate-400 block font-outfit">/100</span>
            </div>
            {/* Visual Circular border glow */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#4D48E6] to-[#2662EB] opacity-30 blur-sm -z-10" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-poppins text-white flex items-center gap-1.5">
                Live ATS Score
              </h3>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border bg-gradient-to-r ${getGradeColor(
                  score.overallGrade
                )}`}
              >
                Grade {score.overallGrade}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-outfit mt-0.5">
              Real-time audit across 8 recruiter benchmarks
            </p>
          </div>
        </div>

        {/* Status Callout */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-outfit text-slate-300 bg-blue-950/40 px-3 py-1.5 rounded-xl border border-blue-500/20">
          <ShieldCheck className="w-4 h-4 text-[#818cf8]" />
          <span>
            {score.overallScore >= 85
              ? 'ATS Shortlist Ready'
              : score.overallScore >= 70
              ? 'Strong Foundation'
              : 'Action Items Needed'}
          </span>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-blue-500/15">
        {Object.entries(score.categories).map(([key, cat]) => {
          const pct = Math.round((cat.score / cat.maxScore) * 100)
          const isGood = pct >= 75
          return (
            <div
              key={key}
              className="bg-[#07101F]/70 border border-blue-500/15 rounded-xl p-2.5 transition-all hover:border-blue-500/35"
            >
              <div className="flex items-center justify-between text-[11px] font-outfit text-slate-400">
                <span className="truncate pr-1">{cat.name}</span>
                <span className={`font-semibold ${isGood ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {cat.score}/{cat.maxScore}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pct >= 85
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : pct >= 60
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#4D48E6]'
                      : 'bg-gradient-to-r from-amber-500 to-orange-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Top Actionable Suggestions */}
      {score.suggestions.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-blue-500/15 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Tips:</span>
          </div>
          {score.suggestions.slice(0, 2).map((sug, i) => (
            <span
              key={i}
              className="text-[11px] font-outfit text-slate-300 bg-blue-950/50 border border-blue-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {sug}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
