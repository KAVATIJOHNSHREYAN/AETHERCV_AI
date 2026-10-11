'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AtsScoreBreakdown } from '@/lib/resume/types'
import {
  User, FileText, GraduationCap, Briefcase, Code, Cpu,
  CheckCircle, Layout, Zap, Search, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react'

interface CategoryBreakdownProps {
  breakdown: AtsScoreBreakdown
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Contact Information': User,
  'Professional Summary': FileText,
  'Education': GraduationCap,
  'Experience': Briefcase,
  'Projects': Code,
  'Skills': Cpu,
  'Certifications': CheckCircle,
  'Formatting': Layout,
  'Action Verbs': Zap,
  'Keyword Optimization': Search
}

export function CategoryBreakdown({ breakdown }: CategoryBreakdownProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const categories = Object.values(breakdown.categories)

  const toggleExpand = (name: string) => {
    setExpandedCategory(expandedCategory === name ? null : name)
  }

  // Dual-Blue Progress Gradients
  const getStatusBarGradient = (percentage: number) => {
    if (percentage >= 80) return 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
    if (percentage >= 50) return 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
    return 'bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700'
  }

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 80) return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
    if (percentage >= 50) return 'text-sky-300 bg-sky-500/10 border-sky-500/30'
    return 'text-blue-300 bg-blue-600/15 border-blue-500/25'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
        <div>
          <h3 className="text-lg font-bold font-poppins text-white">
            Category-wise ATS Breakdown
          </h3>
          <p className="text-xs text-slate-400 font-outfit">
            Evaluated across 10 core dimensions totaling 100 points
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-600/20 text-sky-200 border border-blue-400/30">
          10 Dimensions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {categories.map((cat, index) => {
          const Icon = CATEGORY_ICONS[cat.name] || FileText
          const isExpanded = expandedCategory === cat.name
          const barGradient = getStatusBarGradient(cat.percentage)
          const badgeClass = getStatusBadge(cat.percentage)

          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="p-4 rounded-2xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 hover:border-sky-400/40 hover:shadow-[0_0_20px_-3px_rgba(59,130,246,0.25)] transition-all"
            >
              <div
                className="cursor-pointer select-none"
                onClick={() => toggleExpand(cat.name)}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-blue-500/15 text-cyan-400 border border-blue-500/30 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-semibold text-white font-poppins truncate">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-outfit">
                        Max {cat.maxScore} pts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                      {cat.score} / {cat.maxScore}
                    </span>
                    <button
                      type="button"
                      aria-label="Toggle details"
                      className="text-slate-400 hover:text-white transition-colors p-1"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-sky-400" />}
                    </button>
                  </div>
                </div>

                {/* Progress Bar with Dual-Blue Gradient */}
                <div className="w-full bg-[#1E293B] rounded-full h-2 overflow-hidden my-2">
                  <motion.div
                    className={`h-full rounded-full ${barGradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>

              {/* Feedback Summary */}
              <p className="text-xs text-slate-400 font-outfit mt-1 line-clamp-2">
                {cat.feedback}
              </p>

              {/* Collapsible Suggestions */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 pt-3 border-t border-blue-500/20 space-y-2 text-xs"
                  >
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
                      Actionable Recommendations:
                    </div>
                    {cat.suggestions.length > 0 ? (
                      <ul className="space-y-1.5 pl-2">
                        {cat.suggestions.map((sug, sIdx) => (
                          <li key={sIdx} className="text-slate-300 font-outfit flex items-start gap-1.5">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-cyan-300 font-outfit">
                        Outstanding score! This section meets top recruiter standards.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
