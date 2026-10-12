'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  Search,
  ChevronDown,
  Check,
  Edit3,
  Sparkles,
  X,
  Briefcase
} from 'lucide-react'

export const STANDARD_PROFESSIONAL_TITLES: string[] = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'AI / Machine Learning Engineer',
  'Data Scientist',
  'Data Analyst',
  'Cloud / DevOps Engineer',
  'Cyber Security Engineer',
  'Mobile App Developer (iOS / Android)',
  'UI/UX Designer',
  'Product Manager',
  'Project Manager / Scrum Master',
  'Systems Architect',
  'QA / Test Automation Engineer',
  'Database Administrator / Data Engineer',
  'Embedded Systems / IoT Engineer',
  'Blockchain / Web3 Developer',
  'Business Analyst',
  'Solutions Architect',
  'Site Reliability Engineer (SRE)',
  'Network / Infrastructure Engineer',
  'Hardware / VLSI Engineer',
  'Technical Lead / Engineering Manager',
  'Student / Graduate Trainee'
]

interface ProfessionalTitleSelectorProps {
  value: string
  onChange: (title: string) => void
  placeholder?: string
}

export function ProfessionalTitleSelector({
  value,
  onChange,
  placeholder = 'e.g. Software Engineer'
}: ProfessionalTitleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(() => {
    return Boolean(value && !STANDARD_PROFESSIONAL_TITLES.includes(value))
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const customInputRef = useRef<HTMLInputElement>(null)

  // Keep custom mode synced if value changes externally
  useEffect(() => {
    if (value && !STANDARD_PROFESSIONAL_TITLES.includes(value)) {
      setIsCustomMode(true)
    }
  }, [value])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    } else {
      setSearchQuery('')
    }
  }, [isOpen])

  // Focus custom input when custom mode is activated
  useEffect(() => {
    if (isCustomMode && !isOpen) {
      setTimeout(() => {
        customInputRef.current?.focus()
      }, 50)
    }
  }, [isCustomMode, isOpen])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Filtered titles based on search query
  const filteredTitles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return STANDARD_PROFESSIONAL_TITLES
    return STANDARD_PROFESSIONAL_TITLES.filter((title) =>
      title.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const handleSelectTitle = (title: string) => {
    setIsCustomMode(false)
    onChange(title)
    setIsOpen(false)
  }

  const handleSelectOthers = () => {
    setIsCustomMode(true)
    setIsOpen(false)
    // If current value is one of standard, clear it so user can type freshly
    if (STANDARD_PROFESSIONAL_TITLES.includes(value)) {
      onChange('')
    }
  }

  const handleApplyCustomSearch = () => {
    if (searchQuery.trim()) {
      setIsCustomMode(true)
      onChange(searchQuery.trim())
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* ── MAIN INPUT OR TRIGGER ── */}
      {isCustomMode ? (
        <div className="relative flex items-center">
          <input
            ref={customInputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your custom professional title..."
            className="w-full bg-[#07101F] border border-blue-500/40 focus:border-blue-500 rounded-xl pl-3 pr-24 py-2 text-white text-xs focus:outline-none transition shadow-inner shadow-black/40"
          />
          <div className="absolute right-1.5 flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Custom
            </span>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="Browse 25 standard titles"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full bg-[#07101F] hover:bg-[#09152B] border border-blue-500/20 hover:border-blue-500/40 rounded-xl px-3 py-2 text-white text-xs flex items-center justify-between transition text-left group focus:outline-none focus:border-blue-500"
        >
          <div className="flex items-center gap-2 truncate pr-2">
            <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className={value ? 'text-white font-medium truncate' : 'text-slate-400 truncate'}>
              {value || placeholder}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">25 Titles</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-blue-400' : ''
              }`}
            />
          </div>
        </button>
      )}

      {/* ── DROPDOWN WITH SEARCH BAR & 25 TITLES + OTHERS ── */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#0C162B] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-80">
          {/* Search Header */}
          <div className="p-2.5 border-b border-white/10 bg-[#07101F] sticky top-0 z-10 space-y-2">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-blue-400 absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (filteredTitles.length > 0) {
                      handleSelectTitle(filteredTitles[0])
                    } else if (searchQuery.trim()) {
                      handleApplyCustomSearch()
                    }
                  }
                }}
                placeholder="Search professional titles (25 presets)..."
                className="w-full bg-[#0C162B] border border-blue-500/25 focus:border-blue-500 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-0.5 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>
                  {searchQuery ? `${filteredTitles.length} matching` : '25 Curated Titles'}
                </span>
              </span>
              <span className="text-[10px] text-slate-500">Pick below or choose Others</span>
            </div>
          </div>

          {/* Titles List */}
          <div className="overflow-y-auto p-1.5 space-y-0.5 flex-1 divide-y divide-white/5">
            {/* Custom search quick-apply option if user typed something not matching exactly */}
            {searchQuery.trim() &&
              !STANDARD_PROFESSIONAL_TITLES.some(
                (t) => t.toLowerCase() === searchQuery.trim().toLowerCase()
              ) && (
                <button
                  type="button"
                  onClick={handleApplyCustomSearch}
                  className="w-full px-3 py-2 text-left rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Edit3 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">
                      Use custom: <span className="text-white">"{searchQuery.trim()}"</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-300 font-bold px-1.5 py-0.5 rounded bg-purple-500/20">
                    Apply
                  </span>
                </button>
              )}

            {filteredTitles.map((title, index) => {
              const isSelected = value === title && !isCustomMode
              return (
                <button
                  key={title}
                  type="button"
                  onClick={() => handleSelectTitle(title)}
                  className={`w-full px-3 py-2 text-left rounded-xl text-xs font-medium flex items-center justify-between transition group ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                      : 'text-slate-200 hover:bg-blue-600/15 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`text-[10px] font-mono w-4 text-right shrink-0 ${
                      isSelected ? 'text-blue-200' : 'text-slate-500 group-hover:text-blue-300'
                    }`}>
                      {index + 1}.
                    </span>
                    <span className="truncate">{title}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
                </button>
              )
            })}

            {filteredTitles.length === 0 && !searchQuery.trim() && (
              <div className="p-4 text-center text-xs text-slate-400">No titles available</div>
            )}

            {/* ── 26TH OPTION: OTHERS (CUSTOM) ── */}
            <div className="pt-1 mt-1 border-t border-white/10">
              <button
                type="button"
                onClick={handleSelectOthers}
                className={`w-full px-3 py-2.5 text-left rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                  isCustomMode
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/40 text-purple-200'
                    : 'bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/30 text-purple-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
                    <Edit3 className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Others (Type Custom Title)</div>
                    <div className="text-[10px] text-slate-400">
                      Type any custom title not listed in the 25 presets
                    </div>
                  </div>
                </div>
                {isCustomMode && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/30 text-purple-200">
                    Active
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
