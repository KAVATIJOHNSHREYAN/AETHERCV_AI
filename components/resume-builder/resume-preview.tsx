'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ResumeBuilderData, SectionKey } from '@/types/resume-builder'
import {
  ZoomIn, ZoomOut, Printer, Eye, FileText, Sparkles,
  AlertTriangle, CheckCircle2, Zap
} from 'lucide-react'
import { exportToPlainText } from '@/lib/resume-builder/import-export'

interface ResumePreviewProps {
  data: ResumeBuilderData
  onOptimizeToOnePage?: () => void
}

// In standard 96 DPI web rendering: 297mm is approx 1122.5 pixels.
// With 12mm top and 12mm bottom margins (24mm total), printable area is approx 1030px.
const A4_HEIGHT_PX = 1122

export function ResumePreview({ data, onOptimizeToOnePage }: ResumePreviewProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [viewMode, setViewMode] = useState<'ats-visual' | 'ats-raw'>('ats-visual')
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false)
  const [contentHeight, setContentHeight] = useState<number>(0)

  const printRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  const { customization, personalInfo, professionalSummary, education, experience, projects, skills, certifications, achievements, languages, interests } = data

  // Measure content height and check for 1-page overflow
  useEffect(() => {
    const checkHeight = () => {
      if (sheetRef.current) {
        const height = sheetRef.current.scrollHeight
        setContentHeight(height)
        setIsOverflowing(height > A4_HEIGHT_PX + 20)
      }
    }

    checkHeight()
    const observer = new ResizeObserver(() => checkHeight())
    if (sheetRef.current) observer.observe(sheetRef.current)
    return () => observer.disconnect()
  }, [data, zoomLevel])

  // Font family selector: Strict ATS-Safe Fonts
  const getFontFamily = () => {
    switch (customization.fontFamily) {
      case 'merriweather':
        return 'font-serif'
      case 'jetbrains':
        return 'font-mono'
      case 'roboto':
      case 'inter':
      default:
        return 'font-sans'
    }
  }

  // Margin padding
  const getPaddingStyle = () => {
    switch (customization.margins) {
      case 'spacious':
        return 'p-10'
      case 'normal':
        return 'p-8'
      case 'compact':
      default:
        return 'p-7'
    }
  }

  // Font sizing scale (Clean ATS scale: 10pt - 11pt)
  const getTextSizeClass = () => {
    switch (customization.fontSize) {
      case 'lg':
        return 'text-[12.5px] leading-relaxed'
      case 'md':
        return 'text-[11.5px] leading-normal'
      case 'sm':
      default:
        return 'text-[11px] leading-tight'
    }
  }

  // Section Header Component strictly formatted for ATS
  const SectionHeader = ({ title }: { title: string }) => {
    return (
      <div className="border-b border-slate-900 pb-0.5 mb-2 mt-3.5">
        <h2 className="font-bold text-[12px] uppercase tracking-wider text-slate-950">
          {title}
        </h2>
      </div>
    )
  }

  // Dynamic Section Renderer (STRICT SINGLE COLUMN ONLY)
  const renderSection = (key: SectionKey) => {
    switch (key) {
      case 'summary':
        if (!professionalSummary) return null
        return (
          <div key="summary" className="mb-2.5">
            <SectionHeader title="Professional Summary" />
            <p className="text-slate-800 leading-relaxed text-justify">
              {professionalSummary}
            </p>
          </div>
        )

      case 'skills':
        if (skills.length === 0) return null
        return (
          <div key="skills" className="mb-2.5">
            <SectionHeader title="Technical Skills" />
            <div className="space-y-1">
              {skills.map((cat, idx) => (
                <div key={idx} className="text-slate-800">
                  <span className="font-bold text-slate-950">{cat.category}: </span>
                  <span>{cat.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'experience':
        if (experience.length === 0) return null
        return (
          <div key="experience" className="mb-2.5">
            <SectionHeader title="Work Experience" />
            <div className="space-y-2.5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-950">{exp.role}</span>
                      <span className="text-slate-800 font-semibold">, {exp.company}</span>
                      {exp.location && <span className="text-slate-600 text-[10.5px]"> — {exp.location}</span>}
                    </div>
                    <span className="text-slate-700 text-[10.5px] font-semibold shrink-0">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>

                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-slate-800">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                    {exp.achievements.map((a, i) => (
                      <li key={`ach-${i}`}>
                        <strong>Key Impact:</strong> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )

      case 'projects':
        if (projects.length === 0) return null
        return (
          <div key="projects" className="mb-2.5">
            <SectionHeader title="Key Projects" />
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-950">{proj.name}</span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="text-slate-600 text-[10.5px] italic">
                          | {proj.technologies.join(', ')}
                        </span>
                      )}
                    </div>
                    <div className="text-[10.5px] text-slate-700 font-medium shrink-0">
                      {proj.githubUrl && (
                        <span className="mr-2">
                          Code: {proj.githubUrl.replace(/^https?:\/\//, '')}
                        </span>
                      )}
                      {proj.duration && <span>{proj.duration}</span>}
                    </div>
                  </div>

                  {proj.description && <p className="text-slate-800 mt-0.5">{proj.description}</p>}

                  {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-slate-800">
                      {proj.bulletPoints.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 'education':
        if (education.length === 0) return null
        return (
          <div key="education" className="mb-2.5">
            <SectionHeader title="Education" />
            <div className="space-y-1.5">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-950">{edu.degree}</span>
                      <span className="text-slate-800"> — {edu.university}</span>
                    </div>
                    <span className="text-slate-700 text-[10.5px] font-semibold shrink-0">
                      {edu.startDate} – {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] text-slate-700 mt-0.5">
                    {edu.college && <span>{edu.college}</span>}
                    {edu.cgpa && <span className="font-semibold text-slate-900">CGPA / GPA: {edu.cgpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'certifications':
        if (certifications.length === 0) return null
        return (
          <div key="certifications" className="mb-2.5">
            <SectionHeader title="Certifications" />
            <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800">
              {certifications.map((c) => (
                <li key={c.id}>
                  <strong>{c.name}</strong> — {c.issuer} {c.issueDate && `(${c.issueDate})`}
                </li>
              ))}
            </ul>
          </div>
        )

      case 'achievements':
        if (achievements.length === 0) return null
        return (
          <div key="achievements" className="mb-2.5">
            <SectionHeader title="Achievements & Honors" />
            <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800">
              {achievements.map((a) => (
                <li key={a.id}>
                  <strong>{a.title}</strong>
                  {a.date && <span className="text-slate-600 text-[10.5px]"> ({a.date})</span>}:{' '}
                  {a.description}
                </li>
              ))}
            </ul>
          </div>
        )

      case 'languages':
        if (languages.length === 0) return null
        return (
          <div key="languages" className="mb-2.5">
            <SectionHeader title="Languages" />
            <p className="text-slate-800">
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
            </p>
          </div>
        )

      case 'interests':
        if (interests.length === 0) return null
        return (
          <div key="interests" className="mb-2.5">
            <SectionHeader title="Interests" />
            <p className="text-slate-800">{interests.join(' • ')}</p>
          </div>
        )

      default:
        return null
    }
  }

  // Build clean ATS Contact line (strictly text-only, no SVG icons inside resume)
  const contactParts: string[] = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin ? personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '') : '',
    personalInfo.github ? personalInfo.github.replace(/^https?:\/\/(www\.)?/, '') : '',
    personalInfo.portfolio ? personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '') : ''
  ].filter(Boolean)

  return (
    <div className="flex flex-col h-full space-y-3 font-outfit">
      {/* ── Toolbar: Page Indicator, Optimization Button, Zoom & Print ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#0C162B]/95 border border-blue-500/20 backdrop-blur-md shadow-md">
        {/* Live Page Count Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
              isOverflowing
                ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {isOverflowing ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Page Count: {isOverflowing ? '2 / 1' : '1 / 1'}</span>
          </div>

          {/* Quick One-Click AI Optimizer Button */}
          {isOverflowing && onOptimizeToOnePage && (
            <button
              type="button"
              onClick={onOptimizeToOnePage}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:brightness-110 text-white text-xs font-bold shadow-md animate-pulse"
              title="Compress spacing, summaries, and bullets to fit within 1 page"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Optimize to 1 Page</span>
            </button>
          )}
        </div>

        {/* View Mode Toggle & Print */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#07101F] p-0.5 rounded-xl border border-blue-500/15 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('ats-visual')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'ats-visual'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ATS Preview
            </button>
            <button
              type="button"
              onClick={() => setViewMode('ats-raw')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'ats-raw'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Stream View
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-[#07101F] px-2 py-1 rounded-xl border border-blue-500/15 text-xs text-slate-300">
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
              className="p-1 hover:text-white text-slate-400"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-mono text-[11px]">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
              className="p-1 hover:text-white text-slate-400"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] hover:brightness-110 text-white text-xs font-bold shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export A4 PDF</span>
          </button>
        </div>
      </div>

      {/* Overflow Warning Banner */}
      {isOverflowing && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>This resume exceeds one A4 page. Recruiters and ATS scanners strongly favor a strict 1-page format.</span>
          </div>
          {onOptimizeToOnePage && (
            <button
              type="button"
              onClick={onOptimizeToOnePage}
              className="font-bold underline text-white hover:text-amber-300 ml-2 shrink-0"
            >
              Click Optimize
            </button>
          )}
        </div>
      )}

      {/* ── Viewport Container ── */}
      <div className="flex-1 overflow-auto rounded-2xl bg-[#060D1A] border border-blue-500/20 p-4 sm:p-6 flex justify-center items-start shadow-inner">
        {viewMode === 'ats-raw' ? (
          // ATS Plain Text Stream Inspector
          <div className="w-full max-w-2xl bg-[#08111F] border border-blue-500/25 rounded-2xl p-6 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto whitespace-pre-wrap select-text shadow-xl">
            <div className="border-b border-blue-500/20 pb-2.5 mb-3 flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold text-sky-400 font-poppins">
                Pure ATS Plain Text Stream (Top-to-Bottom Scan)
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">100% Machine Parsable</span>
            </div>
            {exportToPlainText(data)}
          </div>
        ) : (
          // Visual ATS-Strict A4 Sheet (210mm x 297mm)
          <div className="relative">
            <div
              ref={sheetRef}
              id="resume-printable-sheet"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.12s ease-out',
                width: '210mm',
                minHeight: '297mm',
                boxSizing: 'border-box'
              }}
              className={`bg-white text-slate-900 shadow-2xl rounded-sm ${getFontFamily()} ${getPaddingStyle()} ${getTextSizeClass()}`}
            >
              {/* ── Header: Candidate Name, Title & Pure Text Contacts ── */}
              <div className="text-center pb-2 mb-1 border-b border-slate-900">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase font-sans">
                  {personalInfo.firstName} {personalInfo.lastName}
                </h1>

                {personalInfo.professionalTitle && (
                  <p className="text-[12px] font-bold text-slate-800 mt-0.5">
                    {personalInfo.professionalTitle}
                  </p>
                )}

                {/* Pure text contact separator (No images or icons per strict ATS rules) */}
                {contactParts.length > 0 && (
                  <p className="text-[10.5px] text-slate-700 font-medium mt-1 leading-normal">
                    {contactParts.join(' | ')}
                  </p>
                )}
              </div>

              {/* ── Single-Column Body (Enforced: No tables, no columns, no textboxes) ── */}
              <div className="space-y-0.5">
                {customization.sectionOrder.map((secKey) => renderSection(secKey))}
              </div>
            </div>

            {/* Visual Page 1 Bottom Limit Indicator (Guides user if exceeding 297mm) */}
            <div
              style={{
                position: 'absolute',
                top: `${A4_HEIGHT_PX * (zoomLevel / 100)}px`,
                left: 0,
                right: 0,
                borderTop: '2px dashed rgba(239, 68, 68, 0.7)',
                pointerEvents: 'none',
                display: isOverflowing ? 'block' : 'none'
              }}
            >
              <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-b shadow-sm ml-2">
                Page 1 Boundary (Content below will overflow)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Strict A4 Print CSS Rules */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body * {
            visibility: hidden;
          }
          #resume-printable-sheet,
          #resume-printable-sheet * {
            visibility: visible;
          }
          #resume-printable-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 8mm !important;
            box-shadow: none !important;
            transform: none !important;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  )
}
