'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Sparkles, Download, Copy, Check, FileText, Upload,
  RefreshCw, Eye, Sliders, Award, TrendingUp, FileCode,
  FileDown, BookOpen, Layers
} from 'lucide-react'
import { GitHubProfileData } from '@/types/github'
import { DEFAULT_GITHUB_PROFILE } from '@/lib/github/default-data'
import { calculateGitHubScore } from '@/lib/github/optimizer-engine'
import { downloadFile } from '@/lib/github/import-export'
import { ProfilePreview } from '@/components/github/profile-preview'
import { ScoreDashboard } from '@/components/github/score-dashboard'
import { EditorTabs } from '@/components/github/editor-tabs'
import { ImportModal } from '@/components/github/import-modal'

export default function GitHubOptimizerPage() {
  const [profileData, setProfileData] = useState<GitHubProfileData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('aethercv_github_profile_v1')
        if (cached) return JSON.parse(cached)
      } catch {
        // fallback
      }
    }
    return DEFAULT_GITHUB_PROFILE
  })

  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [copiedReadme, setCopiedReadme] = useState(false)
  const [activeMobileView, setActiveMobileView] = useState<'editor' | 'preview' | 'score'>('editor')
  const [exportMenuOpen, setExportMenuOpen] = useState(false)

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem('aethercv_github_profile_v1', JSON.stringify(profileData))
    } catch {
      // ignore
    }
  }, [profileData])

  // Recalculate score reactively
  const scoreReport = useMemo(() => {
    return calculateGitHubScore(profileData)
  }, [profileData])

  // Copy README markdown
  const handleCopyReadme = () => {
    navigator.clipboard.writeText(profileData.readmeContent)
    setCopiedReadme(true)
    setTimeout(() => setCopiedReadme(false), 2000)
  }

  // Export handlers
  const handleExportReadme = () => {
    downloadFile(
      profileData.readmeContent,
      `${profileData.username || 'README'}_README.md`,
      'text/markdown;charset=utf-8'
    )
    setExportMenuOpen(false)
  }

  const handleExportTxt = () => {
    const txt = `GITHUB PROFILE PORTFOLIO SPECIFICATION\nUsername: ${profileData.username}\nName: ${profileData.name}\nTarget Role: ${profileData.targetRole}\nBio: ${profileData.bio}\nWebsite: ${profileData.website}\n\n=== REPOSITORIES ===\n` +
      profileData.repositories
        .map((r) => `* ${r.name} (${r.language}) - ${r.description} [Stars: ${r.stars}, Forks: ${r.forks}]\n  Demo: ${r.demoUrl || 'N/A'}`)
        .join('\n\n')
    downloadFile(txt, `${profileData.username || 'github'}_portfolio.txt`, 'text/plain;charset=utf-8')
    setExportMenuOpen(false)
  }

  // Inject missing skill
  const handleAddSkill = (skill: string) => {
    const existing = profileData.techStack.languages || []
    if (!existing.includes(skill)) {
      setProfileData((prev) => ({
        ...prev,
        techStack: {
          ...prev.techStack,
          languages: [...existing, skill]
        }
      }))
    }
  }

  // Reset to default demo
  const handleResetDemo = () => {
    if (confirm('Reset to default recruiter-tested demo GitHub profile?')) {
      setProfileData(DEFAULT_GITHUB_PROFILE)
    }
  }

  return (
    <div className="min-h-screen bg-[#07101F] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#0A1322]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  GitHub Profile Optimizer
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <Award className="w-3 h-3" /> Developer AI
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {scoreReport.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                README generators, repository curation, readiness analytics &amp; live preview
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Import Button */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition cursor-pointer"
              title="Import from Resume Builder, Paste text, or Upload PDF"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>Import</span>
            </button>

            {/* Copy README */}
            <button
              onClick={handleCopyReadme}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer ${
                copiedReadme
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
            >
              {copiedReadme ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReadme ? 'Copied README!' : 'Copy README.md'}</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#162440] hover:bg-[#1C2F52] border border-blue-500/30 text-xs font-semibold text-blue-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              {exportMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0B1528] border border-blue-500/30 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setExportMenuOpen(false)}
                >
                  <button
                    onClick={handleExportReadme}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-blue-600/20 hover:text-white rounded-lg transition"
                  >
                    <FileCode className="w-4 h-4 text-sky-400" />
                    <span>Download README.md</span>
                  </button>
                  <button
                    onClick={handleExportTxt}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-blue-600/20 hover:text-white rounded-lg transition"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Portfolio Text (.txt)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Reset */}
            <button
              onClick={handleResetDemo}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
              title="Reset Demo Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="lg:hidden flex border-t border-white/5 bg-[#07101F] px-4 py-1.5 gap-2">
          {[
            { id: 'editor', label: 'Editor & Studio', icon: Sliders },
            { id: 'preview', label: 'Live GitHub Preview', icon: Eye },
            { id: 'score', label: `Score (${scoreReport.overallScore})`, icon: TrendingUp }
          ].map((v) => {
            const Icon = v.icon
            const isActive = activeMobileView === v.id
            return (
              <button
                key={v.id}
                onClick={() => setActiveMobileView(v.id as any)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{v.label}</span>
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Editor & Score Dashboard */}
          <div
            className={`space-y-6 lg:col-span-7 ${
              activeMobileView === 'preview' ? 'hidden lg:block' : ''
            }`}
          >
            {/* Score Dashboard */}
            <div className={activeMobileView === 'editor' ? 'block' : activeMobileView === 'score' ? 'block' : 'hidden lg:block'}>
              <ScoreDashboard
                report={scoreReport}
                onAddSkill={handleAddSkill}
              />
            </div>

            {/* Editor Tabs */}
            <div className={activeMobileView === 'score' ? 'hidden lg:block' : 'block'}>
              <EditorTabs
                data={profileData}
                onChange={(updated) => setProfileData((prev) => ({ ...prev, ...updated }))}
              />
            </div>
          </div>

          {/* Right Column: Live Sticky GitHub Profile Preview */}
          <div
            className={`lg:col-span-5 lg:sticky lg:top-20 space-y-4 ${
              activeMobileView !== 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live GitHub Preview
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Real-Time Desktop View
              </span>
            </div>

            {/* Authentic GitHub Card */}
            <ProfilePreview
              data={profileData}
              onCopyReadme={handleCopyReadme}
            />

            {/* Helper Tip */}
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Open Source Tip: </span>
                Click the <strong>Copy README.md</strong> button to paste directly into your GitHub special repository (<code className="text-sky-300">username/username</code>).
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A1322] py-4 text-center text-xs text-slate-500">
        <p>AETHERCV AI GitHub Profile Optimizer • Recruiter Appeal &amp; Open Source Visibility Engine</p>
      </footer>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(newData) => {
          setProfileData((prev) => ({
            ...prev,
            ...newData
          }))
        }}
      />
    </div>
  )
}
