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
      color: 'from-blue-600/20 to-blue-500/5',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400'
    },
    {
      id: 'matched',
      title: 'Matched Skills',
      value: data.matchedSkills.length.toString(),
      subtitle: `${Array.from(new Set(data.matchedSkills.map(s => s.category))).length} categories matched`,
      icon: CheckCircle2,
      color: 'from-emerald-600/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400'
    },
    {
      id: 'missing',
      title: 'Missing Skills',
      value: data.missingSkills.length.toString(),
      subtitle: `${highPriorityMissingCount} High Priority`,
      icon: AlertTriangle,
      color: 'from-amber-600/20 to-amber-500/5',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400'
    },
    {
      id: 'learning',
      title: 'Learning Progress',
      value: '12 Weeks',
      subtitle: `${data.learningRoadmap.length} strategic milestones`,
      icon: Calendar,
      color: 'from-indigo-600/20 to-indigo-500/5',
      borderColor: 'border-indigo-500/30',
      textColor: 'text-indigo-400'
    },
    {
      id: 'projects',
      title: 'Projects Needed',
      value: data.projectRecommendations.length.toString(),
      subtitle: 'Portfolio gap projects',
      icon: FolderGit2,
      color: 'from-purple-600/20 to-purple-500/5',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400'
    },
    {
      id: 'certifications',
      title: 'Certificates',
      value: data.certifications.length.toString(),
      subtitle: 'Target credentials',
      icon: Award,
      color: 'from-cyan-600/20 to-cyan-500/5',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400'
    },
    {
      id: 'market',
      title: 'Market Demand',
      value: data.marketDemand.averageSalary,
      subtitle: data.marketDemand.growthTrend,
      icon: TrendingUp,
      color: 'from-teal-600/20 to-teal-500/5',
      borderColor: 'border-teal-500/30',
      textColor: 'text-teal-400'
    },
    {
      id: 'resume-readiness',
      title: 'Resume Readiness',
      value: `${data.readinessMetrics.resumeReadiness}%`,
      subtitle: data.readinessMetrics.resumeReadiness >= 75 ? 'Ready to Submit' : 'Needs Optimization',
      icon: FileCheck2,
      color: 'from-sky-600/20 to-sky-500/5',
      borderColor: 'border-sky-500/30',
      textColor: 'text-sky-400'
    },
    {
      id: 'placement-readiness',
      title: 'Placement Readiness',
      value: `${data.readinessMetrics.placementReadiness}%`,
      subtitle: data.readinessMetrics.placementReadiness >= 75 ? 'Interview Competitive' : 'Bridge Scale Gap',
      icon: GraduationCap,
      color: 'from-violet-600/20 to-violet-500/5',
      borderColor: 'border-violet-500/30',
      textColor: 'text-violet-400'
    }
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map(card => {
        const Icon = card.icon
        return (
          <div
            key={card.id}
            className={`bg-gradient-to-b ${card.color} bg-[#0C162B] border ${card.borderColor} rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-lg backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 tracking-wide">
                {card.title}
              </span>
              <div
                className={`w-7 h-7 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center ${card.textColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className={`text-2xl font-black tracking-tight ${card.textColor}`}>
                {card.value}
              </div>
              <div className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
                {card.subtitle}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
