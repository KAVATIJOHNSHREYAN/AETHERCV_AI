'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Brain, Cpu, FileSearch, CheckCircle2 } from 'lucide-react'

interface CoverLetterLoadingAnimationProps {
  step: number
}

const STEPS = [
  { label: 'Analyzing Candidate Resume...', desc: 'Extracting verified skills, projects, and work history', icon: FileSearch },
  { label: 'Reading Job Description & Role Context...', desc: 'Parsing target responsibilities and qualifications', icon: Brain },
  { label: 'Matching Core Competencies & Keywords...', desc: 'Bridging profile strengths with target requisitions', icon: Cpu },
  { label: 'Generating Tailored Professional Narrative...', desc: 'Composing narrative according to chosen tone', icon: Sparkles },
  { label: 'Finalizing Recruiter-Ready Cover Letter...', desc: 'Applying formatting hierarchy and structural review', icon: CheckCircle2 }
]

export function CoverLetterLoadingAnimation({ step }: CoverLetterLoadingAnimationProps) {
  const currentStep = Math.min(step, STEPS.length - 1)
  const current = STEPS[currentStep]
  const Icon = current.icon

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A]/90 backdrop-blur-2xl border border-blue-500/25 shadow-[0_0_50px_rgba(77,72,230,0.25)] flex flex-col items-center justify-center text-center space-y-6">
      {/* Animated Orb */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-[#4D48E6]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#4D48E6] via-[#2662EB] to-[#1E50DA] blur-md opacity-70"
        />
        <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#0E1729] border border-blue-500/30 flex items-center justify-center text-[#818cf8] shadow-inner">
          <Icon className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-lg font-bold font-poppins text-white">{current.label}</h3>
        <p className="text-xs text-slate-400 font-outfit">{current.desc}</p>
      </div>

      {/* Dual Color Progress Bar */}
      <div className="w-full max-w-sm">
        <div className="h-2 rounded-full bg-[#0E1729] border border-blue-500/20 overflow-hidden p-0.5">
          <motion.div
            initial={{ width: '10%' }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA]"
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-mono">
          <span>STEP {currentStep + 1} OF {STEPS.length}</span>
          <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}%</span>
        </div>
      </div>
    </div>
  )
}
