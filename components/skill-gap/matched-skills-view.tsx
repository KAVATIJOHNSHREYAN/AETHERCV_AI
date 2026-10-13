'use client'

import React, { useState } from 'react'
import { MatchedSkill, SkillCategory } from '@/types/skill-gap'
import {
  CheckCircle2,
  Code,
  Layout,
  Server,
  Cloud,
  Terminal,
  Brain,
  Cpu,
  Database,
  Wrench,
  Layers,
  Users2
} from 'lucide-react'

interface MatchedSkillsViewProps {
  matchedSkills: MatchedSkill[]
}

const CATEGORIES_ORDER: SkillCategory[] = [
  'Programming Languages',
  'Frontend',
  'Backend',
  'Cloud',
  'DevOps',
  'AI',
  'Machine Learning',
  'Databases',
  'Tools',
  'Frameworks',
  'Soft Skills'
]

const CATEGORY_ICON_MAP: Record<SkillCategory, React.ElementType> = {
  'Programming Languages': Code,
  'Frontend': Layout,
  'Backend': Server,
  'Cloud': Cloud,
  'DevOps': Terminal,
  'AI': Brain,
  'Machine Learning': Cpu,
  'Databases': Database,
  'Tools': Wrench,
  'Frameworks': Layers,
  'Soft Skills': Users2
}

export function MatchedSkillsView({ matchedSkills }: MatchedSkillsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Group matched skills by category
  const skillsByCategory: Record<string, MatchedSkill[]> = {}
  CATEGORIES_ORDER.forEach(cat => {
    skillsByCategory[cat] = []
  })

  matchedSkills.forEach(s => {
    if (!skillsByCategory[s.category]) {
      skillsByCategory[s.category] = []
    }
    skillsByCategory[s.category].push(s)
  })

  const filteredCategories =
    selectedCategory === 'All'
      ? CATEGORIES_ORDER.filter(cat => (skillsByCategory[cat] || []).length > 0)
      : [selectedCategory as SkillCategory]

  return (
    <div className="bg-gradient-to-b from-[#0A1A36] to-[#071328] border border-blue-900/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-blue-950/80 mb-5 gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Matched Skills ({matchedSkills.length})
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Verified competencies in your resume matching target role requirements.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                : 'bg-[#0A1730] border-blue-900/40 text-slate-300 hover:text-white'
            }`}
          >
            All Categories ({matchedSkills.length})
          </button>
          {CATEGORIES_ORDER.map(cat => {
            const count = (skillsByCategory[cat] || []).length
            if (count === 0) return null
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-[#0A1730] border-blue-900/40 text-slate-300 hover:text-white'
                }`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid of Categories */}
      {matchedSkills.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          No direct skills matched yet. Review the missing skills list to begin bridging the gap!
        </div>
      ) : (
        <div className="space-y-5">
          {filteredCategories.map(cat => {
            const skills = skillsByCategory[cat] || []
            if (skills.length === 0) return null
            const Icon = CATEGORY_ICON_MAP[cat] || Layers

            return (
              <div key={cat} className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span>{cat}</span>
                  <span className="text-[10px] text-emerald-300 font-mono font-bold">({skills.length})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {skills.map((skill, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-b from-[#07241C] to-[#051613] border border-emerald-500/30 hover:border-emerald-400/60 rounded-xl p-3 flex flex-col justify-between transition-all group shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:text-emerald-200 transition-colors">
                          {skill.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                          {skill.proficiencyEstimate}
                        </span>
                      </div>
                      {skill.matchedContext && (
                        <p className="text-[10.5px] text-slate-300 mt-2 line-clamp-2 italic font-mono bg-black/40 p-1.5 rounded border border-emerald-500/20">
                          &quot;{skill.matchedContext}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
