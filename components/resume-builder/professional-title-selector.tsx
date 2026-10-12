'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Search, ChevronDown, Check, Edit3, X, Sparkles, Plus } from 'lucide-react'

export const POPULAR_PROFESSIONAL_TITLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'AI Engineer',
  'Machine Learning Engineer',
  'Data Scientist',
  'Data Engineer',
  'Data Analyst',
  'Cloud Engineer',
  'DevOps Engineer',
  'Site Reliability Engineer (SRE)',
  'Cyber Security Engineer',
  'Information Security Analyst',
  'Systems Architect',
  'Solutions Architect',
  'Mobile App Developer (iOS / Android)',
  'React Native Developer',
  'Flutter Developer',
  'Embedded Systems Engineer',
  'Firmware Engineer',
  'QA Automation Engineer',
  'Software Development Engineer in Test (SDET)',
  'Product Manager',
  'Technical Product Manager',
  'Project Manager',
  'Scrum Master',
  'UI/UX Designer',
  'Product Designer',
  'UX Researcher',
  'Blockchain Developer',
  'Web3 Engineer',
  'NLP Engineer (Natural Language Processing)',
  'Computer Vision Engineer',
  'MLOps Engineer',
  'Big Data Engineer',
  'Database Administrator (DBA)',
  'Network Engineer',
  'IT Support Specialist',
  'Cloud Security Specialist',
  'Penetration Tester / Ethical Hacker',
  'Business Analyst',
  'BI Developer (Business Intelligence)',
  'Technical Lead (Tech Lead)',
  'Engineering Manager',
  'Solutions Consultant',
  'Growth Hacker / Digital Marketer',
  'Technical Writer',
  'Research Scientist',
  'Graduate Engineer Trainee (GET) / Student Fresher'
] as const

interface ProfessionalTitleSelectorProps {
  value: string
  onChange: (title: string) => void
  placeholder?: string
}

