'use client'

import React from 'react'
import { SkillImpactItem } from '@/types/salary-predictor'
import { Sparkles, CheckCircle2, ArrowUpRight, Flame } from 'lucide-react'

interface SkillImpactMatrixProps {
  skills: SkillImpactItem[]
}

export function SkillImpactMatrix({ skills }: SkillImpactMatrixProps) {
  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Skill ROI & Compensation Premium Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            How individual technical competencies and specialized certifications drive your salary higher.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Ranked by market demand premium
        </div>
      </div>

      {/* Grid of Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {skills.map((item, idx) => {
          const isPossessed = item.currentStatus === 'possessed'

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                isPossessed
                  ? 'bg-blue-950/20 border-blue-500/40 shadow-md shadow-blue-500/5'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {item.skill}
                  </h4>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Est. Timeline: {item.timeframe}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    item.demandLevel === 'Critical'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : item.demandLevel === 'High'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}
                >
                  <Flame className="w-3 h-3" />
                  {item.demandLevel}
                </span>
              </div>

              {/* Boost figure */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 font-mono">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">
                    {item.formattedIncrease}
                  </span>
                  <span className="text-xs text-slate-400">
                    (+{item.percentageBoost}%)
                  </span>
                </div>

                {isPossessed ? (
                  <span className="text-[11px] font-semibold text-blue-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">
                    Potential Lift
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
