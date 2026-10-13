'use client'

import React from 'react'
import { SkillGapAnalysisResult } from '@/types/skill-gap'
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FolderGit2,
  Award,
  TrendingUp,
  FileCheck2,
  GraduationCap
} from 'lucide-react'

interface DashboardCardsProps {
  data: SkillGapAnalysisResult
}

export function DashboardCards({ data }: DashboardCardsProps) {
  const highPriorityMissingCount = data.missingSkills.filter(
    s => s.priority === 'High Priority'
  ).length

  const cards = [
    {
      id: 'match',
      title: 'Overall Match',
      value: `${data.overallScore}%`,
      subtitle: data.matchLevel,
      icon: Target,
      bgGradient: 'from-[#0D254C] via-[#091A36] to-[#061226]',
      borderColor: 'border-blue-500/40 hover:border-blue-400/80',
      badgeBg: 'bg-blue-500/20 border-blue-400/40 text-blue-300',
      textColor: 'text-blue-300',
      glow: 'shadow-[0_0_25px_rgba(37,99,235,0.18)]'
    },
    {
      id: 'matched',
      title: 'Matched Skills',
      value: data.matchedSkills.length.toString(),
      subtitle: `${Array.from(new Set(data.matchedSkills.map(s => s.category))).length} categories matched`,
      icon: CheckCircle2,
      bgGradient: 'from-[#082A1E] via-[#061E16] to-[#061226]',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400/80',
      badgeBg: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
      textColor: 'text-emerald-300',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.18)]'
    },
    {
      id: 'missing',
      title: 'Missing Skills',
      value: data.missingSkills.length.toString(),
      subtitle: `${highPriorityMissingCount} High Priority`,
      icon: AlertTriangle,
      bgGradient: 'from-[#2C1D07] via-[#201505] to-[#061226]',
      borderColor: 'border-amber-500/40 hover:border-amber-400/80',
      badgeBg: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
      textColor: 'text-amber-300',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.18)]'
    },
    {
      id: 'learning',
      title: 'Learning Progress',
      value: '12 Weeks',
      subtitle: `${data.learningRoadmap.length} strategic milestones`,
      icon: Calendar,
      bgGradient: 'from-[#0A2649] via-[#081C36] to-[#061226]',
      borderColor: 'border-sky-500/40 hover:border-sky-400/80',
      badgeBg: 'bg-sky-500/20 border-sky-400/40 text-sky-300',
      textColor: 'text-sky-300',
      glow: 'shadow-[0_0_25px_rgba(14,165,233,0.18)]'
    },
    {
      id: 'projects',
      title: 'Projects Needed',
      value: data.projectRecommendations.length.toString(),
      subtitle: 'Portfolio gap projects',
      icon: FolderGit2,
      bgGradient: 'from-[#072B3C] via-[#061F2C] to-[#061226]',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400/80',
      badgeBg: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300',
      textColor: 'text-cyan-300',
      glow: 'shadow-[0_0_25px_rgba(6,182,212,0.18)]'
    },
    {
      id: 'certifications',
      title: 'Certificates',
      value: data.certifications.length.toString(),
      subtitle: 'Target credentials',
      icon: Award,
      bgGradient: 'from-[#092842] via-[#071C2E] to-[#061226]',
      borderColor: 'border-sky-500/40 hover:border-sky-400/80',
      badgeBg: 'bg-sky-500/20 border-sky-400/40 text-sky-300',
      textColor: 'text-sky-300',
      glow: 'shadow-[0_0_25px_rgba(56,189,248,0.18)]'
    },
    {
      id: 'market',
      title: 'Market Demand',
      value: data.marketDemand.averageSalary,
      subtitle: data.marketDemand.growthTrend,
      icon: TrendingUp,
      bgGradient: 'from-[#092B25] via-[#071F1B] to-[#061226]',
      borderColor: 'border-teal-500/40 hover:border-teal-400/80',
      badgeBg: 'bg-teal-500/20 border-teal-400/40 text-teal-300',
      textColor: 'text-teal-300',
      glow: 'shadow-[0_0_25px_rgba(20,184,166,0.18)]'
    },
    {
      id: 'resume-readiness',
      title: 'Resume Readiness',
      value: `${data.readinessMetrics.resumeReadiness}%`,
      subtitle: data.readinessMetrics.resumeReadiness >= 75 ? 'Ready to Submit' : 'Needs Optimization',
      icon: FileCheck2,
      bgGradient: 'from-[#0B254A] via-[#081B37] to-[#061226]',
      borderColor: 'border-blue-500/40 hover:border-blue-400/80',
      badgeBg: 'bg-blue-500/20 border-blue-400/40 text-blue-300',
      textColor: 'text-blue-300',
      glow: 'shadow-[0_0_25px_rgba(37,99,235,0.18)]'
    },
    {
      id: 'placement-readiness',
      title: 'Placement Readiness',
      value: `${data.readinessMetrics.placementReadiness}%`,
      subtitle: data.readinessMetrics.placementReadiness >= 75 ? 'Interview Competitive' : 'Bridge Scale Gap',
      icon: GraduationCap,
      bgGradient: 'from-[#0C2A52] via-[#091E3B] to-[#061226]',
      borderColor: 'border-blue-400/40 hover:border-blue-300/80',
      badgeBg: 'bg-blue-400/20 border-blue-300/40 text-blue-200',
      textColor: 'text-blue-200',
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.18)]'
    }
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map(card => {
        const Icon = card.icon
        return (
          <div
            key={card.id}
            className={`bg-gradient-to-b ${card.bgGradient} border ${card.borderColor} rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${card.glow} backdrop-blur-md relative overflow-hidden group`}
          >
            {/* Top highlight shine */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200 tracking-wide">
                {card.title}
              </span>
              <div
                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-110 ${card.badgeBg}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className={`text-2xl font-black tracking-tight ${card.textColor}`}>
                {card.value}
              </div>
              <div className="text-[11px] font-medium text-slate-300 mt-1 truncate">
                {card.subtitle}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
