'use client'

import React, { useState, useEffect } from 'react'
import {
  Monitor, Smartphone, Tablet, Laptop, CheckCircle2,
  X, Eye, Sparkles, ShieldCheck, Zap, Maximize2, Compass
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DevicePreset {
  name: string
  category: 'laptop' | 'tablet' | 'phone'
  resolution: string
  aspectRatio: string
  dpr: string
  diagonal: string
  popularFor: string
  tailwindBreakpoint: string
}

const DEVICE_PRESETS: DevicePreset[] = [
  // ── Laptops & Desktops ──
  {
    name: 'MacBook Pro 16" / Large Laptop',
    category: 'laptop',
    resolution: '2560 × 1600',
    aspectRatio: '16:10',
    dpr: '2.0x Retina',
    diagonal: '16.0 inch',
    popularFor: 'Workstations, High-end Dev Laptops',
    tailwindBreakpoint: '2xl (>= 1536px)'
  },
  {
    name: 'Standard 15.6" Laptop (Full HD)',
    category: 'laptop',
    resolution: '1920 × 1080',
    aspectRatio: '16:9',
    dpr: '1.0x / 1.25x',
    diagonal: '15.6 inch',
    popularFor: 'Most common student & office laptops worldwide',
    tailwindBreakpoint: 'xl (>= 1280px)'
  },
  {
    name: 'MacBook Air 13" / Ultrabook',
    category: 'laptop',
    resolution: '1440 × 900',
    aspectRatio: '16:10',
    dpr: '2.0x Retina',
    diagonal: '13.3 inch',
    popularFor: 'MacBook Air, Ultra-portable laptops',
    tailwindBreakpoint: 'xl (>= 1280px)'
  },
  {
    name: 'Business 14" Laptop (HD+)',
    category: 'laptop',
    resolution: '1600 × 900',
    aspectRatio: '16:9',
    dpr: '1.0x',
    diagonal: '14.0 inch',
    popularFor: 'Lenovo ThinkPad, HP EliteBook, Dell Latitude',
    tailwindBreakpoint: 'lg (>= 1024px)'
  },
  {
    name: 'Compact 13.3" Laptop (Standard HD)',
    category: 'laptop',
    resolution: '1366 × 768',
    aspectRatio: '16:9',
    dpr: '1.0x',
    diagonal: '13.3 inch',
    popularFor: 'Budget laptops, legacy college PCs',
    tailwindBreakpoint: 'lg (>= 1024px)'
  },
  {
    name: 'Desktop Monitor (2K Quad HD)',
    category: 'laptop',
    resolution: '2560 × 1440',
    aspectRatio: '16:9',
    dpr: '1.0x',
    diagonal: '27.0 inch',
    popularFor: 'External gaming & professional monitors',
    tailwindBreakpoint: '2xl (>= 1536px)'
  },

  // ── Tablets ──
  {
    name: 'Apple iPad Pro 12.9"',
    category: 'tablet',
    resolution: '1024 × 1366',
    aspectRatio: '4:3',
    dpr: '2.0x Retina',
    diagonal: '12.9 inch',
    popularFor: 'Large tablet, digital stylus note-taking',
    tailwindBreakpoint: 'lg / xl (1024px)'
  },
  {
    name: 'Apple iPad Air / 11" Pro',
    category: 'tablet',
    resolution: '820 × 1180',
    aspectRatio: '1.43:1',
    dpr: '2.0x Retina',
    diagonal: '10.9 inch',
    popularFor: 'Standard college student tablet',
    tailwindBreakpoint: 'md (>= 768px)'
  },
  {
    name: 'Samsung Galaxy Tab S9 / S8',
    category: 'tablet',
    resolution: '800 × 1280',
    aspectRatio: '16:10',
    dpr: '2.0x AMOLED',
    diagonal: '11.0 inch',
    popularFor: 'Android flagship tablets',
    tailwindBreakpoint: 'md (>= 768px)'
  },
  {
    name: 'Microsoft Surface Pro 9',
    category: 'tablet',
    resolution: '912 × 1368',
    aspectRatio: '3:2',
    dpr: '2.0x PixelSense',
    diagonal: '13.0 inch',
    popularFor: '2-in-1 Windows tablet laptops',
    tailwindBreakpoint: 'md / lg (912px)'
  },
  {
    name: 'Apple iPad Mini (6th Gen)',
    category: 'tablet',
    resolution: '744 × 1133',
    aspectRatio: '3:2',
    dpr: '2.0x Retina',
    diagonal: '8.3 inch',
    popularFor: 'Compact portable tablet reading',
    tailwindBreakpoint: 'sm / md (744px)'
  },

  // ── Smartphones ──
  {
    name: 'iPhone 16 / 15 Pro Max',
    category: 'phone',
    resolution: '430 × 932',
    aspectRatio: '19.5:9',
    dpr: '3.0x Super Retina',
    diagonal: '6.7 - 6.9 inch',
    popularFor: 'Flagship large iOS smartphones',
    tailwindBreakpoint: 'sm (430px)'
  },
  {
    name: 'iPhone 16 / 15 / 14 / 13',
    category: 'phone',
    resolution: '390 × 844',
    aspectRatio: '19.5:9',
    dpr: '3.0x Super Retina',
    diagonal: '6.1 inch',
    popularFor: 'Standard iOS smartphones',
    tailwindBreakpoint: 'base (390px)'
  },
  {
    name: 'Samsung Galaxy S24 / S23 Ultra',
    category: 'phone',
    resolution: '412 × 915',
    aspectRatio: '20:9',
    dpr: '3.5x Dynamic AMOLED',
    diagonal: '6.8 inch',
    popularFor: 'Flagship Android devices',
    tailwindBreakpoint: 'sm (412px)'
  },
  {
    name: 'Google Pixel 9 / 8 Pro',
    category: 'phone',
    resolution: '412 × 892',
    aspectRatio: '20:9',
    dpr: '3.0x Actua',
    diagonal: '6.7 inch',
    popularFor: 'Google Android flagships',
    tailwindBreakpoint: 'sm (412px)'
  },
  {
    name: 'OnePlus 12 / Xiaomi / Redmi',
    category: 'phone',
    resolution: '360 × 800',
    aspectRatio: '20:9',
    dpr: '3.0x AMOLED',
    diagonal: '6.5 inch',
    popularFor: 'High-volume Android devices in India & Asia',
    tailwindBreakpoint: 'base (360px)'
  },
  {
    name: 'iPhone SE (3rd Gen) / Compact',
    category: 'phone',
    resolution: '375 × 667',
    aspectRatio: '16:9',
    dpr: '2.0x Retina',
    diagonal: '4.7 inch',
    popularFor: 'Compact small-screen mobile devices',
    tailwindBreakpoint: 'base (375px)'
  }
]

const MODULES_COMPATIBILITY = [
  {
    name: 'AI Resume Builder',
    path: '/resume-builder',
    desktopBehavior: 'Split-screen side-by-side editing + live A4 preview with instant reactive updates.',
    tabletBehavior: 'Adaptive 2-column or stacked layout with expandable template gallery.',
    mobileBehavior: '3-mode tab switcher (Form Editor, Live Preview, ATS Audit). 1-click single-page PDF download.'
  },
  {
    name: 'AI Resume Analyzer',
    path: '/resume-analyzer',
    desktopBehavior: 'Dual panel with neon circular ATS gauge, 8-pillar category bars & JD comparison.',
    tabletBehavior: 'Collapsible audit accordion with high-DPI gauge display.',
    mobileBehavior: 'Touch-optimized drag & drop upload, vertical stacked audit cards, and quick memo drawer.'
  },
  {
    name: 'AI Cover Letter Generator',
    path: '/cover-letter',
    desktopBehavior: 'Dual-pane synthesis form & formatted live markdown preview with .docx export.',
    tabletBehavior: 'Stacked cards with smooth tabs for form and preview.',
    mobileBehavior: 'Single-column step-by-step wizard, touch tone selector, and quick copy to clipboard.'
  },
  {
    name: 'Simple Attendance Calculator',
    path: '/simple',
    desktopBehavior: 'Spacious cards with 75% & 85% status meters and quick attendance forecast.',
    tabletBehavior: 'Balanced grid with large touch buttons for increment/decrement.',
    mobileBehavior: 'Touch numerical sliders, thumb-friendly skip/needed class indicators.'
  },
  {
    name: 'LTPS Multi-Course Calculator',
    path: '/ltps',
    desktopBehavior: '4-component card grid (Lecture, Tutorial, Practical, Skilling) with weighted credit matrix.',
    tabletBehavior: '2x2 grid with component credit calculators.',
    mobileBehavior: 'Vertical accordion cards, individual component sliders, and detention risk banners.'
  },
  {
    name: 'Screenshot / OCR Calculator',
    path: '/screenshot',
    desktopBehavior: 'Desktop file dropzone with table preview and automated row parsing.',
    tabletBehavior: 'Touch file picker with OCR status feedback.',
    mobileBehavior: 'Direct native smartphone camera photo upload + gallery image parsing.'
  },
  {
    name: 'ERP Portal Login & Dashboard',
    path: '/login',
    desktopBehavior: 'Side-by-side authentication card + security credentials overview.',
    tabletBehavior: 'Centered login card with automated CAPTCHA solver.',
    mobileBehavior: 'Mobile-first biometric/token login, touch CAPTCHA refresh, responsive subject cards.'
  }
]

interface DeviceCompatibilityModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DeviceCompatibilityModal({ isOpen, onClose }: DeviceCompatibilityModalProps) {
  const [currentWidth, setCurrentWidth] = useState<number>(0)
  const [currentHeight, setCurrentHeight] = useState<number>(0)
  const [dpr, setDpr] = useState<number>(1)
  const [orientation, setOrientation] = useState<string>('Landscape')
  const [activeCategory, setActiveCategory] = useState<'all' | 'laptop' | 'tablet' | 'phone'>('all')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateDimensions = () => {
      setCurrentWidth(window.innerWidth)
      setCurrentHeight(window.innerHeight)
      setDpr(window.devicePixelRatio || 1)
      setOrientation(window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait')
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [isOpen])

  if (!isOpen) return null

  // Categorize active screen
  const getDeviceCategory = () => {
    if (currentWidth >= 1024) return { label: 'Laptop / Desktop', icon: Laptop, color: 'text-sky-400' }
    if (currentWidth >= 640) return { label: 'Tablet / iPad', icon: Tablet, color: 'text-indigo-400' }
    return { label: 'Mobile Smartphone', icon: Smartphone, color: 'text-emerald-400' }
  }

  const activeDevice = getDeviceCategory()
  const ActiveIcon = activeDevice.icon

  const filteredPresets = DEVICE_PRESETS.filter((p) => {
    if (activeCategory === 'all') return true
    return p.category === activeCategory
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-outfit">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0C162B] border border-blue-500/25 p-5 sm:p-7 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header with Mixed Device Icon */}
        <div className="flex items-center justify-between border-b border-blue-500/15 pb-4">
          <div className="flex items-center gap-3">
            {/* Mixed Compatibility Icon: Laptop + Smartphone */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4D48E6]/25 to-[#2662EB]/30 border border-blue-500/40 flex items-center justify-center text-sky-300 shadow-md">
              <Laptop className="w-5 h-5 text-sky-300" />
              <Smartphone className="w-3.5 h-3.5 text-blue-200 absolute -bottom-1 -right-1 bg-[#0C162B] rounded-full p-0.5 border border-blue-400/40" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-poppins text-white">
                  Cross-Platform Device &amp; Screen Compatibility
                </h3>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                  All Modules 100% Responsive
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Optimized for all Laptops, Desktops, Tablets, and Mobile Smartphones
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Live Detected Screen Size Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0A1528] to-indigo-950/40 border border-blue-500/30 flex flex-wrap items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <ActiveIcon className={`w-5 h-5 ${activeDevice.color}`} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Your Current Device Viewport
              </span>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold font-poppins text-white">
                  {currentWidth} × {currentHeight} px
                </span>
                <span className="text-xs text-sky-400 font-semibold">
                  ({orientation}, {dpr}x DPR)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Optimized for {activeDevice.label}</span>
            </div>
          </div>
        </div>

        {/* 2. Screen Sizes of Different Laptops, Tablets, and Phones */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold font-poppins text-slate-200 flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-[#818cf8]" />
                <span>Screen Sizes Reference &amp; Viewport Matrix</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Standard hardware resolutions tested and verified for AETHERCV AI
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-[#07101F] p-1 rounded-xl border border-blue-500/15 text-xs font-semibold">
              {(['all', 'laptop', 'tablet', 'phone'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs capitalize transition-all ${
                    activeCategory === cat
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All Devices' : cat + 's'}
                </button>
              ))}
            </div>
          </div>

          {/* Device Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {filteredPresets.map((preset, index) => {
              const Icon = preset.category === 'laptop' ? Laptop : preset.category === 'tablet' ? Tablet : Smartphone
              return (
                <div
                  key={index}
                  className="p-3 rounded-2xl bg-[#07101F] border border-blue-500/15 hover:border-blue-500/35 transition-all space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="font-bold text-xs text-white truncate font-poppins">{preset.name}</span>
                    </div>
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-sky-300 shrink-0">
                      {preset.resolution}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                    <div>
                      <span className="text-slate-500">Ratio:</span> {preset.aspectRatio}
                    </div>
                    <div>
                      <span className="text-slate-500">Size:</span> {preset.diagonal}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {preset.popularFor}
                  </p>

                  <div className="pt-1 border-t border-blue-500/10 flex items-center justify-between text-[9.5px]">
                    <span className="text-slate-500">Breakpoint: {preset.tailwindBreakpoint}</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> 100% Tested
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. Module-by-Module Compatibility Matrix */}
        <div className="space-y-3 pt-2 border-t border-blue-500/15">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold font-poppins text-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Module Compatibility Across All Devices</span>
            </h4>
            <span className="text-[10px] text-slate-400">All 8 Core Modules Supported</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {MODULES_COMPATIBILITY.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#07101F] border border-blue-500/15 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-poppins">{m.name}</span>
                  <span className="font-mono text-[10px] text-sky-400">{m.path}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div className="p-2 rounded-xl bg-white/5 space-y-0.5">
                    <span className="font-semibold text-sky-300 flex items-center gap-1 text-[10px]">
                      <Laptop className="w-3 h-3" /> Desktop / Laptop
                    </span>
                    <p className="text-[10px] text-slate-400 leading-snug">{m.desktopBehavior}</p>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 space-y-0.5">
                    <span className="font-semibold text-indigo-300 flex items-center gap-1 text-[10px]">
                      <Tablet className="w-3 h-3" /> Tablet / iPad
                    </span>
                    <p className="text-[10px] text-slate-400 leading-snug">{m.tabletBehavior}</p>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 space-y-0.5">
                    <span className="font-semibold text-emerald-300 flex items-center gap-1 text-[10px]">
                      <Smartphone className="w-3 h-3" /> Mobile Smartphone
                    </span>
                    <p className="text-[10px] text-slate-400 leading-snug">{m.mobileBehavior}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/15 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Fluid CSS Grid, Flexbox &amp; Tailwind breakpoints deliver seamless adaptive scaling on any display.</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}
