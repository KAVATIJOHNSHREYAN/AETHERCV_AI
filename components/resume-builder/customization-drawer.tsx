'use client'

import React from 'react'
import {
  CustomizationSettings,
  TemplateId,
  FontFamily,
  FontSize,
  LineHeight,
  Margins,
  HeaderStyle,
  SectionKey
} from '@/types/resume-builder'
import {
  Palette, Type, Sliders, Layout, ArrowUp, ArrowDown,
  Check, Eye, Sparkles, CheckCircle2, ShieldCheck
} from 'lucide-react'

interface CustomizationDrawerProps {
  customization: CustomizationSettings
  onChange: (updated: Partial<CustomizationSettings>) => void
}

const TEMPLATES: { id: TemplateId; name: string; tag: string; desc: string }[] = [
  { id: 'modern-ats', name: 'Modern ATS', tag: 'Recommended', desc: 'Single-column with bold headers and clean dividing rules' },
  { id: 'classic-ats', name: 'Classic Corporate ATS', tag: 'Standard', desc: 'Conservative linear format favored by Fortune 500 ATS systems' },
  { id: 'harvard', name: 'Harvard Ivy ATS', tag: 'Academic', desc: 'Formal serif typography with right-aligned dates and crisp dividers' },
  { id: 'stanford', name: 'Stanford Tech ATS', tag: 'Silicon Valley', desc: 'Geometric sans-serif with compact technical hierarchy' },
  { id: 'google', name: 'Google SDE ATS', tag: 'Engineering', desc: 'High emphasis on metrics, action verbs, and system scale' },
  { id: 'minimal', name: 'Minimalist Clean ATS', tag: 'Distraction-Free', desc: 'Generous whitespace with clean black-on-white text' },
  { id: 'executive', name: 'Executive Leadership ATS', tag: 'Senior', desc: 'High-density format for managers and lead architects' }
]

const ACCENT_COLORS = [
  { name: 'Pure ATS Charcoal', hex: '#111827' },
  { name: 'Dark Slate', hex: '#1F2937' },
  { name: 'Navy Blue', hex: '#1E3A8A' },
  { name: 'Corporate Blue', hex: '#2563EB' },
  { name: 'Dark Teal', hex: '#0F766E' }
]

const FONTS: { id: FontFamily; name: string; style: string }[] = [
  { id: 'inter', name: 'Inter', style: 'ATS Standard Sans' },
  { id: 'roboto', name: 'Roboto', style: 'Universal ATS Sans' },
  { id: 'outfit', name: 'Outfit', style: 'Clean Geometric' },
  { id: 'merriweather', name: 'Merriweather', style: 'Classic Editorial Serif' },
  { id: 'jetbrains', name: 'JetBrains Mono', style: 'Technical Monospace' }
]

const SECTION_LABELS: Record<SectionKey, string> = {
  personal: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  projects: 'Key Projects',
  skills: 'Technical Skills',
  certifications: 'Certifications',
  achievements: 'Achievements',
  languages: 'Languages',
  interests: 'Interests'
}

export function CustomizationDrawer({ customization, onChange }: CustomizationDrawerProps) {
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const order = [...customization.sectionOrder]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= order.length) return
    const temp = order[index]
    order[index] = order[targetIndex]
    order[targetIndex] = temp
    onChange({ sectionOrder: order })
  }

  return (
    <div className="space-y-6 text-sm font-outfit">
      {/* 1. Template Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold font-poppins uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-[#818cf8]" />
          Strict Single-Column ATS Templates
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
          {TEMPLATES.map((tmpl) => {
            const isSelected = customization.templateId === tmpl.id
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onChange({ templateId: tmpl.id })}
                className={`text-left p-2.5 rounded-xl border transition-all relative ${
                  isSelected
                    ? 'border-[#2563EB] bg-[#2563EB]/15 text-white shadow-sm'
                    : 'border-blue-500/15 bg-[#07101F]/80 text-slate-400 hover:border-blue-500/30 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-poppins text-xs text-white truncate">{tmpl.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#60a5fa]" />}
                </div>
                <span className="text-[10px] text-sky-400 font-semibold block mt-0.5">{tmpl.tag}</span>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">{tmpl.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. ATS Typography & Sizing */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold font-poppins text-slate-300 block mb-1.5">ATS-Safe Font</label>
          <select
            value={customization.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value as FontFamily })}
            className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.style})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold font-poppins text-slate-300 block mb-1.5">Accent Color</label>
          <select
            value={customization.accentColor}
            onChange={(e) => onChange({ accentColor: e.target.value })}
            className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {ACCENT_COLORS.map((c) => (
              <option key={c.hex} value={c.hex}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Spacing Sliders */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Font Size</label>
          <div className="flex rounded-xl bg-[#07101F] p-0.5 border border-blue-500/20">
            {(['sm', 'md', 'lg'] as FontSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onChange({ fontSize: size })}
                className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  customization.fontSize === size
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Line Height</label>
          <div className="flex rounded-xl bg-[#07101F] p-0.5 border border-blue-500/20">
            {(['tight', 'normal', 'relaxed'] as LineHeight[]).map((lh) => (
              <button
                key={lh}
                type="button"
                onClick={() => onChange({ lineHeight: lh })}
                className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  customization.lineHeight === lh
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lh}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Margins</label>
          <div className="flex rounded-xl bg-[#07101F] p-0.5 border border-blue-500/20">
            {(['compact', 'normal', 'spacious'] as Margins[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onChange({ margins: m })}
                className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  customization.margins === m
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Strict ATS Compliance Rules Badge */}
      <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-sky-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict ATS Compliance Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          ✓ Single-column layout only &nbsp;•&nbsp; ✓ No tables &nbsp;•&nbsp; ✓ No graphics or icons &nbsp;•&nbsp; ✓ 100% Machine Parsable &nbsp;•&nbsp; ✓ Standard A4 Portrait
        </p>
      </div>

      {/* 5. Section Reordering */}
      <div className="space-y-2 pt-2 border-t border-blue-500/15">
        <label className="text-xs font-bold font-poppins uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#818cf8]" />
          Section Order (Reorderable)
        </label>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {customization.sectionOrder.map((key, index) => (
            <div
              key={key}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#07101F] border border-blue-500/15 text-xs text-slate-300"
            >
              <span className="font-medium truncate">{SECTION_LABELS[key] || key}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveSection(index, 'up')}
                  className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === customization.sectionOrder.length - 1}
                  onClick={() => moveSection(index, 'down')}
                  className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
