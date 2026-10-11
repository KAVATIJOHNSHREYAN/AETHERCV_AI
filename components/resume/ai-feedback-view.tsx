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
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-card/80 to-card/60 backdrop-blur-sm border border-blue-500/20 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-blue-500 text-white shadow-md shadow-blue-500/20">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-poppins text-foreground">Recruiter Perspective (6-Sec Scan)</h4>
              <p className="text-[11px] text-muted-foreground">What a hiring manager notices instantly</p>
            </div>
          </div>
          <p className="text-xs text-foreground/80 font-outfit leading-relaxed">
            {recruiterPerspective}
          </p>
        </div>

        {/* Professional Review */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-card/80 to-card/60 backdrop-blur-sm border border-purple-500/20 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-purple-500 text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-poppins text-foreground">AI Profile Evaluation</h4>
              <p className="text-[11px] text-muted-foreground">Holistic resume strength analysis</p>
            </div>
          </div>
          <p className="text-xs text-foreground/80 font-outfit leading-relaxed">
            {professionalReview}
          </p>
        </div>
      </div>

      {/* 2. Sentence-by-Sentence AI Rewrites */}
      <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div>
            <h3 className="text-base font-bold font-poppins text-foreground flex items-center gap-2">
              <CheckCheck className="w-5 h-5 text-emerald-500" />
              Before & After Bullet Rewriter
            </h3>
            <p className="text-xs text-muted-foreground font-outfit">
              Transforms passive sentences into high-impact STAR statements with numbers & metrics
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            STAR Method
          </span>
        </div>

        <div className="space-y-3">
          {sentenceRewrites.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-xs font-semibold text-muted-foreground">Original Sentence (Weak / Passive):</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {item.improvementType.replace('_', ' ')}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/15 text-xs text-red-600 dark:text-red-400 font-mono">
                "{item.original}"
              </div>

              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-2">
                <Sparkles className="w-3.5 h-3.5" />
                AI Optimized Version (Impact + Metrics):
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                {item.improved}
              </div>

              <p className="text-[11px] text-muted-foreground font-outfit pt-1 italic">
                Why this works: {item.explanation}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Actionable Improvement Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Improvements */}
        <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
          <h4 className="text-sm font-semibold text-foreground font-poppins mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Project Presentation Suggestions
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground font-outfit">
            {projectImprovements.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience Improvements */}
        <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
          <h4 className="text-sm font-semibold text-foreground font-poppins mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Experience Narrative Enhancements
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground font-outfit">
            {experienceImprovements.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills Recommendations */}
        <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
          <h4 className="text-sm font-semibold text-foreground font-poppins mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Strategic Skill Recommendations
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground font-outfit">
            {skillsSuggestions.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-purple-500 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Strategic Career Advice */}
        <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
          <h4 className="text-sm font-semibold text-foreground font-poppins mb-2 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-500" />
            Recruiter Strategy & Career Advice
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground font-outfit">
            {careerAdvice.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
