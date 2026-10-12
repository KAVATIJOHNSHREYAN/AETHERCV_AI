'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import {
  Search, ChevronDown, Check, Edit3, X, Sparkles, Plus,
  Star, Clock, Flame, Layers, Code, Database, Cloud,
  Shield, CheckCircle2, Briefcase, Palette, Server, Boxes,
  Cpu, Crown, LineChart, TrendingUp, Headphones, Microscope,
  Zap, GraduationCap, ArrowRight
} from 'lucide-react'
import {
  JobRoleCategory,
  JobRoleItem,
  CATEGORY_DEFINITIONS,
  MASTER_JOB_ROLES,
  searchMasterRoles,
  getStoredRecentRoles,
  saveRecentRole,
  getStoredFavoriteRoles,
  toggleFavoriteRole,
  getStoredCustomRoles,
  saveCustomRole,
  getStoredFrequentRoles
} from '@/lib/job-roles/master-library'

// Dynamic category icon map
const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  Layers,
  Code,
  Sparkles,
  Database,
  Cloud,
  Shield,
  CheckCircle2,
  Briefcase,
  Palette,
  Server,
  Boxes,
  Cpu,
  Crown,
  LineChart,
  TrendingUp,
  Headphones,
  Microscope,
  Zap,
  GraduationCap
}

export function getCategoryIcon(category: JobRoleCategory): React.ElementType {
  const meta = CATEGORY_DEFINITIONS.find((c) => c.id === category)
  if (meta && CATEGORY_ICON_MAP[meta.iconName]) {
    return CATEGORY_ICON_MAP[meta.iconName]
  }
  return Briefcase
}

export interface UniversalJobRoleSelectorProps {
  value: string
  onChange: (role: string) => void
  placeholder?: string
  label?: string
  showLabel?: boolean
  required?: boolean
  className?: string
  id?: string
}

