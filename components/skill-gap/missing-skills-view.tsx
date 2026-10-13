'use client'

import React, { useState } from 'react'
import { MissingSkill } from '@/types/skill-gap'
import { AlertTriangle, Clock, ArrowUpRight, Flame, ShieldAlert, Sparkles } from 'lucide-react'

interface MissingSkillsViewProps {
  missingSkills: MissingSkill[]
}

export function MissingSkillsView({ missingSkills }: MissingSkillsViewProps) {
  const [filterPriority, setFilterPriority] = useState<string>('All')

  const highPriority = missingSkills.filter(s => s.priority === 'High Priority')
  const mediumPriority = missingSkills.filter(s => s.priority === 'Medium Priority')
  const lowPriority = missingSkills.filter(s => s.priority === 'Low Priority')

  const displayedSkills =
    filterPriority === 'All'
      ? missingSkills
      : missingSkills.filter(s => s.priority === filterPriority)

  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 mb-5 gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Missing Skills Analysis ({missingSkills.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Prioritized competencies required by recruiters that are absent from your resume.
          </p>
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterPriority('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              filterPriority === 'All'
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All ({missingSkills.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterPriority('High Priority')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
              filterPriority === 'High Priority'
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>High ({highPriority.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterPriority('Medium Priority')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
              filterPriority === 'Medium Priority'
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Medium ({mediumPriority.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterPriority('Low Priority')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
              filterPriority === 'Low Priority'
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            <span>Low ({lowPriority.length})</span>
          </button>
        </div>
      </div>

      {/* List of Skills */}
      {displayedSkills.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No skills in this priority tier. You are well-aligned!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedSkills.map((skill, idx) => {
            const isHigh = skill.priority === 'High Priority'
            const isMedium = skill.priority === 'Medium Priority'

            return (
              <div
                key={idx}
                className={`bg-slate-950/70 border rounded-xl p-4 flex flex-col justify-between transition-all hover:border-slate-700 ${
                  isHigh
                    ? 'border-rose-500/30 hover:border-rose-500/50'
                    : isMedium
                    ? 'border-amber-500/30 hover:border-amber-500/50'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {skill.name}
                        <span className="text-[10px] font-normal text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {skill.category}
                        </span>
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                        isHigh
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                          : isMedium
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      {skill.priority}
                    </span>
                  </div>

                  {/* Why each skill matters */}
                  <div className="mt-3 bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/60">
                    <p className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      Why this skill matters:
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {skill.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 mt-3 border-t border-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Est. Effort: ~{skill.estimatedHours || 20} hours</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-slate-300">
                    <span>Difficulty:</span>
                    <span
                      className={
                        skill.learningDifficulty === 'Challenging'
                          ? 'text-rose-400'
                          : skill.learningDifficulty === 'Moderate'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }
                    >
                      {skill.learningDifficulty}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
