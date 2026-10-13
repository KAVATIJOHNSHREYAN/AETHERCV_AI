'use client'

import React from 'react'
import { MarketTrendInsights } from '@/types/salary-predictor'
import { TrendingUp, BarChart3, Building, Sparkles, Layers, ShieldCheck } from 'lucide-react'

interface MarketTrendsCardProps {
  trends: MarketTrendInsights
}

export function MarketTrendsCard({ trends }: MarketTrendsCardProps) {
  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Hiring Market Momentum & Industry Growth
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Macro hiring statistics and macroeconomic salary trajectory metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-semibold">{trends.hiringDemand} Demand</span>
        </div>
      </div>

      {/* Grid of Key Market Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium block">Hiring Demand Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{trends.demandScore}</span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Top 12% in Tech Sector</span>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium block">3-Year Salary Growth</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">+{trends.threeYearSalaryGrowthPercent}%</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Rolling annualized growth</span>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium block">Industry Expansion</span>
          <span className="text-base font-bold text-white block mt-1">
            {trends.industryGrowthRate}
          </span>
          <span className="text-[11px] text-slate-500 block">Verified Tech Sector YoY</span>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium block">Confidence Metric</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-400">{trends.confidenceScore}%</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Aggregated dataset fidelity</span>
        </div>
      </div>

      {/* Experience Demand Distribution & Top Hiring Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Experience Demand Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            Hiring Requisitions by Experience
          </h4>
          <div className="space-y-2.5">
            {trends.experienceDemandBreakdown.map(item => (
              <div key={item.bracket} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.bracket}</span>
                  <span className="text-blue-400 font-mono font-bold">{item.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Hiring Companies */}
        <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-cyan-400" />
            Active Employers in This Category
          </h4>
          <div className="flex flex-wrap gap-2 pt-1">
            {trends.topHiringCompanies.map(c => (
              <span
                key={c}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 pt-2 leading-relaxed">
            Consistently posting open headcount with above-median compensation packages.
          </p>
        </div>
      </div>
    </div>
  )
}
