'use client'

import React, { useState } from 'react'
import {
  GitHubProfileData,
  GitHubReadmeStyle,
  GitHubRepoItem
} from '@/types/github'
import { generateProfileReadme } from '@/lib/github/readme-generator'
import { UniversalJobRoleSelector } from '@/components/shared/universal-job-role-selector'
import {
  User, FileText, BookOpen, Layers, Star, Plus, Trash2,
  Sparkles, ExternalLink, ShieldCheck, Check, Copy, Flame,
  Globe, Code, Eye, RefreshCw
} from 'lucide-react'

interface EditorTabsProps {
  data: GitHubProfileData
  onChange: (updated: Partial<GitHubProfileData>) => void
}

type TabType = 'profile' | 'readme' | 'repos' | 'techstack' | 'activity'

export function EditorTabs({ data, onChange }: EditorTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [newSkillCategory, setNewSkillCategory] = useState<'languages' | 'frameworks' | 'databases' | 'cloudDevOps' | 'aiMl' | 'tools'>('languages')
  const [newSkillInput, setNewSkillInput] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Regenerate README using selected style
  const handleRegenerateReadme = (style: GitHubReadmeStyle) => {
    const nextReadme = generateProfileReadme({ ...data, readmeStyle: style }, style)
    onChange({ readmeStyle: style, readmeContent: nextReadme })
  }

  // Update repository item
  const handleUpdateRepo = (id: string, updates: Partial<GitHubRepoItem>) => {
    const updatedList = (data.repositories || []).map((r) =>
      r.id === id ? { ...r, ...updates } : r
    )
    onChange({ repositories: updatedList })
  }

  // Add new repository
  const handleAddRepo = () => {
    const newRepo: GitHubRepoItem = {
      id: `repo-${Date.now()}`,
      name: 'new-awesome-project',
      description: 'Production-ready full-stack application built with modern architecture.',
      language: 'TypeScript',
      stars: 12,
      forks: 3,
      topics: ['typescript', 'fullstack', 'react'],
      isPinned: true,
      hasReadme: true,
      hasLicense: true,
      hasLiveDemo: false,
      license: 'MIT',
      healthScore: 85,
      recommendations: ['Deploy a live demo link', 'Add sample environment variables (.env.example)']
    }
    onChange({ repositories: [newRepo, ...(data.repositories || [])] })
  }

  // Delete repository
  const handleDeleteRepo = (id: string) => {
    onChange({ repositories: (data.repositories || []).filter((r) => r.id !== id) })
  }

  // Add new tech stack skill
  const handleAddTechSkill = () => {
    if (!newSkillInput.trim()) return
    const cat = newSkillCategory
    const existing = data.techStack?.[cat] || []
    if (!existing.includes(newSkillInput.trim())) {
      onChange({
        techStack: {
          ...data.techStack,
          [cat]: [...existing, newSkillInput.trim()]
        }
      })
    }
    setNewSkillInput('')
  }

  // Remove skill
  const handleRemoveSkill = (category: keyof GitHubProfileData['techStack'], skill: string) => {
    const existing = data.techStack?.[category] || []
    onChange({
      techStack: {
        ...data.techStack,
        [category]: existing.filter((s) => s !== skill)
      }
    })
  }

  return (
    <div className="space-y-4 font-outfit">
      {/* ── NAVIGATION PILLS ── */}
      <div className="flex border-b border-blue-500/20 bg-[#0C162B] p-1.5 rounded-2xl gap-1 overflow-x-auto">
        {[
          { id: 'profile', label: 'Profile Info', icon: User },
          { id: 'readme', label: 'README Studio', icon: FileText },
          { id: 'repos', label: `Repositories (${data.repositories?.length || 0})`, icon: BookOpen },
          { id: 'techstack', label: 'Tech Stack', icon: Layers },
          { id: 'activity', label: 'Open Source', icon: Flame }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── TAB 1: PROFILE INFO ── */}
      {activeTab === 'profile' && (
        <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Developer Profile Information
            </h4>
            <span className="text-[11px] text-slate-400">Recruiter Headline Settings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">GitHub Username *</label>
              <input
                type="text"
                value={data.username}
                onChange={(e) => onChange({ username: e.target.value })}
                placeholder="e.g. alexjohnson-dev"
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Display Name *</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="e.g. Alex Johnson"
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Target Role Selector using UniversalJobRoleSelector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Target Engineering Role *</label>
            <UniversalJobRoleSelector
              value={data.targetRole}
              onChange={(role) => onChange({ targetRole: role })}
              placeholder="Select or search 200+ roles, or type custom..."
              id="github-target-role"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">GitHub Bio *</label>
              <span className={`text-[11px] font-mono ${data.bio.length > 160 ? 'text-red-400' : 'text-slate-400'}`}>
                {data.bio.length} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={data.bio}
              onChange={(e) => onChange({ bio: e.target.value })}
              placeholder="Brief bio describing your engineering specialization and goals..."
              className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Location</label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => onChange({ location: e.target.value })}
                placeholder="e.g. San Francisco, CA"
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Team</label>
              <input
                type="text"
                value={data.company}
                onChange={(e) => onChange({ company: e.target.value })}
                placeholder="e.g. @AcmeCloud"
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Portfolio Website</label>
              <input
                type="text"
                value={data.website}
                onChange={(e) => onChange({ website: e.target.value })}
                placeholder="e.g. https://alexjohnson.dev"
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={data.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  onChange({ socialLinks: { ...data.socialLinks, linkedin: e.target.value } })
                }
                placeholder="linkedin.com/in/username"
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Twitter / X Handle</label>
              <input
                type="text"
                value={data.socialLinks?.twitter || ''}
                onChange={(e) =>
                  onChange({ socialLinks: { ...data.socialLinks, twitter: e.target.value } })
                }
                placeholder="@username"
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Public Email</label>
              <input
                type="email"
                value={data.socialLinks?.email || ''}
                onChange={(e) =>
                  onChange({ socialLinks: { ...data.socialLinks, email: e.target.value } })
                }
                placeholder="dev@example.com"
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: README STUDIO ── */}
      {activeTab === 'readme' && (
        <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                README.md Generator &amp; Style Switcher
              </h4>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">6 Curated Styles</span>
          </div>

          {/* Style Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'neon-developer', label: 'Neon Developer', desc: 'Animated typing SVG, badges & stats' },
              { id: 'corporate-engineer', label: 'Corporate Engineer', desc: 'Executive tables & competencies' },
              { id: 'faang-sde', label: 'FAANG SDE', desc: 'Metrics, latency numbers & stack matrix' },
              { id: 'minimalist', label: 'Minimalist Clean', desc: 'Pure distraction-free markdown' },
              { id: 'open-source-hero', label: 'Open Source Hero', desc: 'Community stars, PRs & git install' },
              { id: 'student-fresher', label: 'Student / Fresher', desc: 'Academics, capstones & eager learner' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleRegenerateReadme(st.id as GitHubReadmeStyle)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  data.readmeStyle === st.id
                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30'
                    : 'bg-[#07101F] text-slate-300 hover:text-white border-white/5 hover:border-blue-500/30'
                }`}
              >
                <span className="block text-xs font-bold">{st.label}</span>
                <span className={`block text-[10px] line-clamp-1 mt-0.5 ${
                  data.readmeStyle === st.id ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  {st.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Markdown Code Editor */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold font-mono">README.md Markdown Content</span>
              <button
                type="button"
                onClick={() => handleCopy(data.readmeContent, 'readme')}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                {copiedKey === 'readme' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'readme' ? 'Copied!' : 'Copy Markdown'}</span>
              </button>
            </div>
            <textarea
              rows={12}
              value={data.readmeContent}
              onChange={(e) => onChange({ readmeContent: e.target.value })}
              className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl p-3 text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>
      )}

      {/* ── TAB 3: REPOSITORIES & PINNED ── */}
      {activeTab === 'repos' && (
        <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Repository Curation &amp; Pinned Showcase
              </h4>
              <p className="text-[11px] text-slate-400">
                Pin 4-6 flagship repositories. Recruiters evaluate project depth and live demos.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddRepo}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Repository</span>
            </button>
          </div>

          <div className="space-y-3">
            {(data.repositories || []).map((repo) => (
              <div
                key={repo.id}
                className="p-4 rounded-xl bg-[#07101F] border border-white/10 space-y-3 transition hover:border-blue-500/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateRepo(repo.id, { isPinned: !repo.isPinned })}
                      className={`p-1.5 rounded-lg border transition ${
                        repo.isPinned
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-white/5 text-slate-500 border-white/5 hover:text-amber-300'
                      }`}
                      title={repo.isPinned ? 'Pinned on profile' : 'Click to pin on profile'}
                    >
                      <Star className={`w-3.5 h-3.5 ${repo.isPinned ? 'fill-amber-400' : ''}`} />
                    </button>
                    <input
                      type="text"
                      value={repo.name}
                      onChange={(e) => handleUpdateRepo(repo.id, { name: e.target.value })}
                      placeholder="repository-name"
                      className="bg-[#0C162B] border border-blue-500/20 rounded-lg px-2.5 py-1 text-white text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400">({repo.language})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-sky-400 border border-blue-500/30">
                      Health: {repo.healthScore}%
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteRepo(repo.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition"
                      title="Delete repository"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Recruiter Description
                  </label>
                  <textarea
                    rows={2}
                    value={repo.description}
                    onChange={(e) => handleUpdateRepo(repo.id, { description: e.target.value })}
                    placeholder="Problem solved, architectural approach, and measurable latency or throughput numbers..."
                    className="w-full bg-[#0C162B] border border-white/10 rounded-lg p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10.5px] text-slate-400 block mb-0.5">Live Demo URL</label>
                    <input
                      type="text"
                      value={repo.demoUrl || ''}
                      onChange={(e) =>
                        handleUpdateRepo(repo.id, {
                          demoUrl: e.target.value,
                          hasLiveDemo: Boolean(e.target.value)
                        })
                      }
                      placeholder="https://task-queue.alexjohnson.dev"
                      className="w-full bg-[#0C162B] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10.5px] text-slate-400 block mb-0.5">Topics / Tags (comma separated)</label>
                    <input
                      type="text"
                      value={(repo.topics || []).join(', ')}
                      onChange={(e) =>
                        handleUpdateRepo(repo.id, {
                          topics: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                        })
                      }
                      placeholder="distributed-systems, redis, python"
                      className="w-full bg-[#0C162B] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: TECH STACK VISUALIZER ── */}
      {activeTab === 'techstack' && (
        <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Modern Tech Stack &amp; Badge Visualizer
            </h4>
            <span className="text-[11px] text-slate-400">Structured by Technical Domain</span>
          </div>

          {/* Add New Skill Input */}
          <div className="p-3 rounded-xl bg-[#07101F] border border-white/10 flex flex-wrap items-center gap-2">
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as any)}
              className="bg-[#0C162B] border border-blue-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="languages">Languages</option>
              <option value="frameworks">Frameworks & Libs</option>
              <option value="databases">Databases & Storage</option>
              <option value="cloudDevOps">Cloud & DevOps</option>
              <option value="aiMl">AI & Machine Learning</option>
              <option value="tools">Tools & Utilities</option>
            </select>

            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTechSkill()}
              placeholder="e.g. Qdrant, Docker, FastAPI..."
              className="flex-1 bg-[#0C162B] border border-blue-500/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={handleAddTechSkill}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Grouped Tags */}
          <div className="space-y-3">
            {[
              { key: 'languages', title: 'Programming Languages' },
              { key: 'frameworks', title: 'Frameworks & Libraries' },
              { key: 'databases', title: 'Databases & In-Memory Stores' },
              { key: 'cloudDevOps', title: 'Cloud & Infrastructure (DevOps)' },
              { key: 'aiMl', title: 'AI & Data Engineering' },
              { key: 'tools', title: 'Developer Tools' }
            ].map(({ key, title }) => {
              const list = data.techStack?.[key as keyof GitHubProfileData['techStack']] || []
              return (
                <div key={key} className="p-3 rounded-xl bg-[#07101F] border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span>{title}</span>
                    <span className="text-[10px] text-slate-500">{list.length} tagged</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {list.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg text-xs bg-[#0C162B] border border-blue-500/20 text-slate-200 flex items-center gap-1.5 group"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(key as any, item)}
                          className="text-slate-500 hover:text-red-400 transition"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {list.length === 0 && (
                      <span className="text-xs text-slate-500 italic">No skills listed yet</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── TAB 5: OPEN SOURCE & ACTIVITY ── */}
      {activeTab === 'activity' && (
        <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Open Source Readiness &amp; Contribution Signals
            </h4>
            <span className="text-[11px] text-slate-400">Recruiter Activity Stats</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Contributions in Last Year
              </label>
              <input
                type="number"
                value={data.contributionsLastYear}
                onChange={(e) => onChange({ contributionsLastYear: Number(e.target.value) || 0 })}
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Current Contribution Streak (Days)
              </label>
              <input
                type="number"
                value={data.streakDays}
                onChange={(e) => onChange({ streakDays: Number(e.target.value) || 0 })}
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Open To Work Toggle */}
          <div className="p-3 rounded-xl bg-[#07101F] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Open to Work / Actively Interviewing</span>
              <span className="text-[11px] text-slate-400">
                Displays active recruiting beacon in your GitHub profile header and README
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChange({ openToWork: !data.openToWork })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                data.openToWork ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  data.openToWork ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