export function ProfessionalTitleSelector({
  value,
  onChange,
  placeholder = 'e.g. AI & Full Stack Software Engineer'
}: ProfessionalTitleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(() => {
    return Boolean(value && !POPULAR_PROFESSIONAL_TITLES.includes(value as any))
  })
  const [customInputValue, setCustomInputValue] = useState(() => {
    return Boolean(value && !POPULAR_PROFESSIONAL_TITLES.includes(value as any)) ? value : ''
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const customInputRef = useRef<HTMLInputElement>(null)

  // Sync external changes
  useEffect(() => {
    const isCustom = Boolean(value && !POPULAR_PROFESSIONAL_TITLES.includes(value as any))
    setIsCustomMode(isCustom)
    if (isCustom) {
      setCustomInputValue(value)
    }
  }, [value])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto focus search when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    } else {
      setSearchQuery('')
    }
  }, [isOpen])

  // Filtered titles
  const filteredTitles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return POPULAR_PROFESSIONAL_TITLES
    return POPULAR_PROFESSIONAL_TITLES.filter((title) =>
      title.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const exactMatchExists = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return POPULAR_PROFESSIONAL_TITLES.some((t) => t.toLowerCase() === q)
  }, [searchQuery])

  const handleSelectTitle = (title: string) => {
    setIsCustomMode(false)
    onChange(title)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleSelectOthers = () => {
    setIsCustomMode(true)
    setIsOpen(false)
    setTimeout(() => {
      customInputRef.current?.focus()
    }, 100)
  }

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCustomInputValue(val)
    onChange(val)
  }

  const handleApplyCustomSearch = () => {
    if (searchQuery.trim()) {
      setIsCustomMode(true)
      setCustomInputValue(searchQuery.trim())
      onChange(searchQuery.trim())
      setIsOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Primary Display & Trigger */}
      <div className="flex items-center gap-2">
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex-1 flex items-center justify-between bg-[#07101F] border rounded-xl px-3 py-2 text-xs transition cursor-pointer select-none ${
            isOpen
              ? 'border-blue-500 shadow-md shadow-blue-500/20 ring-1 ring-blue-500/30'
              : 'border-blue-500/20 hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {value ? (
              <span className="text-white font-medium truncate">
                {value}
                {isCustomMode && (
                  <span className="ml-2 text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                    Custom
                  </span>
                )}
              </span>
            ) : (
              <span className="text-slate-500 truncate">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 ml-2 shrink-0">
            {value && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange('')
                  setCustomInputValue('')
                  setIsCustomMode(false)
                }}
                className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition"
                title="Clear title"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-blue-400' : ''
              }`}
            />
          </div>
        </div>

        {/* Quick button to switch to custom "Others" typing mode */}
        <button
          type="button"
          onClick={() => {
            setIsCustomMode(true)
            setTimeout(() => customInputRef.current?.focus(), 50)
          }}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition shrink-0 ${
            isCustomMode
              ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
              : 'bg-[#07101F] text-slate-400 hover:text-slate-200 border-blue-500/20 hover:border-blue-500/40'
          }`}
          title="Type custom professional title"
        >
          <Edit3 className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Type Custom</span>
        </button>
      </div>

      {/* Custom Title Input (Displayed when "Others" is activated) */}
      {isCustomMode && (
        <div className="mt-2 p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-sky-300 flex items-center gap-1">
              <Edit3 className="w-3 h-3" /> Custom Professional Title:
            </span>
            <button
              type="button"
              onClick={() => {
                setIsCustomMode(false)
                if (!POPULAR_PROFESSIONAL_TITLES.includes(value as any)) {
                  onChange('Software Engineer')
                }
              }}
              className="text-slate-400 hover:text-white transition text-[10px]"
            >
              Back to Preset Titles
            </button>
          </div>
          <input
            ref={customInputRef}
            type="text"
            value={customInputValue}
            onChange={handleCustomInputChange}
            placeholder="Type your custom professional title (e.g. Quantum Computing Researcher)"
            className="w-full bg-[#07101F] border border-blue-500/30 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>
      )}

      {/* Searchable Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#0B1528] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[380px]">
          {/* Search Header */}
          <div className="p-3 border-b border-white/10 bg-[#07101F]/90 sticky top-0 z-10 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 50+ professional titles..."
                className="w-full bg-[#0B1528] border border-blue-500/25 rounded-xl pl-9 pr-8 py-2 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
              <span>
                {searchQuery ? `Matching: ${filteredTitles.length} of 50 titles` : '50 Top Industry Titles'}
              </span>
              <span className="text-[10px] text-blue-400 font-medium">Scroll to explore</span>
            </div>
          </div>

          {/* Titles List */}
          <div className="overflow-y-auto p-1.5 space-y-0.5 flex-1 divide-y divide-white/5">
            {/* If user typed a search query that isn't an exact match, give 1-click option to use as custom title */}
            {searchQuery.trim() && !exactMatchExists && (
              <button
                type="button"
                onClick={handleApplyCustomSearch}
                className="w-full text-left p-2.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-xs text-sky-300 flex items-center justify-between group transition"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-sky-400" />
                  <span>
                    Use <strong className="text-white">&quot;{searchQuery.trim()}&quot;</strong> as custom title
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Custom
                </span>
              </button>
            )}

            {/* Render matching 50 titles */}
            {filteredTitles.map((title, index) => {
              const isSelected = value === title
              return (
                <button
                  key={title}
                  type="button"
                  onClick={() => handleSelectTitle(title)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] text-slate-500 font-mono w-5">
                      {index + 1}.
                    </span>
                    <span>{title}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              )
            })}

            {filteredTitles.length === 0 && !searchQuery.trim() && (
              <div className="p-4 text-center text-xs text-slate-500">
                No titles available
              </div>
            )}
          </div>

          {/* Last Option: "Others" (Always fixed / visible at bottom) */}
          <div className="p-2 border-t border-white/10 bg-[#07101F]">
            <button
              type="button"
              onClick={handleSelectOthers}
              className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition border ${
                isCustomMode
                  ? 'bg-blue-600/20 border-blue-500/40 text-sky-300'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
                  <Edit3 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block font-bold">Others (Type Custom Title)</span>
                  <span className="block text-[10px] text-slate-400 font-normal">
                    Enter any specialized or unique job title
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Custom Option
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
