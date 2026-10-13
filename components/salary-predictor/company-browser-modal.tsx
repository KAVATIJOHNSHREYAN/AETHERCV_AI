'use client'

import React, { useState, useMemo } from 'react'
import {
  COMPANIES_DATABASE,
  CompanyProfile
} from '@/lib/salary-predictor/companies-data'
import {
  Building2,
  Search,
  X,
  Check,
  Sparkles,
  MapPin,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Briefcase,
  Globe2
} from 'lucide-react'

interface CompanyBrowserModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCompany: string
  onSelectCompany: (company: string) => void
}

const SECTOR_TIERS = [
  'All',
  'Tier 1 Big Tech',
  'Enterprise Cloud',
  'Hardware & Semiconductor',
  'High-Growth Tech Unicorn',
  'FinTech & Banking',
  'Global IT & Consulting'
]

export function CompanyBrowserModal({
  isOpen,
  onClose,
  selectedCompany,
  onSelectCompany
}: CompanyBrowserModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTier, setSelectedTier] = useState<string>('All')

  // Calculate counts per tier
  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = { All: COMPANIES_DATABASE.length }
    COMPANIES_DATABASE.forEach(c => {
      counts[c.tier] = (counts[c.tier] || 0) + 1
    })
    return counts
  }, [])

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return COMPANIES_DATABASE.filter(c => {
      const matchesTier = selectedTier === 'All' || c.tier === selectedTier
      if (!matchesTier) return false

      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        (c.ticker && c.ticker.toLowerCase().includes(q)) ||
        c.headquarters.toLowerCase().includes(q) ||
        c.primaryIndustries.some(ind => ind.toLowerCase().includes(q))
      )
    })
  }, [searchQuery, selectedTier])

  if (!isOpen) return null

  const getTierColor = (tier: string) => {
    if (tier.includes('Big Tech')) return 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    if (tier.includes('Enterprise Cloud')) return 'bg-blue-500/15 text-blue-300 border-blue-500/30'
    if (tier.includes('Hardware')) return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    if (tier.includes('Unicorn')) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    if (tier.includes('FinTech')) return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
    return 'bg-slate-500/15 text-slate-300 border-slate-500/30'
  }

  const getHiringBadge = (status: string) => {
    if (status === 'Aggressive') return 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
    if (status === 'Selective') return 'bg-amber-950/50 text-amber-300 border-amber-500/30'
    return 'bg-blue-950/50 text-blue-300 border-blue-500/30'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0C162B] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Top 200+ Global Employers & Tech Giants
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                  {COMPANIES_DATABASE.length} Companies
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Curated across Tier 1 Big Tech, AI Frontiers, Cloud, FinTech, Semiconductors, and Global IT.
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

        {/* Search Bar & Tier Filter */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60 shrink-0 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by employer name (e.g. Google, Anthropic, NVIDIA), ticker, location..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
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

          {/* Sector / Tier Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {SECTOR_TIERS.map(tier => {
              const count = tierCounts[tier] || 0
              const isSelected = selectedTier === tier

              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setSelectedTier(tier)}
                  className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition flex items-center gap-1.5 text-xs ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{tier}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Companies Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>
              Showing <strong className="text-white">{filteredCompanies.length}</strong> of{' '}
              {COMPANIES_DATABASE.length} verified employers
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSelectCompany(searchQuery.trim())
                  onClose()
                }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline"
              >
                Use custom: &quot;{searchQuery.trim()}&quot;
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filteredCompanies.map(company => {
              const isSelected = selectedCompany.toLowerCase() === company.name.toLowerCase()

              return (
                <button
                  key={company.name}
                  type="button"
                  onClick={() => {
                    onSelectCompany(company.name)
                    onClose()
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 group ${
                    isSelected
                      ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-850 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-[10px] text-cyan-400 shrink-0 font-mono">
                          {company.logoText || company.name.slice(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-xs sm:text-[13px] leading-snug line-clamp-1 group-hover:text-cyan-300 transition-colors">
                            {company.name}
                          </span>
                          {company.ticker && (
                            <span className="text-[10px] font-mono text-slate-400">
                              {company.ticker}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9.5px] px-2 py-0.5 rounded-md border font-medium ${getTierColor(company.tier)}`}>
                        {company.tier}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-semibold ${getHiringBadge(company.hiringStatus)}`}>
                        {company.hiringStatus}
                      </span>
                      <span className="text-[9.5px] px-1.5 py-0.5 rounded-md bg-slate-950/80 text-cyan-300 border border-slate-800 font-mono">
                        {company.compensationMultiplier}x TC
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
                      <MapPin className="w-2.5 h-2.5 shrink-0 text-slate-500" />
                      <span className="truncate">{company.headquarters}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">No employer profile found</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Would you like to predict salaries for &quot;<span className="text-white font-medium">{searchQuery}</span>&quot;?
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (searchQuery.trim()) {
                    onSelectCompany(searchQuery.trim())
                    onClose()
                  }
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20"
              >
                Apply &quot;{searchQuery}&quot;
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Click any company to populate target employer</span>
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
