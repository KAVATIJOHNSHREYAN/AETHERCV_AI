'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Award, Sparkles, Zap, ShieldCheck } from 'lucide-react'
import { AtsScoreBreakdown } from '@/lib/resume/types'

interface AtsCircularScoreProps {
  breakdown: AtsScoreBreakdown
}

export function AtsCircularScore({ breakdown }: AtsCircularScoreProps) {
  const { overallScore, overallGrade, overallSummary } = breakdown

  // Dual-Blue Palette Status
  let gradeText = 'Developing Fit'
  let badgeStyle = 'bg-[#4D48E6]/15 text-[#818cf8] border-[#4D48E6]/30 shadow-[0_0_12px_rgba(77,72,230,0.2)]'
  let Icon = Sparkles

  if (overallScore >= 85) {
    gradeText = 'Recruiter Ready (Tier 1)'
    badgeStyle = 'bg-gradient-to-r from-[#4D48E6]/20 to-[#1E50DA]/20 text-white border-[#4D48E6]/40 shadow-[0_0_15px_rgba(77,72,230,0.3)]'
    Icon = ShieldCheck
  } else if (overallScore >= 70) {
    gradeText = 'Strong Candidate'
    badgeStyle = 'bg-blue-600/20 text-blue-200 border-blue-500/30 shadow-[0_0_12px_rgba(38,98,235,0.25)]'
    Icon = CheckCircle2
  }

  // SVG Circular calculation
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (overallScore / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 rounded-3xl shadow-[0_4px_30px_-5px_rgba(30,80,218,0.25)] relative overflow-hidden group hover:border-[#4D48E6]/40 transition-all">
      {/* Ambient Blue Glowing Orbs */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#4D48E6]/15 rounded-full filter blur-[60px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#1E50DA]/15 rounded-full filter blur-[60px] pointer-events-none" />

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
          <Icon className="w-3.5 h-3.5 text-[#818cf8]" />
          <span>{gradeText}</span>
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-[#4D48E6]/25 to-[#1E50DA]/25 text-white border border-[#4D48E6]/40 shadow-[0_0_10px_rgba(77,72,230,0.25)]">
          Grade: {overallGrade}
        </span>
      </div>

      {/* Circular Progress Gauge with Exact Dual-Color Gradient (#4D48E6 -> #1E50DA) */}
      <div className="relative w-44 h-44 flex items-center justify-center relative z-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="atsNeonDualColorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4D48E6" />
              <stop offset="50%" stopColor="#2662EB" />
              <stop offset="100%" stopColor="#1E50DA" />
            </linearGradient>
            <filter id="atsNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#4D48E6" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#0E1729"
            strokeWidth="12"
            fill="transparent"
            className="opacity-90"
          />

          {/* Animated score circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#atsNeonDualColorGradient)"
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
            filter="url(#atsNeonGlow)"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-extrabold tracking-tight font-poppins text-white drop-shadow-[0_0_15px_rgba(77,72,230,0.5)]"
          >
            {overallScore}
          </motion.span>
          <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">
            out of 100
          </span>
        </div>
      </div>

      <div className="mt-4 text-center max-w-sm relative z-10">
        <h4 className="text-sm font-semibold text-white font-poppins flex items-center justify-center gap-1.5">
          <Award className="w-4 h-4 text-[#818cf8]" />
          ATS Compatibility Score
        </h4>
        <p className="text-xs text-slate-400 font-outfit mt-1 leading-relaxed">
          {overallSummary}
        </p>
      </div>
    </div>
  )
}
