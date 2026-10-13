'use client'

import React from 'react'
import { ProjectRecommendation } from '@/types/skill-gap'
import { FolderGit2, Clock, Sparkles, CheckCircle2, GitBranch, Layers } from 'lucide-react'

interface ProjectGapViewProps {
  projects: ProjectRecommendation[]
  roleName: string
}

export function ProjectGapView({ projects, roleName }: ProjectGapViewProps) {
  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/80 mb-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-purple-400" />
          Recommended Portfolio Projects to Bridge Skill Gap
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Building these specific production projects will demonstrate real-world competence for {roleName}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj, i) => {
          const isCrucial = proj.resumeValue === 'Crucial'
          const isVeryHigh = proj.resumeValue === 'Very High'

          return (
            <div
              key={proj.id || i}
              className="bg-slate-950/70 border border-slate-800/90 hover:border-purple-500/40 rounded-xl p-5 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider block mb-1">
                      {proj.category}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {proj.title}
                    </h4>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                      isCrucial
                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                        : isVeryHigh
                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300'
                    }`}
                  >
                    {proj.resumeValue} Value
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {proj.description}
                </p>

                {/* Tech stack */}
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
                    <Layers className="w-3 h-3 text-purple-400" /> Technologies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.map((t, tidx) => (
                      <span
                        key={tidx}
                        className="text-[10.5px] font-mono bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Deliverables */}
                <div className="mb-4 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60">
                  <span className="text-[11px] font-bold text-slate-300 block mb-2">
                    Key Deliverables:
                  </span>
                  <ul className="space-y-1.5">
                    {proj.keyDeliverables.map((deliv, didx) => (
                      <li key={didx} className="text-xs text-slate-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* GitHub Architecture */}
                <div className="text-[11px] text-slate-400 flex items-start gap-1.5 font-mono bg-slate-950 p-2.5 rounded border border-slate-900">
                  <GitBranch className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-300">Architecture:</strong> {proj.githubArchitecture}
                  </span>
                </div>
              </div>

              {/* Footer Meta */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-4 mt-4 border-t border-slate-900">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Est. Time: {proj.estimatedTime}</span>
                </div>

                <div className="flex items-center gap-1 font-semibold text-slate-300">
                  <span>Difficulty:</span>
                  <span
                    className={
                      proj.difficulty === 'Advanced'
                        ? 'text-purple-400'
                        : proj.difficulty === 'Intermediate'
                        ? 'text-blue-400'
                        : 'text-emerald-400'
                    }
                  >
                    {proj.difficulty}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
