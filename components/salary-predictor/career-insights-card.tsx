'use client'

import React from 'react'
import { CareerRecommendation } from '@/types/salary-predictor'
import { Award, Compass, FolderGit2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

interface CareerInsightsCardProps {
  insights: CareerRecommendation
}

export function CareerInsightsCard({ insights }: CareerInsightsCardProps) {
  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400" />
            AI Career Advancement Roadmap & Upskilling Strategy
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Actionable milestones to reach the next compensation tier and accelerate promotion velocity.
          </p>
        </div>
      </div>

      {/* 5-Year Salary Progression Timeline */}
      <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          5-Year Expected Compensation Progression
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {insights.salaryProgressionRoadmap.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border relative ${
                idx === 0
                  ? 'bg-blue-950/20 border-blue-500/30'
                  : 'bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                {item.year}
              </span>
              <span className="text-sm font-bold text-white block mt-1 line-clamp-1">
                {item.role}
              </span>
              <span className="text-base font-extrabold text-emerald-400 block mt-2 font-mono">
                {item.formattedSalary}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column: Next Career Roles & Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Next Career Roles */}
        <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            Likely Next Career Roles & Comp Potential
          </h4>

          <div className="space-y-2.5">
            {insights.nextCareerRoles.map((role, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <h5 className="text-xs font-bold text-white">{role.title}</h5>
                  <span className="text-[11px] text-slate-400">Target Timeframe: {role.timeframe}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block font-mono">
                    {role.formattedSalary}
                  </span>
                  <span className="text-[10px] text-blue-400 font-semibold">
                    +{role.expectedIncreasePercent}% Growth
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications with High ROI */}
        <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Top Industry Certifications for Salary Boost
          </h4>

          <div className="space-y-2.5">
            {insights.certificationsToObtain.map((cert, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-xs font-bold text-white">{cert.name}</h5>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    {cert.roi}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block">Issued by {cert.provider}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Portfolio Projects */}
      <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
          Recommended Portfolio Projects to Command Top Compensation
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {insights.recommendedProjects.map((proj, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
            >
              <h5 className="text-xs font-bold text-white">{proj.title}</h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">{proj.marketAppeal}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {proj.tech.map(t => (
                  <span
                    key={t}
                    className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
