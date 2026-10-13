'use client'

import React from 'react'
import { MissingKeyword } from '@/types/skill-gap'
import { KeyRound, Sparkles, HelpCircle, FileText, CheckCircle } from 'lucide-react'

interface MissingKeywordsViewProps {
  missingKeywords: MissingKeyword[]
}

export function MissingKeywordsView({ missingKeywords }: MissingKeywordsViewProps) {
  return (
    <div className="bg-gradient-to-b from-[#0A1A36] to-[#071328] border border-blue-900/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="pb-4 border-b border-blue-950/80 mb-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-sky-400" />
          Missing Recruiter Keywords ({missingKeywords.length})
        </h3>
        <p className="text-xs text-slate-300 mt-0.5">
          Critical ATS search queries and recruiter indexing terms absent from your document.
        </p>
      </div>

      {missingKeywords.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs flex flex-col items-center">
          <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
          <span>All high-priority recruiter keywords were successfully detected in your resume!</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missingKeywords.map((kw, i) => {
            const isCritical = kw.importance === 'Critical'
            const isHigh = kw.importance === 'High'

            return (
              <div
                key={i}
                className="bg-gradient-to-b from-[#091E3D] to-[#07142A] border border-blue-900/40 hover:border-sky-400/60 rounded-xl p-4 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold text-white bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                        {kw.keyword}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Target: <strong className="text-slate-300">{kw.targetSection}</strong>
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                          : isHigh
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                      }`}
                    >
                      {kw.importance}
                    </span>
                  </div>

                  {/* Where it appears */}
                  <div className="text-xs text-slate-400 flex items-start gap-1.5 mb-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-300">Where it appears:</strong> {kw.occurrenceInJd}
                    </span>
                  </div>

                  {/* How to add naturally */}
                  <div className="mt-3 bg-blue-950/20 border border-blue-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-300 mb-1">
                      <Sparkles className="w-3 h-3 text-sky-400" />
                      <span>How to add naturally to resume:</span>
                    </div>
                    <p className="text-xs text-slate-300 italic font-mono leading-relaxed">
                      &quot;{kw.naturalAdditionTip}&quot;
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
