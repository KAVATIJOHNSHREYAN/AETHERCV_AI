'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ResumeBuilderData, SectionKey } from '@/types/resume-builder'
import {
  ZoomIn, ZoomOut, Printer, Download, Eye, FileText, Sparkles,
  AlertTriangle, CheckCircle2, Zap, ShieldCheck, RefreshCw
} from 'lucide-react'
import { exportToPlainText } from '@/lib/resume-builder/import-export'
import { ATS_SAFE_FONTS, getTemplateConfig } from '@/lib/resume-builder/templates'
import { downloadSinglePageA4Pdf, printIsolatedA4Sheet } from '@/lib/resume-builder/pdf-exporter'

interface ResumePreviewProps {
  data: ResumeBuilderData
  onOptimizeToOnePage?: () => void
}

// In standard 96 DPI web rendering: 297mm is approx 1122.5 pixels.
const A4_HEIGHT_PX = 1122

export function ResumePreview({ data, onOptimizeToOnePage }: ResumePreviewProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [viewMode, setViewMode] = useState<'ats-visual' | 'ats-raw'>('ats-visual')
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false)
  const [contentHeight, setContentHeight] = useState<number>(0)
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false)

  const printRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  const {
    customization,
    personalInfo,
    professionalSummary,
    education,
    experience,
    projects,
    skills,
    certifications,
    achievements,
    languages,
    interests,
    internships,
    research,
    publications,
    volunteer,
    references
  } = data

  const templateConfig = getTemplateConfig(customization.templateId)

  // Measure content height and check for 1-page overflow
  useEffect(() => {
    const checkHeight = () => {
      if (sheetRef.current) {
        const height = sheetRef.current.scrollHeight
        setContentHeight(height)
        setIsOverflowing(height > A4_HEIGHT_PX + 25)
      }
    }

    checkHeight()
    const observer = new ResizeObserver(() => checkHeight())
    if (sheetRef.current) observer.observe(sheetRef.current)
    return () => observer.disconnect()
  }, [data, zoomLevel])

  // Resolve CSS Font Stack directly from ATS registry
  const fontConfig = ATS_SAFE_FONTS.find((f) => f.id === customization.fontFamily) || ATS_SAFE_FONTS[0]

  // Margin padding
  const getPaddingClass = () => {
    switch (customization.margins) {
      case 'spacious':
        return 'p-9'
      case 'normal':
        return 'p-7'
      case 'compact':
      default:
        return 'p-6'
    }
  }

  // Base font size
  const getFontSizeClass = () => {
    switch (customization.fontSize) {
      case 'lg':
        return 'text-[12.5px]'
      case 'md':
        return 'text-[11.5px]'
      case 'sm':
      default:
        return 'text-[11px]'
    }
  }

  // Line height
  const getLineHeightClass = () => {
    switch (customization.lineHeight) {
      case 'relaxed':
        return 'leading-relaxed'
      case 'normal':
        return 'leading-normal'
      case 'tight':
      default:
        return 'leading-tight'
    }
  }

  // Section Header Component strictly formatted for ATS with configurable template styles
  const SectionHeader = ({ title }: { title: string }) => {
    const accent = customization.accentColor || '#111827'
    const isDouble = templateConfig.dividerStyle === 'double'
    const isBold = templateConfig.dividerStyle === 'bold'
    const isSubtle = templateConfig.dividerStyle === 'subtle'
    const isNone = templateConfig.dividerStyle === 'none'

    let borderStyle: React.CSSProperties = { borderColor: accent }
    if (isDouble) {
      borderStyle = { borderBottom: `3px double ${accent}` }
    } else if (isBold) {
      borderStyle = { borderBottom: `2px solid ${accent}` }
    } else if (isSubtle) {
      borderStyle = { borderBottom: `1px solid #cbd5e1` }
    } else if (isNone) {
      borderStyle = {}
    } else {
      borderStyle = { borderBottom: `1.5px solid ${accent}` }
    }

    return (
      <div className="pb-0.5 mb-2 mt-3" style={borderStyle}>
        <h2
          className={`font-bold text-[12px] tracking-wider ${
            templateConfig.headerTransform === 'uppercase' ? 'uppercase' : 'capitalize'
          }`}
          style={{ color: accent }}
        >
          {title}
        </h2>
      </div>
    )
  }

  // Dynamic Section Renderer (STRICT SINGLE COLUMN ONLY)
  const renderSection = (key: SectionKey) => {
    // If hidden by user customization, omit immediately
    if (customization.hiddenSections?.includes(key)) {
      return null
    }

    switch (key) {
      case 'summary':
        if (!professionalSummary) return null
        return (
          <div key="summary" className="mb-2">
            <SectionHeader title="Professional Summary" />
            <p className="text-slate-800 leading-relaxed text-justify">
              {professionalSummary}
            </p>
          </div>
        )

      case 'skills':
        if (skills.length === 0) return null
        return (
          <div key="skills" className="mb-2">
            <SectionHeader title="Technical & Core Skills" />
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
          <div key="experience" className="mb-2">
            <SectionHeader title="Work Experience" />
            <div className="space-y-2">
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
          <div key="projects" className="mb-2">
            <SectionHeader title="Key Projects" />
            <div className="space-y-1.5">
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
          <div key="education" className="mb-2">
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
          <div key="certifications" className="mb-2">
            <SectionHeader title="Certifications & Credentials" />
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
          <div key="achievements" className="mb-2">
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

      case 'internships':
        if (!internships || internships.length === 0) return null
        return (
          <div key="internships" className="mb-2">
            <SectionHeader title="Internships" />
            <div className="space-y-1.5">
              {internships.map((int) => (
                <div key={int.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-950">{int.role}</span>
                      <span className="text-slate-800">, {int.company}</span>
                    </div>
                    <span className="text-slate-700 text-[10.5px]">
                      {int.startDate} – {int.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'research':
        if (!research || research.length === 0) return null
        return (
          <div key="research" className="mb-2">
            <SectionHeader title="Research & Publications" />
            <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800">
              {research.map((r) => (
                <li key={r.id}>
                  <strong>{r.title}</strong>: {r.description}
                </li>
              ))}
            </ul>
          </div>
        )

      case 'publications':
        if (!publications || publications.length === 0) return null
        return (
          <div key="publications" className="mb-2">
            <SectionHeader title="Publications" />
            <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800">
              {publications.map((p) => (
                <li key={p.id}>
                  <strong>{p.title}</strong>: {p.description}
                </li>
              ))}
            </ul>
          </div>
        )

      case 'languages':
        if (languages.length === 0) return null
        return (
          <div key="languages" className="mb-2">
            <SectionHeader title="Languages" />
            <p className="text-slate-800">
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
            </p>
          </div>
        )

      case 'volunteer':
        if (!volunteer || volunteer.length === 0) return null
        return (
          <div key="volunteer" className="mb-2">
            <SectionHeader title="Volunteer Work" />
            <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800">
              {volunteer.map((v) => (
                <li key={v.id}>
                  <strong>{v.title}</strong>: {v.description}
                </li>
              ))}
            </ul>
          </div>
        )

      case 'references':
        if (!references || references.length === 0) return null
        return (
          <div key="references" className="mb-2">
            <SectionHeader title="References" />
            <p className="text-slate-800 italic">Available upon request.</p>
          </div>
        )

      case 'interests':
        if (interests.length === 0) return null
        return (
          <div key="interests" className="mb-2">
            <SectionHeader title="Interests & Activities" />
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

  const isCenteredHeader = templateConfig.headerStyle === 'centered'

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

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-semibold px-2 py-0.5 rounded-lg bg-[#07101F] border border-blue-500/15">
            <span className="text-sky-300">{templateConfig.name}</span>
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
            disabled={isExportingPdf}
            onClick={async () => {
              if (!sheetRef.current) return
              setIsExportingPdf(true)
              try {
                if (isOverflowing && onOptimizeToOnePage) {
                  onOptimizeToOnePage()
                  await new Promise((r) => setTimeout(r, 150))
                }
                const name = `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || ''}`.trim()
                await downloadSinglePageA4Pdf(sheetRef.current, name)
              } catch (err) {
                console.error('Failed to export single page PDF:', err)
              } finally {
                setIsExportingPdf(false)
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1E50DA] hover:brightness-110 text-white text-xs font-bold shadow-sm disabled:opacity-50 transition-all cursor-pointer"
            title="Download directly as a strictly 1-page A4 PDF file"
          >
            {isExportingPdf ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isExportingPdf ? 'Exporting PDF...' : 'Download A4 PDF'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!sheetRef.current) return
              const name = `${personalInfo.firstName || 'Resume'} ${personalInfo.lastName || ''}`.trim()
              printIsolatedA4Sheet(sheetRef.current, name, fontConfig.cssStack)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#07101F] border border-blue-500/25 hover:border-blue-500/50 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            title="Print isolated 1-page A4 sheet via browser dialog"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Overflow Warning Banner */}
      {isOverflowing && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>This resume exceeds one A4 page. Click Optimize to automatically adjust spacing and fit strictly on 1 page.</span>
          </div>
          {onOptimizeToOnePage && (
            <button
              type="button"
              onClick={onOptimizeToOnePage}
              className="font-bold underline text-white hover:text-amber-300 ml-2 shrink-0 cursor-pointer"
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
                fontFamily: fontConfig.cssStack,
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.12s ease-out',
                width: '210mm',
                minHeight: '297mm',
                maxHeight: isOverflowing ? undefined : '297mm',
                boxSizing: 'border-box'
              }}
              className={`bg-white text-slate-900 shadow-2xl rounded-sm ${getPaddingClass()} ${getFontSizeClass()} ${getLineHeightClass()}`}
            >
              {/* ── Header: Candidate Name, Title & Pure Text Contacts ── */}
              <div
                className={`pb-2 mb-1 border-b ${
                  isCenteredHeader ? 'text-center' : 'text-left'
                }`}
                style={{ borderColor: customization.accentColor || '#0f172a' }}
              >
                <h1
                  className="text-xl sm:text-2xl font-black tracking-tight uppercase"
                  style={{ color: customization.accentColor || '#020617' }}
                >
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
            size: 210mm 297mm;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            overflow: hidden !important;
            background: #ffffff !important;
          }
          header, nav, footer, .sticky, button, input, select, textarea, [role="dialog"], [role="banner"], div:has(> #resume-printable-sheet) ~ * {
            display: none !important;
          }
          #resume-printable-sheet {
            display: block !important;
            visibility: visible !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
            transform: none !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            z-index: 99999999 !important;
          }
          #resume-printable-sheet * {
            visibility: visible !important;
          }
        }
      `}</style>
    </div>
  )
}
