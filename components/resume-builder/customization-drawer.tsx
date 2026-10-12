'use client'

import React, { useState } from 'react'
import {
  CustomizationSettings,
  TemplateId,
  FontFamily,
  FontSize,
  LineHeight,
  Margins,
  SectionKey
} from '@/types/resume-builder'
import {
  ATS_TEMPLATES,
  ATS_SAFE_FONTS,
  ATS_ACCENT_COLORS,
  SECTION_METADATA,
  getTemplateConfig
} from '@/lib/resume-builder/templates'
import {
  Layout, Type, Sliders, ArrowUp, ArrowDown,
  Check, Eye, EyeOff, ShieldCheck, Sparkles,
  CheckCircle2, AlertTriangle, Lock, Palette
} from 'lucide-react'

interface CustomizationDrawerProps {
  customization: CustomizationSettings
  onChange: (updated: Partial<CustomizationSettings>) => void
  onOptimizeToOnePage?: () => void
}

export function CustomizationDrawer({ customization, onChange, onOptimizeToOnePage }: CustomizationDrawerProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'typography' | 'sections' | 'compliance'>('templates')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')

  // Handle template selection with smooth instant update
  const handleSelectTemplate = (templateId: TemplateId) => {
    const config = getTemplateConfig(templateId)
    onChange({
      templateId,
      fontFamily: config.defaultFont,
      accentColor: config.defaultAccent,
      fontSize: config.defaultFontSize,
      lineHeight: config.defaultLineHeight,
      margins: config.defaultMargins,
      headerStyle: config.headerStyle,
      showIcons: false, // Strict ATS: always false
      showPhoto: false, // Strict ATS: always false
      sectionOrder: [...config.sectionOrder]
    })
  }

  // Section reordering
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const order = [...customization.sectionOrder]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= order.length) return
    const temp = order[index]
    order[index] = order[targetIndex]
    order[targetIndex] = temp
    onChange({ sectionOrder: order })
  }

  // Toggle section visibility
  const toggleSectionVisibility = (key: SectionKey) => {
    const currentHidden = customization.hiddenSections || []
    const isHidden = currentHidden.includes(key)
    const newHidden = isHidden
      ? currentHidden.filter((k) => k !== key)
      : [...currentHidden, key]
    onChange({ hiddenSections: newHidden })
  }

  // Filter templates
  const categories = ['All', 'Recommended', 'Tech & Engineering', 'Corporate & Business', 'Academic & Research', 'Specialized']
  const filteredTemplates = ATS_TEMPLATES.filter((t) => {
    if (categoryFilter === 'All') return true
    return t.category === categoryFilter
  })

  const hiddenSections = customization.hiddenSections || []

  return (
    <div className="space-y-5 text-sm font-outfit">
      {/* ── Sub-navigation Tabs ── */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#07101F] border border-blue-500/20 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'templates'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Templates (15)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'typography'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Typography & Layout</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'sections'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Sections & Visibility</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compliance')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'compliance'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>ATS Lock</span>
        </button>
      </div>

      {/* ── TAB 1: 15 ATS TEMPLATES GALLERY ── */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-[#07101F] text-slate-400 hover:text-white border border-blue-500/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredTemplates.map((tmpl) => {
              const isSelected = customization.templateId === tmpl.id
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between group ${
                    isSelected
                      ? 'border-[#2563EB] bg-[#2563EB]/15 text-white ring-1 ring-[#2563EB]/40 shadow-lg'
                      : 'border-blue-500/15 bg-[#07101F]/90 text-slate-400 hover:border-blue-500/40 hover:bg-[#07101F] hover:text-slate-200'
                  }`}
                >
                  <div>
                    {/* Header: Name + Badge */}
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="space-y-0.5">
                        <span className="font-bold font-poppins text-xs text-white block group-hover:text-sky-300 transition-colors">
                          {tmpl.name}
                        </span>
                        <span className="text-[10px] text-sky-400 font-medium">
                          {tmpl.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {tmpl.recommended && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-500/40">
                            ★ Recommended
                          </span>
                        )}
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Miniature ATS Structure Representation */}
                    <div className="my-2.5 p-2 rounded-lg bg-white/5 border border-white/5 space-y-1 select-none pointer-events-none">
                      <div className="h-1.5 w-1/3 bg-slate-400 rounded-sm mx-auto mb-1.5" />
                      <div className="h-0.5 w-full bg-slate-600 rounded-sm" />
                      <div className="h-1 w-2/5 bg-sky-400/80 rounded-sm" />
                      <div className="h-1 w-4/5 bg-slate-500 rounded-sm" />
                      <div className="h-1 w-3/4 bg-slate-500 rounded-sm" />
                      <div className="h-0.5 w-full bg-slate-600 rounded-sm mt-1" />
                      <div className="h-1 w-1/3 bg-sky-400/80 rounded-sm" />
                      <div className="h-1 w-full bg-slate-500 rounded-sm" />
                    </div>

                    <p className="text-[10.5px] text-slate-400 leading-snug line-clamp-2">
                      {tmpl.desc}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-blue-500/10 flex items-center justify-between text-[9.5px] text-slate-400">
                    <span>Default: {tmpl.defaultFont}</span>
                    <span className="text-emerald-400 font-semibold">100% ATS Safe</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: TYPOGRAPHY, ACCENT & SPACING ── */}
      {activeTab === 'typography' && (
        <div className="space-y-4">
          {/* ATS Safe Fonts (11 Fonts) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-poppins text-slate-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#818cf8]" />
                <span>ATS-Safe Typography</span>
              </label>
              <span className="text-[10px] text-emerald-400 font-semibold">11 Certified Fonts</span>
            </div>
            <select
              value={customization.fontFamily}
              onChange={(e) => onChange({ fontFamily: e.target.value as FontFamily })}
              className="w-full bg-[#07101F] border border-blue-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {ATS_SAFE_FONTS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.type}
                </option>
              ))}
            </select>
            <p className="text-[10.5px] text-slate-400">
              Only machine-readable serif and sans-serif fonts are allowed. Fancy or script fonts are blocked to guarantee OCR score.
            </p>
          </div>

          {/* Accent Color Palette (10 Colors) */}
          <div className="space-y-2">
            <label className="text-xs font-bold font-poppins text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Recruiter Accent Color</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ATS_ACCENT_COLORS.map((col) => {
                const isSelected = customization.accentColor.toLowerCase() === col.hex.toLowerCase()
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => onChange({ accentColor: col.hex })}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#2563EB] bg-[#2563EB]/15 text-white ring-1 ring-[#2563EB]'
                        : 'border-blue-500/15 bg-[#07101F] text-slate-400 hover:text-white hover:border-blue-500/30'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-sm"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="text-[10px] font-semibold truncate">{col.name}</span>
                  </button>
                )
              })}
            </div>
            <p className="text-[10px] text-slate-400">
              Accent colors only tint section headers and divider lines. Body text remains high-contrast black for standard ATS parsing.
            </p>
          </div>

          {/* Font Size, Line Height & Margins */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-blue-500/15">
            {/* Font Size */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 block">Font Size</label>
              <div className="flex rounded-xl bg-[#07101F] p-0.5 border border-blue-500/20">
                {(['sm', 'md', 'lg'] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onChange({ fontSize: size })}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      customization.fontSize === size
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Height */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 block">Line Spacing</label>
              <div className="flex rounded-xl bg-[#07101F] p-0.5 border border-blue-500/20">
                {(['tight', 'normal', 'relaxed'] as LineHeight[]).map((lh) => (
                  <button
                    key={lh}
                    type="button"
                    onClick={() => onChange({ lineHeight: lh })}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      customization.lineHeight === lh
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lh === 'tight' ? 'Compact' : lh === 'normal' ? 'Normal' : 'Relaxed'}
                  </button>
                ))}
              </div>
            </div>

            {/* Margins */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 block">Page Margins</label>
              <div className="flex rounded-xl bg-[#07101F] p-0.5 border border-blue-500/20">
                {(['compact', 'normal', 'spacious'] as Margins[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onChange({ margins: m })}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      customization.margins === m
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m === 'compact' ? 'Compact' : m === 'normal' ? 'Normal' : 'Spacious'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: SECTION ORDER & CUSTOM VISIBILITY ── */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold font-poppins text-slate-200">
                Section Hierarchy & Toggle Visibility
              </h4>
              <p className="text-[10.5px] text-slate-400">
                Reorder sections up/down or toggle optional sections ON/OFF. Preview updates instantly.
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {customization.sectionOrder.map((key, index) => {
              const meta = SECTION_METADATA[key] || { label: key, optional: true }
              const isHidden = hiddenSections.includes(key)

              return (
                <div
                  key={key}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all ${
                    isHidden
                      ? 'bg-[#07101F]/50 border-blue-500/10 text-slate-500 opacity-60'
                      : 'bg-[#07101F] border-blue-500/20 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-blue-500/15 text-sky-400 flex items-center justify-center font-mono text-[10px] font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-semibold">{meta.label}</span>
                      {meta.optional && (
                        <span className="text-[10px] text-slate-500 ml-1.5">(Optional)</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Visibility Toggle */}
                    {meta.optional && (
                      <button
                        type="button"
                        onClick={() => toggleSectionVisibility(key)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isHidden
                            ? 'text-slate-500 hover:text-slate-300 bg-slate-800/40'
                            : 'text-sky-400 hover:text-sky-200 bg-blue-500/15'
                        }`}
                        title={isHidden ? 'Show section' : 'Hide section'}
                      >
                        {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    {/* Up / Down Reorder */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveSection(index, 'up')}
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 disabled:opacity-25 text-slate-400 hover:text-white"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === customization.sectionOrder.length - 1}
                      onClick={() => moveSection(index, 'down')}
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 disabled:opacity-25 text-slate-400 hover:text-white"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── TAB 4: STRICT ATS COMPLIANCE LOCK ── */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          {/* Compliance Status Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Strict ATS Compliance Guaranteed</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                100% ATS Safe
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every template strictly enforces modern Applicant Tracking System guidelines. Multi-column tables, floating textboxes, images, icons, and non-standard fonts are automatically locked out to guarantee seamless machine parsing.
            </p>
          </div>

          {/* Locked Elements Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold font-poppins text-slate-300">
              Enforced Security & Parsing Rules:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {[
                { label: 'Single-Column Layout', status: 'Enforced' },
                { label: 'No Tables or Nested Divs', status: 'Enforced' },
                { label: 'No Embedded SVG Icons in Body', status: 'Enforced' },
                { label: 'No Images / Profile Photos', status: 'Enforced' },
                { label: 'No Floating Text Boxes', status: 'Enforced' },
                { label: 'No Progress Bars / Star Ratings', status: 'Enforced' },
                { label: 'Standard A4 Dimension (210×297mm)', status: 'Enforced' },
                { label: 'Pure Machine-Readable Plaintext', status: 'Enforced' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#07101F] border border-blue-500/15"
                >
                  <span className="text-slate-300">{item.label}</span>
                  <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1-Click Optimize Trigger */}
          {onOptimizeToOnePage && (
            <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-sky-300 block">Single-Page Auto Optimizer</span>
                <span className="text-[10px] text-slate-400">Intelligently compresses bullets and summaries if exceeding A4 height</span>
              </div>
              <button
                type="button"
                onClick={onOptimizeToOnePage}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold shadow-sm shrink-0"
              >
                Optimize Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
