'use client'

import React, { useState } from 'react'
import { SalaryPredictionResult } from '@/types/salary-predictor'
import { formatCurrencyAmount } from '@/lib/salary-predictor/countries-data'
import {
  DollarSign,
  TrendingUp,
  Award,
  Coins,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react'

interface SalaryHeroGaugeProps {
  result: SalaryPredictionResult
  activeCurrency: string
}

export function SalaryHeroGauge({ result, activeCurrency }: SalaryHeroGaugeProps) {
  const [useLpa, setUseLpa] = useState(true)
  const curr = activeCurrency || result.primaryCurrency

  const totalMedian = result.metrics.totalCompensation.median
  const totalMin = result.metrics.totalCompensation.min
  const totalMax = result.metrics.totalCompensation.max
  const totalAvg = result.metrics.totalCompensation.average

  const baseMedian = result.metrics.baseSalary.median
  const bonusAvg = result.metrics.bonusEstimate.average
  const stockAvg = result.metrics.stockCompensation.average
  const signingAvg = result.metrics.signingBonus.average

  // Component percentages
  const basePercent = Math.max(10, Math.round((baseMedian / (totalMedian || 1)) * 100))
  const bonusPercent = Math.max(5, Math.round((bonusAvg / (totalMedian || 1)) * 100))
  const stockPercent = Math.max(5, 100 - basePercent - bonusPercent)

  const isINR = curr === 'INR'

  return (
    <div className="bg-gradient-to-b from-[#0F1E3D] via-[#0C162B] to-[#07101F] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-blue-400" />
            {result.input.company || 'Market Standard'}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            {result.input.city}, {result.input.country}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            {result.input.experienceBracket} ({result.input.yearsOfExperience} yrs)
          </span>
        </div>

        {/* Currency LPA toggle for INR */}
        {isINR && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Display:</span>
            <div className="flex p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setUseLpa(true)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  useLpa ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                LPA (Lakhs)
              </button>
              <button
                type="button"
                onClick={() => setUseLpa(false)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  !useLpa ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Standard (₹)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hero Salary Figure Card */}
      <div className="text-center py-4 relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Market Median Estimated Compensation</span>
        </div>

        {/* Main Big Number */}
        <div className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-cyan-300 tracking-tight">
          {formatCurrencyAmount(totalMedian, curr, { useLpaForInr: useLpa })}
        </div>

        <p className="text-sm sm:text-base text-slate-300 font-medium">
          Estimated 50th Percentile Total Annual Compensation (TC)
        </p>

        {/* Min - Max Range */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
          <span className="text-slate-500">Market Range:</span>
          <span className="font-bold text-white">
            {formatCurrencyAmount(totalMin, curr, { useLpaForInr: useLpa })}
          </span>
          <span className="text-slate-500">—</span>
          <span className="font-bold text-white">
            {formatCurrencyAmount(totalMax, curr, { useLpaForInr: useLpa })}
          </span>
        </div>
      </div>

      {/* Stacked Composition Bar: Base Pay / Bonus / Stock Equity */}
      <div className="space-y-2 relative z-10 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Total Compensation Breakdown Structure</span>
          <span className="text-blue-400 font-semibold">100% Annualized Total</span>
        </div>

        {/* Visual Stacked Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex">
          <div
            style={{ width: `${basePercent}%` }}
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700"
            title={`Base Pay: ${basePercent}%`}
          />
          <div
            style={{ width: `${bonusPercent}%` }}
            className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 transition-all duration-700"
            title={`Performance Bonus: ${bonusPercent}%`}
          />
          <div
            style={{ width: `${stockPercent}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
            title={`Stock / Equity: ${stockPercent}%`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-400">Base Salary:</span>
            <span className="font-bold text-white">
              {formatCurrencyAmount(baseMedian, curr, { useLpaForInr: useLpa })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-400">Annual Bonus:</span>
            <span className="font-bold text-white">
              {formatCurrencyAmount(bonusAvg, curr, { useLpaForInr: useLpa })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span className="text-slate-400">Stock RSUs (p.a.):</span>
            <span className="font-bold text-white">
              {formatCurrencyAmount(stockAvg, curr, { useLpaForInr: useLpa })}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Key Derived Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Average Base
          </span>
          <span className="text-base sm:text-lg font-bold text-white block">
            {formatCurrencyAmount(result.metrics.baseSalary.average, curr, { useLpaForInr: useLpa })}
          </span>
          <span className="text-[11px] text-slate-500 block">Annual Fixed Salary</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Monthly Base
          </span>
          <span className="text-base sm:text-lg font-bold text-emerald-400 block">
            {formatCurrencyAmount(result.metrics.monthlySalary.median, curr, { useLpaForInr: false })}
          </span>
          <span className="text-[11px] text-slate-500 block">Pre-tax monthly gross</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Hourly Rate Equivalent
          </span>
          <span className="text-base sm:text-lg font-bold text-sky-400 block">
            {result.currencySymbol}
            {result.metrics.hourlyRate.median}/hr
          </span>
          <span className="text-[11px] text-slate-500 block">Based on 2,080 working hrs</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Signing Bonus
          </span>
          <span className="text-base sm:text-lg font-bold text-amber-400 block">
            {formatCurrencyAmount(signingAvg, curr, { useLpaForInr: useLpa })}
          </span>
          <span className="text-[11px] text-slate-500 block">Estimated joining grant</span>
        </div>
      </div>

      {/* Data Source & Confidence Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400 relative z-10">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>
            Source: <strong className="text-slate-300">{result.marketTrends.dataSourceLabel}</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>Sample: <strong className="text-slate-300">{result.marketTrends.dataSamplePeriod}</strong></span>
          <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold">
            {result.marketTrends.confidenceScore}% Confidence Score
          </span>
        </div>
      </div>
    </div>
  )
}
