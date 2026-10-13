'use client'

import React, { useEffect, useState } from 'react'
import { Sparkles, Brain, Cpu, Search, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface ScanningAnimationProps {
  targetRole: string
}

const SCAN_STEPS = [
  'Validating document authenticity and candidate structure...',
  'Extracting competencies across 11 industry domains...',
  'Cross-referencing recruiter keywords against target specifications...',
  'Evaluating experience depth, architecture scale, and leadership indicators...',
  'Synthesizing 12-week learning roadmap and project deliverables...',
  'Generating final employability match score and prioritized action plan...'
]

export function ScanningAnimation({ targetRole }: ScanningAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1 < SCAN_STEPS.length ? prev + 1 : prev))
    }, 700)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0C162B] border border-blue-500/30 rounded-2xl p-8 max-w-xl mx-auto text-center shadow-[0_0_50px_rgba(37,99,235,0.15)] backdrop-blur-xl">
      {/* Animated Glowing Radar Sphere */}
      <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border border-sky-500/30 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-blue-600/30 via-sky-500/25 to-cyan-500/30 blur-md" />

        <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
          <Brain className="w-8 h-8 animate-bounce" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-1.5 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
        <span>AI Skill Gap Neural Engine</span>
      </h3>
      <p className="text-xs text-slate-400 mb-6">
        Analyzing your profile against modern standards for <strong className="text-blue-300">{targetRole || 'Target Role'}</strong>
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 mb-6 overflow-hidden border border-slate-800">
        <motion.div
          className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 h-2 rounded-full"
          initial={{ width: '10%' }}
          animate={{ width: `${Math.min(100, ((currentStep + 1) / SCAN_STEPS.length) * 100)}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Stepper text */}
      <div className="space-y-2 text-left bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
        {SCAN_STEPS.map((step, idx) => {
          const isDone = idx < currentStep
          const isCurrent = idx === currentStep

          return (
            <div
              key={idx}
              className={`text-xs flex items-center gap-2.5 transition-all duration-300 ${
                isDone
                  ? 'text-emerald-400'
                  : isCurrent
                  ? 'text-white font-semibold'
                  : 'text-slate-600'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-slate-800 shrink-0" />
              )}
              <span className="truncate">{step}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
