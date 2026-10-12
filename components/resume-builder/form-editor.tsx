'use client'

import React, { useState } from 'react'
import {
  ResumeBuilderData,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  SkillCategory,
  CertificationEntry,
  AchievementEntry,
  LanguageEntry,
  EmploymentType,
  LanguageProficiency
} from '@/types/resume-builder'
import {
  User, FileText, GraduationCap, Briefcase, Code, Sparkles,
  Award, Globe, Heart, Plus, Trash2, Wand2, ChevronDown, ChevronUp,
  RefreshCw, Check, ArrowRight, Layers
} from 'lucide-react'
import {
  generateSummaryByRole,
  rewriteBulletPoint,
  enhanceProjectDescription,
  suggestAchievementWording,
  autoCategorizeSkills,
  TargetRole,
  WritingTone
} from '@/lib/resume-builder/ai-assistant'
import { Button } from '@/components/ui/button'

interface FormEditorProps {
  data: ResumeBuilderData
  onChange: (updated: Partial<ResumeBuilderData> | ((prev: ResumeBuilderData) => ResumeBuilderData)) => void
}

const COMMON_TECH_TAGS = [
  'Python', 'TypeScript', 'JavaScript', 'React', 'Next.js', 'FastAPI', 'Node.js',
  'Java', 'C++', 'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'Git', 'Linux', 'Tailwind CSS', 'GraphQL', 'REST APIs',
  'Qdrant', 'RAG', 'LLMs', 'PyTorch', 'TensorFlow', 'CI/CD'
]

