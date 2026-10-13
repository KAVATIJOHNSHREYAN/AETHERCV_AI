'use client'

import React from 'react'
import { RoadmapWeek } from '@/types/skill-gap'
import { Calendar, Target, CheckCircle2, PackageCheck, Clock } from 'lucide-react'

interface LearningRoadmapViewProps {
  roadmap: RoadmapWeek[]
  roleName: string
}

export function LearningRoadmapView({ roadmap, roleName }: LearningRoadmapViewProps) {
  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 mb-6 gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            12-Week AI-Powered Learning Roadmap
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step curriculum with weekly deliverables tailored for {roleName}.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl font-semibold">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Estimated Completion: 12 Weeks (8–10 hrs/week)</span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative border-l-2 border-indigo-500/30 ml-4 pl-6 space-y-7">
        {roadmap.map((week, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#0C162B] border-2 border-indigo-400 flex items-center justify-center group-hover:scale-125 transition-transform">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </div>

            <div className="bg-slate-950/70 border border-slate-800/90 hover:border-indigo-500/40 rounded-xl p-4.5 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-0.5 rounded-lg">
                    {week.weekRange}
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {week.title}
                  </h4>
                </div>

                <div className="flex flex-wrap gap-1">
                  {week.keySkills.map((sk, sidx) => (
                    <span
                      key={sidx}
                      className="text-[10.5px] font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div className="mb-3">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Core Goals:
                </span>
                <ul className="space-y-1">
                  {week.goals.map((goal, gidx) => (
                    <li key={gidx} className="text-xs text-slate-300 flex items-start gap-2">
                      <Target className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Milestones */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Actionable Milestones:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {week.milestones.map((ms, midx) => (
                    <div
                      key={midx}
                      className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{ms}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Deliverable */}
              {week.projectDeliverable && (
                <div className="mt-3 pt-3 border-t border-slate-900 flex items-center gap-2 text-xs text-emerald-300 font-semibold">
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  <span>Deliverable: {week.projectDeliverable}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
