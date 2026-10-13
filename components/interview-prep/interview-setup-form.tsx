'use client'

import React, { useState, useRef, useMemo } from 'react'
import {
  InterviewInput,
  InterviewType,
  DifficultyLevel,
  ExperienceLevel
} from '@/types/interview-prep'
import { MASTER_JOB_ROLES } from '@/lib/job-roles/master-library'
import { COMPANIES_DATABASE } from '@/lib/salary-predictor/companies-data'
import { RoleBrowserModal } from '@/components/salary-predictor/role-browser-modal'
import { CompanyBrowserModal } from '@/components/salary-predictor/company-browser-modal'
import { extractTextFromPdfInBrowser, extractTextFromDocxInBrowser } from '@/lib/resume/client-pdf-extractor'
import { defaultResumeData } from '@/lib/resume-builder/default-data'
import {
  Briefcase,
  Building2,
  Globe2,
  Sparkles,
  Upload,
  FileText,
  Sliders,
  AlertCircle,
  CheckCircle2,
  X,
  Code2,
  Compass,
  Users,
  Shield,
  Layers,
  ArrowRight,
  RefreshCw,
  Search
} from 'lucide-react'

interface InterviewSetupFormProps {
  input: InterviewInput
  onChange: (input: InterviewInput) => void
  onStartInterview: () => void
  isLoading: boolean
  onLoadSample: () => void
  onReset: () => void
}

