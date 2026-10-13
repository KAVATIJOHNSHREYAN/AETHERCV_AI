'use client'

import React from 'react'
import { MarketDemand } from '@/types/skill-gap'
import {
  TrendingUp,
  DollarSign,
  Building2,
  Briefcase,
  Wifi,
  Flame,
  Globe2
} from 'lucide-react'

interface MarketDemandViewProps {
  marketDemand: MarketDemand
}

export function MarketDemandView({ marketDemand }: MarketDemandViewProps) {
  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/80 mb-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-400" />
          Industry Market Demand & Compensation Overview
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time hiring trends, compensation benchmarks, and remote flexibility for {marketDemand.role}.
        </p>
      </div>

      {/* Grid of Key Market Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mb-6">
        {/* Average Salary */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Average Salary</span>
          </div>
          <div className="text-2xl font-black text-white">
            {marketDemand.averageSalary}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
            Range: {marketDemand.salaryRange}
          </div>
        </div>

        {/* Hiring Demand */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Hiring Demand</span>
          </div>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <span>{marketDemand.hiringDemand}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Hot
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {marketDemand.jobOpeningsEstimate}
          </div>
        </div>

        {/* Growth Trend */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <span>Growth Trend</span>
          </div>
          <div className="text-2xl font-black text-teal-400">
            {marketDemand.growthTrend}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Annual projected market growth
          </div>
        </div>

        {/* Experience Level */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>Target Experience</span>
          </div>
          <div className="text-lg font-bold text-white">
            {marketDemand.experienceLevel}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Standard career tenure
          </div>
        </div>

        {/* Remote Opportunities */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Wifi className="w-4 h-4 text-cyan-400" />
            <span>Remote Opportunities</span>
          </div>
          <div className="text-lg font-bold text-white">
            {marketDemand.remoteOpportunities}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Distributed workforce availability
          </div>
        </div>

        {/* Global Outlook */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Globe2 className="w-4 h-4 text-sky-400" />
            <span>Market Outlook</span>
          </div>
          <div className="text-lg font-bold text-white">
            High Demand
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Global enterprise adoption
          </div>
        </div>
      </div>

      {/* Top Hiring Companies */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          <Building2 className="w-4 h-4 text-teal-400" />
          <span>Top Hiring Companies</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {marketDemand.topHiringCompanies.map((company, i) => (
            <span
              key={i}
              className="text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:border-teal-500/40 transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              {company}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
