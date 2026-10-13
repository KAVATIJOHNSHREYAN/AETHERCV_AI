'use client'

import React from 'react'
import { CertificationRecommendation } from '@/types/skill-gap'
import { Award, Clock, TrendingUp, ExternalLink, ShieldCheck } from 'lucide-react'

interface CertificationsViewProps {
  certifications: CertificationRecommendation[]
  roleName: string
}

export function CertificationsView({ certifications, roleName }: CertificationsViewProps) {
  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/80 mb-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          Recommended Industry Certifications
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Credible certifications to validate professional expertise for {roleName}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert, i) => (
          <div
            key={cert.id || i}
            className="bg-slate-950/70 border border-slate-800/90 hover:border-cyan-500/40 rounded-xl p-5 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                    {cert.issuer}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cert.name}
                  </h4>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 whitespace-nowrap">
                  {cert.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {cert.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Duration: {cert.duration}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-slate-300 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Impact: <strong className="text-emerald-300">{cert.careerImpact}</strong>
                </span>

                {cert.officialUrl && (
                  <a
                    href={cert.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:text-cyan-300 transition text-slate-400"
                    title="View official certification curriculum"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
