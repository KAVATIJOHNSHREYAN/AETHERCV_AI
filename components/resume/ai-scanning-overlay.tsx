'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Sparkles, ShieldCheck, Zap } from 'lucide-react'
import Image from 'next/image'

interface AiScanningOverlayProps {
  isLoading: boolean
}

const SCAN_STEPS = [
  'Verifying Document Authenticity & Structure...',
  'Extracting Text Geometry & Layout Hierarchy...',
  'Mapping 8-Cluster Technical Skill Taxonomy...',
  'Auditing Action Verbs & Measurable STAR Metrics...',
  'Calculating 100-Point Algorithmic ATS Score...',
  'Simulating Recruiter 6-Second Glance...'
]

export function AiScanningOverlay({ isLoading }: AiScanningOverlayProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    if (!isLoading) {
      setCurrentStepIndex(0)
      return
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % SCAN_STEPS.length)
    }, 1100)

    return () => clearInterval(interval)
  }, [isLoading])

  if (!isLoading) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08111F]/85 backdrop-blur-xl"
      >
        <div className="relative w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-[#0F172A]/95 border border-blue-500/30 shadow-[0_0_80px_rgba(37,99,235,0.35)] flex flex-col items-center text-center overflow-hidden">
          {/* Ambient Glowing Orbs */}
          <div className="absolute -top-20 -left-20 w-52 h-52 bg-blue-600/30 rounded-full blur-[70px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-cyan-500/25 rounded-full blur-[70px] pointer-events-none" />

          {/* Animated Scanning Beam Effect */}
          <motion.div
            initial={{ y: -120 }}
            animate={{ y: 280 }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
              repeatType: 'reverse'
            }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] opacity-80 pointer-events-none z-10"
          />

          {/* Central AI Scanner Rings */}
          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            {/* Outer Pulsing Ring 1 */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border border-sky-400/40 shadow-[0_0_25px_rgba(56,189,248,0.3)]"
            />

            {/* Pulsing Ring 2 */}
            <motion.div
              animate={{
                scale: [1.15, 0.95, 1.15],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inset-2 rounded-full border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
            />

            {/* Rotating Neural Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="absolute inset-4 rounded-full border-2 border-dashed border-blue-500/60"
            />

            {/* Center Core */}
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 p-1 flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.6)]">
              <Image
                src="/aethercv-logo.png"
                alt="AETHERCV AI Scanner Core"
                width={60}
                height={60}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Title & Status */}
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-cyan-300 text-xs font-semibold shadow-[0_0_15px_rgba(59,130,246,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Neural Scanning Engine</span>
            </div>

            <h3 className="text-xl font-bold font-poppins text-white">
              Analyzing Document &amp; Scoring ATS
            </h3>

            {/* Step text with smooth reveal */}
            <motion.p
              key={currentStepIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-medium text-sky-300 font-outfit h-6 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>{SCAN_STEPS[currentStepIndex]}</span>
            </motion.p>
          </div>

          {/* Progress Shimmer Bar with Exact Dual-Color Gradient */}
          <div className="w-full max-w-xs h-2.5 bg-[#0E1729] rounded-full mt-6 overflow-hidden border border-[#4D48E6]/30 relative shadow-inner">
            <motion.div
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut'
              }}
              className="w-1/2 h-full bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] rounded-full shadow-[0_0_15px_rgba(77,72,230,0.6)]"
            />
          </div>

          <p className="text-[11px] text-slate-400 font-outfit mt-4">
            Auditing 10 scoring categories • Zero data sent to third-party ads
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
