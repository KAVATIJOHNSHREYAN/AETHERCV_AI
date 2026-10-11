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
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div>
            <h3 className="text-base font-bold font-poppins text-foreground flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-500" />
              Project Portfolio Depth & Metrics Audit
            </h3>
            <p className="text-xs text-muted-foreground font-outfit">
              Evaluates tech stacks, technical architecture, and measurable business impact
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
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
                className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold font-poppins text-foreground">{proj.name}</h4>
                    <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 inline-block mt-1">
                      Depth: {proj.depthGrade}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">Impact Metric</span>
                    <span className={`text-xs font-bold ${proj.metricScore > 50 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {proj.metricScore}%
                    </span>
                  </div>
                </div>

                {/* Strengths */}
                {proj.strengths.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Strengths:
                    </span>
                    <ul className="text-xs text-muted-foreground pl-3 space-y-0.5 font-outfit">
                      {proj.strengths.map((st, sIdx) => (
                        <li key={sIdx}>• {st}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {proj.improvementRecommendations.length > 0 && (
                  <div className="pt-2 border-t border-border/30 space-y-1">
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Recommended Improvement:
                    </span>
                    <ul className="text-xs text-muted-foreground pl-3 space-y-0.5 font-outfit">
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
          <div className="p-6 text-center text-xs text-muted-foreground bg-secondary/30 rounded-2xl border border-dashed border-border/60">
            No dedicated project blocks detected. Adding 2-3 technical projects significantly increases ATS qualification scores.
          </div>
        )}
      </div>

      {/* 2. Work Experience Analysis */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div>
            <h3 className="text-base font-bold font-poppins text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-500" />
              Experience Impact & Quantified Delivery
            </h3>
            <p className="text-xs text-muted-foreground font-outfit">
              Audits role descriptions, responsibility framing, and numbers/metrics
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
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
                className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold font-poppins text-foreground">{exp.title}</h4>
                    <span className="text-xs text-muted-foreground">at {exp.company}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-outfit">
                    <span>Metrics Found: <strong className="text-foreground">{exp.quantifiedCount}</strong></span>
                    <span>•</span>
                    <span>Action Verbs: <strong className="text-foreground">{exp.actionVerbCount}</strong></span>
                  </div>
                  {exp.bulletRecommendations.length > 0 && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-outfit mt-1 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{exp.bulletRecommendations[0]}</span>
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    exp.status === 'Strong Impact'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  }`}>
                    {exp.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-muted-foreground bg-secondary/30 rounded-2xl border border-dashed border-border/60">
            No work experience section identified. For early-career engineers, showcase internships or open source contributions.
          </div>
        )}
      </div>

      {/* 3. Education Verification */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div>
            <h3 className="text-base font-bold font-poppins text-foreground flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-500" />
              Academic Credentials & Graduation Check
            </h3>
            <p className="text-xs text-muted-foreground font-outfit">
              Checks institution names, graduation year, and academic grades
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {educationAudits.map((edu, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-1.5">
              <h4 className="text-sm font-bold font-poppins text-foreground">{edu.degree}</h4>
              <p className="text-xs text-muted-foreground font-outfit">{edu.institution}</p>
              <div className="flex items-center gap-3 text-xs pt-1">
                <span className="font-medium text-foreground">{edu.year}</span>
                {edu.cgpa && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">• CGPA: {edu.cgpa}</span>}
              </div>
              {edu.auditRemarks.length > 0 && (
                <p className="text-[11px] text-muted-foreground italic font-outfit pt-1">
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
