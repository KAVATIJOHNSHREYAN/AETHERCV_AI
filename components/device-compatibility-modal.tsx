'use client'

import React, { useState, useEffect } from 'react'
import {
  Monitor, Smartphone, Tablet, Laptop, CheckCircle2,
  X, Eye, Sparkles, ShieldCheck, Zap, Maximize2, Compass,
  RotateCcw, ExternalLink, Play, Layers, RefreshCw
} from 'lucide-react'
import { usePathname } from 'next/navigation'

interface DevicePreset {
  id: string
  name: string
  category: 'laptop' | 'tablet' | 'phone'
  width: number
  height: number
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
    id: 'macbook-16',
    name: 'MacBook Pro 16" / Large Laptop',
    category: 'laptop',
    width: 1536,
    height: 960,
    resolution: '2560 × 1600 (Scaled 1536×960)',
    aspectRatio: '16:10',
    dpr: '2.0x Retina',
    diagonal: '16.0 inch',
    popularFor: 'Workstations, High-end Dev Laptops',
    tailwindBreakpoint: '2xl (>= 1536px)'
  },
  {
    id: 'laptop-15',
    name: 'Standard 15.6" Laptop (Full HD)',
    category: 'laptop',
    width: 1280,
    height: 720,
    resolution: '1920 × 1080 (Viewport 1280×720)',
    aspectRatio: '16:9',
    dpr: '1.25x / 1.5x',
    diagonal: '15.6 inch',
    popularFor: 'Most common student & office laptops worldwide',
    tailwindBreakpoint: 'xl (>= 1280px)'
  },
  {
    id: 'macbook-air-13',
    name: 'MacBook Air 13" / Ultrabook',
    category: 'laptop',
    width: 1280,
    height: 800,
    resolution: '1440 × 900 (Viewport 1280×800)',
    aspectRatio: '16:10',
    dpr: '2.0x Retina',
    diagonal: '13.3 inch',
    popularFor: 'MacBook Air, Ultra-portable laptops',
    tailwindBreakpoint: 'xl (>= 1280px)'
  },
  {
    id: 'laptop-14',
    name: 'Business 14" Laptop (HD+)',
    category: 'laptop',
    width: 1024,
    height: 640,
    resolution: '1600 × 900 (Viewport 1024×640)',
    aspectRatio: '16:9',
    dpr: '1.0x',
    diagonal: '14.0 inch',
    popularFor: 'Lenovo ThinkPad, HP EliteBook, Dell Latitude',
    tailwindBreakpoint: 'lg (>= 1024px)'
  },
  {
    id: 'laptop-13-compact',
    name: 'Compact 13.3" Laptop (Standard HD)',
    category: 'laptop',
    width: 1024,
    height: 576,
    resolution: '1366 × 768 (Viewport 1024×576)',
    aspectRatio: '16:9',
    dpr: '1.0x',
    diagonal: '13.3 inch',
    popularFor: 'Budget laptops, legacy college PCs',
    tailwindBreakpoint: 'lg (>= 1024px)'
  },
  {
    id: 'desktop-2k',
    name: 'Desktop Monitor (2K Quad HD)',
    category: 'laptop',
    width: 1440,
    height: 810,
    resolution: '2560 × 1440 (Scaled 1440×810)',
    aspectRatio: '16:9',
    dpr: '1.0x',
    diagonal: '27.0 inch',
    popularFor: 'External gaming & professional monitors',
    tailwindBreakpoint: '2xl (>= 1536px)'
  },

  // ── Tablets ──
  {
    id: 'ipad-pro-12',
    name: 'Apple iPad Pro 12.9"',
    category: 'tablet',
    width: 1024,
    height: 1366,
    resolution: '1024 × 1366',
    aspectRatio: '4:3',
    dpr: '2.0x Retina',
    diagonal: '12.9 inch',
    popularFor: 'Large tablet, digital stylus note-taking',
    tailwindBreakpoint: 'lg / xl (1024px)'
  },
  {
    id: 'ipad-air',
    name: 'Apple iPad Air / 11" Pro',
    category: 'tablet',
    width: 820,
    height: 1180,
    resolution: '820 × 1180',
    aspectRatio: '1.43:1',
    dpr: '2.0x Retina',
    diagonal: '10.9 inch',
    popularFor: 'Standard college student tablet',
    tailwindBreakpoint: 'md (>= 768px)'
  },
  {
    id: 'galaxy-tab-s9',
    name: 'Samsung Galaxy Tab S9 / S8',
    category: 'tablet',
    width: 800,
    height: 1280,
    resolution: '800 × 1280',
    aspectRatio: '16:10',
    dpr: '2.0x AMOLED',
    diagonal: '11.0 inch',
    popularFor: 'Android flagship tablets',
    tailwindBreakpoint: 'md (>= 768px)'
  },
  {
    id: 'surface-pro',
    name: 'Microsoft Surface Pro 9',
    category: 'tablet',
    width: 912,
    height: 1368,
    resolution: '912 × 1368',
    aspectRatio: '3:2',
    dpr: '2.0x PixelSense',
    diagonal: '13.0 inch',
    popularFor: '2-in-1 Windows tablet laptops',
    tailwindBreakpoint: 'md / lg (912px)'
  },
  {
    id: 'ipad-mini',
    name: 'Apple iPad Mini (6th Gen)',
    category: 'tablet',
    width: 744,
    height: 1133,
    resolution: '744 × 1133',
    aspectRatio: '3:2',
    dpr: '2.0x Retina',
    diagonal: '8.3 inch',
    popularFor: 'Compact portable tablet reading',
    tailwindBreakpoint: 'sm / md (744px)'
  },

  // ── Smartphones ──
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 / 15 Pro Max',
    category: 'phone',
    width: 430,
    height: 932,
    resolution: '430 × 932',
    aspectRatio: '19.5:9',
    dpr: '3.0x Super Retina',
    diagonal: '6.7 - 6.9 inch',
    popularFor: 'Flagship large iOS smartphones',
    tailwindBreakpoint: 'sm (430px)'
  },
  {
    id: 'iphone-16-standard',
    name: 'iPhone 16 / 15 / 14 / 13',
    category: 'phone',
    width: 390,
    height: 844,
    resolution: '390 × 844',
    aspectRatio: '19.5:9',
    dpr: '3.0x Super Retina',
    diagonal: '6.1 inch',
    popularFor: 'Standard iOS smartphones',
    tailwindBreakpoint: 'base (390px)'
  },
  {
    id: 'galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 / S23 Ultra',
    category: 'phone',
    width: 412,
    height: 915,
    resolution: '412 × 915',
    aspectRatio: '20:9',
    dpr: '3.5x Dynamic AMOLED',
    diagonal: '6.8 inch',
    popularFor: 'Flagship Android devices',
    tailwindBreakpoint: 'sm (412px)'
  },
  {
    id: 'pixel-9-pro',
    name: 'Google Pixel 9 / 8 Pro',
    category: 'phone',
    width: 412,
    height: 892,
    resolution: '412 × 892',
    aspectRatio: '20:9',
    dpr: '3.0x Actua',
    diagonal: '6.7 inch',
    popularFor: 'Google Android flagships',
    tailwindBreakpoint: 'sm (412px)'
  },
  {
    id: 'oneplus-xiaomi',
    name: 'OnePlus 12 / Xiaomi / Redmi',
    category: 'phone',
    width: 360,
    height: 800,
    resolution: '360 × 800',
    aspectRatio: '20:9',
    dpr: '3.0x AMOLED',
    diagonal: '6.5 inch',
    popularFor: 'High-volume Android devices in India & Asia',
    tailwindBreakpoint: 'base (360px)'
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE (3rd Gen) / Compact',
    category: 'phone',
    width: 375,
    height: 667,
    resolution: '375 × 667',
    aspectRatio: '16:9',
    dpr: '2.0x Retina',
    diagonal: '4.7 inch',
    popularFor: 'Compact small-screen mobile devices',
    tailwindBreakpoint: 'base (375px)'
  }
]

