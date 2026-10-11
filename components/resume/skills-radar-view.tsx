'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CategorizedSkills } from '@/lib/resume/types'
import {
  Code2, Layers, BookMarked, Database, Cloud, Terminal, Sparkles, HeartHandshake,
  Cpu, Check
} from 'lucide-react'

interface SkillsRadarViewProps {
  skills: CategorizedSkills
  totalSkillsCount: number
}

const CATEGORY_META = [
  { key: 'programmingLanguages' as const, label: 'Programming Languages', icon: Code2, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { key: 'frameworks' as const, label: 'Frameworks & Runtimes', icon: Layers, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  { key: 'libraries' as const, label: 'Libraries & Utilities', icon: BookMarked, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
  { key: 'databases' as const, label: 'Databases & Storage', icon: Database, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { key: 'cloudPlatforms' as const, label: 'Cloud Infrastructure', icon: Cloud, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
  { key: 'devOpsTools' as const, label: 'DevOps & Tooling', icon: Terminal, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { key: 'aiMlSkills' as const, label: 'AI & Machine Learning', icon: Sparkles, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  { key: 'softSkills' as const, label: 'Leadership & Soft Skills', icon: HeartHandshake, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' }
]

export function SkillsRadarView({ skills, totalSkillsCount }: SkillsRadarViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border/40 gap-2">
        <div>
          <h3 className="text-lg font-bold font-poppins text-foreground flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            Classified Technical Skills
          </h3>
          <p className="text-xs text-muted-foreground font-outfit">
            Normalized and classified into 8 professional tech taxonomy clusters
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
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
              className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-border transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground font-poppins">
                      {cat.label}
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {list.length}
                  </span>
                </div>

                {hasItems ? (
                  <div className="flex flex-wrap gap-1.5">
                    {list.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary/70 hover:bg-secondary text-foreground border border-border/40 transition-colors"
                      >
                        <Check className="w-3 h-3 text-emerald-500" />
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="py-2 text-xs text-muted-foreground italic font-outfit">
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
