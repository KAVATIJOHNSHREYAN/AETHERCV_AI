export interface CompanyProfile {
  name: string
  ticker?: string
  tier: 'Tier 1 Big Tech' | 'Tier 1 AI / Cloud' | 'High-Growth Tech Unicorn' | 'Enterprise Cloud' | 'Hardware & Semiconductor' | 'Global IT & Consulting' | 'FinTech & Banking'
  compensationMultiplier: number // Relative to market standard (1.0 = median market)
  bonusRangePercent: { min: number; max: number; average: number }
  stockGrantMultiplier: number // 1.0 = high stock equity grants (FAANG level)
  hiringRating: number // Out of 5.0
  benefitsHighlights: string[]
  hiringStatus: 'Aggressive' | 'Selective' | 'Steady'
  headquarters: string
  logoText: string
  primaryIndustries: string[]
}

export const COMPANIES_DATABASE: CompanyProfile[] = [
  // Tier 1 Big Tech / FAANG+
  {
    name: 'Google',
    ticker: 'GOOGL',
    tier: 'Tier 1 Big Tech',
    compensationMultiplier: 1.48,
    bonusRangePercent: { min: 15, max: 25, average: 18 },
    stockGrantMultiplier: 1.5,
    hiringRating: 4.5,
    benefitsHighlights: ['Comprehensive Health', 'Generous 401(k) / PF Match', 'Substantial GSU Equity', 'Relocation & Wellness'],
    hiringStatus: 'Selective',
    headquarters: 'Mountain View, CA, USA',
    logoText: 'G',
    primaryIndustries: ['AI & Cloud', 'Search', 'Consumer Tech']
  },
  {
    name: 'Microsoft',
    ticker: 'MSFT',
    tier: 'Tier 1 Big Tech',
    compensationMultiplier: 1.42,
    bonusRangePercent: { min: 10, max: 25, average: 16 },
    stockGrantMultiplier: 1.35,
    hiringRating: 4.4,
    benefitsHighlights: ['Annual On-hire & Merit Stock', 'Generous Parental Leave', 'Hybrid Flexibility', 'Tuition Assistance'],
    hiringStatus: 'Steady',
    headquarters: 'Redmond, WA, USA',
    logoText: 'MS',
    primaryIndustries: ['Enterprise Cloud', 'AI', 'Software']
  },
  {
    name: 'Meta',
    ticker: 'META',
    tier: 'Tier 1 Big Tech',
    compensationMultiplier: 1.52,
    bonusRangePercent: { min: 15, max: 30, average: 20 },
    stockGrantMultiplier: 1.6,
    hiringRating: 4.3,
    benefitsHighlights: ['Top-of-market RSUs', 'Comprehensive Wellness Stipend', 'Free Gourmet Meals', 'Family Planning'],
    hiringStatus: 'Selective',
    headquarters: 'Menlo Park, CA, USA',
    logoText: 'M',
    primaryIndustries: ['Social Media', 'VR/AR', 'AI Infrastructure']
  },
  {
    name: 'Amazon',
    ticker: 'AMZN',
    tier: 'Tier 1 Big Tech',
    compensationMultiplier: 1.40,
    bonusRangePercent: { min: 5, max: 15, average: 10 },
    stockGrantMultiplier: 1.45,
    hiringRating: 4.0,
    benefitsHighlights: ['High 2-Year Sign-on Bonus', 'Progressive RSU Vesting', 'AWS Employee Discounts', 'Comprehensive Care'],
    hiringStatus: 'Steady',
    headquarters: 'Seattle, WA, USA',
    logoText: 'A',
    primaryIndustries: ['Cloud Computing (AWS)', 'E-Commerce', 'Logistics']
  },
  {
    name: 'Apple',
    ticker: 'AAPL',
    tier: 'Tier 1 Big Tech',
    compensationMultiplier: 1.44,
    bonusRangePercent: { min: 10, max: 20, average: 15 },
    stockGrantMultiplier: 1.38,
    hiringRating: 4.4,
    benefitsHighlights: ['Product Discounts', 'Tuition Reimbursement', 'Annual RSU Refresher Grants', 'On-site Wellness'],
    hiringStatus: 'Selective',
    headquarters: 'Cupertino, CA, USA',
    logoText: '',
    primaryIndustries: ['Hardware & Devices', 'Consumer Software', 'Silicon Design']
  },
  {
    name: 'Netflix',
    ticker: 'NFLX',
    tier: 'Tier 1 Big Tech',
    compensationMultiplier: 1.55,
    bonusRangePercent: { min: 0, max: 5, average: 2 },
    stockGrantMultiplier: 1.1, // Netflix gives all-cash or custom stock allocation
    hiringRating: 4.2,
    benefitsHighlights: ['Top-of-Market All-Cash Option', 'Unlimited Paid Time Off', 'Generous Parental Support', 'No Vesting Cliff'],
    hiringStatus: 'Selective',
    headquarters: 'Los Gatos, CA, USA',
    logoText: 'N',
    primaryIndustries: ['Streaming Tech', 'Content Systems', 'Distributed Media']
  },
  {
    name: 'NVIDIA',
    ticker: 'NVDA',
    tier: 'Tier 1 AI / Cloud',
    compensationMultiplier: 1.54,
    bonusRangePercent: { min: 10, max: 20, average: 15 },
    stockGrantMultiplier: 1.65,
    hiringRating: 4.7,
    benefitsHighlights: ['Industry-Leading ESPP', 'High-Valuation RSU Grants', '401k/Superannuation Match', 'Flexible Work Options'],
    hiringStatus: 'Aggressive',
    headquarters: 'Santa Clara, CA, USA',
    logoText: 'NV',
    primaryIndustries: ['AI Compute & GPUs', 'Semiconductors', 'Accelerated Systems']
  },
  {
    name: 'OpenAI',
    tier: 'Tier 1 AI / Cloud',
    compensationMultiplier: 1.68,
    bonusRangePercent: { min: 10, max: 25, average: 18 },
    stockGrantMultiplier: 1.8, // PPU (Profit Participation Units)
    hiringRating: 4.6,
    benefitsHighlights: ['Lucrative PPU Equity Structure', 'Premium Health & Mental Care', 'Leading AI Compute Access', 'Full Relocation'],
    hiringStatus: 'Selective',
    headquarters: 'San Francisco, CA, USA',
    logoText: 'OA',
    primaryIndustries: ['Frontier AI Models', 'Generative AI', 'Research & Systems']
  },

  // Enterprise Cloud & Systems
  {
    name: 'Oracle',
    ticker: 'ORCL',
    tier: 'Enterprise Cloud',
    compensationMultiplier: 1.25,
    bonusRangePercent: { min: 10, max: 20, average: 12 },
    stockGrantMultiplier: 1.15,
    hiringRating: 4.1,
    benefitsHighlights: ['OCI Cloud Employee Credits', 'Flexible Work Schedule', 'Health Coverage', 'Employee Stock Purchase'],
    hiringStatus: 'Steady',
    headquarters: 'Austin, TX, USA',
    logoText: 'O',
    primaryIndustries: ['Cloud Infrastructure (OCI)', 'Enterprise Databases', 'ERP']
  },
  {
    name: 'Adobe',
    ticker: 'ADBE',
    tier: 'Enterprise Cloud',
    compensationMultiplier: 1.36,
    bonusRangePercent: { min: 12, max: 22, average: 16 },
    stockGrantMultiplier: 1.32,
    hiringRating: 4.5,
    benefitsHighlights: ['Twice-Yearly Company Shutdowns', 'Generous Sabbatical', 'Creative Cloud Subscriptions', 'Education Fund'],
    hiringStatus: 'Steady',
    headquarters: 'San Jose, CA, USA',
    logoText: 'AD',
    primaryIndustries: ['Creative Cloud', 'Digital Experience', 'Document Cloud']
  },
  {
    name: 'Salesforce',
    ticker: 'CRM',
    tier: 'Enterprise Cloud',
    compensationMultiplier: 1.35,
    bonusRangePercent: { min: 10, max: 20, average: 15 },
    stockGrantMultiplier: 1.28,
    hiringRating: 4.3,
    benefitsHighlights: ['7 Days Volunteer Time Off (VTO)', 'Wellbeing Reimbursement', 'Comprehensive Medical', 'Parental Perks'],
    hiringStatus: 'Steady',
    headquarters: 'San Francisco, CA, USA',
    logoText: 'SF',
    primaryIndustries: ['CRM & Enterprise Cloud', 'Marketing Cloud', 'Data Cloud']
  },
  {
    name: 'Cisco',
    ticker: 'CSCO',
    tier: 'Enterprise Cloud',
    compensationMultiplier: 1.22,
    bonusRangePercent: { min: 8, max: 18, average: 12 },
    stockGrantMultiplier: 1.12,
    hiringRating: 4.3,
    benefitsHighlights: ['Great Work-Life Balance', 'Hybrid Workplace Choice', 'Tuition Support', 'Volunteer Days'],
    hiringStatus: 'Steady',
    headquarters: 'San Jose, CA, USA',
    logoText: 'CS',
    primaryIndustries: ['Networking & Telecom', 'Cybersecurity', 'Cloud Software']
  },
  {
    name: 'IBM',
    ticker: 'IBM',
    tier: 'Enterprise Cloud',
    compensationMultiplier: 1.16,
    bonusRangePercent: { min: 5, max: 15, average: 10 },
    stockGrantMultiplier: 1.05,
    hiringRating: 4.0,
    benefitsHighlights: ['Global Mobility Programs', 'Watsonx Certification Credits', 'Health Benefits', 'Pension & 401(k)'],
    hiringStatus: 'Steady',
    headquarters: 'Armonk, NY, USA',
    logoText: 'IBM',
    primaryIndustries: ['Hybrid Cloud', 'AI & Consulting', 'Mainframes']
  },

  // Semiconductors & Hardware
  {
    name: 'Intel',
    ticker: 'INTC',
    tier: 'Hardware & Semiconductor',
    compensationMultiplier: 1.24,
    bonusRangePercent: { min: 8, max: 18, average: 12 },
    stockGrantMultiplier: 1.15,
    hiringRating: 4.0,
    benefitsHighlights: ['Annual Bonus & Profit Sharing', 'Sabbatical Program', 'Tuition Assistance', 'ESPP at Discount'],
    hiringStatus: 'Steady',
    headquarters: 'Santa Clara, CA, USA',
    logoText: 'IN',
    primaryIndustries: ['Silicon Architecture', 'Foundry Services', 'Client Computing']
  },
  {
    name: 'AMD',
    ticker: 'AMD',
    tier: 'Hardware & Semiconductor',
    compensationMultiplier: 1.32,
    bonusRangePercent: { min: 10, max: 20, average: 14 },
    stockGrantMultiplier: 1.30,
    hiringRating: 4.3,
    benefitsHighlights: ['Competitive Equity Refresher', 'Generous 401(k) Matching', 'Health and Wellness Subsidies'],
    hiringStatus: 'Aggressive',
    headquarters: 'Santa Clara, CA, USA',
    logoText: 'AMD',
    primaryIndustries: ['Processors (Ryzen / EPYC)', 'Data Center GPUs', 'Embedded']
  },
  {
    name: 'Qualcomm',
    ticker: 'QCOM',
    tier: 'Hardware & Semiconductor',
    compensationMultiplier: 1.30,
    bonusRangePercent: { min: 10, max: 20, average: 14 },
    stockGrantMultiplier: 1.25,
    hiringRating: 4.2,
    benefitsHighlights: ['Patent Bonus Awards', 'On-site Fitness Centers', '401k & ESPP', 'Tuition Assistance'],
    hiringStatus: 'Steady',
    headquarters: 'San Diego, CA, USA',
    logoText: 'QC',
    primaryIndustries: ['5G / Wireless Systems', 'Snapdragon SoCs', 'Automotive Edge']
  },

  // High Growth Tech Unicorns & Product Leaders
  {
    name: 'Stripe',
    tier: 'High-Growth Tech Unicorn',
    compensationMultiplier: 1.48,
    bonusRangePercent: { min: 10, max: 20, average: 15 },
    stockGrantMultiplier: 1.5,
    hiringRating: 4.4,
    benefitsHighlights: ['Top Tier Base Pay', 'Remote First Stipend ($2k/yr)', 'Comprehensive Medical', 'Generous Parental Care'],
    hiringStatus: 'Selective',
    headquarters: 'San Francisco, CA & Dublin, Ireland',
    logoText: 'S',
    primaryIndustries: ['FinTech Infrastructure', 'Global Payments', 'Billing & SaaS']
  },
  {
    name: 'Uber',
    ticker: 'UBER',
    tier: 'High-Growth Tech Unicorn',
    compensationMultiplier: 1.40,
    bonusRangePercent: { min: 10, max: 22, average: 15 },
    stockGrantMultiplier: 1.42,
    hiringRating: 4.2,
    benefitsHighlights: ['Monthly Uber Credits ($300+)', 'Annual RSU Merit Refreshers', 'Health Savings Support', 'Global Offices'],
    hiringStatus: 'Steady',
    headquarters: 'San Francisco, CA, USA',
    logoText: 'U',
    primaryIndustries: ['Mobility Platform', 'Delivery Logistics', 'Autonomous Tech']
  },
  {
    name: 'Airbnb',
    ticker: 'ABNB',
    tier: 'High-Growth Tech Unicorn',
    compensationMultiplier: 1.42,
    bonusRangePercent: { min: 10, max: 20, average: 14 },
    stockGrantMultiplier: 1.45,
    hiringRating: 4.3,
    benefitsHighlights: ['Work From Anywhere Policy', '$2,000 Annual Travel Credit', 'Generous Paid Leave', 'Equity Grants'],
    hiringStatus: 'Selective',
    headquarters: 'San Francisco, CA, USA',
    logoText: 'AB',
    primaryIndustries: ['Hospitality Platform', 'Travel Tech', 'Marketplaces']
  },
  {
    name: 'Atlassian',
    ticker: 'TEAM',
    tier: 'High-Growth Tech Unicorn',
    compensationMultiplier: 1.34,
    bonusRangePercent: { min: 10, max: 20, average: 14 },
    stockGrantMultiplier: 1.30,
    hiringRating: 4.4,
    benefitsHighlights: ['Team Anywhere (100% Remote flexibility)', 'Annual Home Office Stipend', 'Health Insurance', 'Growth Grants'],
    hiringStatus: 'Steady',
    headquarters: 'Sydney, Australia & San Francisco, USA',
    logoText: 'AT',
    primaryIndustries: ['Dev Collaboration (Jira, Confluence)', 'Agile Tooling', 'Enterprise Work']
  },
  {
    name: 'Tesla',
    ticker: 'TSLA',
    tier: 'High-Growth Tech Unicorn',
    compensationMultiplier: 1.35,
    bonusRangePercent: { min: 0, max: 10, average: 5 },
    stockGrantMultiplier: 1.45,
    hiringRating: 3.8,
    benefitsHighlights: ['High Equity Upside', 'Employee Vehicle Purchase Discounts', 'Full Medical Care', 'Rapid Advancement'],
    hiringStatus: 'Steady',
    headquarters: 'Austin, TX, USA',
    logoText: 'T',
    primaryIndustries: ['Electric Vehicles', 'Autopilot / FSD Vision', 'Clean Energy Storage']
  },
  {
    name: 'Samsung',
    tier: 'Hardware & Semiconductor',
    compensationMultiplier: 1.20,
    bonusRangePercent: { min: 10, max: 30, average: 18 },
    stockGrantMultiplier: 1.10,
    hiringRating: 4.0,
    benefitsHighlights: ['Target Achievement Incentive (TAI)', 'Global Rotation', 'Family Education Support', 'Medical Insurance'],
    hiringStatus: 'Steady',
    headquarters: 'Suwon, South Korea',
    logoText: 'SEC',
    primaryIndustries: ['Memory Semiconductors', 'Mobile Devices', 'Consumer Electronics']
  },

  // Indian Product Tech Champions
  {
    name: 'Zoho',
    tier: 'Enterprise Cloud',
    compensationMultiplier: 1.10,
    bonusRangePercent: { min: 8, max: 18, average: 12 },
    stockGrantMultiplier: 0.8, // Bootstrapped, high profit-sharing & cash stability
    hiringRating: 4.4,
    benefitsHighlights: ['Exceptional Work-Life Balance', 'Free Organic Campus Meals', 'Rural Innovation Offices', 'No Layoff Philosophy'],
    hiringStatus: 'Aggressive',
    headquarters: 'Chennai, Tamil Nadu, India',
    logoText: 'Z',
    primaryIndustries: ['SaaS Suite', 'CRM', 'Productivity Software']
  },
  {
    name: 'Freshworks',
    ticker: 'FRSH',
    tier: 'Enterprise Cloud',
    compensationMultiplier: 1.20,
    bonusRangePercent: { min: 10, max: 20, average: 14 },
    stockGrantMultiplier: 1.22,
    hiringRating: 4.1,
    benefitsHighlights: ['US-listed RSUs', 'Wellness Reimbursement', 'Parental Benefits', 'Hybrid Work Culture'],
    hiringStatus: 'Steady',
    headquarters: 'San Mateo, CA, USA & Chennai, India',
    logoText: 'FW',
    primaryIndustries: ['Customer Engagement SaaS', 'ITSM', 'Cloud Software']
  },

  // Global IT Services & Consulting Giants
  {
    name: 'Tata Consultancy Services (TCS)',
    ticker: 'TCS',
    tier: 'Global IT & Consulting',
    compensationMultiplier: 0.95,
    bonusRangePercent: { min: 5, max: 15, average: 10 },
    stockGrantMultiplier: 0.5,
    hiringRating: 3.9,
    benefitsHighlights: ['High Job Security', 'TCS Digital / Prime Accelerator Premiums', 'Comprehensive Family Mediclaim', 'Global Deputations'],
    hiringStatus: 'Aggressive',
    headquarters: 'Mumbai, Maharashtra, India',
    logoText: 'TCS',
    primaryIndustries: ['Enterprise IT Services', 'Digital Transformation', 'Banking Software (Bancs)']
  },
  {
    name: 'Infosys',
    ticker: 'INFY',
    tier: 'Global IT & Consulting',
    compensationMultiplier: 0.96,
    bonusRangePercent: { min: 5, max: 15, average: 10 },
    stockGrantMultiplier: 0.55,
    hiringRating: 3.9,
    benefitsHighlights: ['Power Programmer / Specialist Track (2x Pay)', 'Infosys Springboard Learning', 'Health Cover', 'Global Projects'],
    hiringStatus: 'Aggressive',
    headquarters: 'Bangalore, Karnataka, India',
    logoText: 'INFY',
    primaryIndustries: ['IT Consulting', 'Cloud Transformation', 'Finacle Core Banking']
  },
  {
    name: 'Accenture',
    ticker: 'ACN',
    tier: 'Global IT & Consulting',
    compensationMultiplier: 1.08,
    bonusRangePercent: { min: 8, max: 18, average: 12 },
    stockGrantMultiplier: 0.85,
    hiringRating: 4.1,
    benefitsHighlights: ['Discretionary Performance Bonus', 'Global Client Exposure', 'Comprehensive Medical & Life Cover', 'Employee Share Plan'],
    hiringStatus: 'Aggressive',
    headquarters: 'Dublin, Ireland',
    logoText: 'ACN',
    primaryIndustries: ['Management Consulting', 'Cloud Architecture', 'Technology Services']
  },
  {
    name: 'Deloitte',
    tier: 'Global IT & Consulting',
    compensationMultiplier: 1.10,
    bonusRangePercent: { min: 10, max: 20, average: 14 },
    stockGrantMultiplier: 0.75,
    hiringRating: 4.0,
    benefitsHighlights: ['Annual Performance Bonus', 'Tuition & Certification Sponsorship', 'Well-being Subsidy', 'Global Mobility'],
    hiringStatus: 'Steady',
    headquarters: 'London, UK & New York, USA',
    logoText: 'D',
    primaryIndustries: ['Advisory & Tech Consulting', 'Cyber Risk', 'Enterprise Systems']
  },
  {
    name: 'Capgemini',
    ticker: 'CAP',
    tier: 'Global IT & Consulting',
    compensationMultiplier: 0.98,
    bonusRangePercent: { min: 6, max: 16, average: 10 },
    stockGrantMultiplier: 0.6,
    hiringRating: 3.9,
    benefitsHighlights: ['Flexible Benefits Plan', 'Employee Share Ownership', 'Health & Group Life Insurance', 'Certifications Support'],
    hiringStatus: 'Steady',
    headquarters: 'Paris, France',
    logoText: 'CAP',
    primaryIndustries: ['Cloud & Data Engineering', 'Consulting', 'Engineering Services']
  },
  {
    name: 'Cognizant',
    ticker: 'CTSH',
    tier: 'Global IT & Consulting',
    compensationMultiplier: 0.97,
    bonusRangePercent: { min: 5, max: 15, average: 10 },
    stockGrantMultiplier: 0.6,
    hiringRating: 3.8,
    benefitsHighlights: ['Competitive Group Insurance', 'Annual Merit Cycles', 'Skill Premium Allowances', 'Certification Reimbursements'],
    hiringStatus: 'Steady',
    headquarters: 'Teaneck, NJ, USA',
    logoText: 'CTSH',
    primaryIndustries: ['Digital Systems', 'Healthcare IT', 'Enterprise Platforms']
  },
  {
    name: 'Wipro',
    ticker: 'WIT',
    tier: 'Global IT & Consulting',
    compensationMultiplier: 0.94,
    bonusRangePercent: { min: 5, max: 14, average: 9 },
    stockGrantMultiplier: 0.5,
    hiringRating: 3.7,
    benefitsHighlights: ['Turbo / Elite Specialization Incentives', 'Group Medical Cover', 'Higher Education Programs', 'Flexible Benefits'],
    hiringStatus: 'Steady',
    headquarters: 'Bangalore, Karnataka, India',
    logoText: 'WIP',
    primaryIndustries: ['IT Infrastructure', 'Cloud Engineering', 'Consulting']
  },
  {
    name: 'HCL Technologies',
    ticker: 'HCLTECH',
    tier: 'Global IT & Consulting',
    compensationMultiplier: 0.95,
    bonusRangePercent: { min: 6, max: 15, average: 10 },
    stockGrantMultiplier: 0.5,
    hiringRating: 3.8,
    benefitsHighlights: ['HCL Software Division Premiums', 'Health Benefits', 'Engineering Services R&D', 'Long-service Rewards'],
    hiringStatus: 'Steady',
    headquarters: 'Noida, Uttar Pradesh, India',
    logoText: 'HCL',
    primaryIndustries: ['Engineering R&D', 'Enterprise Cloud', 'Cybersecurity']
  },
  {
    name: 'Tech Mahindra',
    ticker: 'TECHM',
    tier: 'Global IT & Consulting',
    compensationMultiplier: 0.93,
    bonusRangePercent: { min: 5, max: 14, average: 9 },
    stockGrantMultiplier: 0.5,
    hiringRating: 3.7,
    benefitsHighlights: ['Telecom & 5G Specialized Projects', 'Medical Insurance', 'Upskilling Allowances', 'Global Deputations'],
    hiringStatus: 'Steady',
    headquarters: 'Pune, Maharashtra, India',
    logoText: 'TM',
    primaryIndustries: ['Telecom Networks & 5G', 'Enterprise Cloud', 'Digital Engineering']
  }
]

