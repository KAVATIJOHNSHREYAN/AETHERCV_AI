'use client'

import React, { useRef, useState } from 'react'
import { ResumeBuilderData, SectionKey } from '@/types/resume-builder'
import {
  ZoomIn, ZoomOut, Printer, Eye, FileText,
  Mail, Phone, MapPin, Linkedin, Github, Globe
} from 'lucide-react'
import { exportToPlainText } from '@/lib/resume-builder/import-export'

interface ResumePreviewProps {
  data: ResumeBuilderData
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [viewMode, setViewMode] = useState<'recruiter' | 'ats-text'>('recruiter')
  const printRef = useRef<HTMLDivElement>(null)

  const { customization, personalInfo, professionalSummary, education, experience, projects, skills, certifications, achievements, languages, interests } = data
  const accent = customization.accentColor || '#2563EB'

  // Font family class
  const getFontFamily = () => {
    switch (customization.fontFamily) {
      case 'merriweather':
        return 'font-serif'
      case 'jetbrains':
        return 'font-mono'
      case 'poppins':
        return 'font-poppins'
      case 'outfit':
        return 'font-outfit'
      case 'roboto':
        return 'font-sans'
      case 'inter':
      default:
        return 'font-sans'
    }
  }

  // Margin padding
  const getPaddingClass = () => {
    switch (customization.margins) {
      case 'compact':
        return 'p-6 sm:p-8'
      case 'spacious':
        return 'p-10 sm:p-14'
      case 'normal':
      default:
        return 'p-8 sm:p-10'
    }
  }

  // Font sizing scale
  const getTextSizeClass = () => {
    switch (customization.fontSize) {
      case 'sm':
        return 'text-[11px] leading-snug'
      case 'lg':
        return 'text-[13px] leading-relaxed'
      case 'md':
      default:
        return 'text-[12px] leading-normal'
    }
  }

  // Trigger browser print
  const handlePrint = () => {
    window.print()
  }

