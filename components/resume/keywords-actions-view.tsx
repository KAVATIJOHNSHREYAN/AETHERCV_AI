'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { KeywordAnalysisResult, ActionVerbAnalysisResult } from '@/lib/resume/types'
import {
  TrendingUp, AlertTriangle, ArrowRight, Sparkles, Zap, Hash,
  Repeat, CheckCircle, ShieldAlert
} from 'lucide-react'

interface KeywordsActionsViewProps {
  keywords: KeywordAnalysisResult
  actionVerbs: ActionVerbAnalysisResult
}

export function KeywordsActionsView({ keywords, actionVerbs }: KeywordsActionsViewProps) {
  return (
    <div className="space-y-6">
      {/* Action Verbs Spotlight */}
      <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/40 gap-3">
          <div>
            <h3 className="text-base font-bold font-poppins text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Action Verb Dynamic Analysis
            </h3>
            <p className="text-xs text-muted-foreground font-outfit">
              Measurable power verbs that drive assertive, high-impact bullet points
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Verb Density</span>
              <span className="text-sm font-bold text-foreground font-poppins">
                {actionVerbs.densityScore}%
              </span>
            </div>
            <div className="text-right border-l border-border/40 pl-3">
              <span className="text-xs text-muted-foreground block">Unique Verbs</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-poppins">
                {actionVerbs.uniqueVerbsFound.length}
              </span>
            </div>
          </div>
        </div>

        {/* Found Verbs Chips */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            Detected Power Verbs:
          </h4>
          <div className="flex flex-wrap gap-2">
            {actionVerbs.uniqueVerbsFound.length > 0 ? (
              actionVerbs.uniqueVerbsFound.map((verb, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 capitalize"
                >
                  {verb} <span className="opacity-60 text-[10px]">({actionVerbs.frequencyMap[verb]}x)</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">
                No strong action verbs detected. Begin sentences with verbs like Spearheaded, Engineered, or Automated.
              </span>
            )}
          </div>
        </div>

        {/* Weak Verbs Replacement Table */}
        {actionVerbs.weakVerbsUsed.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border/30">
            <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              Suggested High-Impact Replacements:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {actionVerbs.weakVerbsUsed.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between text-xs"
                >
                  <span className="text-red-500 font-semibold line-through">{item.verb}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground mx-2" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.suggestedReplacement}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keywords Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most Frequent Keywords */}
        <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground font-poppins">Most Frequent Terms</h4>
              <p className="text-[11px] text-muted-foreground">Dominant vocabulary found in your resume</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywords.mostFrequent.slice(0, 10).map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs bg-secondary text-secondary-foreground border border-border/40 font-mono"
              >
                {item.word} <span className="text-[10px] opacity-60">({item.count})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Missing Important Benchmark Keywords */}
        <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground font-poppins">Missing High-Value Keywords</h4>
              <p className="text-[11px] text-muted-foreground">Modern industry terms recruiters search for</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywords.missingImportant.slice(0, 8).map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium"
              >
                + {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Weak Keywords Detected */}
        {keywords.weakKeywords.length > 0 && (
          <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground font-poppins">Passive / Vague Phrasing Detected</h4>
                <p className="text-[11px] text-muted-foreground">Terms that weaken candidate authority</p>
              </div>
            </div>
            <div className="space-y-2">
              {keywords.weakKeywords.map((wk, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-secondary/40 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-red-500">"{wk.word}"</span>: <span className="text-muted-foreground font-outfit">{wk.reason}</span>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Use:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">{wk.replacement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
