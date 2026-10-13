'use client'

import React, { useState, useEffect } from 'react'
import {
  SalaryPredictionInput,
  SalaryPredictionResult,
  SalaryHistoryItem
} from '@/types/salary-predictor'
import { predictGlobalSalary } from '@/lib/salary-predictor/salary-engine'
import { formatCurrencyAmount, convertCurrency } from '@/lib/salary-predictor/countries-data'
import { SalaryInputForm } from '@/components/salary-predictor/salary-input-form'
import { SalaryHeroGauge } from '@/components/salary-predictor/salary-hero-gauge'
import { CurrencyConverterBar } from '@/components/salary-predictor/currency-converter-bar'
import { ExperienceTrajectoryChart } from '@/components/salary-predictor/experience-trajectory-chart'
import { CompanyComparisonMatrix } from '@/components/salary-predictor/company-comparison-matrix'
import { SkillImpactMatrix } from '@/components/salary-predictor/skill-impact-matrix'
import { MarketTrendsCard } from '@/components/salary-predictor/market-trends-card'
import { CareerInsightsCard } from '@/components/salary-predictor/career-insights-card'
import { SalaryExportModal } from '@/components/salary-predictor/salary-export-modal'
import { SalaryHistoryDrawer } from '@/components/salary-predictor/salary-history-drawer'
import {
  DollarSign,
  TrendingUp,
  Building2,
  Sparkles,
  BarChart3,
  Compass,
  History,
  Download,
  ShieldCheck,
  AlertCircle,
  Zap,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const STORAGE_KEY_HISTORY = 'aethercv_salary_predictor_history_v1'

const DEFAULT_SAMPLE_INPUT: SalaryPredictionInput = {
  inputSource: 'manual',
  jobTitle: 'Software Engineer',
  company: 'Google',
  country: 'India',
  stateProvince: 'Karnataka',
  city: 'Bangalore (Bengaluru)',
  experienceBracket: '3-5',
  yearsOfExperience: 3.5,
  education: "Bachelor's Degree",
  skills: ['TypeScript', 'React', 'Python', 'System Design', 'PostgreSQL', 'Docker'],
  industry: 'Tech / Software',
  employmentType: 'Full-time',
  workModel: 'Hybrid',
  targetCurrency: 'INR'
}

export default function GlobalSalaryPredictorPage() {
  const [input, setInput] = useState<SalaryPredictionInput>(DEFAULT_SAMPLE_INPUT)
  const [result, setResult] = useState<SalaryPredictionResult | null>(null)
  const [activeCurrency, setActiveCurrency] = useState<string>('INR')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('compensation')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Drawers & Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [historyItems, setHistoryItems] = useState<SalaryHistoryItem[]>([])

  // Load history from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setHistoryItems(parsed)
      }
    } catch {}
  }, [])

  // Auto-generate initial prediction on mount for zero-friction user preview
  useEffect(() => {
    let isMounted = true
    const runInitialPrediction = async () => {
      try {
        const initialRes = await predictGlobalSalary(DEFAULT_SAMPLE_INPUT)
        if (isMounted) {
          setResult(initialRes)
          setActiveCurrency(initialRes.primaryCurrency)
        }
      } catch (err: any) {
        console.error('Initial salary prediction error:', err)
      }
    }
    runInitialPrediction()
    return () => {
      isMounted = false
    }
  }, [])

  // Save to history helper
  const saveToHistory = (res: SalaryPredictionResult) => {
    const historyItem: SalaryHistoryItem = {
      id: res.id,
      title: `${res.input.jobTitle} at ${res.input.company || 'Market'}`,
      jobTitle: res.input.jobTitle,
      company: res.input.company || 'Market Standard',
      location: `${res.input.city}, ${res.input.country}`,
      totalCompensationFormatted: formatCurrencyAmount(
        res.metrics.totalCompensation.median,
        res.primaryCurrency
      ),
      timestamp: res.timestamp,
      data: res
    }

    setHistoryItems(prev => {
      const updated = [historyItem, ...prev.filter(h => h.id !== res.id)].slice(0, 25)
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  // Handle Predict Salary
  const handleRunPrediction = async () => {
    setErrorMessage(null)

    if (!input.jobTitle.trim()) {
      setErrorMessage('Please enter a job title to predict salary ranges.')
      return
    }

    setIsLoading(true)

    try {
      const [res] = await Promise.all([
        predictGlobalSalary(input),
        new Promise(r => setTimeout(r, 650))
      ])

      setResult(res)
      setActiveCurrency(res.primaryCurrency)
      saveToHistory(res)

      setTimeout(() => {
        const el = document.getElementById('salary-results-section')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to calculate salary prediction.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Load Demo Sample
  const handleLoadSample = async () => {
    setInput(DEFAULT_SAMPLE_INPUT)
    setErrorMessage(null)
    setIsLoading(true)
    try {
      const res = await predictGlobalSalary(DEFAULT_SAMPLE_INPUT)
      setResult(res)
      setActiveCurrency(res.primaryCurrency)
      saveToHistory(res)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Reset
  const handleReset = () => {
    setInput({
      ...DEFAULT_SAMPLE_INPUT,
      jobTitle: '',
      company: '',
      skills: []
    })
    setResult(null)
    setErrorMessage(null)
  }

  // History Actions
  const handleDeleteHistory = (id: string) => {
    setHistoryItems(prev => {
      const updated = prev.filter(h => h.id !== id)
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const handleClearAllHistory = () => {
    setHistoryItems([])
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY)
    } catch {}
  }

  const handleSelectHistoryItem = (item: SalaryHistoryItem) => {
    setInput(item.data.input)
    setResult(item.data)
    setActiveCurrency(item.data.primaryCurrency)
  }

  const tabs = [
    { id: 'compensation', label: 'Total Rewards Breakdown', icon: DollarSign },
    { id: 'experience', label: 'Experience Trajectory', icon: TrendingUp },
    { id: 'companies', label: 'Employer Benchmarks', icon: Building2 },
    { id: 'skills', label: 'Skill ROI Matrix', icon: Sparkles },
    { id: 'market', label: 'Market Momentum', icon: BarChart3 },
    { id: 'roadmap', label: 'Career Roadmap', icon: Compass }
  ]

  const baseTotalUsd = result
    ? result.metrics.totalCompensation.median / (result.exchangeRateToUSD || 1.0)
    : 100000

  return (
    <div className="min-h-screen bg-[#07101F] text-slate-100 pt-20 pb-28 px-4 sm:px-6 lg:px-8 selection:bg-blue-600/30 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide uppercase shadow-lg shadow-blue-500/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Global Salary Predictor</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Global Compensation Intelligence Powered by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400">
              Live Market Data
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Predict realistic base salaries, performance bonuses, and stock equity grants across 25+ countries, 100+ cities, and 40+ employers using verified market datasets.
          </p>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Sample Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>View History ({historyItems.length})</span>
            </button>

            {result && (
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Export Dossier</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto bg-rose-950/30 border border-rose-500/40 rounded-2xl p-4 flex items-start gap-3 shadow-lg shadow-rose-900/10">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-bold text-rose-300 uppercase block">Notice</span>
              <p className="text-xs text-rose-200 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Interactive Parameter Input Form */}
        <SalaryInputForm
          input={input}
          onChange={setInput}
          onPredict={handleRunPrediction}
          isLoading={isLoading}
          onLoadSample={handleLoadSample}
          onReset={handleReset}
        />

        {/* Results Section */}
        {result && (
          <div id="salary-results-section" className="space-y-6 pt-6">
            {/* Real-time Multi-Currency Converter Bar */}
            <CurrencyConverterBar
              activeCurrency={activeCurrency}
              onCurrencyChange={setActiveCurrency}
              baseAmountUsd={baseTotalUsd}
            />

            {/* Hero Compensation Gauge Card */}
            <SalaryHeroGauge
              result={result}
              activeCurrency={activeCurrency}
            />

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-none">
              {tabs.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Tab Views */}
            {activeTab === 'compensation' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CompanyComparisonMatrix
                  companies={result.companyComparisons}
                  activeCurrency={activeCurrency}
                />
                <SkillImpactMatrix skills={result.skillImpacts} />
              </div>
            )}

            {activeTab === 'experience' && (
              <ExperienceTrajectoryChart
                progression={result.experienceProgression}
                activeCurrency={activeCurrency}
              />
            )}

            {activeTab === 'companies' && (
              <CompanyComparisonMatrix
                companies={result.companyComparisons}
                activeCurrency={activeCurrency}
              />
            )}

            {activeTab === 'skills' && (
              <SkillImpactMatrix skills={result.skillImpacts} />
            )}

            {activeTab === 'market' && (
              <MarketTrendsCard trends={result.marketTrends} />
            )}

            {activeTab === 'roadmap' && (
              <CareerInsightsCard insights={result.careerInsights} />
            )}

            {/* Next Steps Cross-Module Recommendation Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-cyan-950/40 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Ready to optimize your profile to reach this salary tier?
                </h4>
                <p className="text-xs text-slate-400">
                  Audit your resume against 200+ role requirements or generate tailored application packages.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/skill-gap-analyzer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <span>Skill Gap Analyzer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/resume-builder"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition"
                >
                  Resume Builder
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History Drawer */}
      <SalaryHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onSelect={handleSelectHistoryItem}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearAllHistory}
      />

      {/* Export Modal */}
      <SalaryExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        result={result}
      />
    </div>
  )
}