const APP_MODULES = [
  { name: 'AI Resume Builder', path: '/resume-builder' },
  { name: 'AI Resume Analyzer', path: '/resume-analyzer' },
  { name: 'AI Cover Letter Generator', path: '/cover-letter' },
  { name: 'Simple Attendance Calculator', path: '/simple' },
  { name: 'LTPS Multi-Course Calculator', path: '/ltps' },
  { name: 'Screenshot OCR Calculator', path: '/screenshot' },
  { name: 'ERP Portal Login', path: '/login' },
  { name: 'Student Dashboard', path: '/dashboard' },
  { name: 'Home Landing Page', path: '/' }
]

interface DeviceCompatibilityModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DeviceCompatibilityModal({ isOpen, onClose }: DeviceCompatibilityModalProps) {
  const currentPath = usePathname() || '/resume-builder'

  // View state: 'grid' (selection cards) | 'simulator' (interactive live test) | 'matrix' (documentation)
  const [activeTab, setActiveTab] = useState<'grid' | 'simulator' | 'matrix'>('grid')
  const [activeCategory, setActiveCategory] = useState<'all' | 'laptop' | 'tablet' | 'phone'>('all')

  // Selected device for simulation
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[11]) // iPhone 16 Pro Max default
  const [isLandscape, setIsLandscape] = useState<boolean>(false)
  const [simulatorPath, setSimulatorPath] = useState<string>(currentPath)
  const [simulatorScale, setSimulatorScale] = useState<number>(0.85)

  // Live viewport metrics
  const [currentWidth, setCurrentWidth] = useState<number>(0)
  const [currentHeight, setCurrentHeight] = useState<number>(0)
  const [dpr, setDpr] = useState<number>(1)
  const [orientation, setOrientation] = useState<string>('Landscape')

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

  // Helper to open real browser popup window at exact physical dimensions
  const handleOpenRealWindow = (preset: DevicePreset) => {
    const w = isLandscape ? preset.height : preset.width
    const h = isLandscape ? preset.width : preset.height
    const left = Math.max(0, (window.screen.width - w) / 2)
    const top = Math.max(0, (window.screen.height - h) / 2)
    window.open(
      simulatorPath,
      `preview_${preset.id}`,
      `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no`
    )
  }

  // Handle clicking a device card: activate and launch simulator
  const handleSelectDevice = (preset: DevicePreset) => {
    setSelectedDevice(preset)
    // Auto-adjust orientation default based on device type
    if (preset.category === 'laptop') {
      setIsLandscape(true)
      setSimulatorScale(0.65)
    } else if (preset.category === 'tablet') {
      setIsLandscape(false)
      setSimulatorScale(0.7)
    } else {
      setIsLandscape(false)
      setSimulatorScale(0.85)
    }
    setActiveTab('simulator')
  }

  // Filter presets
  const filteredPresets = DEVICE_PRESETS.filter((p) => {
    if (activeCategory === 'all') return true
    return p.category === activeCategory
  })

  // Simulated width & height based on orientation
  const simWidth = isLandscape
    ? Math.max(selectedDevice.width, selectedDevice.height)
    : Math.min(selectedDevice.width, selectedDevice.height)
  const simHeight = isLandscape
    ? Math.min(selectedDevice.width, selectedDevice.height)
    : Math.max(selectedDevice.width, selectedDevice.height)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-outfit">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#0C162B] border border-blue-500/25 p-4 sm:p-6 shadow-2xl space-y-5 max-h-[94vh] flex flex-col overflow-hidden">
        {/* ── Top Header with Mixed Device Icon ── */}
        <div className="flex items-center justify-between border-b border-blue-500/15 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4D48E6]/25 to-[#2662EB]/30 border border-blue-500/40 flex items-center justify-center text-sky-300 shadow-md">
              <Laptop className="w-5 h-5 text-sky-300" />
              <Smartphone className="w-3 h-3 text-blue-200 absolute -bottom-0.5 -right-0.5 bg-[#0C162B] rounded-full p-0.5 border border-blue-400/40" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-poppins text-white">
                  Device &amp; Screen Compatibility
                </h3>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                  Interactive Viewport Tester Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Click any device below to test, simulate, or open at real hardware dimensions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Top Action Tabs (Grid vs Simulator vs Matrix) ── */}
        <div className="flex items-center justify-between gap-2 border-b border-blue-500/15 pb-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#07101F] p-1 rounded-xl border border-blue-500/15 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'grid'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Select Screen Size (17 Presets)</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Simulator: {selectedDevice.name.split('/')[0]}</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`hidden sm:flex px-3 py-1.5 rounded-lg items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Module Specs</span>
            </button>
          </div>

          {/* Quick Active Screen Display */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-[#07101F] px-3 py-1.5 rounded-xl border border-blue-500/20">
            <span className="text-slate-500">Current Display:</span>
            <span className="font-mono font-bold text-sky-400">
              {currentWidth} × {currentHeight} px
            </span>
          </div>
        </div>

        {/* ── TAB 1: SCREEN SIZES GRID (REAL INTERACTIVE BUTTONS) ── */}
        {activeTab === 'grid' && (
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {/* Category Filter Pills */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-300">
                Click any device card to test in the simulator or open real popup:
              </span>

              <div className="flex items-center gap-1 bg-[#07101F] p-0.5 rounded-xl border border-blue-500/15 text-xs font-semibold">
                {(['all', 'laptop', 'tablet', 'phone'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-all cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat + 's'}
                  </button>
                ))}
              </div>
            </div>

            {/* REAL INTERACTIVE BUTTON CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPresets.map((preset) => {
                const Icon = preset.category === 'laptop' ? Laptop : preset.category === 'tablet' ? Tablet : Smartphone
                const isSelected = selectedDevice.id === preset.id

                return (
                  <div
                    key={preset.id}
                    className={`p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between group ${
                      isSelected
                        ? 'border-[#2563EB] bg-[#2563EB]/15 text-white ring-1 ring-[#2563EB]/40 shadow-lg'
                        : 'border-blue-500/20 bg-[#07101F]/90 text-slate-400 hover:border-blue-500/50 hover:bg-[#07101F] hover:text-slate-200'
                    }`}
                  >
                    <div>
                      {/* Header with Icon and Resolution Pill */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-blue-500/20 text-sky-300">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-white block group-hover:text-sky-300 transition-colors">
                              {preset.name}
                            </span>
                            <span className="text-[10px] text-sky-400 font-mono">
                              {preset.diagonal} • {preset.aspectRatio}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-blue-500/20 text-sky-300 shrink-0 border border-blue-500/30">
                          {preset.width} × {preset.height}
                        </span>
                      </div>

                      <p className="text-[10.5px] text-slate-400 mt-2 line-clamp-2">
                        {preset.popularFor}
                      </p>
                    </div>

                    {/* ACTION BUTTONS: Real clickable buttons */}
                    <div className="mt-3 pt-2.5 border-t border-blue-500/15 flex items-center gap-2">
                      {/* Primary Button: Simulate in Modal */}
                      <button
                        type="button"
                        onClick={() => handleSelectDevice(preset)}
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        title="Simulate this screen size interactively"
                      >
                        <Play className="w-3 h-3" />
                        <span>Simulate Size</span>
                      </button>

                      {/* Secondary Button: Open Real Popup Window */}
                      <button
                        type="button"
                        onClick={() => handleOpenRealWindow(preset)}
                        className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-blue-500/20 transition-all cursor-pointer"
                        title={`Open dedicated browser popup window at ${preset.width}×${preset.height} px`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── TAB 2: LIVE DEVICE VIEWPORT SIMULATOR ── */}
        {activeTab === 'simulator' && (
          <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
            {/* Simulator Controls Toolbar */}
            <div className="p-3 rounded-2xl bg-[#07101F] border border-blue-500/20 flex flex-wrap items-center justify-between gap-2 shrink-0">
              {/* Device Selector & Orientation */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedDevice.id}
                  onChange={(e) => {
                    const found = DEVICE_PRESETS.find((d) => d.id === e.target.value)
                    if (found) setSelectedDevice(found)
                  }}
                  className="bg-[#0C162B] text-white text-xs px-3 py-1.5 rounded-xl border border-blue-500/30 focus:outline-none cursor-pointer"
                >
                  {DEVICE_PRESETS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.width}×{d.height})
                    </option>
                  ))}
                </select>

                {/* Rotate Orientation Button */}
                <button
                  type="button"
                  onClick={() => setIsLandscape(!isLandscape)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#0C162B] hover:bg-blue-600/20 text-sky-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Rotate Device Orientation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
                </button>

                {/* Scale Selector */}
                <div className="flex items-center gap-1 text-xs text-slate-400 bg-[#0C162B] px-2 py-1 rounded-xl border border-blue-500/20">
                  <span>Scale:</span>
                  {[0.5, 0.7, 0.85, 1.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSimulatorScale(s)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        simulatorScale === s ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {Math.round(s * 100)}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Module URL Switcher & Real Window Button */}
              <div className="flex items-center gap-2">
                <select
                  value={simulatorPath}
                  onChange={(e) => setSimulatorPath(e.target.value)}
                  className="bg-[#0C162B] text-white text-xs px-2.5 py-1.5 rounded-xl border border-blue-500/30 focus:outline-none cursor-pointer"
                >
                  {APP_MODULES.map((m) => (
                    <option key={m.path} value={m.path}>
                      {m.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleOpenRealWindow(selectedDevice)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1E50DA] text-white text-xs font-bold flex items-center gap-1.5 hover:brightness-110 shadow-sm cursor-pointer"
                  title="Open real browser window at these exact dimensions"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch Pop-up</span>
                </button>
              </div>
            </div>

            {/* Interactive Viewport Frame Area */}
            <div className="flex-1 bg-[#050B14] rounded-2xl border border-blue-500/20 p-4 flex justify-center items-start overflow-auto shadow-inner">
              <div
                style={{
                  width: `${simWidth * simulatorScale}px`,
                  height: `${simHeight * simulatorScale}px`,
                  transition: 'all 0.2s ease-out'
                }}
                className="relative bg-black rounded-3xl p-2 shadow-2xl border-4 border-slate-700/80 flex flex-col shrink-0"
              >
                {/* Notch / Speaker representation for phones */}
                {selectedDevice.category === 'phone' && !isLandscape && (
                  <div className="w-24 h-3.5 bg-black rounded-b-xl mx-auto absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                  </div>
                )}

                {/* Simulated Header info pill */}
                <div className="bg-[#0C162B] text-slate-300 text-[10px] px-2 py-0.5 rounded-t-xl flex items-center justify-between border-b border-white/10 shrink-0">
                  <span className="font-semibold truncate">{selectedDevice.name}</span>
                  <span className="font-mono text-sky-400">
                    {simWidth} × {simHeight} px
                  </span>
                </div>

                {/* The Real Interactive iFrame running the actual page */}
                <div className="flex-1 relative overflow-hidden bg-white rounded-b-xl">
                  <iframe
                    src={simulatorPath}
                    title="Live Device Viewport Tester"
                    className="w-full h-full border-0 select-auto"
                    style={{
                      transformOrigin: 'top left',
                      width: `${simWidth}px`,
                      height: `${simHeight}px`,
                      transform: `scale(${simulatorScale})`,
                      pointerEvents: 'auto'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: MODULE SPECIFICATIONS BREAKDOWN ── */}
        {activeTab === 'matrix' && (
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            <h4 className="text-xs font-bold text-slate-300">
              Cross-Platform Module Architecture Breakdown
            </h4>
            <div className="space-y-2">
              {[
                {
                  name: 'AI Resume Builder',
                  path: '/resume-builder',
                  desc: 'Split-screen side-by-side on desktop (>=1024px); 3-tab responsive switcher on mobile (<1024px) with dedicated 1-page A4 PDF exporter.'
                },
                {
                  name: 'AI Resume Analyzer',
                  path: '/resume-analyzer',
                  desc: 'Dual-panel layout with circular neon score gauge, full responsive drag & drop upload, and touch-scrollable category audits.'
                },
                {
                  name: 'AI Cover Letter Generator',
                  path: '/cover-letter',
                  desc: 'Side-by-side synthesis form & live markdown editor on desktop; single-column touch wizard on smartphones.'
                },
                {
                  name: 'Simple & LTPS Attendance Calculators',
                  path: '/simple & /ltps',
                  desc: 'Touch numerical sliders, thumb-accessible fast attendance calculators, and responsive credit matrix tables.'
                },
                {
                  name: 'Screenshot OCR & ERP Login',
                  path: '/screenshot & /login',
                  desc: 'Camera capture on mobile; drag-and-drop table parsing on desktops; touch CAPTCHA refresh.'
                }
              ].map((m, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#07101F] border border-blue-500/15 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-poppins">{m.name}</span>
                    <span className="font-mono text-[10px] text-sky-400">{m.path}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="pt-2 border-t border-blue-500/15 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">All 17 standard hardware presets support live simulation &amp; pop-up windows.</span>
            <span className="sm:hidden">17 hardware presets supported.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
