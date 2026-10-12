'use client'

import React from 'react'
import { GitHubScoreReport } from '@/types/github'
import {
  Sparkles, Award, TrendingUp, CheckCircle2, AlertCircle,
  Plus, ExternalLink, Code, Layers, Zap, Star, ShieldCheck
} from 'lucide-react'

interface ScoreDashboardProps {
  report: GitHubScoreReport
  onAddSkill?: (skill: string) => void
}

export function ScoreDashboard({ report, onAddSkill }: ScoreDashboardProps) {
  // SVG circular gauge calculation
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (report.overallScore / 100) * circumference

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Top 1% Elite':
        return 'from-emerald-500 to-teal-400 text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
      case 'Senior Ready':
        return 'from-blue-500 to-indigo-400 text-sky-400 border-blue-500/40 bg-blue-500/10'
      case 'Intermediate':
        return 'from-amber-500 to-yellow-400 text-amber-400 border-amber-500/40 bg-amber-500/10'
      default:
        return 'from-slate-500 to-slate-400 text-slate-300 border-slate-500/40 bg-slate-500/10'
    }
  }

  return (
    <div className="space-y-4 font-outfit">
      {/* ── CARD 1: OVERALL SCORE & RADIAL GAUGE ── */}
      <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold font-poppins text-white uppercase tracking-wider">
              GitHub Engineering Score
            </h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getTierColor(report.tier)}`}>
            ⭐ {report.tier}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Radial Circular SVG Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-blue-500 transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white font-poppins">
                {report.overallScore}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">/ 100 PTS</span>
            </div>
          </div>

          {/* Readiness Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 flex-1 w-full text-xs">
            <div className="p-2.5 rounded-xl bg-[#07101F] border border-blue-500/15">
              <span className="text-[10.5px] text-slate-400 block">Portfolio Score</span>
              <span className="text-sm font-bold text-sky-300 font-mono">
                {report.readiness.portfolioScore}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#07101F] border border-blue-500/15">
              <span className="text-[10.5px] text-slate-400 block">Recruiter Appeal</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {report.readiness.recruiterAppeal}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#07101F] border border-blue-500/15">
              <span className="text-[10.5px] text-slate-400 block">Internship Readiness</span>
              <span className="text-sm font-bold text-indigo-300 font-mono">
                {report.readiness.internshipReadiness}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#07101F] border border-blue-500/15">
              <span className="text-[10.5px] text-slate-400 block">Placement Ready</span>
              <span className="text-sm font-bold text-amber-300 font-mono">
                {report.readiness.placementReadiness}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#07101F] border border-blue-500/15">
              <span className="text-[10.5px] text-slate-400 block">FAANG Readiness</span>
              <span className="text-sm font-bold text-purple-300 font-mono">
                {report.readiness.faangReadiness}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#07101F] border border-blue-500/15 flex flex-col justify-center">
              <span className="text-[10.5px] text-slate-400 block">Engineering Tier</span>
              <span className="text-xs font-bold text-emerald-300 truncate">
                {report.tier}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CARD 2: CATEGORY BREAKDOWN ── */}
      <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 shadow-xl space-y-3">
        <h4 className="text-xs font-bold font-poppins text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
          <span>Category Performance Audit</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(report.categories).map(([key, cat]) => {
            const pct = (cat.score / cat.maxScore) * 100
            return (
              <div key={key} className="p-2.5 rounded-xl bg-[#07101F] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                  <span className="font-mono font-bold text-sky-300">
                    {cat.score} / {cat.maxScore}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 80 ? 'bg-emerald-400' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {cat.tips && cat.tips[0] && (
                  <p className="text-[10px] text-slate-400 truncate pt-0.5">
                    💡 {cat.tips[0]}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── CARD 3: MISSING HIGH-DEMAND SKILLS ── */}
      {report.missingTrendingSkills.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#0C162B] border border-blue-500/25 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Trending Recruiter Skills Missing From Your Profile</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1-Click Inject</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {report.missingTrendingSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => onAddSkill && onAddSkill(skill)}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/25 text-sky-300 border border-blue-500/30 text-[11px] font-semibold flex items-center gap-1 transition"
                title={`Add ${skill} to your Tech Stack`}
              >
                <Plus className="w-3 h-3 text-sky-400" />
                <span>{skill}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── CARD 4: AI SUGGESTED HIGH-IMPACT PROJECTS ── */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0C162B] to-blue-950/30 border border-blue-500/25 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold font-poppins text-white uppercase tracking-wider">
            AI Recommended High-Impact Projects
          </h4>
        </div>

        <div className="space-y-2.5">
          {report.suggestedProjects.map((proj, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#07101F] border border-white/10 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {proj.title}
                </span>
                <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {proj.difficulty}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {proj.description}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Stack: <strong className="text-slate-200">{proj.technologies.join(', ')}</strong></span>
                <span className="text-emerald-400 font-medium">Recruiter Magnet ★</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