const COUNTRIES_LIST = [
  { name: 'India', flag: '🇮🇳' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Brazil', flag: '🇧🇷' }
]

const INTERVIEW_TYPES: {
  id: InterviewType
  title: string
  subtitle: string
  icon: React.ElementType
  badge?: string
}[] = [
  {
    id: 'complete',
    title: 'Complete Mock Interview',
    subtitle: 'Full-loop technical, DSA, system design, and behavioral simulation',
    icon: Sparkles,
    badge: 'Recommended'
  },
  {
    id: 'technical',
    title: 'Technical Deep-Dive',
    subtitle: 'Architecture, frameworks, concurrency, database internals & trade-offs',
    icon: Code2
  },
  {
    id: 'coding',
    title: 'Coding & DSA Round',
    subtitle: 'Algorithmic problem solving, complexity analysis & live code editor',
    icon: Layers
  },
  {
    id: 'system_design',
    title: 'System Design Round',
    subtitle: 'Large scale distributed architectures, caching, rate limiting & CAP trade-offs',
    icon: Compass
  },
  {
    id: 'behavioral',
    title: 'Behavioral Round',
    subtitle: 'STAR method, conflict resolution, leadership principles & ownership',
    icon: Users
  },
  {
    id: 'hr',
    title: 'HR & Cultural Alignment',
    subtitle: 'Motivation, salary expectations, remote/hybrid fit, company values',
    icon: Shield
  },
  {
    id: 'managerial',
    title: 'Managerial & Leadership',
    subtitle: 'Engineering management, team velocity, mentorship & ambiguous scope',
    icon: Briefcase
  },
  {
    id: 'case_study',
    title: 'Architecture Case Study',
    subtitle: 'End-to-end product design, technical roadmapping, failure recovery',
    icon: Sliders
  },
  {
    id: 'final_hr',
    title: 'Final Executive Round',
    subtitle: 'VP / Director level closing interview, long-term vision & team alignment',
    icon: Sparkles
  }
]

export function InterviewSetupForm({
  input,
  onChange,
  onStartInterview,
  isLoading,
  onLoadSample,
  onReset
}: InterviewSetupFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [extractError, setExtractError] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)

  // Role and Company Modals
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [roleSearchOpen, setRoleSearchOpen] = useState(false)
  const [companySearchOpen, setCompanySearchOpen] = useState(false)

  const roleDropdownRef = useRef<HTMLDivElement>(null)
  const companyDropdownRef = useRef<HTMLDivElement>(null)

  // Autocomplete suggestions
  const filteredRoleSuggestions = useMemo(() => {
    const q = input.jobRole.trim().toLowerCase()
    if (!q) return MASTER_JOB_ROLES.slice(0, 30)
    return MASTER_JOB_ROLES.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.aliases.some(a => a.toLowerCase().includes(q))
    ).slice(0, 40)
  }, [input.jobRole])

  const filteredCompanySuggestions = useMemo(() => {
    const q = input.company.trim().toLowerCase()
    if (!q) return COMPANIES_DATABASE.slice(0, 30)
    return COMPANIES_DATABASE.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.ticker && c.ticker.toLowerCase().includes(q)) ||
      c.headquarters.toLowerCase().includes(q) ||
      c.tier.toLowerCase().includes(q) ||
      c.primaryIndustries.some(ind => ind.toLowerCase().includes(q))
    ).slice(0, 40)
  }, [input.company])

  // File Upload parsing
  const handleFileUpload = async (file: File) => {
    if (!file) return
    setIsExtracting(true)
    setExtractError(null)

    try {
      let extracted = ''
      const name = file.name.toLowerCase()

      if (name.endsWith('.pdf')) {
        extracted = await extractTextFromPdfInBrowser(file)
      } else if (name.endsWith('.docx')) {
        extracted = await extractTextFromDocxInBrowser(file)
      } else if (name.endsWith('.txt')) {
        extracted = await file.text()
      } else {
        throw new Error('Unsupported format. Please upload .PDF, .DOCX, or .TXT')
      }

      if (!extracted || extracted.trim().length < 40) {
        throw new Error('Could not extract readable text from this document. Please ensure it is not scanned.')
      }

      onChange({
        ...input,
        inputSource: 'resume',
        resumeText: extracted,
        resumeFileName: file.name
      })
    } catch (err: any) {
      console.error('File parsing error:', err)
      setExtractError(err.message || 'Error extracting resume text.')
    } finally {
      setIsExtracting(false)
    }
  }

  // Resume Builder Sync
  const handleSyncResumeBuilder = () => {
    try {
      let builderData = defaultResumeData
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('resume-builder-data')
        if (local) {
          builderData = JSON.parse(local)
        }
      }

      const projectsText = builderData.projects
        ? builderData.projects.map(p => `${p.name}: ${p.description}`).join('\n')
        : ''
      const skillsText = builderData.skills ? builderData.skills.join(', ') : ''
      const expText = builderData.experience
        ? builderData.experience.map(e => `${e.position} at ${e.company}: ${e.description}`).join('\n')
        : ''

      const text = `CANDIDATE: ${builderData.personalInfo?.name || 'Candidate'}\nTITLE: ${builderData.personalInfo?.title || ''}\nSUMMARY: ${builderData.personalInfo?.summary || ''}\n\nSKILLS: ${skillsText}\n\nEXPERIENCE:\n${expText}\n\nPROJECTS:\n${projectsText}`

      onChange({
        ...input,
        inputSource: 'builder',
        resumeText: text,
        resumeFileName: 'AETHERCV AI Resume Builder Profile',
        jobRole: builderData.personalInfo?.title || input.jobRole
      })
    } catch (err) {
      console.error('Resume sync failed:', err)
      setExtractError('Could not sync with Resume Builder storage.')
    }
  }

  return (
    <div className="w-full bg-[#0C162B] border border-blue-500/20 rounded-3xl p-5 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
      {/* Header & Source selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span>Configure Your Mock Interview</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personalize your interview room based on your real resume, target company, and round format.
          </p>
        </div>

        {/* Source Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => onChange({ ...input, inputSource: 'manual' })}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              input.inputSource === 'manual'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manual Entry</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChange({ ...input, inputSource: 'resume' })
              fileInputRef.current?.click()
            }}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              input.inputSource === 'resume'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Resume</span>
          </button>

          <button
            type="button"
            onClick={handleSyncResumeBuilder}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              input.inputSource === 'builder'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resume Builder</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={e => {
          if (e.target.files?.[0]) handleFileUpload(e.target.files[0])
        }}
      />

      {/* Uploaded File Status */}
      {input.inputSource === 'resume' && input.resumeFileName && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs">
          <div className="flex items-center gap-2.5 text-blue-300">
            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="font-semibold">{input.resumeFileName}</span>
            <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Resume Loaded
            </span>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-400 hover:text-blue-300 underline font-medium"
          >
            Change File
          </button>
        </div>
      )}

      {extractError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{extractError}</span>
        </div>
      )}

      {/* Row 1: Target Role & Target Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Role */}
        <div className="relative" ref={roleDropdownRef}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              <span>Target Job Role</span>
            </label>
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(true)}
              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition px-1.5 py-0.5 rounded-md hover:bg-blue-950/40"
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Browse Top 200 Roles ({MASTER_JOB_ROLES.length})</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={input.jobRole}
              onChange={e => {
                onChange({ ...input, jobRole: e.target.value })
                setRoleSearchOpen(true)
              }}
              onFocus={() => setRoleSearchOpen(true)}
              placeholder="e.g. Software Engineer, AI Engineer, Full Stack..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
            />
            {input.jobRole && (
              <button
                type="button"
                onClick={() => {
                  onChange({ ...input, jobRole: '' })
                  setRoleSearchOpen(true)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Dropdown */}
            {roleSearchOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-[#0C162B] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-64 flex flex-col animate-in fade-in duration-150">
                <div className="p-2 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400 px-3">
                  <span>Standardized Roles ({filteredRoleSuggestions.length} shown)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setRoleSearchOpen(false)
                      setIsRoleModalOpen(true)
                    }}
                    className="text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    View All {MASTER_JOB_ROLES.length} →
                  </button>
                </div>
                <div className="overflow-y-auto p-1.5 space-y-0.5">
                  {filteredRoleSuggestions.map(role => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        onChange({ ...input, jobRole: role.title })
                        setRoleSearchOpen(false)
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs transition flex items-center justify-between text-slate-300 hover:bg-slate-900 hover:text-white"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{role.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                          {role.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['Software Engineer', 'AI Engineer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  onChange({ ...input, jobRole: r })
                  setRoleSearchOpen(false)
                }}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                  input.jobRole.toLowerCase() === r.toLowerCase()
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Company */}
        <div className="relative" ref={companyDropdownRef}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Employer / Company</span>
            </label>
            <button
              type="button"
              onClick={() => setIsCompanyModalOpen(true)}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition px-1.5 py-0.5 rounded-md hover:bg-cyan-950/40"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Browse Top 200 Employers ({COMPANIES_DATABASE.length})</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={input.company}
              onChange={e => {
                onChange({ ...input, company: e.target.value })
                setCompanySearchOpen(true)
              }}
              onFocus={() => setCompanySearchOpen(true)}
              placeholder="e.g. Google, Microsoft, Amazon, OpenAI, TCS, Infosys, Startup..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
            />
            {input.company && (
              <button
                type="button"
                onClick={() => {
                  onChange({ ...input, company: '' })
                  setCompanySearchOpen(true)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Dropdown */}
            {companySearchOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-[#0C162B] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-64 flex flex-col animate-in fade-in duration-150">
                <div className="p-2 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400 px-3">
                  <span>Top Employers ({filteredCompanySuggestions.length} shown)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCompanySearchOpen(false)
                      setIsCompanyModalOpen(true)
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    View All {COMPANIES_DATABASE.length} →
                  </button>
                </div>
                <div className="overflow-y-auto p-1.5 space-y-0.5">
                  {filteredCompanySuggestions.map(comp => (
                    <button
                      key={comp.name}
                      type="button"
                      onClick={() => {
                        onChange({ ...input, company: comp.name })
                        setCompanySearchOpen(false)
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs transition flex items-center justify-between text-slate-300 hover:bg-slate-900 hover:text-white"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{comp.name}</span>
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                          {comp.tier}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'NVIDIA', 'OpenAI', 'TCS', 'Infosys'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange({ ...input, company: c })
                  setCompanySearchOpen(false)
                }}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                  input.company.toLowerCase() === c.toLowerCase()
                    ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Country, Experience, Difficulty */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
        {/* Country */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Country</span>
          </label>
          <select
            value={input.country}
            onChange={e => onChange({ ...input, country: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
          >
            {COUNTRIES_LIST.map(c => (
              <option key={c.name} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-sky-400" />
            <span>Experience Level</span>
          </label>
          <select
            value={input.experienceLevel}
            onChange={e =>
              onChange({ ...input, experienceLevel: e.target.value as ExperienceLevel })
            }
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-medium cursor-pointer"
          >
            <option value="intern">Intern / Student</option>
            <option value="entry">Entry-Level (0 - 2 Years)</option>
            <option value="mid">Mid-Level (3 - 5 Years)</option>
            <option value="senior">Senior Engineer (6 - 8 Years)</option>
            <option value="lead">Staff / Lead (9 - 12 Years)</option>
            <option value="executive">Executive / Director (12+ Years)</option>
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Difficulty Level</span>
          </label>
          <select
            value={input.difficulty}
            onChange={e =>
              onChange({ ...input, difficulty: e.target.value as DifficultyLevel })
            }
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
          >
            <option value="easy">Easy (Warm-up & Fundamentals)</option>
            <option value="medium">Medium (Standard Hiring Bar)</option>
            <option value="hard">Hard (Rigorous Problem Solving)</option>
            <option value="company_level">Company Level (Strict Tier 1 Bar)</option>
          </select>
        </div>
      </div>

      {/* Row 3: Interview Round Type Cards */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Select Interview Round Type</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {INTERVIEW_TYPES.map(type => {
            const isSelected = input.interviewType === type.id
            const Icon = type.icon

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onChange({ ...input, interviewType: type.id })}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 relative ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-850 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-950 text-blue-400 border border-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs sm:text-[13px] text-white">
                        {type.title}
                      </span>
                    </div>
                    {type.badge && (
                      <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold font-mono">
                        {type.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {type.subtitle}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Row 4: Optional Job Description paste */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>Target Job Description (Optional — Deep-tailors question generation)</span>
        </label>
        <textarea
          rows={3}
          value={input.jobDescription}
          onChange={e => onChange({ ...input, jobDescription: e.target.value })}
          placeholder="Paste requirements, tech stack, or JD text here to have the recruiter target specific keywords from the job listing..."
          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed resize-y"
        />
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onLoadSample}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Sample Profile</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onStartInterview}
          disabled={isLoading || !input.jobRole || !input.company}
          className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Generating Tailored Mock Interview...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>Enter AI Mock Interview Room</span>
              <ArrowRight className="w-4 h-4 text-sky-200" />
            </>
          )}
        </button>
      </div>

      {/* Directory Modals */}
      <RoleBrowserModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        selectedRole={input.jobRole}
        onSelectRole={role => onChange({ ...input, jobRole: role })}
      />

      <CompanyBrowserModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        selectedCompany={input.company}
        onSelectCompany={comp => onChange({ ...input, company: comp })}
      />
    </div>
  )
}
