'use client'

import React, { useState } from 'react'
import {
  getLiveTrendingInterviewData,
  PUBLIC_INTERVIEW_DISCLAIMER
} from '@/lib/interview-prep/trends-database'
import {
  TrendingUp,
  Sparkles,
  Code2,
  Cpu,
  Users,
  Compass,
  MessageSquare,
  ShieldCheck,
  Building2,
  ChevronRight
} from 'lucide-react'

export function LiveTrendsBanner({
  onSelectTopic
}: {
  onSelectTopic?: (topic: string) => void
}) {
  const [activeTab, setActiveTab] = useState<
    'technical' | 'dsa' | 'system_design' | 'behavioral' | 'hr'
  >('technical')

  const trends = getLiveTrendingInterviewData()

  return (
    <div className="w-full bg-[#0C162B]/90 border border-blue-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-3.5 relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Live Public Interview Trends & Questions
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Feed
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>{PUBLIC_INTERVIEW_DISCLAIMER}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <span>{trends.publicReportsSampleCount.toLocaleString()}+ candidate reports aggregated</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('technical')}
          className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition flex items-center gap-1.5 text-xs ${
            activeTab === 'technical'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Code2 className="w-3 h-3" />
          <span>Trending Technical ({trends.trendingTechnicalQuestions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dsa')}
          className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition flex items-center gap-1.5 text-xs ${
            activeTab === 'dsa'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Cpu className="w-3 h-3" />
          <span>Top DSA Problems ({trends.trendingDSAProblems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('system_design')}
          className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition flex items-center gap-1.5 text-xs ${
            activeTab === 'system_design'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Compass className="w-3 h-3" />
          <span>System Design ({trends.trendingSystemDesignQuestions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('behavioral')}
          className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition flex items-center gap-1.5 text-xs ${
            activeTab === 'behavioral'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-3 h-3" />
          <span>STAR Behavioral ({trends.trendingBehavioralQuestions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hr')}
          className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition flex items-center gap-1.5 text-xs ${
            activeTab === 'hr'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <MessageSquare className="w-3 h-3" />
          <span>HR & Culture ({trends.trendingHRQuestions.length})</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
        {activeTab === 'technical' &&
          trends.trendingTechnicalQuestions.slice(0, 4).map((q, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTopic && onSelectTopic(q)}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 text-xs text-slate-300 hover:text-white transition flex items-start justify-between gap-2 cursor-pointer group"
            >
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-mono text-blue-400 font-bold shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <p className="line-clamp-2 leading-relaxed">{q}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 mt-0.5" />
            </div>
          ))}

        {activeTab === 'dsa' &&
          trends.trendingDSAProblems.slice(0, 4).map((dsa, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTopic && onSelectTopic(dsa.title)}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 text-xs text-slate-300 hover:text-white transition flex items-start justify-between gap-2 cursor-pointer group"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white group-hover:text-blue-300">
                    {dsa.title}
                  </span>
                  <span
                    className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      dsa.difficulty === 'Hard'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : dsa.difficulty === 'Medium'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {dsa.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 flex-wrap">
                  <span className="text-slate-500">{dsa.category}</span>
                  <span>•</span>
                  <span>Reported at: {dsa.reportedCompanies.slice(0, 3).join(', ')}</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 mt-0.5" />
            </div>
          ))}

        {activeTab === 'system_design' &&
          trends.trendingSystemDesignQuestions.slice(0, 4).map((sd, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTopic && onSelectTopic(sd)}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 text-xs text-slate-300 hover:text-white transition flex items-start justify-between gap-2 cursor-pointer group"
            >
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <p className="line-clamp-2 leading-relaxed">{sd}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 mt-0.5" />
            </div>
          ))}

        {activeTab === 'behavioral' &&
          trends.trendingBehavioralQuestions.slice(0, 4).map((bq, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTopic && onSelectTopic(bq)}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 text-xs text-slate-300 hover:text-white transition flex items-start justify-between gap-2 cursor-pointer group"
            >
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <p className="line-clamp-2 leading-relaxed">{bq}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 mt-0.5" />
            </div>
          ))}

        {activeTab === 'hr' &&
          trends.trendingHRQuestions.slice(0, 4).map((hrq, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTopic && onSelectTopic(hrq)}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 text-xs text-slate-300 hover:text-white transition flex items-start justify-between gap-2 cursor-pointer group"
            >
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-mono text-purple-400 font-bold shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <p className="line-clamp-2 leading-relaxed">{hrq}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 shrink-0 mt-0.5" />
            </div>
          ))}
      </div>
    </div>
  )
}
