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
  Check, Eye, Sparkles, CheckCircle2
} from 'lucide-react'

interface CustomizationDrawerProps {
  customization: CustomizationSettings
  onChange: (updated: Partial<CustomizationSettings>) => void
}

const TEMPLATES: { id: TemplateId; name: string; tag: string; desc: string }[] = [
  { id: 'modern-ats', name: 'Modern ATS', tag: 'Recommended', desc: 'Sleek tech headers, modern badges, high ATS pass rate' },
  { id: 'classic-ats', name: 'Classic ATS', tag: 'Standard', desc: 'Single-column linear format favored by traditional corporate parsers' },
  { id: 'harvard', name: 'Harvard', tag: 'Ivy League', desc: 'Timeless serif typography, right-aligned dates, academic prestige' },
  { id: 'stanford', name: 'Stanford', tag: 'Tech Elite', desc: 'Crisp sans-serif, high line balance, Silicon Valley favorite' },
  { id: 'google', name: 'Google', tag: 'SDE Focused', desc: 'Emphasizes technical stack, metrics-driven projects, high clarity' },
  { id: 'microsoft', name: 'Microsoft', tag: 'Enterprise', desc: 'Structured corporate layout with subtle dividers' },
  { id: 'amazon', name: 'Amazon', tag: 'Leadership', desc: 'Dense leadership-principles architecture for maximum page efficiency' },
  { id: 'minimal', name: 'Minimalist', tag: 'Clean', desc: 'Distraction-free typography, generous whitespace' },
  { id: 'elegant', name: 'Elegant', tag: 'Polished', desc: 'Sophisticated dual-shade borders with balanced aesthetics' },
  { id: 'executive', name: 'Executive', tag: 'Senior', desc: 'Authoritative headers tailored for managers and leads' },
  { id: 'academic-cv', name: 'Academic CV', tag: 'Research', desc: 'Multi-tiered hierarchy for publications and education' },
  { id: 'sidebar', name: 'Sidebar Two-Column', tag: 'Modern', desc: 'Left column for skills and contact; right column for core experience' },
  { id: 'modern-professional', name: 'Modern Professional', tag: 'Balanced', desc: 'Contemporary corporate design with accent borders' }
]

const ACCENT_COLORS = [
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Violet Indigo', hex: '#4D48E6' },
  { name: 'Teal Emerald', hex: '#0D9488' },
  { name: 'Sky Cyan', hex: '#0284C7' },
  { name: 'Deep Navy', hex: '#1E3A8A' },
  { name: 'Charcoal Slate', hex: '#334155' },
  { name: 'Electric Purple', hex: '#7C3AED' },
  { name: 'Midnight', hex: '#0F172A' }
]

const FONTS: { id: FontFamily; name: string; style: string }[] = [
  { id: 'outfit', name: 'Outfit', style: 'Modern & Clean' },
  { id: 'inter', name: 'Inter', style: 'ATS Standard' },
  { id: 'poppins', name: 'Poppins', style: 'Geometric Sans' },
  { id: 'roboto', name: 'Roboto', style: 'Neutral Sans' },
  { id: 'merriweather', name: 'Merriweather', style: 'Classic Editorial' },
  { id: 'jetbrains', name: 'JetBrains Mono', style: 'Tech Monospace' }
]

const SECTION_LABELS: Record<SectionKey, string> = {
  personal: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  projects: 'Projects',
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
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold font-poppins uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-[#818cf8]" />
            Template ({TEMPLATES.length} Designs)
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
          {TEMPLATES.map((tmpl) => {
            const isSelected = customization.templateId === tmpl.id
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onChange({ templateId: tmpl.id })}
                className={`text-left p-2.5 rounded-xl border transition-all relative ${
                  isSelected
                    ? 'border-[#2563EB] bg-[#2563EB]/15 text-white shadow-[0_0_15px_rgba(37,99,235,0.25)]'
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

      {/* 2. Accent Color */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold font-poppins uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[#818cf8]" />
          Accent Color
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => onChange({ accentColor: c.hex })}
              title={c.name}
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                customization.accentColor === c.hex
                  ? 'ring-2 ring-white scale-110 shadow-lg'
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {customization.accentColor === c.hex && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
          <input
            type="color"
            value={customization.accentColor}
            onChange={(e) => onChange({ accentColor: e.target.value })}
            className="w-7 h-7 rounded-xl cursor-pointer bg-transparent border-0"
            title="Custom Hex Color"
          />
        </div>
      </div>

      {/* 3. Typography & Sizing */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold font-poppins text-slate-300 block mb-1.5">Font Family</label>
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
          <label className="text-xs font-bold font-poppins text-slate-300 block mb-1.5">Header Layout</label>
          <select
            value={customization.headerStyle}
            onChange={(e) => onChange({ headerStyle: e.target.value as HeaderStyle })}
            className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="left">Left Aligned</option>
            <option value="centered">Centered Formal</option>
            <option value="banner">Modern Banner</option>
            <option value="minimal">Minimal Clean</option>
          </select>
        </div>
      </div>

      {/* 4. Spacing Sliders / Buttons */}
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

      {/* 5. Toggles */}
      <div className="flex items-center justify-between pt-2 border-t border-blue-500/15">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
          <input
            type="checkbox"
            checked={customization.showIcons}
            onChange={(e) => onChange({ showIcons: e.target.checked })}
            className="rounded border-blue-500/30 text-blue-600 focus:ring-0"
          />
          <span>Show Section Icons</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
          <input
            type="checkbox"
            checked={customization.showPhoto}
            onChange={(e) => onChange({ showPhoto: e.target.checked })}
            className="rounded border-blue-500/30 text-blue-600 focus:ring-0"
          />
          <span>Show Photo Frame</span>
        </label>
      </div>

      {/* 6. Section Reordering */}
      <div className="space-y-2 pt-2 border-t border-blue-500/15">
        <label className="text-xs font-bold font-poppins uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#818cf8]" />
          Section Order (Reorderable)
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
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
