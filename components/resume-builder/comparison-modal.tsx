'use client'

import React, { useState } from 'react'
import { ResumeVersion } from '@/types/resume-builder'
import {
  GitCompare, X, Award, CheckCircle2, TrendingUp, Layers,
  ArrowRight, ShieldCheck, Sparkles
} from 'lucide-react'
import { calculateLiveAtsScore } from '@/lib/resume-builder/ats-calculator'

interface ComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  versions: ResumeVersion[]
}

export function ComparisonModal({ isOpen, onClose, versions }: ComparisonModalProps) {
  const [verAId, setVerAId] = useState<string>(versions[0]?.id || '')
  const [verBId, setVerBId] = useState<string>(versions[1]?.id || versions[0]?.id || '')

  if (!isOpen) return null

  const verA = versions.find((v) => v.id === verAId) || versions[0]
  const verB = versions.find((v) => v.id === verBId) || versions[1] || versions[0]

  const scoreA = verA ? calculateLiveAtsScore(verA.data) : null
  const scoreB = verB ? calculateLiveAtsScore(verB.data) : null

  const getMetrics = (ver: ResumeVersion | undefined) => {
    if (!ver) return { skills: 0, projects: 0, exp: 0, words: 0 }
    const skillsCount = ver.data.skills.reduce((acc, c) => acc + c.skills.length, 0)
    const projectsCount = ver.data.projects.length
    const expCount = ver.data.experience.length
    const words = [
      ver.data.professionalSummary,
      ...ver.data.experience.flatMap((e) => e.responsibilities),
      ...ver.data.projects.flatMap((p) => p.bulletPoints)
    ]
      .join(' ')
      .split(/\s+/)
      .filter(Boolean).length
    return { skills: skillsCount, projects: projectsCount, exp: expCount, words }
  }

  const metricsA = getMetrics(verA)
  const metricsB = getMetrics(verB)

  const scoreDiff = (scoreB?.overallScore || 0) - (scoreA?.overallScore || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0C162B] border border-blue-500/25 p-6 shadow-2xl space-y-6 font-outfit text-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-blue-500/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#818cf8] flex items-center justify-center">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-poppins text-white">Compare Resume Versions</h3>
              <p className="text-xs text-slate-400">Side-by-side ATS score breakdown and architectural metrics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version Pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Version A (Base)</label>
            <select
              value={verAId}
              onChange={(e) => setVerAId(e.target.value)}
              className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs font-semibold"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (Score: {v.atsScore})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Version B (Comparison)</label>
            <select
              value={verBId}
              onChange={(e) => setVerBId(e.target.value)}
              className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs font-semibold"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (Score: {v.atsScore})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overall Score Comparison Card */}
        <div className="p-4 rounded-2xl bg-[#07101F] border border-blue-500/20 grid grid-cols-3 items-center text-center">
          <div>
            <span className="text-xs text-slate-400 block">{verA?.name}</span>
            <span className="text-2xl font-black text-white font-poppins">{scoreA?.overallScore || 0}</span>
            <span className="text-[10px] text-slate-500 block">Grade {scoreA?.overallGrade}</span>
          </div>

          <div className="flex flex-col items-center">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                scoreDiff > 0
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : scoreDiff < 0
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-blue-500/10 text-slate-300 border-blue-500/30'
              }`}
            >
              {scoreDiff > 0 ? `+${scoreDiff} Pts Higher` : scoreDiff < 0 ? `${scoreDiff} Pts` : 'Identical Score'}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">Delta Analysis</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block">{verB?.name}</span>
            <span className="text-2xl font-black text-white font-poppins">{scoreB?.overallScore || 0}</span>
            <span className="text-[10px] text-slate-500 block">Grade {scoreB?.overallGrade}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-[#07101F] border border-blue-500/15 text-center">
            <span className="text-[10px] text-slate-400 block">Skills</span>
            <div className="flex items-center justify-center gap-1 font-bold text-white text-xs mt-0.5">
              <span>{metricsA.skills}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className={metricsB.skills >= metricsA.skills ? 'text-emerald-400' : 'text-slate-300'}>
                {metricsB.skills}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#07101F] border border-blue-500/15 text-center">
            <span className="text-[10px] text-slate-400 block">Projects</span>
            <div className="flex items-center justify-center gap-1 font-bold text-white text-xs mt-0.5">
              <span>{metricsA.projects}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className={metricsB.projects >= metricsA.projects ? 'text-emerald-400' : 'text-slate-300'}>
                {metricsB.projects}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#07101F] border border-blue-500/15 text-center">
            <span className="text-[10px] text-slate-400 block">Experience</span>
            <div className="flex items-center justify-center gap-1 font-bold text-white text-xs mt-0.5">
              <span>{metricsA.exp}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className={metricsB.exp >= metricsA.exp ? 'text-emerald-400' : 'text-slate-300'}>
                {metricsB.exp}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#07101F] border border-blue-500/15 text-center">
            <span className="text-[10px] text-slate-400 block">Word Count</span>
            <div className="flex items-center justify-center gap-1 font-bold text-white text-xs mt-0.5">
              <span>{metricsA.words}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="text-sky-400">{metricsB.words}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
