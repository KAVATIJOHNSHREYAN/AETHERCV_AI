import {
  TemplateId,
  FontFamily,
  FontSize,
  LineHeight,
  Margins,
  HeaderStyle,
  SectionKey
} from '@/types/resume-builder'

export interface AtsTemplateDefinition {
  id: TemplateId
  name: string
  category: 'Recommended' | 'Tech & Engineering' | 'Corporate & Business' | 'Academic & Research' | 'Specialized'
  tag: string
  desc: string
  recommended?: boolean
  defaultFont: FontFamily
  defaultAccent: string
  defaultFontSize: FontSize
  defaultLineHeight: LineHeight
  defaultMargins: Margins
  headerStyle: HeaderStyle
  dividerStyle: 'solid' | 'double' | 'subtle' | 'bold' | 'none'
  headerTransform: 'uppercase' | 'capitalize'
  sectionOrder: SectionKey[]
}

export const ATS_TEMPLATES: AtsTemplateDefinition[] = [
  {
    id: 'modern-ats',
    name: 'Modern ATS',
    category: 'Recommended',
    tag: 'Recommended',
    recommended: true,
    desc: 'Recruiter-tested single column layout with bold headers, subtle horizontal dividers, and crisp hierarchy.',
    defaultFont: 'inter',
    defaultAccent: '#1E293B',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'left',
    dividerStyle: 'solid',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'summary',
      'experience',
      'education',
      'projects',
      'skills',
      'certifications',
      'achievements'
    ]
  },
  {
    id: 'classic-ats',
    name: 'Classic Corporate ATS',
    category: 'Corporate & Business',
    tag: 'Fortune 500',
    desc: 'Conservative linear format favored by enterprise applicant tracking systems and institutional employers.',
    defaultFont: 'calibri',
    defaultAccent: '#111827',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'centered',
    dividerStyle: 'solid',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'achievements'
    ]
  },
  {
    id: 'harvard',
    name: 'Harvard Ivy ATS',
    category: 'Academic & Research',
    tag: 'Ivy League',
    desc: 'Formal academic serif typography with centered credentials, right-aligned dates, and classic Ivy prestige.',
    defaultFont: 'times-new-roman',
    defaultAccent: '#000000',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'centered',
    dividerStyle: 'subtle',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'education',
      'experience',
      'skills',
      'projects',
      'achievements',
      'certifications'
    ]
  },
  {
    id: 'stanford',
    name: 'Stanford Tech ATS',
    category: 'Tech & Engineering',
    tag: 'Silicon Valley',
    desc: 'Streamlined Bay Area tech format emphasizing software stack, technical contributions, and rapid scaling.',
    defaultFont: 'inter',
    defaultAccent: '#1E3A8A',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'left',
    dividerStyle: 'bold',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'summary',
      'skills',
      'experience',
      'projects',
      'education',
      'certifications'
    ]
  },
  {
    id: 'google',
    name: 'Google SDE ATS',
    category: 'Tech & Engineering',
    tag: 'Big Tech',
    desc: 'Engineered for XYZ metric formula bullets (Accomplished [X] measured by [Y] through doing [Z]).',
    defaultFont: 'roboto',
    defaultAccent: '#0F172A',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'left',
    dividerStyle: 'solid',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'skills',
      'experience',
      'projects',
      'education',
      'certifications',
      'achievements'
    ]
  },
  {
    id: 'minimal',
    name: 'Minimalist Clean ATS',
    category: 'Recommended',
    tag: 'Distraction-Free',
    desc: 'Pure high-contrast text on white document with generous breathing room and zero parsing interference.',
    defaultFont: 'helvetica',
    defaultAccent: '#000000',
    defaultFontSize: 'sm',
    defaultLineHeight: 'normal',
    defaultMargins: 'normal',
    headerStyle: 'left',
    dividerStyle: 'none',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'summary',
      'experience',
      'skills',
      'education',
      'projects',
      'certifications'
    ]
  },
  {
    id: 'executive',
    name: 'Executive Leadership ATS',
    category: 'Corporate & Business',
    tag: 'Senior Exec',
    desc: 'Dense leadership format highlighting executive summaries, board impact, P&L ownership, and strategic scale.',
    defaultFont: 'georgia',
    defaultAccent: '#1E293B',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'centered',
    dividerStyle: 'double',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'summary',
      'experience',
      'skills',
      'education',
      'achievements',
      'certifications'
    ]
  },
  {
    id: 'product-manager',
    name: 'Product Manager ATS',
    category: 'Corporate & Business',
    tag: 'Product / PM',
    desc: 'Tailored for Product Managers with focus on business metrics, product lifecycles, and user impact.',
    defaultFont: 'open-sans',
    defaultAccent: '#2563EB',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'left',
    dividerStyle: 'solid',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'summary',
      'skills',
      'experience',
      'projects',
      'education',
      'certifications'
    ]
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer ATS',
    category: 'Tech & Engineering',
    tag: 'Fullstack / SDE',
    desc: 'Developer-first hierarchy featuring prominent Technical Skills grid followed by enterprise system projects.',
    defaultFont: 'inter',
    defaultAccent: '#0284C7',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'left',
    dividerStyle: 'solid',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'skills',
      'experience',
      'projects',
      'education',
      'certifications'
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist ATS',
    category: 'Tech & Engineering',
    tag: 'ML & AI',
    desc: 'Structures statistical models, deep learning frameworks, analytical benchmarks, and quantitative results.',
    defaultFont: 'source-sans',
    defaultAccent: '#4338CA',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'left',
    dividerStyle: 'solid',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'summary',
      'skills',
      'experience',
      'projects',
      'education',
      'certifications'
    ]
  },
  {
    id: 'consulting',
    name: 'Consulting ATS',
    category: 'Corporate & Business',
    tag: 'MBB / Advisory',
    desc: 'Structured analytical format for McKinsey, BCG, and Bain recruiting emphasizing client ROI and rigor.',
    defaultFont: 'cambria',
    defaultAccent: '#111827',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'centered',
    dividerStyle: 'solid',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'summary',
      'experience',
      'education',
      'skills',
      'achievements',
      'certifications'
    ]
  },
  {
    id: 'creative',
    name: 'Creative Professional ATS',
    category: 'Specialized',
    tag: 'ATS Safe',
    desc: 'Contemporary typography with slate styling for UX designers and creative leads while remaining 100% ATS text-safe.',
    defaultFont: 'lato',
    defaultAccent: '#475569',
    defaultFontSize: 'sm',
    defaultLineHeight: 'normal',
    defaultMargins: 'compact',
    headerStyle: 'left',
    dividerStyle: 'subtle',
    headerTransform: 'capitalize',
    sectionOrder: [
      'personal',
      'summary',
      'experience',
      'projects',
      'skills',
      'education',
      'certifications'
    ]
  },
  {
    id: 'finance',
    name: 'Finance ATS',
    category: 'Corporate & Business',
    tag: 'Wall Street',
    desc: 'Banking and private equity standard with rigorous deal transaction summaries, financial modeling, and valuations.',
    defaultFont: 'times-new-roman',
    defaultAccent: '#0F172A',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'centered',
    dividerStyle: 'solid',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'education',
      'experience',
      'skills',
      'certifications',
      'achievements'
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare ATS',
    category: 'Specialized',
    tag: 'Clinical / Medical',
    desc: 'Clinical layout prioritizing medical licensures, clinical certifications, hospital experience, and patient care.',
    defaultFont: 'calibri',
    defaultAccent: '#059669',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'left',
    dividerStyle: 'solid',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'summary',
      'certifications',
      'experience',
      'education',
      'skills',
      'achievements'
    ]
  },
  {
    id: 'student-fresher',
    name: 'Student / Fresher ATS',
    category: 'Recommended',
    tag: 'Campus Ready',
    desc: 'Optimized for university students and entry-level grads with Education, GPA, and Capstone projects upfront.',
    defaultFont: 'arial',
    defaultAccent: '#2563EB',
    defaultFontSize: 'sm',
    defaultLineHeight: 'tight',
    defaultMargins: 'compact',
    headerStyle: 'centered',
    dividerStyle: 'solid',
    headerTransform: 'uppercase',
    sectionOrder: [
      'personal',
      'education',
      'projects',
      'skills',
      'experience',
      'certifications',
      'achievements'
    ]
  }
]

