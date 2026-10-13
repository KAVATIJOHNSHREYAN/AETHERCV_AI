'use client'

import React, { useState, useMemo } from 'react'
import {
  MASTER_JOB_ROLES,
  CATEGORY_DEFINITIONS,
  JobRoleCategory,
  JobRoleItem
} from '@/lib/job-roles/master-library'
import {
  Briefcase,
  Search,
  X,
  Check,
  Sparkles,
  Layers,
  Code,
  Database,
  Cloud,
  Shield,
  CheckCircle2,
  Palette,
  Server,
  Boxes,
  Cpu,
  Crown,
  LineChart,
  TrendingUp,
  Headphones,
  Microscope,
  Zap,
  GraduationCap
} from 'lucide-react'

// Icon mapping for categories
const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  Layers,
  Code,
  Sparkles,
  Database,
  Cloud,
  Shield,
  CheckCircle2,
  Briefcase,
  Palette,
  Server,
  Boxes,
  Cpu,
  Crown,
  LineChart,
  TrendingUp,
  Headphones,
  Microscope,
  Zap,
  GraduationCap
}

function getCategoryIcon(category: string): React.ElementType {
  const def = CATEGORY_DEFINITIONS.find(c => c.id === category)
  if (def && CATEGORY_ICON_MAP[def.iconName]) {
    return CATEGORY_ICON_MAP[def.iconName]
  }
  return Briefcase
}

interface RoleBrowserModalProps {
  isOpen: boolean
  onClose: () => void
  selectedRole: string
  onSelectRole: (role: string) => void
}

export function RoleBrowserModal({
  isOpen,
  onClose,
  selectedRole,
  onSelectRole
}: RoleBrowserModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Calculate counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: MASTER_JOB_ROLES.length }
    MASTER_JOB_ROLES.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1
    })
    return counts
  }, [])

  // Filtered roles
  const filteredRoles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return MASTER_JOB_ROLES.filter(r => {
      const matchesCategory =
        selectedCategory === 'All' || r.category === selectedCategory
      if (!matchesCategory) return false

      if (!q) return true
      return (
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.aliases.some(a => a.toLowerCase().includes(q))
      )
    })
  }, [searchQuery, selectedCategory])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0C162B] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Top 200+ Master Job Roles
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                  {MASTER_JOB_ROLES.length} Roles
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Standardized global tech & industry roles calibrated with live salary benchmarks.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Custom Input */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60 shrink-0 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, acronym (e.g. SRE, ML, SDET), or keywords..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills (Scrollable) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition flex items-center gap-1.5 ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>All</span>
              <span className="text-[10px] opacity-75 font-mono">({categoryCounts['All'] || 0})</span>
            </button>

            {CATEGORY_DEFINITIONS.filter(c => c.id !== 'All').map(cat => {
              const count = categoryCounts[cat.id] || 0
              if (count === 0) return null
              const Icon = CATEGORY_ICON_MAP[cat.iconName] || Briefcase
              const isSelected = selectedCategory === cat.id

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1.5 rounded-lg font-medium shrink-0 transition flex items-center gap-1.5 text-xs ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  <span>{cat.shortLabel || cat.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Roles List Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>
              Showing <strong className="text-white">{filteredRoles.length}</strong> of{' '}
              {MASTER_JOB_ROLES.length} roles
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSelectRole(searchQuery.trim())
                  onClose()
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold underline"
              >
                Use custom: &quot;{searchQuery.trim()}&quot;
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filteredRoles.map(role => {
              const isSelected = selectedRole.toLowerCase() === role.title.toLowerCase()
              const Icon = getCategoryIcon(role.category)

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    onSelectRole(role.title)
                    onClose()
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 group ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-850 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-xs sm:text-[13px] leading-snug line-clamp-1 group-hover:text-blue-300 transition-colors">
                      {role.title}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/90 text-slate-400 border border-slate-800 flex items-center gap-1">
                      <Icon className="w-2.5 h-2.5 text-blue-400" />
                      {role.category}
                    </span>
                    {role.aliases && role.aliases.length > 0 && role.aliases[0] !== role.title && (
                      <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-blue-950/40 text-blue-300 font-mono">
                        {role.aliases[0]}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {filteredRoles.length === 0 && (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">No exact role found</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Would you like to use &quot;<span className="text-white font-medium">{searchQuery}</span>&quot; as your custom title?
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (searchQuery.trim()) {
                    onSelectRole(searchQuery.trim())
                    onClose()
                  }
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
              >
                Apply &quot;{searchQuery}&quot;
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Click any role to populate the salary calculator</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