  // Section Header Component styled by template
  const SectionHeader = ({ title }: { title: string }) => {
    if (customization.templateId === 'harvard' || customization.templateId === 'academic-cv') {
      return (
        <div className="border-b border-black/80 pb-0.5 mb-2.5 mt-4">
          <h3 className="font-serif font-bold text-xs uppercase tracking-widest text-slate-900">{title}</h3>
        </div>
      )
    }

    if (customization.templateId === 'minimal') {
      return (
        <div className="mb-2 mt-3.5">
          <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-800">{title}</h3>
        </div>
      )
    }

    if (customization.templateId === 'google') {
      return (
        <div className="border-b-2 pb-1 mb-2.5 mt-4" style={{ borderColor: accent }}>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">{title}</h3>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 border-b pb-1 mb-2.5 mt-4" style={{ borderColor: `${accent}40` }}>
        <div className="w-1.5 h-3.5 rounded-sm" style={{ backgroundColor: accent }} />
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">{title}</h3>
      </div>
    )
  }

  // Dynamic Section Renderer
  const renderSection = (key: SectionKey) => {
    switch (key) {
      case 'summary':
        if (!professionalSummary) return null
        return (
          <div key="summary" className="mb-3">
            <SectionHeader title="Professional Summary" />
            <p className="text-slate-700 leading-relaxed text-justify">{professionalSummary}</p>
          </div>
        )

      case 'skills':
        if (skills.length === 0) return null
        return (
          <div key="skills" className="mb-3">
            <SectionHeader title="Technical Skills" />
            <div className="space-y-1">
              {skills.map((cat, idx) => (
                <div key={idx} className="flex flex-wrap items-baseline text-slate-800">
                  <span className="font-bold text-slate-900 min-w-32 mr-2">{cat.category}:</span>
                  <span className="text-slate-700">{cat.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'experience':
        if (experience.length === 0) return null
        return (
          <div key="experience" className="mb-3">
            <SectionHeader title="Work Experience" />
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900">{exp.role}</span>
                      <span className="text-slate-700 font-semibold"> • {exp.company}</span>
                      {exp.location && <span className="text-slate-500 text-[11px]"> ({exp.location})</span>}
                    </div>
                    <span className="text-slate-600 text-[11px] font-medium shrink-0">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>

                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                    {exp.achievements.map((a, i) => (
                      <li key={`ach-${i}`} className="font-medium text-slate-800">
                        <strong>Impact:</strong> {a}
                      </li>
                    ))}
                  </ul>

                  {exp.technologiesUsed && exp.technologiesUsed.length > 0 && (
                    <p className="text-[11px] text-slate-500 mt-0.5 italic">
                      Tech Stack: {exp.technologiesUsed.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 'projects':
        if (projects.length === 0) return null
        return (
          <div key="projects" className="mb-3">
            <SectionHeader title="Key Projects" />
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900">{proj.name}</span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="text-[11px] font-medium text-slate-600">
                          [{proj.technologies.join(', ')}]
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] shrink-0">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          GitHub
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          Live Demo
                        </a>
                      )}
                      {proj.duration && <span className="text-slate-500">{proj.duration}</span>}
                    </div>
                  </div>

                  {proj.description && <p className="text-slate-700 mt-0.5">{proj.description}</p>}

                  {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700">
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
          <div key="education" className="mb-3">
            <SectionHeader title="Education" />
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degree}</span>
                      <span className="text-slate-700"> • {edu.university}</span>
                    </div>
                    <span className="text-slate-600 text-[11px] font-medium shrink-0">
                      {edu.startDate} – {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 mt-0.5">
                    {edu.college && <span>{edu.college}</span>}
                    {edu.cgpa && <span className="font-semibold text-slate-800">CGPA: {edu.cgpa}</span>}
                  </div>
                  {edu.description && <p className="text-[11px] text-slate-600 mt-0.5 italic">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )

      case 'certifications':
        if (certifications.length === 0) return null
        return (
          <div key="certifications" className="mb-3">
            <SectionHeader title="Certifications" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-800">
              {certifications.map((c) => (
                <div key={c.id} className="flex items-baseline gap-1">
                  <span className="font-bold text-slate-900">• {c.name}</span>
                  {c.issuer && <span className="text-slate-600">({c.issuer})</span>}
                  {c.issueDate && <span className="text-slate-500 text-[11px]">— {c.issueDate}</span>}
                </div>
              ))}
            </div>
          </div>
        )

      case 'achievements':
        if (achievements.length === 0) return null
        return (
          <div key="achievements" className="mb-3">
            <SectionHeader title="Achievements & Honors" />
            <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700">
              {achievements.map((a) => (
                <li key={a.id}>
                  <strong className="text-slate-900">{a.title}</strong>
                  {a.date && <span className="text-slate-500 text-[11px]"> ({a.date})</span>}:{' '}
                  {a.description}
                </li>
              ))}
            </ul>
          </div>
        )

      case 'languages':
        if (languages.length === 0) return null
        return (
          <div key="languages" className="mb-3">
            <SectionHeader title="Languages" />
            <p className="text-slate-700">
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
            </p>
          </div>
        )

      case 'interests':
        if (interests.length === 0) return null
        return (
          <div key="interests" className="mb-3">
            <SectionHeader title="Interests" />
            <p className="text-slate-700">{interests.join(' • ')}</p>
          </div>
        )

      default:
        return null
    }
  }

  const isSidebarTemplate = customization.templateId === 'sidebar'

  return (
    <div className="flex flex-col h-full space-y-3 font-outfit">
      {/* Preview Controls Bar */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0C162B]/90 border border-blue-500/20 backdrop-blur-md">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-[#07101F] p-1 rounded-xl border border-blue-500/15">
          <button
            type="button"
            onClick={() => setViewMode('recruiter')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'recruiter'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Recruiter View</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('ats-text')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'ats-text'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ATS Plain Text</span>
          </button>
        </div>

        {/* Zoom & Print */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#07101F] px-2 py-1 rounded-xl border border-blue-500/15 text-xs text-slate-300">
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
              className="p-1 hover:text-white text-slate-400"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono text-[11px]">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
              className="p-1 hover:text-white text-slate-400"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] hover:brightness-110 text-white text-xs font-semibold shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Preview Viewport Container */}
      <div className="flex-1 overflow-auto rounded-2xl bg-[#060D1A] border border-blue-500/20 p-4 sm:p-6 flex justify-center items-start shadow-inner">
        {viewMode === 'ats-text' ? (
          // ATS Plain Text Inspector
          <div className="w-full max-w-3xl bg-[#08111F] border border-blue-500/25 rounded-2xl p-6 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap select-text shadow-xl">
            <div className="border-b border-blue-500/20 pb-3 mb-4 flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold text-sky-400 font-poppins">
                ATS Document Stream (Top-to-Bottom Parser View)
              </span>
              <span className="text-[10px]">100% Machine Parsable Plain Text</span>
            </div>
            {exportToPlainText(data)}
          </div>
        ) : (
          // Recruiter Visual A4 Sheet
          <div
            ref={printRef}
            id="resume-printable-sheet"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
              width: '210mm',
              minHeight: '297mm'
            }}
            className={`bg-white text-slate-900 shadow-2xl rounded-sm ${getFontFamily()} ${getPaddingClass()} ${getTextSizeClass()}`}
          >
            {/* Header Section */}
            <div
              className={`pb-3 mb-3 border-b ${
                customization.headerStyle === 'centered'
                  ? 'text-center'
                  : customization.headerStyle === 'banner'
                  ? 'bg-slate-50 p-4 -mx-6 -mt-6 mb-4 rounded-t'
                  : 'text-left'
              }`}
              style={{ borderColor: `${accent}40` }}
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-poppins">
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>

              {personalInfo.professionalTitle && (
                <p className="text-sm font-semibold mt-0.5" style={{ color: accent }}>
                  {personalInfo.professionalTitle}
                </p>
              )}

              {/* Contact Icons Bar */}
              <div
                className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-600 ${
                  customization.headerStyle === 'centered' ? 'justify-center' : 'justify-start'
                }`}
              >
                {personalInfo.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-500" />
                    <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                      {personalInfo.email}
                    </a>
                  </span>
                )}
                {personalInfo.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{personalInfo.phone}</span>
                  </span>
                )}
                {personalInfo.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{personalInfo.location}</span>
                  </span>
                )}
                {personalInfo.linkedin && (
                  <span className="flex items-center gap-1">
                    <Linkedin className="w-3 h-3 text-slate-500" />
                    <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                      LinkedIn
                    </a>
                  </span>
                )}
                {personalInfo.github && (
                  <span className="flex items-center gap-1">
                    <Github className="w-3 h-3 text-slate-500" />
                    <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">
                      GitHub
                    </a>
                  </span>
                )}
                {personalInfo.portfolio && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-500" />
                    <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" className="hover:underline">
                      Portfolio
                    </a>
                  </span>
                )}
              </div>
            </div>

            {/* Dynamic Body Ordered by User Customization */}
            {isSidebarTemplate ? (
              // Sidebar Two-Column Layout
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 border-r pr-4 space-y-3" style={{ borderColor: `${accent}30` }}>
                  {renderSection('skills')}
                  {renderSection('education')}
                  {renderSection('certifications')}
                  {renderSection('languages')}
                  {renderSection('interests')}
                </div>
                <div className="col-span-2 space-y-3">
                  {renderSection('summary')}
                  {renderSection('experience')}
                  {renderSection('projects')}
                  {renderSection('achievements')}
                </div>
              </div>
            ) : (
              // Standard Linear Single-Column Layout
              <div className="space-y-1">
                {customization.sectionOrder.map((secKey) => renderSection(secKey))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global CSS for Print Isolating Resume A4 */}
      <style jsx global>{`
        @media print {
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
            padding: 12mm !important;
            box-shadow: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  )
}