export const ATS_SAFE_FONTS: { id: FontFamily; name: string; type: string; cssStack: string }[] = [
  { id: 'inter', name: 'Inter', type: 'ATS Standard Sans', cssStack: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  { id: 'calibri', name: 'Calibri', type: 'Corporate Sans', cssStack: "'Calibri', 'Candara', 'Segoe UI', 'Arial', sans-serif" },
  { id: 'arial', name: 'Arial', type: 'Universal Clean Sans', cssStack: "'Arial', 'Helvetica Neue', Helvetica, sans-serif" },
  { id: 'helvetica', name: 'Helvetica', type: 'Modern Swiss Sans', cssStack: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" },
  { id: 'lato', name: 'Lato', type: 'Humanist Sans', cssStack: "'Lato', 'Helvetica Neue', Arial, sans-serif" },
  { id: 'roboto', name: 'Roboto', type: 'Universal Tech Sans', cssStack: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif" },
  { id: 'source-sans', name: 'Source Sans Pro', type: 'Technical Sans', cssStack: "'Source Sans Pro', 'Source Sans 3', -apple-system, sans-serif" },
  { id: 'open-sans', name: 'Open Sans', type: 'Neutral Modern Sans', cssStack: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif" },
  { id: 'georgia', name: 'Georgia', type: 'Classic Elegant Serif', cssStack: "'Georgia', 'Cambria', 'Times New Roman', serif" },
  { id: 'cambria', name: 'Cambria', type: 'Executive Business Serif', cssStack: "'Cambria', 'Georgia', 'Times New Roman', serif" },
  { id: 'times-new-roman', name: 'Times New Roman', type: 'Academic Ivy Serif', cssStack: "'Times New Roman', 'Times', serif" },
  // Backward compatible
  { id: 'outfit', name: 'Outfit', type: 'Geometric Clean', cssStack: "'Outfit', sans-serif" },
  { id: 'merriweather', name: 'Merriweather', type: 'Editorial Serif', cssStack: "'Merriweather', serif" },
  { id: 'jetbrains', name: 'JetBrains Mono', type: 'Technical Monospace', cssStack: "'JetBrains Mono', monospace" }
]

export const ATS_ACCENT_COLORS = [
  { id: 'pure-charcoal', name: 'Pure ATS Charcoal', hex: '#1E293B' },
  { id: 'enterprise-blue', name: 'Enterprise Blue', hex: '#2563EB' },
  { id: 'royal-indigo', name: 'Royal Indigo', hex: '#4338CA' },
  { id: 'navy-pro', name: 'Navy Professional', hex: '#1E3A8A' },
  { id: 'slate-gray', name: 'Slate Gray', hex: '#475569' },
  { id: 'emerald-pro', name: 'Emerald Professional', hex: '#059669' },
  { id: 'graphite-black', name: 'Graphite Black', hex: '#0F172A' },
  { id: 'steel-blue', name: 'Steel Blue', hex: '#0284C7' },
  { id: 'deep-violet', name: 'Deep Violet', hex: '#6D28D9' },
  { id: 'classic-black', name: 'Classic Black', hex: '#000000' }
]

export const SECTION_METADATA: Record<SectionKey, { label: string; optional: boolean }> = {
  personal: { label: 'Contact & Personal Details', optional: false },
  summary: { label: 'Professional Summary', optional: true },
  skills: { label: 'Technical & Core Skills', optional: false },
  experience: { label: 'Work Experience', optional: false },
  projects: { label: 'Key Projects', optional: true },
  education: { label: 'Education & Academics', optional: false },
  certifications: { label: 'Certifications & Licenses', optional: true },
  achievements: { label: 'Achievements & Honors', optional: true },
  internships: { label: 'Internships', optional: true },
  research: { label: 'Research & Publications', optional: true },
  publications: { label: 'Publications', optional: true },
  languages: { label: 'Languages', optional: true },
  volunteer: { label: 'Volunteer Work', optional: true },
  references: { label: 'References', optional: true },
  interests: { label: 'Interests & Activities', optional: true }
}

export function getTemplateConfig(id: TemplateId): AtsTemplateDefinition {
  const match = ATS_TEMPLATES.find((t) => t.id === id)
  return match || ATS_TEMPLATES[0]
}
