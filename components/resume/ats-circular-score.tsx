'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, XCircle, Award, Sparkles } from 'lucide-react'
import { AtsScoreBreakdown } from '@/lib/resume/types'

interface AtsCircularScoreProps {
  breakdown: AtsScoreBreakdown
}

export function AtsCircularScore({ breakdown }: AtsCircularScoreProps) {
  const { overallScore, overallGrade, overallSummary } = breakdown

  // Color config based on score
  let strokeColor = '#ef4444' // red
  let badgeBg = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
  let gradeText = 'Needs Work'
  let Icon = XCircle

  if (overallScore >= 85) {
    strokeColor = '#10b981' // emerald
    badgeBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    gradeText = 'Excellent (ATS Ready)'
    Icon = CheckCircle2
  } else if (overallScore >= 70) {
    strokeColor = '#f59e0b' // amber
    badgeBg = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    gradeText = 'Competitive'
    Icon = AlertTriangle
  }

  // SVG Circular calculation
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (overallScore / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card/60 backdrop-blur-md border border-border/50 rounded-3xl shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full filter blur-[50px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full filter blur-[50px] pointer-events-none" />

      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{gradeText}</span>
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          Grade: {overallGrade}
        </span>
      </div>

      {/* Circular Progress Gauge */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-muted/30"
          />
          {/* Animated score circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-extrabold tracking-tight font-poppins text-foreground"
          >
            {overallScore}
          </motion.span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            out of 100
          </span>
        </div>
      </div>

      <div className="mt-4 text-center max-w-sm">
        <h4 className="text-sm font-semibold text-foreground font-poppins flex items-center justify-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          ATS Compatibility Score
        </h4>
        <p className="text-xs text-muted-foreground font-outfit mt-1 leading-relaxed">
          {overallSummary}
        </p>
      </div>
    </div>
  )
}
