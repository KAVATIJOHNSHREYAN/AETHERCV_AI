'use client'

import React from 'react'
import { ExperienceGap } from '@/types/skill-gap'
import { Briefcase, Crown, Network, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react'

interface ExperienceGapViewProps {
  experienceGap: ExperienceGap
}

export function ExperienceGapView({ experienceGap }: ExperienceGapViewProps) {
  const isExperienceMet = experienceGap.yearsMentioned >= experienceGap.yearsRequired

  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/80 mb-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-400" />
          Experience & Seniority Gap Analysis
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Benchmarking demonstrated years, architecture scope, leadership signals, and delivery scale.
        </p>
      </div>

      {/* Years Comparison Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
            Role Typically Requires
          </span>
          <div className="text-3xl font-black text-white">
            {experienceGap.yearsRequired} <span className="text-sm font-semibold text-slate-400">Years</span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
            Years Mentioned on Resume
          </span>
          <div className="text-3xl font-black text-blue-400">
            {experienceGap.yearsMentioned} <span className="text-sm font-semibold text-slate-400">Years</span>
          </div>
        </div>

        <div
          className={`border rounded-xl p-4 text-center flex flex-col items-center justify-center ${
            isExperienceMet
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider font-semibold block mb-1">
            Tenure Alignment
          </span>
          <span className="text-sm font-bold flex items-center gap-1.5">
            {isExperienceMet ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Meets Requirements</span>
              </>
            ) : (
              <span>~{(experienceGap.yearsRequired - experienceGap.yearsMentioned).toFixed(1)} yr Gap</span>
            )}
          </span>
        </div>
      </div>

      {/* Gap Explanation */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-6">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
          Experience Gap Explanation
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {experienceGap.gapExplanation}
        </p>
      </div>

      {/* Signals & Scores: Leadership, Architecture, Ownership, Project Scale */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
        {/* Leadership */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" /> Leadership
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {experienceGap.leadershipScore}%
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all duration-700"
              style={{ width: `${experienceGap.leadershipScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Mentorship, sprint coordination, and peer code reviews.
          </p>
        </div>

        {/* Architecture */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Network className="w-4 h-4 text-blue-400" /> Architecture
            </span>
            <span className="text-xs font-mono font-bold text-blue-400">
              {experienceGap.architectureScore}%
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-blue-400 h-2 rounded-full transition-all duration-700"
              style={{ width: `${experienceGap.architectureScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            System design, database schemas, and microservice modularity.
          </p>
        </div>

        {/* Ownership */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Ownership
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {experienceGap.ownershipScore}%
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-emerald-400 h-2 rounded-full transition-all duration-700"
              style={{ width: `${experienceGap.ownershipScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            End-to-end feature delivery, incident triage, and deployment.
          </p>
        </div>
      </div>

      {/* Project Scale Assessment & Responsibilities */}
      <div className="space-y-4">
        <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-1.5">
            <Scale className="w-4 h-4 text-blue-400" />
            Project Scale Assessment
          </div>
          <p className="text-xs text-slate-300">
            {experienceGap.projectScaleAssessment}
          </p>
        </div>

        {experienceGap.responsibilitiesGap.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5">
              Key Responsibilities Needed for This Level:
            </h4>
            <div className="space-y-1.5">
              {experienceGap.responsibilitiesGap.map((resp, i) => (
                <div
                  key={i}
                  className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                  <span>{resp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
