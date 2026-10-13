'use client'

import React, { useEffect, useState } from 'react'
import { SkillMatchLevel } from '@/types/skill-gap'
import { motion } from 'framer-motion'

interface CircularMatchGaugeProps {
  score: number // 0 - 100
  matchLevel: SkillMatchLevel
  size?: number
  strokeWidth?: number
}

export function CircularMatchGauge({
  score,
  matchLevel,
  size = 200,
  strokeWidth = 14
}: CircularMatchGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 150)
    return () => clearTimeout(timer)
  }, [score])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  // Color selection based on match level
  const getColorScheme = () => {
    if (score >= 85) {
      return {
        stroke: 'url(#gradient-emerald)',
        glow: 'rgba(16, 185, 129, 0.4)',
        textColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
      }
    }
    if (score >= 70) {
      return {
        stroke: 'url(#gradient-cyan)',
        glow: 'rgba(6, 182, 212, 0.4)',
        textColor: 'text-cyan-400',
        badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
      }
    }
    if (score >= 55) {
      return {
        stroke: 'url(#gradient-indigo)',
        glow: 'rgba(99, 102, 241, 0.4)',
        textColor: 'text-indigo-400',
        badgeBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
      }
    }
    if (score >= 40) {
      return {
        stroke: 'url(#gradient-amber)',
        glow: 'rgba(245, 158, 11, 0.4)',
        textColor: 'text-amber-400',
        badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300'
      }
    }
    return {
      stroke: 'url(#gradient-orange)',
      glow: 'rgba(249, 115, 22, 0.4)',
      textColor: 'text-orange-400',
      badgeBg: 'bg-orange-500/15 border-orange-500/30 text-orange-300'
    }
  }

  const colors = getColorScheme()

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(37,99,235,0.25)]"
        >
          <defs>
            <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id="gradient-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="gradient-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="gradient-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
            <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800/80"
            fill="transparent"
          />

          {/* Animated active stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 8px ${colors.glow})`
            }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-baseline"
          >
            <span className={`text-5xl font-black tracking-tight ${colors.textColor}`}>
              {animatedScore}
            </span>
            <span className="text-xl font-bold text-slate-400 ml-0.5">/100</span>
          </motion.div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1">
            Skill Match
          </span>
        </div>
      </div>

      {/* Match Level Pill */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className={`mt-4 px-3.5 py-1 rounded-full border text-xs font-bold tracking-wide uppercase shadow-sm ${colors.badgeBg}`}
      >
        {matchLevel}
      </motion.div>
    </div>
  )
}
