'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CategoryScore, AtsScoreBreakdown } from '@/lib/resume/types'
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

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-500'
    if (percentage >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
    if (percentage >= 50) return 'text-amber-600 bg-amber-500/10 border-amber-500/20'
    return 'text-red-600 bg-red-500/10 border-red-500/20'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div>
          <h3 className="text-lg font-bold font-poppins text-foreground">
            Category-wise ATS Breakdown
          </h3>
          <p className="text-xs text-muted-foreground font-outfit">
            Evaluated across 10 core dimensions totaling 100 points
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
          10 Categories
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {categories.map((cat, index) => {
          const Icon = CATEGORY_ICONS[cat.name] || FileText
          const isExpanded = expandedCategory === cat.name
          const barColor = getStatusColor(cat.percentage)
          const badgeClass = getStatusBadge(cat.percentage)

          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-border transition-all shadow-sm"
            >
              <div
                className="cursor-pointer select-none"
                onClick={() => toggleExpand(cat.name)}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-semibold text-foreground font-poppins truncate">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground font-outfit">
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
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden my-2">
                  <motion.div
                    className={`h-full rounded-full ${barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>

              {/* Feedback Summary */}
              <p className="text-xs text-muted-foreground font-outfit mt-1 line-clamp-2">
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
                    className="mt-3 pt-3 border-t border-border/40 space-y-2 text-xs"
                  >
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                      Actionable Recommendations:
                    </div>
                    {cat.suggestions.length > 0 ? (
                      <ul className="space-y-1.5 pl-2">
                        {cat.suggestions.map((sug, sIdx) => (
                          <li key={sIdx} className="text-muted-foreground font-outfit flex items-start gap-1.5">
                            <span className="text-primary font-bold">•</span>
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-emerald-600 dark:text-emerald-400 font-outfit">
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