/**
 * Helper to retrieve company profile or generate smart dynamic estimate for any other company
 */
export function getCompanyProfile(companyName: string): CompanyProfile {
  if (!companyName) {
    return {
      name: 'Standard Market Baseline',
      tier: 'Enterprise Cloud',
      compensationMultiplier: 1.0,
      bonusRangePercent: { min: 8, max: 15, average: 10 },
      stockGrantMultiplier: 1.0,
      hiringRating: 4.0,
      benefitsHighlights: ['Standard Health Insurance', 'Annual Merit Reviews', 'Paid Time Off', 'Professional Development'],
      hiringStatus: 'Steady',
      headquarters: 'Global',
      logoText: 'SMB',
      primaryIndustries: ['Technology & Software']
    }
  }

  const normalized = companyName.trim().toLowerCase()
  const matched = COMPANIES_DATABASE.find(c => {
    const cNorm = c.name.toLowerCase()
    return cNorm === normalized || cNorm.includes(normalized) || normalized.includes(cNorm)
  })

  if (matched) return matched

  // Fallback heuristic for any custom company
  const isStartup = /startup|labs|technologies|ai|robotics|protocol|ventures/i.test(companyName)
  const isConsulting = /consulting|solutions|services|infotech|global/i.test(companyName)

  if (isStartup) {
    return {
      name: companyName,
      tier: 'High-Growth Tech Unicorn',
      compensationMultiplier: 1.15,
      bonusRangePercent: { min: 5, max: 15, average: 10 },
      stockGrantMultiplier: 1.25,
      hiringRating: 4.1,
      benefitsHighlights: ['Startup Equity Upside', 'Flexible Work', 'Rapid Ownership', 'Health Benefits'],
      hiringStatus: 'Aggressive',
      headquarters: 'Regional Tech Hub',
      logoText: companyName.slice(0, 3).toUpperCase(),
      primaryIndustries: ['High-Growth Innovation']
    }
  }

  if (isConsulting) {
    return {
      name: companyName,
      tier: 'Global IT & Consulting',
      compensationMultiplier: 0.96,
      bonusRangePercent: { min: 5, max: 15, average: 9 },
      stockGrantMultiplier: 0.6,
      hiringRating: 3.8,
      benefitsHighlights: ['Client Project Variety', 'Group Health Cover', 'Certifications Support', 'Hybrid Model'],
      hiringStatus: 'Steady',
      headquarters: 'Global Services Hub',
      logoText: companyName.slice(0, 3).toUpperCase(),
      primaryIndustries: ['IT & Enterprise Solutions']
    }
  }

  return {
    name: companyName,
    tier: 'Enterprise Cloud',
    compensationMultiplier: 1.02,
    bonusRangePercent: { min: 8, max: 16, average: 11 },
    stockGrantMultiplier: 1.0,
    hiringRating: 4.0,
    benefitsHighlights: ['Competitive Health Coverage', 'Annual Bonus Plan', 'Hybrid Model', 'Growth Stipend'],
    hiringStatus: 'Steady',
    headquarters: 'Regional Office',
    logoText: companyName.slice(0, 3).toUpperCase(),
    primaryIndustries: ['Industry Tech']
  }
}
