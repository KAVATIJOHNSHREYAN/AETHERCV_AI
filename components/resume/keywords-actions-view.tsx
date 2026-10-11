'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { KeywordAnalysisResult, ActionVerbAnalysisResult } from '@/lib/resume/types'
import { Zap, CheckCircle, Hash, TrendingUp, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react'

interface KeywordsActionsViewProps {
  keywords: KeywordAnalysisResult
  actionVerbs: ActionVerbAnalysisResult
}

export function KeywordsActionsView({ keywords, actionVerbs }: KeywordsActionsViewProps) {
  return (
    <div className="space-y-6">
      {/* Action Verbs Spotlight */}
      <div className="p-5 rounded-2xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_25px_-5px_rgba(30,80,218,0.15)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-blue-500/20 gap-3">
          <div>
            <h3 className="text-base font-bold font-poppins text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#818cf8]" />
              Action Verb Dynamic Analysis
            </h3>
            <p className="text-xs text-slate-400 font-outfit">
              Measurable power verbs that drive assertive, high-impact bullet points
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Verb Density</span>
              <span className="text-sm font-bold text-white font-poppins">
                {actionVerbs.densityScore}%
              </span>
            </div>
            <div className="text-right border-l border-blue-500/20 pl-3">
              <span className="text-xs text-slate-400 block">Unique Verbs</span>
              <span className="text-sm font-bold text-[#818cf8] font-poppins">
                {actionVerbs.uniqueVerbsFound.length}
              </span>
            </div>
          </div>
        </div>

        {/* Found Verbs Chips */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#818cf8]" />
            Detected Power Verbs:
          </h4>
          <div className="flex flex-wrap gap-2">
            {actionVerbs.uniqueVerbsFound.length > 0 ? (
              actionVerbs.uniqueVerbsFound.map((verb, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#4D48E6]/20 to-[#1E50DA]/20 text-white border border-[#4D48E6]/35 capitalize shadow-sm"
                >
                  {verb} <span className="opacity-60 text-[10px]">({actionVerbs.frequencyMap[verb]}x)</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                No strong action verbs detected. Begin sentences with verbs like Spearheaded, Engineered, or Automated.
              </span>
            )}
          </div>
        </div>

        {/* Weak Verbs Replacement Table */}
        {actionVerbs.weakVerbsUsed.length > 0 && (
          <div className="mt-4 pt-3 border-t border-blue-500/20">
            <h4 className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-300" />
              Suggested High-Impact Replacements:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {actionVerbs.weakVerbsUsed.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#0B132B]/80 border border-blue-500/20 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-400 font-semibold line-through">{item.verb}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#818cf8] mx-2" />
                  <span className="text-white font-bold px-2 py-0.5 rounded bg-gradient-to-r from-[#4D48E6]/25 to-[#1E50DA]/25 border border-[#4D48E6]/40">{item.suggestedReplacement}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keywords Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most Frequent Keywords */}
        <div className="p-4 rounded-2xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_25px_-5px_rgba(30,80,218,0.15)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-[#4D48E6]/15 text-[#818cf8] border border-[#4D48E6]/30">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white font-poppins">Most Frequent Terms</h4>
              <p className="text-[11px] text-slate-400">Dominant vocabulary found in your resume</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywords.mostFrequent.slice(0, 10).map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs bg-[#0B132B] text-slate-200 border border-blue-500/20 font-mono"
              >
                {item.word} <span className="text-[10px] opacity-60">({item.count})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Missing Important Benchmark Keywords */}
        <div className="p-4 rounded-2xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_25px_-5px_rgba(30,80,218,0.15)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-[#1E50DA]/20 text-blue-300 border border-blue-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white font-poppins">Missing High-Value Keywords</h4>
              <p className="text-[11px] text-slate-400">Modern industry terms recruiters search for</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywords.missingImportant.slice(0, 8).map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs bg-gradient-to-r from-[#4D48E6]/15 to-[#1E50DA]/15 text-blue-200 border border-[#4D48E6]/30 font-medium shadow-sm"
              >
                + {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