export function FormEditor({ data, onChange }: FormEditorProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: true,
    education: true,
    projects: true,
    skills: true
  })

  // AI Modal States
  const [summaryRole, setSummaryRole] = useState<TargetRole>('Full Stack Developer')
  const [summaryTone, setSummaryTone] = useState<WritingTone>('Professional')
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [newSkillInput, setNewSkillInput] = useState('')
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('Programming Languages')

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Personal Info Handlers
  const handlePersonalInfo = (field: keyof ResumeBuilderData['personalInfo'], val: string) => {
    onChange((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: val }
    }))
  }

  // AI Summary Generator
  const handleGenerateSummary = () => {
    setIsGeneratingSummary(true)
    const skillsList = data.skills.flatMap((s) => s.skills)
    const summary = generateSummaryByRole(summaryRole, summaryTone, skillsList, data.personalInfo.professionalTitle)
    onChange({ professionalSummary: summary })
    setIsGeneratingSummary(false)
  }

  // Education Helpers
  const addEducation = () => {
    const newEdu: EducationEntry = {
      id: `edu-${Date.now()}`,
      degree: '',
      university: '',
      college: '',
      location: '',
      cgpa: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    onChange((prev) => ({ ...prev, education: [...prev.education, newEdu] }))
  }

  const updateEducation = (id: string, updates: Partial<EducationEntry>) => {
    onChange((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...updates } : e))
    }))
  }

  const deleteEducation = (id: string) => {
    onChange((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id)
    }))
  }

  // Experience Helpers
  const addExperience = () => {
    const newExp: ExperienceEntry = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      employmentType: 'full-time',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: ['Engineered scalable application features with modular architecture and high test coverage.'],
      achievements: [],
      technologiesUsed: []
    }
    onChange((prev) => ({ ...prev, experience: [...prev.experience, newExp] }))
  }

  const updateExperience = (id: string, updates: Partial<ExperienceEntry>) => {
    onChange((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, ...updates } : e))
    }))
  }

  const deleteExperience = (id: string) => {
    onChange((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id)
    }))
  }

  const addExpBullet = (expId: string) => {
    onChange((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId
          ? { ...e, responsibilities: [...e.responsibilities, 'Implemented optimized module addressing core system requirements.'] }
          : e
      )
    }))
  }

  const updateExpBullet = (expId: string, idx: number, val: string) => {
    onChange((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => {
        if (e.id !== expId) return e
        const updated = [...e.responsibilities]
        updated[idx] = val
        return { ...e, responsibilities: updated }
      })
    }))
  }

  const removeExpBullet = (expId: string, idx: number) => {
    onChange((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => {
        if (e.id !== expId) return e
        return { ...e, responsibilities: e.responsibilities.filter((_, i) => i !== idx) }
      })
    }))
  }

  const applyAIBulletRewrite = (
    expId: string,
    idx: number,
    mode: 'improve' | 'star' | 'metrics' | 'technical' | 'executive'
  ) => {
    const exp = data.experience.find((e) => e.id === expId)
    if (!exp) return
    const current = exp.responsibilities[idx] || ''
    const rewritten = rewriteBulletPoint(current, mode)
    updateExpBullet(expId, idx, rewritten)
  }

  // Projects Helpers
  const addProject = () => {
    const newProj: ProjectEntry = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      duration: '',
      role: '',
      bulletPoints: ['Architected core application logic and integrated responsive user interfaces with real-time API routes.']
    }
    onChange((prev) => ({ ...prev, projects: [...prev.projects, newProj] }))
  }

  const updateProject = (id: string, updates: Partial<ProjectEntry>) => {
    onChange((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
    }))
  }

  const deleteProject = (id: string) => {
    onChange((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }))
  }

  const addProjBullet = (projId: string) => {
    onChange((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projId
          ? { ...p, bulletPoints: [...p.bulletPoints, 'Integrated scalable microservice with sub-second response times.'] }
          : p
      )
    }))
  }

  const updateProjBullet = (projId: string, idx: number, val: string) => {
    onChange((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projId) return p
        const updated = [...p.bulletPoints]
        updated[idx] = val
        return { ...p, bulletPoints: updated }
      })
    }))
  }

  const removeProjBullet = (projId: string, idx: number) => {
    onChange((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projId) return p
        return { ...p, bulletPoints: p.bulletPoints.filter((_, i) => i !== idx) }
      })
    }))
  }

  // Skills Helpers
  const handleAutoCategorize = () => {
    const allSkills = data.skills.flatMap((s) => s.skills)
    if (allSkills.length === 0) return
    const categorized = autoCategorizeSkills(allSkills)
    onChange({ skills: categorized })
  }

  const addCustomSkill = () => {
    if (!newSkillInput.trim()) return
    const skillName = newSkillInput.trim()
    onChange((prev) => {
      const existing = [...prev.skills]
      let cat = existing.find((c) => c.category === selectedSkillCategory)
      if (cat) {
        if (!cat.skills.includes(skillName)) {
          cat.skills = [...cat.skills, skillName]
        }
      } else {
        existing.push({ category: selectedSkillCategory, skills: [skillName] })
      }
      return { ...prev, skills: existing }
    })
    setNewSkillInput('')
  }

  const removeSkill = (categoryName: string, skillName: string) => {
    onChange((prev) => ({
      ...prev,
      skills: prev.skills
        .map((cat) => (cat.category === categoryName ? { ...cat, skills: cat.skills.filter((s) => s !== skillName) } : cat))
        .filter((cat) => cat.skills.length > 0)
    }))
  }

  const toggleCommonTag = (tag: string) => {
    onChange((prev) => {
      const existing = [...prev.skills]
      const isPresent = existing.some((c) => c.skills.includes(tag))
      if (isPresent) {
        return {
          ...prev,
          skills: existing.map((c) => ({ ...c, skills: c.skills.filter((s) => s !== tag) })).filter((c) => c.skills.length > 0)
        }
      } else {
        let cat = existing[0]
        if (!cat) {
          existing.push({ category: 'Technical Skills', skills: [tag] })
        } else {
          cat.skills = [...cat.skills, tag]
        }
        return { ...prev, skills: existing }
      }
    })
  }

  // Certifications Helpers
  const addCert = () => {
    onChange((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { id: `cert-${Date.now()}`, name: '', issuer: '', issueDate: '', credentialUrl: '' }]
    }))
  }

  const updateCert = (id: string, updates: Partial<CertificationEntry>) => {
    onChange((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...updates } : c))
    }))
  }

  const deleteCert = (id: string) => {
    onChange((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id)
    }))
  }

  // Achievements Helpers
  const addAch = () => {
    onChange((prev) => ({
      ...prev,
      achievements: [
        ...prev.achievements,
        { id: `ach-${Date.now()}`, title: '', description: '', date: new Date().getFullYear().toString() }
      ]
    }))
  }

  const updateAch = (id: string, updates: Partial<AchievementEntry>) => {
    onChange((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => (a.id === id ? { ...a, ...updates } : a))
    }))
  }

  const deleteAch = (id: string) => {
    onChange((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id)
    }))
  }

  const applyAIAchievement = (id: string) => {
    const target = data.achievements.find((a) => a.id === id)
    if (!target) return
    const suggested = suggestAchievementWording(target.title, target.description)
    updateAch(id, suggested)
  }

  // Languages Helpers
  const addLanguage = () => {
    onChange((prev) => ({
      ...prev,
      languages: [...prev.languages, { id: `lang-${Date.now()}`, language: '', proficiency: 'Professional' }]
    }))
  }

  const updateLanguage = (id: string, updates: Partial<LanguageEntry>) => {
    onChange((prev) => ({
      ...prev,
      languages: prev.languages.map((l) => (l.id === id ? { ...l, ...updates } : l))
    }))
  }

  const deleteLanguage = (id: string) => {
    onChange((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id)
    }))
  }

  return (
    <div className="space-y-4 font-outfit text-sm">
      {/* ──────────────── STEP 1: PERSONAL INFORMATION ──────────────── */}
      <div className="rounded-2xl border border-blue-500/20 bg-[#0C162B]/80 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection('personal')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-blue-600/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#818cf8] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-poppins text-white text-sm">Step 1: Personal Information</h3>
              <p className="text-xs text-slate-400">Name, role, contact channels, and portfolio links</p>
            </div>
          </div>
          {openSections.personal ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSections.personal && (
          <div className="p-5 pt-0 space-y-4 border-t border-blue-500/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">First Name *</label>
                <input
                  type="text"
                  value={data.personalInfo.firstName}
                  onChange={(e) => handlePersonalInfo('firstName', e.target.value)}
                  placeholder="e.g. John"
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Last Name *</label>
                <input
                  type="text"
                  value={data.personalInfo.lastName}
                  onChange={(e) => handlePersonalInfo('lastName', e.target.value)}
                  placeholder="e.g. Doe"
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Professional Title *</label>
              <input
                type="text"
                value={data.personalInfo.professionalTitle}
                onChange={(e) => handlePersonalInfo('professionalTitle', e.target.value)}
                placeholder="e.g. AI & Full Stack Software Engineer"
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => handlePersonalInfo('email', e.target.value)}
                  placeholder="e.g. name@example.com"
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={data.personalInfo.phone}
                  onChange={(e) => handlePersonalInfo('phone', e.target.value)}
                  placeholder="e.g. +91 93924 93902"
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Location *</label>
                <input
                  type="text"
                  value={data.personalInfo.location}
                  onChange={(e) => handlePersonalInfo('location', e.target.value)}
                  placeholder="e.g. Andhra Pradesh, India"
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={data.personalInfo.linkedin}
                  onChange={(e) => handlePersonalInfo('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">GitHub Profile</label>
                <input
                  type="url"
                  value={data.personalInfo.github}
                  onChange={(e) => handlePersonalInfo('github', e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Portfolio Website</label>
                <input
                  type="url"
                  value={data.personalInfo.portfolio}
                  onChange={(e) => handlePersonalInfo('portfolio', e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ──────────────── STEP 2: PROFESSIONAL SUMMARY ──────────────── */}
      <div className="rounded-2xl border border-blue-500/20 bg-[#0C162B]/80 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection('summary')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-blue-600/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#818cf8] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-poppins text-white text-sm">Step 2: Professional Summary</h3>
              <p className="text-xs text-slate-400">Recruiter pitch statement with instant AI Role generation</p>
            </div>
          </div>
          {openSections.summary ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSections.summary && (
          <div className="p-5 pt-0 space-y-3.5 border-t border-blue-500/10">
            {/* AI Generator Controls Toolbar */}
            <div className="bg-[#07101F]/90 border border-blue-500/20 rounded-xl p-3.5 space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-[#818cf8]" />
                  AI Summary Generator
                </span>
                <span className="text-[10px] text-slate-400">Choose Role &amp; Writing Tone</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Target Role</label>
                  <select
                    value={summaryRole}
                    onChange={(e) => setSummaryRole(e.target.value as TargetRole)}
                    className="w-full bg-[#0C162B] border border-blue-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    {[
                      'Fresher', 'Software Engineer', 'AI Engineer', 'Data Scientist',
                      'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
                      'Cloud Engineer', 'DevOps Engineer', 'Cyber Security'
                    ].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Tone</label>
                  <select
                    value={summaryTone}
                    onChange={(e) => setSummaryTone(e.target.value as WritingTone)}
                    className="w-full bg-[#0C162B] border border-blue-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    {[
                      'Professional', 'Shorter', 'Longer', 'Technical',
                      'Executive', 'Friendly', 'Corporate', 'Startup'
                    ].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="w-full bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] hover:brightness-110 text-white font-semibold text-xs gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Summary</span>
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Summary Text</label>
                <span className="text-[10px] text-slate-400">
                  {data.professionalSummary.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={4}
                value={data.professionalSummary}
                onChange={(e) => onChange({ professionalSummary: e.target.value })}
                placeholder="Write your professional summary or click 'Generate AI Summary' above..."
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* ──────────────── STEP 3: WORK EXPERIENCE ──────────────── */}
      <div className="rounded-2xl border border-blue-500/20 bg-[#0C162B]/80 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection('experience')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-blue-600/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#818cf8] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-poppins text-white text-sm">Step 3: Work Experience ({data.experience.length})</h3>
              <p className="text-xs text-slate-400">Internships, full-time jobs, and client projects with AI STAR rewriters</p>
            </div>
          </div>
          {openSections.experience ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSections.experience && (
          <div className="p-5 pt-0 space-y-5 border-t border-blue-500/10">
            <div className="space-y-4 mt-4">
              {data.experience.map((exp, expIdx) => (
                <div key={exp.id} className="p-4 rounded-xl bg-[#07101F]/80 border border-blue-500/15 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400 font-poppins">Entry #{expIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => deleteExperience(exp.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors p-1"
                      title="Delete experience entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Company / Organization *</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        placeholder="e.g. Siemens"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Job Role / Title *</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                        placeholder="e.g. Data Science Intern"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Employment Type</label>
                      <select
                        value={exp.employmentType}
                        onChange={(e) => updateExperience(exp.id, { employmentType: e.target.value as EmploymentType })}
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="internship">Internship</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="freelance">Freelance</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        placeholder="e.g. Apr 2026"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.current ? 'Present' : exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        placeholder="e.g. Jun 2026"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`curr-${exp.id}`}
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                      className="rounded border-blue-500/30 text-blue-600 focus:ring-0"
                    />
                    <label htmlFor={`curr-${exp.id}`} className="text-xs text-slate-300 cursor-pointer">
                      I currently work in this role
                    </label>
                  </div>

                  {/* Bullet Points with AI Assistant Actions */}
                  <div className="space-y-2 pt-2 border-t border-blue-500/10">
                    <label className="text-[11px] font-semibold text-slate-300 block">
                      Responsibilities &amp; Achievements (ATS Bullet Points)
                    </label>

                    {exp.responsibilities.map((bullet, bIdx) => (
                      <div key={bIdx} className="space-y-1.5 bg-[#0C162B]/60 p-2.5 rounded-xl border border-blue-500/10">
                        <div className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => updateExpBullet(exp.id, bIdx, e.target.value)}
                            placeholder="Describe your achievement starting with a strong action verb..."
                            className="w-full bg-[#07101F] border border-blue-500/20 rounded-lg p-2 text-white text-xs leading-relaxed focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeExpBullet(exp.id, bIdx)}
                            className="text-slate-500 hover:text-red-400 p-1"
                            title="Remove bullet point"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* AI Quick Rewriter Chips */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                            <Wand2 className="w-3 h-3 text-[#818cf8]" /> AI Rewrite:
                          </span>
                          <button
                            type="button"
                            onClick={() => applyAIBulletRewrite(exp.id, bIdx, 'improve')}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/60 hover:bg-blue-900/60 text-sky-300 border border-blue-500/20"
                          >
                            Improve Action
                          </button>
                          <button
                            type="button"
                            onClick={() => applyAIBulletRewrite(exp.id, bIdx, 'star')}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/60 hover:bg-blue-900/60 text-purple-300 border border-purple-500/20"
                          >
                            Convert to STAR
                          </button>
                          <button
                            type="button"
                            onClick={() => applyAIBulletRewrite(exp.id, bIdx, 'metrics')}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/60 hover:bg-blue-900/60 text-emerald-300 border border-emerald-500/20"
                          >
                            + Add Metrics
                          </button>
                          <button
                            type="button"
                            onClick={() => applyAIBulletRewrite(exp.id, bIdx, 'technical')}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/60 hover:bg-blue-900/60 text-amber-300 border border-amber-500/20"
                          >
                            More Technical
                          </button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addExpBullet(exp.id)}
                      className="text-xs text-sky-300 border-blue-500/30 hover:bg-blue-600/10 gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Bullet Point
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={addExperience}
              className="w-full bg-[#07101F] border border-dashed border-blue-500/30 hover:border-blue-500 text-sky-300 text-xs py-2.5 rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Experience Entry
            </Button>
          </div>
        )}
      </div>

      {/* ──────────────── STEP 4: PROJECTS ──────────────── */}
      <div className="rounded-2xl border border-blue-500/20 bg-[#0C162B]/80 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection('projects')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-blue-600/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#818cf8] flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-poppins text-white text-sm">Step 4: Technical Projects ({data.projects.length})</h3>
              <p className="text-xs text-slate-400">Featured engineering projects, tech stack, and GitHub / Live links</p>
            </div>
          </div>
          {openSections.projects ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSections.projects && (
          <div className="p-5 pt-0 space-y-5 border-t border-blue-500/10">
            <div className="space-y-4 mt-4">
              {data.projects.map((proj, projIdx) => (
                <div key={proj.id} className="p-4 rounded-xl bg-[#07101F]/80 border border-blue-500/15 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400 font-poppins">Project #{projIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => deleteProject(proj.id)}
                      className="text-slate-400 hover:text-red-400 p-1"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Project Name *</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                        placeholder="e.g. AetherMind Multi-Modal AI"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Tech Stack (comma-separated)</label>
                      <input
                        type="text"
                        value={proj.technologies.join(', ')}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                          })
                        }
                        placeholder="e.g. Python, FastAPI, React, Qdrant"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">GitHub URL</label>
                      <input
                        type="url"
                        value={proj.githubUrl || ''}
                        onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                        placeholder="https://github.com/username/project"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Live Demo URL</label>
                      <input
                        type="url"
                        value={proj.liveUrl || ''}
                        onChange={(e) => updateProject(proj.id, { liveUrl: e.target.value })}
                        placeholder="https://myproject.vercel.app"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Project Description with AI Buttons */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-300">Brief Overview</label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const enhanced = enhanceProjectDescription(proj.name, proj.technologies, proj.description, 'enhance')
                            updateProject(proj.id, { description: enhanced })
                          }}
                          className="text-[10px] text-sky-300 hover:text-white flex items-center gap-1 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/20"
                        >
                          <Wand2 className="w-3 h-3" /> Enhance
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const arch = enhanceProjectDescription(proj.name, proj.technologies, proj.description, 'architecture')
                            updateProject(proj.id, { description: arch })
                          }}
                          className="text-[10px] text-purple-300 hover:text-white flex items-center gap-1 bg-blue-950/40 px-2 py-0.5 rounded border border-purple-500/20"
                        >
                          <Layers className="w-3 h-3" /> Architecture
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                      placeholder="Brief 1-2 sentence description of the system architecture..."
                      className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl p-2.5 text-white text-xs leading-relaxed focus:outline-none"
                    />
                  </div>

                  {/* Project Bullets */}
                  <div className="space-y-2 pt-2 border-t border-blue-500/10">
                    <label className="text-[11px] font-semibold text-slate-300 block">
                      Implementation Highlights &amp; Metrics
                    </label>

                    {proj.bulletPoints.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <input
                          type="text"
                          value={b}
                          onChange={(e) => updateProjBullet(proj.id, bIdx, e.target.value)}
                          placeholder="e.g. Built intelligent AI routing pipeline orchestrating multi-LLM execution..."
                          className="w-full bg-[#0C162B] border border-blue-500/20 rounded-lg px-2.5 py-1.5 text-white text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeProjBullet(proj.id, bIdx)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addProjBullet(proj.id)}
                      className="text-xs text-sky-300 border-blue-500/30 hover:bg-blue-600/10 gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Project Bullet
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={addProject}
              className="w-full bg-[#07101F] border border-dashed border-blue-500/30 hover:border-blue-500 text-sky-300 text-xs py-2.5 rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Project
            </Button>
          </div>
        )}
      </div>

      {/* ──────────────── STEP 5: EDUCATION ──────────────── */}
      <div className="rounded-2xl border border-blue-500/20 bg-[#0C162B]/80 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection('education')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-blue-600/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#818cf8] flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-poppins text-white text-sm">Step 5: Education ({data.education.length})</h3>
              <p className="text-xs text-slate-400">Degrees, university, CGPA, graduation dates, and coursework</p>
            </div>
          </div>
          {openSections.education ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSections.education && (
          <div className="p-5 pt-0 space-y-4 border-t border-blue-500/10">
            <div className="space-y-4 mt-4">
              {data.education.map((edu, eduIdx) => (
                <div key={edu.id} className="p-4 rounded-xl bg-[#07101F]/80 border border-blue-500/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400 font-poppins">Degree #{eduIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => deleteEducation(edu.id)}
                      className="text-slate-400 hover:text-red-400 p-1"
                      title="Delete education entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Degree Program *</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder="e.g. B.Tech in Computer Science and Engineering"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">University / College *</label>
                      <input
                        type="text"
                        value={edu.university}
                        onChange={(e) => updateEducation(edu.id, { university: e.target.value })}
                        placeholder="e.g. K L University"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Specialization / Department</label>
                      <input
                        type="text"
                        value={edu.college || ''}
                        onChange={(e) => updateEducation(edu.id, { college: e.target.value })}
                        placeholder="e.g. AI & Computational Intelligence"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">CGPA / GPA</label>
                      <input
                        type="text"
                        value={edu.cgpa}
                        onChange={(e) => updateEducation(edu.id, { cgpa: e.target.value })}
                        placeholder="e.g. 7.74 or 3.8/4.0"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Graduation Year</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        placeholder="e.g. 2026 or Present"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Coursework / Honors</label>
                    <input
                      type="text"
                      value={edu.description}
                      onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                      placeholder="e.g. Relevant Coursework: Data Structures, Algorithms, Cloud Computing, AI..."
                      className="w-full bg-[#0C162B] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={addEducation}
              className="w-full bg-[#07101F] border border-dashed border-blue-500/30 hover:border-blue-500 text-sky-300 text-xs py-2.5 rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Degree
            </Button>
          </div>
        )}
      </div>

      {/* ──────────────── STEP 6: TECHNICAL SKILLS ──────────────── */}
      <div className="rounded-2xl border border-blue-500/20 bg-[#0C162B]/80 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection('skills')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-blue-600/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#818cf8] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-poppins text-white text-sm">Step 6: Technical Skills</h3>
              <p className="text-xs text-slate-400">Categorized competencies, searchable tags, and 1-click Auto-Categorize</p>
            </div>
          </div>
          {openSections.skills ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSections.skills && (
          <div className="p-5 pt-0 space-y-4 border-t border-blue-500/10">
            {/* Auto Categorize & Add Custom Skill */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
              <Button
                type="button"
                size="sm"
                onClick={handleAutoCategorize}
                className="bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] hover:brightness-110 text-white text-xs gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Auto-Categorize Skills</span>
              </Button>

              <div className="flex items-center gap-2">
                <select
                  value={selectedSkillCategory}
                  onChange={(e) => setSelectedSkillCategory(e.target.value)}
                  className="bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="Programming Languages">Languages</option>
                  <option value="Frameworks & Web">Frameworks</option>
                  <option value="Artificial Intelligence & ML">AI / ML</option>
                  <option value="Databases & Cloud">Databases/Cloud</option>
                  <option value="Tools & Practices">DevOps/Tools</option>
                </select>

                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                  placeholder="Add skill..."
                  className="w-28 sm:w-36 bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                />

                <Button size="sm" type="button" onClick={addCustomSkill} className="text-xs px-3">
                  Add
                </Button>
              </div>
            </div>

            {/* Quick-Pick Popular Tech Stack Tags */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 block">Quick Pick In-Demand Skills:</span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl bg-[#07101F] border border-blue-500/10">
                {COMMON_TECH_TAGS.map((tag) => {
                  const isSelected = data.skills.some((c) => c.skills.includes(tag))
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleCommonTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-[#2563EB] text-white font-semibold shadow-sm'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Current Categorized Skills List */}
            <div className="space-y-3 pt-2">
              {data.skills.map((cat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#07101F] border border-blue-500/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400">{cat.category}</span>
                    <span className="text-[10px] text-slate-500">{cat.skills.length} skills</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/25 text-xs text-slate-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(cat.category, skill)}
                          className="hover:text-red-400 ml-1 text-slate-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ──────────────── STEP 7: CERTIFICATIONS & ACHIEVEMENTS ──────────────── */}
      <div className="rounded-2xl border border-blue-500/20 bg-[#0C162B]/80 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection('credentials')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-blue-600/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#818cf8] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-poppins text-white text-sm">
                Step 7: Certifications &amp; Achievements ({data.certifications.length + data.achievements.length})
              </h3>
              <p className="text-xs text-slate-400">Industry credentials, hackathons, and honor recognitions</p>
            </div>
          </div>
          {openSections.credentials ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSections.credentials && (
          <div className="p-5 pt-0 space-y-5 border-t border-blue-500/10">
            {/* Certifications Sub-Section */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Certifications</h4>
                <Button size="sm" variant="outline" type="button" onClick={addCert} className="text-xs text-sky-300">
                  + Add Certificate
                </Button>
              </div>

              {data.certifications.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-[#07101F] border border-blue-500/15 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCert(c.id, { name: e.target.value })}
                      placeholder="Certificate Name (e.g. Azure Fundamentals)"
                      className="w-full bg-[#0C162B] border border-blue-500/20 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={c.issuer}
                      onChange={(e) => updateCert(c.id, { issuer: e.target.value })}
                      placeholder="Issuer (e.g. Microsoft)"
                      className="w-full bg-[#0C162B] border border-blue-500/20 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={c.issueDate}
                        onChange={(e) => updateCert(c.id, { issueDate: e.target.value })}
                        placeholder="Date (e.g. June 2026)"
                        className="w-full bg-[#0C162B] border border-blue-500/20 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                      <button type="button" onClick={() => deleteCert(c.id)} className="text-slate-500 hover:text-red-400 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements Sub-Section */}
            <div className="space-y-3 pt-3 border-t border-blue-500/15">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Achievements &amp; Hackathons</h4>
                <Button size="sm" variant="outline" type="button" onClick={addAch} className="text-xs text-sky-300">
                  + Add Achievement
                </Button>
              </div>

              {data.achievements.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-[#07101F] border border-blue-500/15 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={a.title}
                      onChange={(e) => updateAch(a.id, { title: e.target.value })}
                      placeholder="Award or Hackathon Title (e.g. AWS 18-Hour Sprint)"
                      className="w-full bg-[#0C162B] border border-blue-500/20 rounded-lg px-2.5 py-1.5 text-white text-xs font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => applyAIAchievement(a.id)}
                      className="text-[10px] text-sky-300 bg-blue-950/60 px-2.5 py-1 rounded border border-blue-500/20 hover:text-white shrink-0 flex items-center gap-1"
                    >
                      <Wand2 className="w-3 h-3" /> AI Wording
                    </button>
                    <button type="button" onClick={() => deleteAch(a.id)} className="text-slate-500 hover:text-red-400 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={a.description}
                    onChange={(e) => updateAch(a.id, { description: e.target.value })}
                    placeholder="Describe your solution, ranking, or recognition..."
                    className="w-full bg-[#0C162B] border border-blue-500/20 rounded-lg p-2 text-white text-xs leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ──────────────── STEP 8: LANGUAGES & INTERESTS ──────────────── */}
      <div className="rounded-2xl border border-blue-500/20 bg-[#0C162B]/80 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection('additional')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-blue-600/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#818cf8] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-poppins text-white text-sm">Step 8: Languages &amp; Interests</h3>
              <p className="text-xs text-slate-400">Communication languages and optional technical passions</p>
            </div>
          </div>
          {openSections.additional ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSections.additional && (
          <div className="p-5 pt-0 space-y-4 border-t border-blue-500/10">
            {/* Languages */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Languages</label>
                <button type="button" onClick={addLanguage} className="text-xs text-sky-400 hover:underline">
                  + Add Language
                </button>
              </div>

              {data.languages.map((l) => (
                <div key={l.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={l.language}
                    onChange={(e) => updateLanguage(l.id, { language: e.target.value })}
                    placeholder="e.g. English"
                    className="flex-1 bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-1.5 text-white text-xs"
                  />
                  <select
                    value={l.proficiency}
                    onChange={(e) => updateLanguage(l.id, { proficiency: e.target.value as LanguageProficiency })}
                    className="bg-[#07101F] border border-blue-500/20 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Professional">Professional</option>
                    <option value="Native">Native</option>
                  </select>
                  <button type="button" onClick={() => deleteLanguage(l.id)} className="text-slate-500 hover:text-red-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Interests */}
            <div className="pt-2 border-t border-blue-500/10">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Interests &amp; Passions (comma-separated)
              </label>
              <input
                type="text"
                value={data.interests.join(', ')}
                onChange={(e) =>
                  onChange({
                    interests: e.target.value.split(',').map((i) => i.trim()).filter(Boolean)
                  })
                }
                placeholder="e.g. Generative AI, Cloud Infrastructure, Open Source, Autonomous Agents"
                className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
