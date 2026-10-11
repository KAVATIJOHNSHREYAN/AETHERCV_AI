'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AIFeedbackReport } from '@/lib/resume/types'
import {
  Sparkles, Eye, CheckCircle2, ArrowRight, Lightbulb, Compass,
  BookOpen, HelpCircle, CheckCheck
} from 'lucide-react'

interface AIFeedbackViewProps {
  aiFeedback: AIFeedbackReport
}

export function AIFeedbackView({ aiFeedback }: AIFeedbackViewProps) {
  const {
    professionalReview,
    recruiterPerspective,
    grammarSuggestions,
    readabilityImprovements,
    projectImprovements,
    experienceImprovements,
    skillsSuggestions,
    careerAdvice,
    sentenceRewrites
  } = aiFeedback

  return (
    <div className="space-y-6">
      {/* 1. Recruiter Perspective & Executive Review */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recruiter 6-Sec Scan */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/15 via-[#0F172A]/90 to-[#0F172A]/80 backdrop-blur-xl border border-blue-500/25 shadow-[0_4px_25px_rgba(37,99,235,0.12)] relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/30">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-poppins text-white">Recruiter Perspective (6-Sec Scan)</h4>
              <p className="text-[11px] text-slate-400">What a hiring manager notices within the initial glance</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 font-outfit leading-relaxed">
            {recruiterPerspective}
          </p>
        </div>

        {/* Professional Review */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600/15 via-[#0F172A]/90 to-[#0F172A]/80 backdrop-blur-xl border border-indigo-500/25 shadow-[0_4px_25px_rgba(99,102,241,0.12)] relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-poppins text-white">AI Profile Evaluation</h4>
              <p className="text-[11px] text-slate-400">Holistic technical resume calibration</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 font-outfit leading-relaxed">
            {professionalReview}
          </p>
        </div>
      </div>

      {/* 2. Sentence-by-Sentence AI Rewrites */}
      <div className="p-6 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_30px_rgba(37,99,235,0.08)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
          <div>
            <h3 className="text-base font-bold font-poppins text-white flex items-center gap-2">
              <CheckCheck className="w-5 h-5 text-cyan-400" />
              Before &amp; After Bullet Rewriter
            </h3>
            <p className="text-xs text-slate-400 font-outfit">
              Transforms passive sentences into high-impact STAR statements with numbers &amp; metrics
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 shadow-[0_0_10px_rgba(34,211,238,0.15)]">
            STAR Method
          </span>
        </div>

        <div className="space-y-3.5">
          {sentenceRewrites.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-4 sm:p-5 rounded-2xl bg-[#08111F]/90 border border-blue-500/20 space-y-3 hover:border-sky-400/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-xs font-semibold text-slate-400">Original Sentence (Weak / Passive):</span>
                <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/15 text-sky-300 border border-blue-500/30">
                  {item.improvementType.replace('_', ' ')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs text-slate-300 font-mono leading-relaxed">
                "{item.original}"
              </div>

              <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 mt-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                AI Optimized Version (Impact + Metrics):
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/60 to-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 font-medium leading-relaxed shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                {item.improved}
              </div>

              <p className="text-[11px] text-slate-400 font-outfit pt-1 italic">
                Why this works: {item.explanation}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Actionable Improvement Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Improvements */}
        <div className="p-5 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_20px_rgba(37,99,235,0.06)]">
          <h4 className="text-sm font-semibold text-white font-poppins mb-2.5 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-sky-400" />
            Project Presentation Suggestions
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 font-outfit">
            {projectImprovements.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience Improvements */}
        <div className="p-5 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_20px_rgba(37,99,235,0.06)]">
          <h4 className="text-sm font-semibold text-white font-poppins mb-2.5 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            Experience Narrative Enhancements
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 font-outfit">
            {experienceImprovements.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills Recommendations */}
        <div className="p-5 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_20px_rgba(37,99,235,0.06)]">
          <h4 className="text-sm font-semibold text-white font-poppins mb-2.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Strategic Skill Recommendations
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 font-outfit">
            {skillsSuggestions.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Strategic Career Advice */}
        <div className="p-5 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_20px_rgba(37,99,235,0.06)]">
          <h4 className="text-sm font-semibold text-white font-poppins mb-2.5 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            Recruiter Strategy &amp; Career Advice
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 font-outfit">
            {careerAdvice.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
