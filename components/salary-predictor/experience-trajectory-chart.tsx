'use client'

import React from 'react'
import { ExperienceBracketSalary } from '@/types/salary-predictor'
import { formatCurrencyAmount } from '@/lib/salary-predictor/countries-data'
import { TrendingUp, CheckCircle2 } from 'lucide-react'

interface ExperienceTrajectoryChartProps {
  progression: ExperienceBracketSalary[]
  activeCurrency: string
}

export function ExperienceTrajectoryChart({
  progression,
  activeCurrency
}: ExperienceTrajectoryChartProps) {
  const maxMedian = Math.max(...progression.map(p => p.median)) || 1

  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Experience Curve & Career Trajectory
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparative salary growth curve across 7 industry career milestones.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Curated for active role & location
        </div>
      </div>

      <div className="space-y-4">
        {progression.map((item, idx) => {
          const barWidthPercent = Math.max(12, Math.round((item.median / maxMedian) * 100))
          const prevItem = idx > 0 ? progression[idx - 1] : null
          const stepGrowth = prevItem
            ? Math.round(((item.median - prevItem.median) / prevItem.median) * 100)
            : null

          return (
            <div
              key={item.bracketKey}
              className={`p-3.5 rounded-2xl border transition-all ${
                item.isCurrentLevel
                  ? 'bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-500/10'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{item.bracket}</span>
                  {item.isCurrentLevel && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3" /> Your Level
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono">
                  {stepGrowth !== null && (
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      +{stepGrowth}%
                    </span>
                  )}
                  <span className="font-bold text-white text-sm">
                    {formatCurrencyAmount(item.median, activeCurrency)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden flex items-center">
                <div
                  style={{ width: `${barWidthPercent}%` }}
                  className={`h-full rounded-full transition-all duration-700 ${
                    item.isCurrentLevel
                      ? 'bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300'
                      : 'bg-gradient-to-r from-slate-700 to-slate-500'
                  }`}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5 font-mono">
                <span>Range: {formatCurrencyAmount(item.min, activeCurrency)}</span>
                <span>Top Tier: {formatCurrencyAmount(item.max, activeCurrency)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
