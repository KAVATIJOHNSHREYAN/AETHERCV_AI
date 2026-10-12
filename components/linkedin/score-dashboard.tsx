'use client'

import React from 'react'
import { LinkedInScoreReport, TargetRole } from '@/types/linkedin'
import {
  ShieldCheck, Sparkles, TrendingUp, Search, CheckCircle2,
  AlertCircle, Plus, Zap, Award, Target, Star
} from 'lucide-react'

interface ScoreDashboardProps {
  score?: LinkedInScoreReport
  report?: LinkedInScoreReport
  targetRole?: TargetRole
  onAddSkill?: (skill: string) => void
  onAddKeyword?: (skill: string) => void
}

export function ScoreDashboard({
  score: propScore,
  report,
  targetRole: _targetRole,
  onAddSkill,
  onAddKeyword
}: ScoreDashboardProps) {
  const score = report || propScore
  if (!score) return null

  const handleAdd = onAddKeyword || onAddSkill

  // SVG circular gauge calculation
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score.overallScore / 100) * circumference

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'All-Star':
        return 'from-emerald-500 to-teal-400 text-emerald-400'
      case 'Advanced':
        return 'from-blue-500 to-indigo-400 text-sky-400'
      case 'Intermediate':
        return 'from-amber-500 to-yellow-400 text-amber-400'
      default:
        return 'from-blue-600 to-indigo-600 text-blue-400'
    }
  }

  return (
    <div className="space-y-4 font-outfit">
      {/* ── CARD 1: OVERALL SCORE & RADIAL GAUGE ── */}
      <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#818cf8]" />
            <h3 className="text-sm font-bold font-poppins text-white">
              LinkedIn Recruiter Strength
            </h3>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1">
            <Star className="w-3 h-3 fill-emerald-400" />
            <span>{score.tier} Profile</span>
          </span>
        </div>

        {/* Radial Gauge & High-Level Metrics */}
        <div className="flex items-center justify-between gap-4">
          {/* Circular SVG Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="url(#linkedinGradient)"
                fill="transparent"
              />
              <defs>
                <linearGradient id="linkedinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F7DFF" />
                  <stop offset="50%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black font-poppins text-white tracking-tight">
                {score.overallScore}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">/ 100</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex-1 space-y-2">
            <div>
              <span className="text-[10.5px] text-slate-400 font-medium block">Recruiter Rating</span>
              <span className="text-sm font-bold text-sky-300 font-poppins">{score.recruiterRating}</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400">Profile Completeness</span>
                <span className="font-bold text-emerald-400">{score.completionPercentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#07101F] overflow-hidden border border-blue-500/20">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-700 rounded-full"
                  style={{ width: `${score.completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="text-[10.5px] text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>{score.seoMetrics.searchRankingEstimate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CARD 2: 10 CATEGORY SCORES ── */}
      <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 shadow-xl space-y-3">
        <h4 className="text-xs font-bold font-poppins text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-sky-400" />
          <span>Category Score Breakdown</span>
        </h4>

        <div className="space-y-2">
          {Object.entries(score.categories).map(([key, cat]) => {
            const pct = (cat.score / cat.maxScore) * 100
            return (
              <div key={key} className="space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                  <span className="font-mono font-bold text-sky-300">
                    {cat.score} / {cat.maxScore}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#07101F] overflow-hidden border border-blue-500/10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 80 ? 'bg-emerald-400' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── CARD 3: RECRUITER SEARCH SEO & KEYWORDS ── */}
      <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold font-poppins text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span>Recruiter SEO Keywords</span>
          </h4>
          <span className="text-[10px] text-emerald-400 font-bold font-mono">
            {score.seoMetrics.densityScore}% Match
          </span>
        </div>

        {/* Missing Keywords (Actionable 1-Click Injection) */}
        {score.seoMetrics.missingKeywords.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-amber-300 block">
              High-Demand Missing Keywords for Your Role:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {score.seoMetrics.missingKeywords.map((kw, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAdd && handleAdd(kw)}
                  className="px-2 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-sky-300 border border-blue-500/30 text-[10.5px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  title={`Add ${kw} to profile skills`}
                >
                  <Plus className="w-3 h-3 text-sky-400" />
                  <span>{kw}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">
              Click any keyword above to inject it instantly into your profile skills.
            </p>
          </div>
        )}
      </div>

      {/* ── CARD 4: ALL-STAR COMPLETENESS CHECKLIST ── */}
      <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold font-poppins text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Profile Completeness Checklist</span>
          </h4>
          <span className="text-[10px] text-slate-400">10 Key Pillars</span>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {score.checklist.map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                item.completed
                  ? 'bg-[#07101F] border-emerald-500/25 text-slate-200'
                  : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className="font-semibold text-[11.5px]">{item.label}</span>
              </div>

              <span className={`text-[10px] font-bold ${item.completed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {item.completed ? 'Done' : 'Needs Action'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
