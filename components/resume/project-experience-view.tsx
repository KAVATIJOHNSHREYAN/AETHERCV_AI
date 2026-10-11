'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ParsedResume } from '@/lib/resume/types'
import { auditProjects, auditExperience, auditEducation } from '@/lib/resume/project-experience-analyzer'
import { Code, Briefcase, GraduationCap, CheckCircle2, AlertCircle, Layers, Award, Sparkles } from 'lucide-react'

interface ProjectExperienceViewProps {
  resume: ParsedResume
}

export function ProjectExperienceView({ resume }: ProjectExperienceViewProps) {
  const projectAudits = auditProjects(resume)
  const experienceAudits = auditExperience(resume)
  const educationAudits = auditEducation(resume)

  return (
    <div className="space-y-8">
      {/* 1. Projects Analysis */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
          <div>
            <h3 className="text-base font-bold font-poppins text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-sky-400" />
              Project Portfolio Depth &amp; Metrics Audit
            </h3>
            <p className="text-xs text-slate-400 font-outfit">
              Evaluates tech stacks, technical architecture, and measurable business impact
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/15 text-sky-300 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
            {projectAudits.length} Project(s)
          </span>
        </div>

        {projectAudits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectAudits.map((proj, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-5 rounded-2xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 hover:border-sky-400/40 shadow-[0_4px_20px_rgba(37,99,235,0.06)] hover:shadow-[0_4px_25px_rgba(56,189,248,0.12)] transition-all space-y-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold font-poppins text-white">{proj.name}</h4>
                    <span className="text-[11px] font-semibold text-cyan-300 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 inline-block mt-1">
                      Depth: {proj.depthGrade}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Impact Metric</span>
                    <span className={`text-xs font-bold ${proj.metricScore > 50 ? 'text-cyan-400' : 'text-sky-300'}`}>
                      {proj.metricScore}%
                    </span>
                  </div>
                </div>

                {/* Strengths */}
                {proj.strengths.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Strengths:
                    </span>
                    <ul className="text-xs text-slate-300/90 pl-3 space-y-1 font-outfit">
                      {proj.strengths.map((st, sIdx) => (
                        <li key={sIdx}>• {st}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {proj.improvementRecommendations.length > 0 && (
                  <div className="pt-2.5 border-t border-blue-500/15 space-y-1">
                    <span className="text-[11px] font-semibold text-sky-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Recommended Improvement:
                    </span>
                    <ul className="text-xs text-slate-400 pl-3 space-y-1 font-outfit">
                      {proj.improvementRecommendations.map((rec, rIdx) => (
                        <li key={rIdx}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 bg-[#0F172A]/60 rounded-2xl border border-dashed border-blue-500/30">
            No dedicated project blocks detected. Adding 2-3 technical projects significantly increases ATS qualification scores.
          </div>
        )}
      </div>

      {/* 2. Work Experience Analysis */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
          <div>
            <h3 className="text-base font-bold font-poppins text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              Experience Impact &amp; Quantified Delivery
            </h3>
            <p className="text-xs text-slate-400 font-outfit">
              Audits role descriptions, responsibility framing, and numbers/metrics
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 shadow-[0_0_10px_rgba(34,211,238,0.15)]">
            {experienceAudits.length} Role(s)
          </span>
        </div>

        {experienceAudits.length > 0 ? (
          <div className="space-y-3">
            {experienceAudits.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-5 rounded-2xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 hover:border-sky-400/40 shadow-[0_4px_20px_rgba(37,99,235,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold font-poppins text-white">{exp.title}</h4>
                    <span className="text-xs text-slate-400">at {exp.company}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-outfit">
                    <span>Metrics Found: <strong className="text-cyan-300">{exp.quantifiedCount}</strong></span>
                    <span className="text-blue-500">•</span>
                    <span>Action Verbs: <strong className="text-sky-300">{exp.actionVerbCount}</strong></span>
                  </div>
                  {exp.bulletRecommendations.length > 0 && (
                    <div className="text-xs text-sky-200 font-outfit mt-1 flex items-start gap-1.5 bg-blue-950/40 p-2 rounded-xl border border-blue-500/20">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
                      <span>{exp.bulletRecommendations[0]}</span>
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    exp.status === 'Strong Impact'
                      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      : 'bg-blue-500/10 text-sky-300 border-blue-500/30'
                  }`}>
                    {exp.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 bg-[#0F172A]/60 rounded-2xl border border-dashed border-blue-500/30">
            No work experience section identified. For early-career engineers, showcase internships or open source contributions.
          </div>
        )}
      </div>

      {/* 3. Education Verification */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
          <div>
            <h3 className="text-base font-bold font-poppins text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              Academic Credentials &amp; Graduation Check
            </h3>
            <p className="text-xs text-slate-400 font-outfit">
              Checks institution names, graduation year, and academic grades
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {educationAudits.map((edu, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 hover:border-sky-400/40 shadow-[0_4px_20px_rgba(37,99,235,0.06)] space-y-1.5 transition-all">
              <h4 className="text-sm font-bold font-poppins text-white">{edu.degree}</h4>
              <p className="text-xs text-slate-400 font-outfit">{edu.institution}</p>
              <div className="flex items-center gap-3 text-xs pt-1">
                <span className="font-medium text-slate-300">{edu.year}</span>
                {edu.cgpa && <span className="text-cyan-400 font-semibold">• CGPA: {edu.cgpa}</span>}
              </div>
              {edu.auditRemarks.length > 0 && (
                <p className="text-[11px] text-slate-400 italic font-outfit pt-1">
                  Note: {edu.auditRemarks.join(' ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
