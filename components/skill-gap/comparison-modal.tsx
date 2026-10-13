'use client'

import React from 'react'
import { SkillGapHistoryItem } from '@/types/skill-gap'
import { X, GitCompare, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react'

interface ComparisonModalProps {
  itemA: SkillGapHistoryItem | null
  itemB: SkillGapHistoryItem | null
  onClose: () => void
}

export function ComparisonModal({ itemA, itemB, onClose }: ComparisonModalProps) {
  if (!itemA || !itemB) return null

  const dataA = itemA.data
  const dataB = itemB.data

  const scoreDiff = dataB.overallScore - dataA.overallScore

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-[#0C162B] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Compare Skill Gap Analyses</h3>
              <p className="text-xs text-slate-400">
                Side-by-side evaluation of qualifications, scores, and missing competencies.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Score Comparison Banner */}
          <div className="grid grid-cols-2 gap-4">
            {/* Version A */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                {new Date(itemA.timestamp).toLocaleDateString()}
              </span>
              <h4 className="text-sm font-bold text-white mb-2">{itemA.title}</h4>
              <div className="text-3xl font-black text-blue-400">{dataA.overallScore}%</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">{dataA.matchLevel}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Role: {dataA.targetRole}</div>
            </div>

            {/* Version B */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                {new Date(itemB.timestamp).toLocaleDateString()}
              </span>
              <h4 className="text-sm font-bold text-white mb-2">{itemB.title}</h4>
              <div className="text-3xl font-black text-indigo-400">{dataB.overallScore}%</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">{dataB.matchLevel}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Role: {dataB.targetRole}</div>
            </div>
          </div>

          {/* Score Delta */}
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3 text-center text-xs">
            {scoreDiff > 0 ? (
              <span className="text-emerald-300 font-bold">
                ▲ Score increased by +{scoreDiff}% in the later analysis!
              </span>
            ) : scoreDiff < 0 ? (
              <span className="text-amber-300 font-bold">
                ▼ Score decreased by {scoreDiff}% (target requirements may be more stringent).
              </span>
            ) : (
              <span className="text-slate-300 font-bold">Both analyses share identical overall match scores.</span>
            )}
          </div>

          {/* Metric Comparison Table */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Metric</th>
                  <th className="p-3">{itemA.title}</th>
                  <th className="p-3">{itemB.title}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Matched Skills Count</td>
                  <td className="p-3 text-emerald-400">{dataA.matchedSkills.length} skills</td>
                  <td className="p-3 text-emerald-400">{dataB.matchedSkills.length} skills</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Missing Skills Count</td>
                  <td className="p-3 text-amber-400">{dataA.missingSkills.length} skills</td>
                  <td className="p-3 text-amber-400">{dataB.missingSkills.length} skills</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Resume Readiness</td>
                  <td className="p-3">{dataA.readinessMetrics.resumeReadiness}%</td>
                  <td className="p-3">{dataB.readinessMetrics.resumeReadiness}%</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Placement Readiness</td>
                  <td className="p-3">{dataA.readinessMetrics.placementReadiness}%</td>
                  <td className="p-3">{dataB.readinessMetrics.placementReadiness}%</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Missing Recruiter Keywords</td>
                  <td className="p-3">{dataA.missingKeywords.length} keywords</td>
                  <td className="p-3">{dataB.missingKeywords.length} keywords</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  )
}
