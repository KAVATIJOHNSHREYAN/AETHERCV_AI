'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CategorizedSkills } from '@/lib/resume/types'
import {
  Code2, Layers, BookMarked, Database, Cloud, Terminal,
  Sparkles, HeartHandshake, Check, Cpu
} from 'lucide-react'

interface SkillsRadarViewProps {
  skills: CategorizedSkills
  totalSkillsCount: number
}

// Exact Dual-Color Category Color Tokens (#4D48E6 to #1E50DA)
const CATEGORY_META = [
  { key: 'programmingLanguages' as const, label: 'Programming Languages', icon: Code2, color: 'text-[#818cf8] bg-[#4D48E6]/15 border-[#4D48E6]/40' },
  { key: 'frameworks' as const, label: 'Frameworks & Runtimes', icon: Layers, color: 'text-blue-300 bg-blue-600/15 border-blue-500/30' },
  { key: 'libraries' as const, label: 'Libraries & Utilities', icon: BookMarked, color: 'text-[#818cf8] bg-[#4D48E6]/15 border-[#4D48E6]/40' },
  { key: 'databases' as const, label: 'Databases & Storage', icon: Database, color: 'text-blue-300 bg-blue-600/15 border-blue-500/30' },
  { key: 'cloudPlatforms' as const, label: 'Cloud Infrastructure', icon: Cloud, color: 'text-[#818cf8] bg-[#4D48E6]/15 border-[#4D48E6]/40' },
  { key: 'devOpsTools' as const, label: 'DevOps & Tooling', icon: Terminal, color: 'text-blue-300 bg-blue-600/15 border-blue-500/30' },
  { key: 'aiMlSkills' as const, label: 'AI & Machine Learning', icon: Sparkles, color: 'text-[#818cf8] bg-[#4D48E6]/15 border-[#4D48E6]/40' },
  { key: 'softSkills' as const, label: 'Leadership & Execution', icon: HeartHandshake, color: 'text-blue-300 bg-blue-600/15 border-blue-500/30' }
]

export function SkillsRadarView({ skills, totalSkillsCount }: SkillsRadarViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-blue-500/20 gap-2">
        <div>
          <h3 className="text-lg font-bold font-poppins text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#818cf8]" />
            Classified Technical Skills
          </h3>
          <p className="text-xs text-slate-400 font-outfit">
            Normalized and classified into 8 professional tech taxonomy clusters
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-[#4D48E6]/25 to-[#1E50DA]/25 text-white border border-[#4D48E6]/40 shadow-[0_0_10px_rgba(77,72,230,0.25)]">
          {totalSkillsCount} Skills Identified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORY_META.map((cat, idx) => {
          const list = skills[cat.key] || []
          const Icon = cat.icon
          const hasItems = list.length > 0

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="p-4 rounded-2xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 hover:border-[#4D48E6]/50 hover:shadow-[0_0_20px_-3px_rgba(77,72,230,0.25)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${cat.color} shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-white font-poppins">
                      {cat.label}
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#0E1729] text-blue-300 border border-blue-500/25">
                    {list.length}
                  </span>
                </div>

                {hasItems ? (
                  <div className="flex flex-wrap gap-1.5">
                    {list.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#08111F] hover:bg-[#4D48E6]/20 text-slate-200 border border-blue-500/25 hover:border-[#4D48E6]/50 transition-colors shadow-sm"
                      >
                        <Check className="w-3 h-3 text-[#818cf8]" />
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="py-2 text-xs text-slate-400 italic font-outfit">
                    No specific skills detected in this category. Consider adding relevant tools.
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
