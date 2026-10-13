'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  SalaryPredictionInput,
  SalaryInputMode,
  ExperienceBracket,
  EducationLevel,
  EmploymentType,
  WorkplaceModel
} from '@/types/salary-predictor'
import { COUNTRIES_DATABASE, CURRENCY_RATES } from '@/lib/salary-predictor/countries-data'
import { COMPANIES_DATABASE } from '@/lib/salary-predictor/companies-data'
import { MASTER_JOB_ROLES } from '@/lib/job-roles/master-library'
import { RoleBrowserModal } from './role-browser-modal'
import { CompanyBrowserModal } from './company-browser-modal'
import { defaultResumeData } from '@/lib/resume-builder/default-data'
import { extractTextFromPdfInBrowser, extractTextFromDocxInBrowser } from '@/lib/resume/client-pdf-extractor'
import { validateResumeInput } from '@/lib/skill-gap/analyzer-engine'
import {
  Briefcase,
  Building2,
  Globe2,
  MapPin,
  Sparkles,
  Upload,
  UserCheck,
  GraduationCap,
  Sliders,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  FileText,
  Plus,
  X,
  RefreshCw,
  Search
} from 'lucide-react'

const POPULAR_TECH_ROLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'AI Engineer',
  'Machine Learning Engineer',
  'Generative AI Engineer',
  'Data Scientist',
  'Data Engineer',
  'DevOps Engineer',
  'Cloud Architect',
  'Site Reliability Engineer',
  'Cyber Security Engineer',
  'Product Manager',
  'Solutions Architect',
  'Mobile Developer',
  'Engineering Manager'
]

const SUGGESTED_SKILLS = [
  'Generative AI',
  'Python',
  'TypeScript',
  'React',
  'Next.js',
  'AWS',
  'Kubernetes',
  'Docker',
  'System Design',
  'PostgreSQL',
  'Go (Golang)',
  'Microservices',
  'GraphQL',
  'Distributed Systems'
]

interface SalaryInputFormProps {
  input: SalaryPredictionInput
  onChange: (updated: SalaryPredictionInput) => void
  onPredict: () => void
  isLoading: boolean
  onLoadSample: () => void
  onReset: () => void
}

