'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, FileCheck2, HelpCircle } from 'lucide-react'
import { SectionDetectionResult } from '@/lib/resume/types'

interface SectionAuditViewProps {
  sectionsDetection: SectionDetectionResult
}

const SECTION_LABELS: Record<keyof SectionDetectionResult, { label: string; desc: string }> = {
  summary: { label: 'Professional Summary', desc: 'Brief executive profile and core specialty' },
  education: { label: 'Education', desc: 'Degrees, colleges, graduation year, and GPA' },
  skills: { label: 'Technical Skills', desc: 'Categorized technologies, tools, and languages' },
  experience: { label: 'Work Experience', desc: 'Roles, companies, dates, and achievements' },
  projects: { label: 'Key Projects', desc: 'Hands-on builds, architecture, and live links' },
  certifications: { label: 'Certifications', desc: 'Verified cloud, vendor, and technical licenses' },
  languages: { label: 'Languages', desc: 'Professional working and conversational proficiencies' },
  achievements: { label: 'Achievements & Awards', desc: 'Hackathons, honors, academic rankings' }
}

export function SectionAuditView({ sectionsDetection }: SectionAuditViewProps) {
  const entries = Object.entries(sectionsDetection) as [keyof SectionDetectionResult, { present: boolean; recommendation?: string }][]

  const presentCount = entries.filter(([_, data]) => data.present).length
  const missingCount = entries.length - presentCount

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-blue-500/20 gap-2">
        <div>
          <h3 className="text-lg font-bold font-poppins text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-cyan-400" />
            Section Presence Detection
          </h3>
          <p className="text-xs text-slate-400 font-outfit">
            Essential resume sections scanned by Automated Tracking Systems
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
            {presentCount} Detected
          </span>
          {missingCount > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-600/20 text-sky-200 border border-blue-400/30">
              {missingCount} Recommended
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {entries.map(([key, data], idx) => {
          const info = SECTION_LABELS[key] || { label: key, desc: '' }
          const isPresent = data.present

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isPresent
                  ? 'bg-[#0F172A]/85 backdrop-blur-xl border-blue-500/25 hover:border-cyan-400/50 hover:shadow-[0_0_20px_-3px_rgba(34,211,238,0.25)]'
                  : 'bg-[#0B132B]/70 border-blue-500/15 hover:border-sky-400/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-white font-poppins truncate">
                    {info.label}
                  </h4>
                  {isPresent ? (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-sky-400/70 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-outfit leading-relaxed">
                  {info.desc}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-blue-500/20">
                {isPresent ? (
                  <span className="text-[11px] font-semibold text-cyan-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    Detected &amp; Verified
                  </span>
                ) : (
                  <div className="text-[11px] text-sky-300 font-outfit flex flex-col gap-1">
                    <span className="font-semibold flex items-center gap-1 text-sky-400">
                      <AlertCircle className="w-3 h-3 text-sky-400" />
                      Section Recommended
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {data.recommendation}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
