'use client'

import React, { useState } from 'react'
import { CompanyComparisonItem } from '@/types/salary-predictor'
import { formatCurrencyAmount } from '@/lib/salary-predictor/countries-data'
import { Building2, Star, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react'

interface CompanyComparisonMatrixProps {
  companies: CompanyComparisonItem[]
  activeCurrency: string
}

export function CompanyComparisonMatrix({
  companies,
  activeCurrency
}: CompanyComparisonMatrixProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            Employer Compensation Benchmarks
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side total rewards packages across tier-1 big tech, product firms, and IT services.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Showing {companies.length} peer companies
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map(comp => {
          const isPositive = comp.diffVsCurrentPercent >= 0

          return (
            <div
              key={comp.companyName}
              onClick={() => setSelectedCompany(comp.companyName)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                comp.isUserCompany
                  ? 'bg-blue-950/40 border-blue-500/60 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-inner">
                    {comp.logoText}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {comp.companyName}
                      {comp.isUserCompany && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" title="Selected Target" />
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400 block">{comp.companyTier}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{comp.rating}</span>
                </div>
              </div>

              {/* Total Comp Figure */}
              <div className="pt-1">
                <span className="text-[11px] font-medium text-slate-400 block">Total Package</span>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="text-xl font-black text-white font-mono">
                    {comp.formattedTotal}
                  </span>
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                      comp.diffVsCurrentPercent === 0
                        ? 'text-slate-400 bg-slate-800'
                        : isPositive
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/25'
                        : 'text-rose-400 bg-rose-500/10 border border-rose-500/25'
                    }`}
                  >
                    {comp.diffVsCurrentPercent === 0
                      ? 'Baseline'
                      : `${isPositive ? '+' : ''}${comp.diffVsCurrentPercent}%`}
                  </span>
                </div>
              </div>

              {/* Breakdown metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block">Base</span>
                  <span className="text-slate-200 font-semibold">
                    {formatCurrencyAmount(comp.baseSalary, activeCurrency, { compact: true })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Bonus</span>
                  <span className="text-slate-200 font-semibold">
                    {formatCurrencyAmount(comp.annualBonus, activeCurrency, { compact: true })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stock RSUs</span>
                  <span className="text-slate-200 font-semibold">
                    {formatCurrencyAmount(comp.stockRSUs, activeCurrency, { compact: true })}
                  </span>
                </div>
              </div>

              {/* Key Benefit Highlights */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Top Benefit Highlights
                </span>
                <div className="flex flex-wrap gap-1">
                  {comp.benefitsHighlights.slice(0, 2).map((b, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