export function SalaryInputForm({
  input,
  onChange,
  onPredict,
  isLoading,
  onLoadSample,
  onReset
}: SalaryInputFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [skillInput, setSkillInput] = useState('')
  const [extractError, setExtractError] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [roleSearchOpen, setRoleSearchOpen] = useState(false)
  const [companySearchOpen, setCompanySearchOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)

  const roleDropdownRef = useRef<HTMLDivElement>(null)
  const companyDropdownRef = useRef<HTMLDivElement>(null)

  // Close search dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleSearchOpen(false)
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setCompanySearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Top 200 Roles filtered for dropdown autocomplete
  const filteredRoleSuggestions = useMemo(() => {
    const q = input.jobTitle.trim().toLowerCase()
    if (!q) return MASTER_JOB_ROLES.slice(0, 30)
    return MASTER_JOB_ROLES.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.aliases.some(a => a.toLowerCase().includes(q))
    ).slice(0, 40)
  }, [input.jobTitle])

  // Top 200 Companies filtered for dropdown autocomplete
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

  // Current Country & State objects
  const selectedCountry =
    COUNTRIES_DATABASE.find(c => c.name.toLowerCase() === input.country.toLowerCase()) ||
    COUNTRIES_DATABASE[0]
  const availableStates = selectedCountry.states
  const selectedState =
    availableStates.find(s => s.name.toLowerCase() === input.stateProvince.toLowerCase()) ||
    availableStates[0]
  const availableCities = selectedState?.cities || []

  // Switch country -> updates state & city and default currency
  const handleCountryChange = (countryName: string) => {
    const newCountry =
      COUNTRIES_DATABASE.find(c => c.name.toLowerCase() === countryName.toLowerCase()) ||
      COUNTRIES_DATABASE[0]
    const defaultState = newCountry.states[0]
    const defaultCity = defaultState?.cities[0]

    onChange({
      ...input,
      country: newCountry.name,
      stateProvince: defaultState?.name || '',
      city: defaultCity?.name || '',
      targetCurrency: newCountry.currency
    })
  }

  // Switch state -> updates city
  const handleStateChange = (stateName: string) => {
    const newState =
      availableStates.find(s => s.name.toLowerCase() === stateName.toLowerCase()) ||
      availableStates[0]
    const defaultCity = newState?.cities[0]

    onChange({
      ...input,
      stateProvince: newState?.name || stateName,
      city: defaultCity?.name || ''
    })
  }

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
        throw new Error('Unable to extract text from file. Please enter details manually.')
      }

      // Pre-flight check
      const valCheck = validateResumeInput(extracted, file.name)
      if (!valCheck.isValid) {
        throw new Error(valCheck.errorMessage || 'Uploaded document does not appear to be a resume.')
      }

      // Extract skills heuristics from text
      const extractedSkills: string[] = []
      SUGGESTED_SKILLS.forEach(s => {
        if (new RegExp(`\\b${s.replace(/[-\\/\\^$*+?.()|[\\]{}]/g, '\\$&')}\\b`, 'i').test(extracted)) {
          extractedSkills.push(s)
        }
      })

      onChange({
        ...input,
        inputSource: 'resume',
        resumeText: extracted,
        fileName: file.name,
        skills: Array.from(new Set([...input.skills, ...extractedSkills]))
      })
    } catch (err: any) {
      setExtractError(err.message || 'Failed to parse resume.')
    } finally {
      setIsExtracting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Sync from Resume Builder
  const handleSyncResumeBuilder = () => {
    try {
      let resumeObj = defaultResumeData
      const saved = localStorage.getItem('aethercv_ats_manual_saved_resume_v1')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed && (parsed.personalInfo || parsed.data)) {
            resumeObj = parsed.data || parsed
          }
        } catch {}
      }

      // Extract builder skills
      const bSkills: string[] = []
      if (Array.isArray(resumeObj.skills)) {
        resumeObj.skills.forEach((s: any) => {
          if (typeof s === 'string') bSkills.push(s)
          else if (s.items && Array.isArray(s.items)) bSkills.push(...s.items)
        })
      }

      const role = resumeObj.experience?.[0]?.role || input.jobTitle || 'Software Engineer'
      const company = resumeObj.experience?.[0]?.company || input.company || 'Google'

      onChange({
        ...input,
        inputSource: 'builder',
        jobTitle: role,
        company,
        skills: Array.from(new Set([...input.skills, ...bSkills]))
      })
      setExtractError(null)
    } catch (err: any) {
      setExtractError('Could not sync with Resume Builder: ' + err.message)
    }
  }

  const handleAddSkill = (skill: string) => {
    if (!skill || !skill.trim()) return
    const trimmed = skill.trim()
    if (!input.skills.includes(trimmed)) {
      onChange({
        ...input,
        skills: [...input.skills, trimmed]
      })
    }
    setSkillInput('')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange({
      ...input,
      skills: input.skills.filter(s => s !== skillToRemove)
    })
  }

  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Header & Source Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            Market Compensation Parameters
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your profile input source to generate verified market estimates.
          </p>
        </div>

        {/* Input source buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onChange({ ...input, inputSource: 'manual' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              input.inputSource === 'resume'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Resume Upload</span>
          </button>

          <button
            type="button"
            onClick={handleSyncResumeBuilder}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
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

      {/* Uploaded File Status or Sync Feedback */}
      {input.inputSource === 'resume' && input.fileName && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs">
          <div className="flex items-center gap-2.5 text-blue-300">
            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="font-semibold">{input.fileName}</span>
            <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Loaded
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

      {/* Row 1: Job Title & Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Title / Role */}
        <div className="relative" ref={roleDropdownRef}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              <span>Job Title / Role</span>
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
              value={input.jobTitle}
              onChange={e => {
                onChange({ ...input, jobTitle: e.target.value })
                setRoleSearchOpen(true)
              }}
              onFocus={() => setRoleSearchOpen(true)}
              placeholder="e.g. Software Engineer, AI Engineer, Full Stack..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
            />
            {input.jobTitle && (
              <button
                type="button"
                onClick={() => {
                  onChange({ ...input, jobTitle: '' })
                  setRoleSearchOpen(true)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                title="Clear job title"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Autocomplete Dropdown */}
            {roleSearchOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-[#0C162B] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-72 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-2 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400 px-3">
                  <span>Top Standardized Roles ({filteredRoleSuggestions.length} shown)</span>
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
                  {filteredRoleSuggestions.map(role => {
                    const isSelected = input.jobTitle.toLowerCase() === role.title.toLowerCase()
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          onChange({ ...input, jobTitle: role.title })
                          setRoleSearchOpen(false)
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs transition flex items-center justify-between group ${
                          isSelected
                            ? 'bg-blue-600/25 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="truncate">{role.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                            {role.category}
                          </span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                      </button>
                    )
                  })}
                  {filteredRoleSuggestions.length === 0 && (
                    <div className="p-3 text-center text-xs text-slate-400">
                      No predefined role matched. You can still use &quot;{input.jobTitle}&quot; as custom title.
                    </div>
                  )}
                </div>

                <div className="p-2 border-t border-slate-800 bg-slate-950/80 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setRoleSearchOpen(false)
                      setIsRoleModalOpen(true)
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center justify-center gap-1.5 w-full"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Categorized Gallery of All {MASTER_JOB_ROLES.length} Roles</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Popular Roles Suggestions */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[
              'Software Engineer',
              'Senior Software Engineer',
              'Frontend Developer',
              'Backend Developer',
              'Full Stack Developer',
              'AI Engineer',
              'Data Scientist',
              'DevOps Engineer'
            ].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  onChange({ ...input, jobTitle: role })
                  setRoleSearchOpen(false)
                }}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                  input.jobTitle.toLowerCase() === role.toLowerCase()
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300 font-semibold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(true)}
              className="text-[11px] px-2 py-0.5 rounded-md border border-blue-500/40 bg-blue-950/40 text-blue-300 hover:bg-blue-900/60 hover:text-white transition flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-2.5 h-2.5 text-blue-400" />
              <span>+ Top 200 ({MASTER_JOB_ROLES.length})</span>
            </button>
          </div>
        </div>

        {/* Target Employer / Company */}
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
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
            />
            {input.company && (
              <button
                type="button"
                onClick={() => {
                  onChange({ ...input, company: '' })
                  setCompanySearchOpen(true)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                title="Clear company"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Autocomplete Dropdown */}
            {companySearchOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-[#0C162B] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-72 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
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
                  {filteredCompanySuggestions.map(comp => {
                    const isSelected = input.company.toLowerCase() === comp.name.toLowerCase()
                    return (
                      <button
                        key={comp.name}
                        type="button"
                        onClick={() => {
                          onChange({ ...input, company: comp.name })
                          setCompanySearchOpen(false)
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs transition flex items-center justify-between group ${
                          isSelected
                            ? 'bg-cyan-600/25 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="truncate">{comp.name}</span>
                          {comp.ticker && (
                            <span className="text-[10px] px-1 py-0.2 rounded bg-slate-950 font-mono text-cyan-300 border border-slate-800 shrink-0">
                              {comp.ticker}
                            </span>
                          )}
                          <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                            {comp.tier}
                          </span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    )
                  })}
                  {filteredCompanySuggestions.length === 0 && (
                    <div className="p-3 text-center text-xs text-slate-400">
                      No predefined company matched. You can still predict for &quot;{input.company}&quot;.
                    </div>
                  )}
                </div>

                <div className="p-2 border-t border-slate-800 bg-slate-950/80 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setCompanySearchOpen(false)
                      setIsCompanyModalOpen(true)
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center justify-center gap-1.5 w-full"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Sector Gallery of All {COMPANIES_DATABASE.length} Employers</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Companies Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[
              'Google',
              'Microsoft',
              'Amazon',
              'Meta',
              'Apple',
              'NVIDIA',
              'OpenAI',
              'Oracle',
              'TCS',
              'Infosys',
              'Stripe'
            ].map(comp => (
              <button
                key={comp}
                type="button"
                onClick={() => {
                  onChange({ ...input, company: comp })
                  setCompanySearchOpen(false)
                }}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                  input.company.toLowerCase() === comp.toLowerCase()
                    ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {comp}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCompanyModalOpen(true)}
              className="text-[11px] px-2 py-0.5 rounded-md border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 hover:text-white transition flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
              <span>+ Top 200 ({COMPANIES_DATABASE.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Location Hierarchy (Country -> State -> City) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80">
        {/* Country */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            Country
          </label>
          <select
            value={input.country}
            onChange={e => handleCountryChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
          >
            {COUNTRIES_DATABASE.map(c => (
              <option key={c.code} value={c.name}>
                {c.flag} {c.name} ({c.currency})
              </option>
            ))}
          </select>
        </div>

        {/* State / Province */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            State / Province
          </label>
          <select
            value={input.stateProvince}
            onChange={e => handleStateChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
          >
            {availableStates.map(s => (
              <option key={s.code} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            City / Metro Area
          </label>
          <select
            value={input.city}
            onChange={e => onChange({ ...input, city: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
          >
            {availableCities.map(ci => (
              <option key={ci.name} value={ci.name}>
                {ci.name} ({ci.tier})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Experience Bracket & Years */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            Experience Level
          </label>
          <span className="text-xs text-blue-400 font-semibold font-mono">
            {input.yearsOfExperience} Years of Industry Experience
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { id: 'intern' as ExperienceBracket, label: 'Intern', years: 0 },
            { id: 'fresher' as ExperienceBracket, label: 'Fresher (0–1y)', years: 0.5 },
            { id: '1-3' as ExperienceBracket, label: '1–3 Years', years: 2 },
            { id: '3-5' as ExperienceBracket, label: '3–5 Years', years: 4 },
            { id: '5-8' as ExperienceBracket, label: '5–8 Years', years: 6 },
            { id: '8-12' as ExperienceBracket, label: '8–12 Years', years: 10 },
            { id: '12+' as ExperienceBracket, label: '12+ Years', years: 14 }
          ].map(bracket => (
            <button
              key={bracket.id}
              type="button"
              onClick={() =>
                onChange({
                  ...input,
                  experienceBracket: bracket.id,
                  yearsOfExperience: bracket.years
                })
              }
              className={`p-2.5 rounded-xl border text-center transition-all ${
                input.experienceBracket === bracket.id
                  ? 'bg-blue-600/25 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/10 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="text-xs">{bracket.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Row 4: Education, Employment Type, Workplace Model & Target Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Education */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            Education
          </label>
          <select
            value={input.education}
            onChange={e => onChange({ ...input, education: e.target.value as EducationLevel })}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree (+7% Boost)</option>
            <option value="Ph.D. / Doctorate">Ph.D. / Doctorate (+15% Boost)</option>
            <option value="Bootcamp Graduate">Bootcamp Graduate</option>
            <option value="Self-Taught / Associate">Self-Taught / Associate</option>
            <option value="High School">High School</option>
          </select>
        </div>

        {/* Workplace Model */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-sky-400" />
            Workplace Model
          </label>
          <select
            value={input.workModel}
            onChange={e => onChange({ ...input, workModel: e.target.value as WorkplaceModel })}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            Employment Type
          </label>
          <select
            value={input.employmentType}
            onChange={e => onChange({ ...input, employmentType: e.target.value as EmploymentType })}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract (C2C / 1099)</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Target Currency */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Display Currency
          </label>
          <select
            value={input.targetCurrency}
            onChange={e => onChange({ ...input, targetCurrency: e.target.value })}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium font-mono"
          >
            {Object.values(CURRENCY_RATES).map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.code} ({curr.symbol}) — {curr.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 5: Skills Tagging */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Key Technical & Domain Skills (Impacts Compensation Bracket)
        </label>

        {/* Skills Tag Cloud */}
        <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 min-h-[48px]">
          {input.skills.map(s => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-medium"
            >
              {s}
              <button
                type="button"
                onClick={() => handleRemoveSkill(s)}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Inline Skill Input */}
          <div className="inline-flex items-center gap-1 flex-1 min-w-[130px]">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSkill(skillInput)
                }
              }}
              placeholder="Type skill & press Enter..."
              className="w-full bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Suggested Skills to Add */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-500">Popular High-Value Skills:</span>
          {SUGGESTED_SKILLS.map(sk => {
            const hasSkill = input.skills.includes(sk)
            return (
              <button
                key={sk}
                type="button"
                onClick={() => (hasSkill ? handleRemoveSkill(sk) : handleAddSkill(sk))}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                  hasSkill
                    ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {hasSkill ? '✓ ' : '+ '}
                {sk}
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onLoadSample}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Demo Profile</span>
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
          onClick={onPredict}
          disabled={isLoading || !input.jobTitle}
          className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Global Market Datasets...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>Predict Live Market Salary</span>
            </>
          )}
        </button>
      </div>

      {/* Top 200 Roles Directory Modal */}
      <RoleBrowserModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        selectedRole={input.jobTitle}
        onSelectRole={role => onChange({ ...input, jobTitle: role })}
      />

      {/* Top 200 Companies Directory Modal */}
      <CompanyBrowserModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        selectedCompany={input.company}
        onSelectCompany={company => onChange({ ...input, company })}
      />
    </div>
  )
}
