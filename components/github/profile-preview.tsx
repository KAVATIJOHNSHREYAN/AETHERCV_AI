'use client'

import React, { useState } from 'react'
import { GitHubProfileData } from '@/types/github'
import {
  BookOpen, Star, GitFork, MapPin, Link as LinkIcon,
  Twitter, Mail, Award, Check, Copy, Flame, Calendar,
  Code, Eye, ExternalLink, Shield, CheckCircle2, ChevronRight
} from 'lucide-react'

// Language color dots matching GitHub standard
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  HCL: '#844FBA',
  Shell: '#89e051',
  Solidity: '#AA6746'
}

interface ProfilePreviewProps {
  data: GitHubProfileData
  onCopyReadme?: () => void
}

export function ProfilePreview({ data, onCopyReadme }: ProfilePreviewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'repositories' | 'readme'>('overview')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const pinnedRepos = (data.repositories || []).filter((r) => r.isPinned)
  const reposToShow = pinnedRepos.length > 0 ? pinnedRepos : (data.repositories || []).slice(0, 4)

  return (
    <div className="rounded-2xl bg-[#0D1117] border border-[#30363D] text-[#C9D1D9] font-sans shadow-2xl overflow-hidden flex flex-col">
      {/* ── GITHUB TOP NAV BAR ── */}
      <div className="px-4 py-3 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black font-black text-xs">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
          </div>
          <span className="text-xs font-semibold text-white tracking-wide">
            github.com/{data.username || 'developer'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {data.openToWork && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#238636]/20 text-[#3FB950] border border-[#238636]/40">
              ● Open to Work
            </span>
          )}
          <span className="text-[11px] text-[#8B949E] font-mono">Live Preview</span>
        </div>
      </div>

      {/* ── GITHUB PROFILE TABS ── */}
      <div className="flex border-b border-[#30363D] bg-[#0D1117] px-4 gap-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: BookOpen },
          { id: 'repositories', label: `Repositories (${data.repositories?.length || 0})`, icon: Code },
          { id: 'readme', label: 'README.md', icon: Eye }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium border-b-2 transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-[#F78166] text-white font-semibold'
                  : 'border-transparent text-[#8B949E] hover:text-[#C9D1D9] hover:border-[#8B949E]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── MAIN PROFILE BODY ── */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar (GitHub User Card) */}
        <div className="md:col-span-4 space-y-4">
          {/* Avatar & Names */}
          <div className="flex flex-row md:flex-col items-center md:items-start gap-4">
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#21262D] border-2 border-[#30363D] relative shrink-0 shadow-lg">
              {data.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.avatarUrl} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-blue-600 to-indigo-700">
                  {(data.name || data.username || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-0.5">
              <h2 className="text-lg md:text-xl font-bold text-white leading-tight">
                {data.name || 'Your Name'}
              </h2>
              <p className="text-xs text-[#8B949E] font-mono">
                {data.username || 'username'}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <p className="text-xs text-[#C9D1D9] leading-relaxed">
              {data.bio || 'Add a bio to tell the world about your engineering interests.'}
            </p>
            <button
              onClick={() => handleCopy(data.bio, 'bio')}
              className="text-[10px] text-[#58A6FF] hover:underline flex items-center gap-1"
            >
              {copiedField === 'bio' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedField === 'bio' ? 'Copied Bio!' : 'Copy Bio'}</span>
            </button>
          </div>

          {/* Meta Details */}
          <div className="space-y-1.5 text-xs text-[#8B949E] pt-2 border-t border-[#30363D]">
            {data.company && (
              <div className="flex items-center gap-2 truncate">
                <span className="text-slate-400">🏢</span>
                <span className="text-slate-200">{data.company}</span>
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{data.location}</span>
              </div>
            )}
            {data.website && (
              <div className="flex items-center gap-2 truncate">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                <a href={data.website} target="_blank" rel="noreferrer" className="text-[#58A6FF] hover:underline truncate">
                  {data.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {data.socialLinks?.twitter && (
              <div className="flex items-center gap-2 truncate">
                <Twitter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#58A6FF]">@{data.socialLinks.twitter.replace(/^@/, '')}</span>
              </div>
            )}
            {data.socialLinks?.email && (
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-300">{data.socialLinks.email}</span>
              </div>
            )}
          </div>

          {/* Achievements Badges */}
          <div className="space-y-1.5 pt-2 border-t border-[#30363D]">
            <span className="text-[11px] font-bold text-white block">Achievements</span>
            <div className="flex flex-wrap gap-1.5">
              {(data.achievements || []).map((ach) => (
                <span
                  key={ach}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#21262D] border border-[#30363D] text-amber-300 flex items-center gap-1"
                >
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>{ach}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Column */}
        <div className="md:col-span-8 space-y-5">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Profile README Container (Simulating username/username box) */}
              <div className="rounded-xl border border-[#30363D] bg-[#161B22] overflow-hidden shadow-sm">
                <div className="px-4 py-2 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#8B949E] font-mono">
                    <span>{data.username || 'username'}</span>
                    <span>/</span>
                    <strong className="text-white">README.md</strong>
                  </div>
                  <button
                    onClick={onCopyReadme}
                    className="p-1 hover:bg-[#30363D] rounded text-[#8B949E] hover:text-white transition flex items-center gap-1 text-[11px]"
                    title="Copy full README markdown"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy README</span>
                  </button>
                </div>

                <div className="p-4 sm:p-5 text-xs text-[#C9D1D9] prose prose-invert max-w-none space-y-3 font-sans leading-relaxed">
                  <div className="bg-[#0D1117] p-3.5 rounded-lg border border-[#30363D]/60 whitespace-pre-wrap font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto">
                    {data.readmeContent}
                  </div>
                </div>
              </div>

              {/* Pinned Repositories Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Pinned Repositories
                  </h3>
                  <span className="text-[11px] text-[#8B949E]">
                    Showing {reposToShow.length} of {data.repositories?.length || 0}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reposToShow.map((repo) => {
                    const langColor = LANGUAGE_COLORS[repo.language] || '#58A6FF'
                    return (
                      <div
                        key={repo.id}
                        className="p-3.5 rounded-xl border border-[#30363D] bg-[#161B22] hover:border-[#8B949E] transition flex flex-col justify-between space-y-2.5 group"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#58A6FF] hover:underline flex items-center gap-1.5 truncate">
                              <BookOpen className="w-3 h-3 shrink-0 text-[#8B949E]" />
                              <span className="truncate">{repo.name}</span>
                            </span>
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono text-[#8B949E] border border-[#30363D]">
                              Public
                            </span>
                          </div>

                          <p className="text-[11px] text-[#8B949E] line-clamp-2 leading-relaxed">
                            {repo.description || 'No description provided.'}
                          </p>
                        </div>

                        {/* Topics tags */}
                        {repo.topics && repo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {repo.topics.slice(0, 3).map((topic) => (
                              <span
                                key={topic}
                                className="px-1.5 py-0.2 rounded-full text-[9.5px] font-medium bg-[#1F6FEB]/15 text-[#58A6FF] hover:bg-[#1F6FEB]/25"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-[#8B949E] pt-1">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: langColor }}
                              />
                              <span>{repo.language}</span>
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Star className="w-3 h-3" />
                              <span>{repo.stars}</span>
                            </span>
                            <span className="flex items-center gap-0.5">
                              <GitFork className="w-3 h-3" />
                              <span>{repo.forks}</span>
                            </span>
                          </div>

                          {repo.demoUrl && (
                            <a
                              href={repo.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                            >
                              <span>Demo</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Contribution Activity Heatmap Mockup */}
              <div className="p-4 rounded-xl border border-[#30363D] bg-[#161B22] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">
                    {data.contributionsLastYear || 520} contributions in the last year
                  </span>
                  <span className="text-[11px] text-[#8B949E] flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span>{data.streakDays || 18} day streak</span>
                  </span>
                </div>

                {/* Heatmap grid */}
                <div className="overflow-x-auto pb-1">
                  <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
                    {Array.from({ length: 180 }).map((_, i) => {
                      // Generate simulated realistic shades of green
                      const rand = (i * 17) % 5
                      const color =
                        rand === 0
                          ? 'bg-[#161B22]'
                          : rand === 1
                          ? 'bg-[#0E4429]'
                          : rand === 2
                          ? 'bg-[#006D32]'
                          : rand === 3
                          ? 'bg-[#26A641]'
                          : 'bg-[#39D353]'
                      return <div key={i} className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#8B949E] pt-1">
                  <span>Learn how we count contributions</span>
                  <div className="flex items-center gap-1">
                    <span>Less</span>
                    <span className="w-2 h-2 rounded-sm bg-[#161B22]" />
                    <span className="w-2 h-2 rounded-sm bg-[#0E4429]" />
                    <span className="w-2 h-2 rounded-sm bg-[#006D32]" />
                    <span className="w-2 h-2 rounded-sm bg-[#26A641]" />
                    <span className="w-2 h-2 rounded-sm bg-[#39D353]" />
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REPOSITORIES LIST */}
          {activeTab === 'repositories' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  All Public Repositories ({data.repositories?.length || 0})
                </span>
              </div>

              <div className="divide-y divide-[#30363D]">
                {(data.repositories || []).map((repo) => (
                  <div key={repo.id} className="py-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#58A6FF] hover:underline flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#8B949E]" />
                        <span>{repo.name}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-sky-400 border border-blue-500/30">
                          Health: {repo.healthScore}%
                        </span>
                        {repo.license && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-[#8B949E] border border-[#30363D]">
                            {repo.license}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-[#8B949E] leading-relaxed">
                      {repo.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#8B949E] pt-1">
                      <span>{repo.language}</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" /> {repo.forks}
                      </span>
                      {repo.demoUrl && (
                        <a href={repo.demoUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STANDALONE README */}
          {activeTab === 'readme' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white font-mono">README.md Markdown Code</span>
                <button
                  onClick={onCopyReadme}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#161B22] border border-[#30363D] text-[#C9D1D9] font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {data.readmeContent}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
