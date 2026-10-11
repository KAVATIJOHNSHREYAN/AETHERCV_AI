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
  let badgeStyle = 'bg-blue-500/10 text-sky-300 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
  let Icon = Sparkles

  if (overallScore >= 85) {
    gradeText = 'Recruiter Ready (Tier 1)'
    badgeStyle = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
    Icon = ShieldCheck
  } else if (overallScore >= 70) {
    gradeText = 'Strong Candidate'
    badgeStyle = 'bg-sky-500/10 text-sky-200 border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
    Icon = CheckCircle2
  }

  // SVG Circular calculation
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (overallScore / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 rounded-3xl shadow-[0_4px_30px_-5px_rgba(37,99,235,0.25)] relative overflow-hidden group hover:border-sky-400/40 transition-all">
      {/* Ambient Blue Glowing Orbs */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/15 rounded-full filter blur-[60px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-cyan-500/10 rounded-full filter blur-[60px] pointer-events-none" />

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
          <Icon className="w-3.5 h-3.5 text-cyan-400" />
          <span>{gradeText}</span>
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-600/20 text-sky-200 border border-blue-400/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
          Grade: {overallGrade}
        </span>
      </div>

      {/* Circular Progress Gauge with Neon Blue Glow */}
      <div className="relative w-44 h-44 flex items-center justify-center relative z-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="atsNeonBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <filter id="atsNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38BDF8" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#1E293B"
            strokeWidth="12"
            fill="transparent"
            className="opacity-70"
          />

          {/* Animated score circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#atsNeonBlueGradient)"
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
            className="text-4xl font-extrabold tracking-tight font-poppins text-white drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
          >
            {overallScore}
          </motion.span>
          <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
            out of 100
          </span>
        </div>
      </div>

      <div className="mt-4 text-center max-w-sm relative z-10">
        <h4 className="text-sm font-semibold text-white font-poppins flex items-center justify-center gap-1.5">
          <Award className="w-4 h-4 text-cyan-400" />
          ATS Compatibility Score
        </h4>
        <p className="text-xs text-slate-400 font-outfit mt-1 leading-relaxed">
          {overallSummary}
        </p>
      </div>
    </div>
  )
}
