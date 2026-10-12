'use client'

import React, { useState } from 'react'
import {
  LinkedInProfileData,
  TargetRole,
  HeadlineStyle,
  AboutStyle
} from '@/types/linkedin'
import {
  generateHeadlines,
  generateAboutSection,
  rewriteBulletToStar
} from '@/lib/linkedin/optimizer-engine'
import {
  Sparkles, Type, FileText, Briefcase, Award, Check, Copy,
  Plus, Trash2, ArrowRight, UserCheck, ShieldCheck, Zap
} from 'lucide-react'

interface EditorTabsProps {
  data: LinkedInProfileData
  onChange: (updated: Partial<LinkedInProfileData>) => void
  targetRole?: TargetRole
  onRoleChange?: (role: TargetRole) => void
}

export function EditorTabs({ data, onChange, targetRole, onRoleChange }: EditorTabsProps) {
  const [activeTab, setActiveTab] = useState<'headline' | 'about' | 'experience' | 'projects' | 'skills' | 'personal'>('headline')

  // Headline Generator States
  const [headlineRole, setHeadlineRole] = useState<TargetRole>(targetRole || 'software-engineer')
  const [headlineStyle, setHeadlineStyle] = useState<HeadlineStyle>('professional')
  const [generatedHeadlines, setGeneratedHeadlines] = useState<string[]>([])

  // About Generator States
  const [aboutRole, setAboutRole] = useState<TargetRole>(targetRole || 'software-engineer')
  const [aboutStyle, setAboutStyle] = useState<AboutStyle>('professional')
  const [generatedAbout, setGeneratedAbout] = useState<string>('')

  // New Skill Input State
  const [newSkillInput, setNewSkillInput] = useState<string>('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Trigger headline generation
  const handleGenerateHeadlines = () => {
    const list = generateHeadlines(headlineRole, headlineStyle, data.fullName, data.experience[0]?.company || 'Tech')
    setGeneratedHeadlines(list)
  }

  // Trigger about generation
  const handleGenerateAbout = () => {
    const text = generateAboutSection(aboutRole, aboutStyle, data)
    setGeneratedAbout(text)
  }

  // Add skill
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return
    const trimmed = newSkillInput.trim()
    if (!data.skills.includes(trimmed)) {
      onChange({ skills: [...data.skills, trimmed] })
    }
    setNewSkillInput('')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange({ skills: data.skills.filter((s) => s !== skillToRemove) })
  }

  return (
    <div className="space-y-4 font-outfit">
      {/* ── Sub Navigation Tabs ── */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#07101F] border border-blue-500/20 text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('headline')}
          className={`py-1.5 px-3 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'headline'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Headline Studio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`py-1.5 px-3 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>About Section</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('experience')}
          className={`py-1.5 px-3 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'experience'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Experience (STAR)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`py-1.5 px-3 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Projects</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`py-1.5 px-3 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'skills'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Skills &amp; SEO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`py-1.5 px-3 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'personal'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Open To Work</span>
        </button>
      </div>

      {/* ── TAB 1: HEADLINE STUDIO ── */}
      {activeTab === 'headline' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-poppins text-slate-200">
                Current Headline
              </label>
              <span className={`text-[11px] font-mono font-semibold ${
                data.headline.length > 220 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {data.headline.length} / 220 max chars
              </span>
            </div>

            <textarea
              rows={3}
              value={data.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-blue-500 resize-none"
              placeholder="e.g. Software Engineer @ Acme | Building Scalable Distributed Systems | Python • AWS"
            />
          </div>

          {/* AI Headline Generator */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0C162B] to-indigo-950/40 border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-bold font-poppins text-white">
                  AI Recruiter Headline Generator
                </h4>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">6 Writing Styles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Target Role</label>
                <select
                  value={headlineRole}
                  onChange={(e) => setHeadlineRole(e.target.value as TargetRole)}
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="software-engineer">Software Engineer</option>
                  <option value="ai-engineer">AI Engineer & LLMs</option>
                  <option value="full-stack">Full Stack Developer</option>
                  <option value="data-scientist">Data Scientist</option>
                  <option value="cloud-engineer">Cloud Engineer</option>
                  <option value="product-manager">Product Manager</option>
                  <option value="devops-engineer">DevOps Engineer</option>
                  <option value="cyber-security">Cyber Security</option>
                  <option value="frontend-developer">Frontend Engineer</option>
                  <option value="backend-developer">Backend Engineer</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Writing Style</label>
                <select
                  value={headlineStyle}
                  onChange={(e) => setHeadlineStyle(e.target.value as HeadlineStyle)}
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="professional">Professional Standard</option>
                  <option value="corporate">Corporate & Enterprise</option>
                  <option value="startup">Startup & 0-to-1 Builder</option>
                  <option value="faang">FAANG & High Concurrency</option>
                  <option value="student">Student / Fresher Seeking Roles</option>
                  <option value="experienced">Senior / Lead Architect</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateHeadlines}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1E50DA] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Generate Recruiter Headlines</span>
            </button>

            {/* Generated Headlines List */}
            {generatedHeadlines.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-blue-500/15">
                <span className="text-[11px] font-bold text-sky-300 block">Select a Headline to Apply:</span>
                {generatedHeadlines.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#07101F] border border-blue-500/20 hover:border-blue-500/40 space-y-2 text-xs"
                  >
                    <p className="text-slate-200 leading-relaxed font-medium">{h}</p>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400 font-mono">{h.length} chars</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(h, `gen-h-${i}`)}
                          className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === `gen-h-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onChange({ headline: h })}
                          className="px-2.5 py-1 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white font-bold cursor-pointer"
                        >
                          Use Headline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: ABOUT SECTION STUDIO ── */}
      {activeTab === 'about' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-poppins text-slate-200">
                About Summary Content
              </label>
              <span className={`text-[11px] font-mono font-semibold ${
                data.about.length > 2600 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {data.about.length} / 2,600 max chars
              </span>
            </div>

            <textarea
              rows={8}
              value={data.about}
              onChange={(e) => onChange({ about: e.target.value })}
              className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-blue-500 resize-y"
              placeholder="Write your professional career story, core achievements, and contact information..."
            />
          </div>

          {/* AI About Generator */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0C162B] to-indigo-950/40 border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-bold font-poppins text-white">
                  AI About Summary Generator
                </h4>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">Recruiter Formatted</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Target Role</label>
                <select
                  value={aboutRole}
                  onChange={(e) => setAboutRole(e.target.value as TargetRole)}
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="software-engineer">Software Engineer</option>
                  <option value="ai-engineer">AI Engineer & LLMs</option>
                  <option value="full-stack">Full Stack Developer</option>
                  <option value="data-scientist">Data Scientist</option>
                  <option value="cloud-engineer">Cloud Engineer</option>
                  <option value="product-manager">Product Manager</option>
                  <option value="devops-engineer">DevOps Engineer</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Summary Tone</label>
                <select
                  value={aboutStyle}
                  onChange={(e) => setAboutStyle(e.target.value as AboutStyle)}
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="professional">Professional Standard</option>
                  <option value="executive">Executive Summary</option>
                  <option value="startup">Startup & High Velocity</option>
                  <option value="corporate">Corporate Enterprise</option>
                  <option value="recruiter">Recruiter Hook & Bulleted</option>
                  <option value="student">Student / Early Career</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateAbout}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1E50DA] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Generate Recruiter About Section</span>
            </button>

            {generatedAbout && (
              <div className="p-3.5 rounded-xl bg-[#07101F] border border-blue-500/25 space-y-2 text-xs">
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{generatedAbout}</p>
                <div className="pt-2 border-t border-blue-500/15 flex items-center justify-between">
                  <span className="text-slate-400 font-mono text-[11px]">{generatedAbout.length} characters</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(generatedAbout, 'gen-about')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'gen-about' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ about: generatedAbout })}
                      className="px-3 py-1 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white font-bold cursor-pointer"
                    >
                      Apply to Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: EXPERIENCE (STAR REWRITER) ── */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Work Experience Entries ({data.experience.length})
            </span>
            <span className="text-[10px] text-sky-400 font-semibold">STAR Metric Optimization</span>
          </div>

          <div className="space-y-4">
            {data.experience.map((exp, expIdx) => (
              <div key={exp.id || expIdx} className="p-4 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">Role Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...data.experience]
                        updated[expIdx].role = e.target.value
                        onChange({ experience: updated })
                      }}
                      className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...data.experience]
                        updated[expIdx].company = e.target.value
                        onChange({ experience: updated })
                      }}
                      className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Bullets with 1-click STAR Rewriter */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">
                    Achievement Bullets (Click "Optimize STAR" to add impact &amp; metrics):
                  </label>
                  {(exp.bulletPoints || []).map((bullet, bIdx) => (
                    <div key={bIdx} className="p-2.5 rounded-xl bg-[#07101F] border border-blue-500/15 space-y-1.5">
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => {
                          const updated = [...data.experience]
                          updated[expIdx].bulletPoints[bIdx] = e.target.value
                          onChange({ experience: updated })
                        }}
                        className="w-full bg-transparent text-xs text-slate-200 resize-none focus:outline-none"
                      />
                      <div className="flex items-center justify-between pt-1 border-t border-blue-500/10">
                        <button
                          type="button"
                          onClick={() => {
                            const { starBullet } = rewriteBulletToStar(bullet)
                            const updated = [...data.experience]
                            updated[expIdx].bulletPoints[bIdx] = starBullet
                            onChange({ experience: updated })
                          }}
                          className="px-2 py-0.5 rounded-md bg-blue-500/20 text-sky-300 hover:bg-blue-500/30 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-sky-400" />
                          <span>Rewrite to STAR + Metric</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: PROJECTS OPTIMIZER ── */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Featured Projects ({data.projects.length})
            </span>
            <span className="text-[10px] text-sky-400">Problem • Solution • Tech • Impact</span>
          </div>

          <div className="space-y-3">
            {data.projects.map((proj, pIdx) => (
              <div key={proj.id || pIdx} className="p-4 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">Project Title</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...data.projects]
                      updated[pIdx].title = e.target.value
                      onChange({ projects: updated })
                    }}
                    className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">Problem Addressed</label>
                    <textarea
                      rows={2}
                      value={proj.problem || ''}
                      onChange={(e) => {
                        const updated = [...data.projects]
                        updated[pIdx].problem = e.target.value
                        onChange({ projects: updated })
                      }}
                      className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl p-2 text-xs text-white resize-none"
                      placeholder="e.g. Inefficient synchronous task bottleneck during peak server load..."
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">Technical Solution</label>
                    <textarea
                      rows={2}
                      value={proj.solution || ''}
                      onChange={(e) => {
                        const updated = [...data.projects]
                        updated[pIdx].solution = e.target.value
                        onChange({ projects: updated })
                      }}
                      className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl p-2 text-xs text-white resize-none"
                      placeholder="e.g. Architected asynchronous event streams with Redis and FastAPI..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">Measurable Impact</label>
                  <input
                    type="text"
                    value={proj.impact || ''}
                    onChange={(e) => {
                      const updated = [...data.projects]
                      updated[pIdx].impact = e.target.value
                      onChange({ projects: updated })
                    }}
                    className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-emerald-300 font-semibold"
                    placeholder="e.g. Handled 5,000+ tasks/sec with 40% latency reduction..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: SKILLS & SEO OPTIMIZER ── */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-poppins text-slate-200">
                Skills &amp; Endorsements ({data.skills.length})
              </label>
              <span className="text-[10px] text-emerald-400 font-semibold">10+ Recommended</span>
            </div>

            {/* Add Skill Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Enter skill (e.g. Docker, Microservices, Python)..."
                className="flex-1 bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Add Skill
              </button>
            </div>

            {/* Current Skills Chips */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {data.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-[#07101F] border border-blue-500/20 text-xs text-slate-200 flex items-center gap-1.5"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="text-slate-400 hover:text-red-400 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: PERSONAL & OPEN TO WORK ── */}
      {activeTab === 'personal' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-3">
            <h4 className="text-xs font-bold font-poppins text-slate-200">Personal &amp; Contact Details</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">Full Name</label>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => onChange({ fullName: e.target.value })}
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">Location</label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => onChange({ location: e.target.value })}
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-0.5">Custom Public URL</label>
                <input
                  type="text"
                  value={data.customUrl}
                  onChange={(e) => onChange({ customUrl: e.target.value })}
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              {/* Open to Work Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#07101F] border border-emerald-500/30">
                <div>
                  <span className="font-bold text-xs text-emerald-300 block">#OpenToWork Badge</span>
                  <span className="text-[10px] text-slate-400">Show recruiters you are actively interviewing</span>
                </div>
                <input
                  type="checkbox"
                  checked={data.openToWork}
                  onChange={(e) => onChange({ openToWork: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