export function UniversalJobRoleSelector({
  value,
  onChange,
  placeholder = 'Select or search job role...',
  label = 'Professional Title',
  showLabel = false,
  required = false,
  className = '',
  id = 'job-role-selector'
}: UniversalJobRoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<JobRoleCategory>('All')
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false)
  const [customRoleInput, setCustomRoleInput] = useState('')
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  // Local storage state
  const [recentRoles, setRecentRoles] = useState<string[]>([])
  const [favoriteRoles, setFavoriteRoles] = useState<string[]>([])
  const [customRoles, setCustomRoles] = useState<string[]>([])
  const [frequentRoles, setFrequentRoles] = useState<{ role: string; count: number }[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const customInputRef = useRef<HTMLInputElement>(null)
  const listContainerRef = useRef<HTMLDivElement>(null)

  // Refresh saved roles on open or mount
  const refreshStorage = useCallback(() => {
    setRecentRoles(getStoredRecentRoles())
    setFavoriteRoles(getStoredFavoriteRoles())
    setCustomRoles(getStoredCustomRoles())
    setFrequentRoles(getStoredFrequentRoles())
  }, [])

  useEffect(() => {
    refreshStorage()
  }, [refreshStorage])

  useEffect(() => {
    if (isOpen) {
      refreshStorage()
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    } else {
      setSearchQuery('')
      setIsCustomInputOpen(false)
      setActiveIndex(-1)
    }
  }, [isOpen, refreshStorage])

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtered roles based on query & category
  const searchResults = useMemo(() => {
    return searchMasterRoles(searchQuery, selectedCategory, customRoles)
  }, [searchQuery, selectedCategory, customRoles])

  // Determine if typed query matches existing title exactly
  const exactMatch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return null
    return searchResults.find((r) => r.item.title.toLowerCase() === q)
  }, [searchQuery, searchResults])

  // Selection handler
  const handleSelect = (roleTitle: string) => {
    const clean = roleTitle.trim()
    if (!clean) return
    onChange(clean)
    saveRecentRole(clean)
    setIsOpen(false)
    setIsCustomInputOpen(false)
    setSearchQuery('')
  }

  // Favorite toggle handler
  const handleToggleFav = (e: React.MouseEvent, roleTitle: string) => {
    e.stopPropagation()
    toggleFavoriteRole(roleTitle)
    setFavoriteRoles(getStoredFavoriteRoles())
  }

  // Submit custom role
  const handleSubmitCustomRole = () => {
    const clean = customRoleInput.trim() || searchQuery.trim()
    if (!clean) return
    saveCustomRole(clean)
    onChange(clean)
    setCustomRoles(getStoredCustomRoles())
    setCustomRoleInput('')
    setIsCustomInputOpen(false)
    setIsOpen(false)
  }

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      return
    }

    const totalItems = searchResults.length
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && searchResults[activeIndex]) {
        handleSelect(searchResults[activeIndex].item.title)
      } else if (searchQuery.trim() && !exactMatch) {
        handleSubmitCustomRole()
      }
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listContainerRef.current) {
      const activeEl = listContainerRef.current.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeIndex])

  // Highlight matched substring
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark
              key={i}
              className="bg-blue-500/30 text-sky-200 px-0.5 rounded font-semibold underline decoration-sky-400"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    )
  }

  // Identify whether value is a custom role
  const isSelectedCustom = useMemo(() => {
    if (!value) return false
    return !MASTER_JOB_ROLES.some((r) => r.title.toLowerCase() === value.toLowerCase())
  }, [value])

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {showLabel && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
          <span>{label} {required && <span className="text-blue-400">*</span>}</span>
          {value && (
            <span className="text-[10px] text-slate-400 font-normal">
              Active: <strong className="text-white">{value}</strong>
            </span>
          )}
        </label>
      )}

      {/* Main Trigger Input Field */}
      <div className="flex items-center gap-2">
        <div
          id={id}
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onKeyDown={handleKeyDown}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex-1 flex items-center justify-between bg-[#07101F] border rounded-xl px-3.5 py-2.5 text-xs transition cursor-pointer select-none group focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            isOpen
              ? 'border-blue-500 shadow-[0_0_20px_rgba(38,98,235,0.25)] ring-1 ring-blue-500/40'
              : 'border-blue-500/25 hover:border-blue-500/50 hover:bg-[#09152B]'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-5 h-5 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Sparkles className="w-3 h-3" />
            </div>

            {value ? (
              <div className="flex items-center gap-2 truncate">
                <span className="text-white font-semibold truncate">{value}</span>
                {isSelectedCustom && (
                  <span className="text-[9.5px] font-bold text-sky-300 bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.5 rounded">
                    Custom
                  </span>
                )}
              </div>
            ) : (
              <span className="text-slate-400 font-medium truncate">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 ml-2 shrink-0">
            {value && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange('')
                }}
                className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition"
                title="Clear selected role"
                aria-label="Clear selected role"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 group-hover:text-blue-400 ${
                isOpen ? 'rotate-180 text-blue-400' : ''
              }`}
            />
          </div>
        </div>

        {/* Quick Type Custom Role Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(true)
            setIsCustomInputOpen(true)
            setTimeout(() => customInputRef.current?.focus(), 60)
          }}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition shrink-0 ${
            isCustomInputOpen
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
              : 'bg-[#07101F] text-slate-300 hover:text-white border-blue-500/25 hover:border-blue-500/50 hover:bg-[#09152B]'
          }`}
          title="Type custom specialized job role"
        >
          <Edit3 className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Custom Role</span>
        </button>
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0A1426]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[460px]"
        >
          {/* ── TOP SECTION: SEARCH BAR ── */}
          <div className="p-3 border-b border-white/10 bg-[#07101F]/90 sticky top-0 z-20 space-y-2.5">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-sky-400 absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setActiveIndex(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search job roles... (e.g. SRE, AI, Frontend, Data, PM)"
                className="w-full bg-[#0E1A33] border border-blue-500/30 rounded-xl pl-9 pr-9 py-2 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    searchInputRef.current?.focus()
                  }}
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-white rounded"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills (Horizontal Scrollable) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin no-scrollbar">
              {CATEGORY_DEFINITIONS.map((cat) => {
                const Icon = CATEGORY_ICON_MAP[cat.iconName] || Briefcase
                const isCatActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id)
                      setActiveIndex(0)
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition shrink-0 whitespace-nowrap border ${
                      isCatActive
                        ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/5'
                    }`}
                  >
                    <Icon className="w-3 h-3 text-sky-300" />
                    <span>{cat.shortLabel}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between text-[10.5px] text-slate-400 px-0.5">
              <span>
                {searchQuery
                  ? `${searchResults.length} matching roles`
                  : `${searchResults.length} roles available in ${selectedCategory}`}
              </span>
              <span className="text-[10px] text-sky-400 font-mono">Use ↑↓ and Enter</span>
            </div>
          </div>

          {/* ── MIDDLE SECTION: RESULTS & SECTIONS ── */}
          <div
            ref={listContainerRef}
            className="overflow-y-auto p-2 space-y-2 flex-1 divide-y divide-white/5 text-xs select-none"
          >
            {/* If no search query, show Favorites, Recents, and Frequent widgets */}
            {!searchQuery.trim() && (
              <>
                {/* 1. Favorites Section */}
                {favoriteRoles.length > 0 && (
                  <div className="pb-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-300 uppercase tracking-wider px-2 py-0.5">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                      <span>Favorite Roles</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {favoriteRoles.map((fav) => (
                        <button
                          key={fav}
                          type="button"
                          onClick={() => handleSelect(fav)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
                            value.toLowerCase() === fav.toLowerCase()
                              ? 'bg-blue-600 text-white border-blue-400'
                              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border-amber-500/20'
                          }`}
                        >
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span>{fav}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Recently Selected Section */}
                {recentRoles.length > 0 && (
                  <div className="pt-2 pb-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-sky-300 uppercase tracking-wider px-2 py-0.5">
                      <Clock className="w-3 h-3 text-sky-400" />
                      <span>Recently Selected</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {recentRoles.map((rec) => (
                        <button
                          key={rec}
                          type="button"
                          onClick={() => handleSelect(rec)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border ${
                            value.toLowerCase() === rec.toLowerCase()
                              ? 'bg-blue-600 text-white border-blue-400 font-semibold'
                              : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                          }`}
                        >
                          <span>{rec}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Frequent Roles Section */}
                {frequentRoles.length > 0 && (
                  <div className="pt-2 pb-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-purple-300 uppercase tracking-wider px-2 py-0.5">
                      <Flame className="w-3 h-3 text-purple-400" />
                      <span>Frequently Selected</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {frequentRoles.map(({ role }) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleSelect(role)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border ${
                            value.toLowerCase() === role.toLowerCase()
                              ? 'bg-blue-600 text-white border-blue-400'
                              : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border-purple-500/20'
                          }`}
                        >
                          <span>{role}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Quick 1-click option to use typed search query as custom role */}
            {searchQuery.trim() && !exactMatch && (
              <div className="p-1">
                <button
                  type="button"
                  onClick={handleSubmitCustomRole}
                  className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-950/40 hover:from-blue-800/50 hover:to-indigo-800/40 border border-blue-500/40 text-xs text-sky-200 flex items-center justify-between group transition shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-sky-300">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-slate-300">Use </span>
                      <strong className="text-white underline decoration-sky-400 underline-offset-2">
                        &quot;{searchQuery.trim()}&quot;
                      </strong>
                      <span className="text-slate-300"> as custom job role</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                    <span>Add</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              </div>
            )}

            {/* Main Role List */}
            <div className="space-y-0.5 pt-1">
              {searchResults.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Search className="w-5 h-5 opacity-70" />
                  </div>
                  <div className="text-sm font-semibold text-slate-200">No matching preset roles found</div>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    You can type any custom job role below or select &quot;Other (Custom Job Role)&quot;.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomInputOpen(true)
                      setCustomRoleInput(searchQuery)
                      setTimeout(() => customInputRef.current?.focus(), 60)
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition inline-flex items-center gap-1.5 mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Custom Role</span>
                  </button>
                </div>
              ) : (
                searchResults.map(({ item }, index) => {
                  const isSelected = value.toLowerCase() === item.title.toLowerCase()
                  const isFav = favoriteRoles.some((f) => f.toLowerCase() === item.title.toLowerCase())
                  const isFocused = index === activeIndex
                  const Icon = getCategoryIcon(item.category)

                  return (
                    <div
                      key={item.id}
                      data-index={index}
                      onClick={() => handleSelect(item.title)}
                      className={`group w-full px-3 py-2 rounded-xl flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                          : isFocused
                          ? 'bg-blue-500/20 text-white border border-blue-500/30'
                          : 'text-slate-200 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-white/5 text-slate-400 group-hover:text-sky-300'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                        </div>

                        <div className="truncate">
                          {renderHighlightedText(item.title, searchQuery)}
                          {item.isCustom && (
                            <span className="ml-2 text-[9px] font-bold text-sky-300 bg-sky-500/20 border border-sky-500/30 px-1.5 py-0.2 rounded">
                              Custom
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {/* Favorite star */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleFav(e, item.title)}
                          className={`p-1 rounded hover:bg-white/10 transition ${
                            isFav ? 'text-amber-400' : 'text-slate-500 hover:text-amber-300'
                          }`}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                        </button>

                        {/* Selected Checkmark */}
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* ── BOTTOM SECTION: ➕ OTHER (CUSTOM JOB ROLE) ── */}
          <div className="p-2.5 border-t border-white/10 bg-[#07101F] space-y-2">
            {!isCustomInputOpen ? (
              <button
                type="button"
                onClick={() => {
                  setIsCustomInputOpen(true)
                  setTimeout(() => customInputRef.current?.focus(), 50)
                }}
                className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition border ${
                  isSelectedCustom
                    ? 'bg-blue-600/20 border-blue-500/50 text-sky-300'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">➕ Other (Custom Job Role)</span>
                    <span className="block text-[10px] text-slate-400 font-normal">
                      Type any specialized role (AI Ethics, Quantum, Founder, etc.)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Custom
                </span>
              </button>
            ) : (
              <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/40 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-sky-300 flex items-center gap-1.5">
                    <Edit3 className="w-3 h-3 text-sky-400" />
                    <span>Enter your desired job role</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCustomInputOpen(false)}
                    className="text-slate-400 hover:text-white text-[10px] transition"
                  >
                    Cancel
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={customInputRef}
                    type="text"
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSubmitCustomRole()
                      }
                    }}
                    placeholder="e.g. AI Ethics Consultant, Prompt Engineer, XR Developer..."
                    className="flex-1 bg-[#07101F] border border-blue-500/40 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={handleSubmitCustomRole}
                    disabled={!customRoleInput.trim()}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1 shrink-0 shadow-md shadow-blue-600/30"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 leading-tight">
                  The custom role is instantly saved and shared across all AI modules (Resume Builder, ATS, Cover Letter, LinkedIn).
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
