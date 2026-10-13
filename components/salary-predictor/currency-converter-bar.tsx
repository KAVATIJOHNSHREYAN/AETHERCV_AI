'use client'

import React from 'react'
import { CURRENCY_RATES, formatCurrencyAmount } from '@/lib/salary-predictor/countries-data'
import { Coins, ArrowRightLeft } from 'lucide-react'

interface CurrencyConverterBarProps {
  activeCurrency: string
  onCurrencyChange: (currency: string) => void
  baseAmountUsd: number
}

const POPULAR_CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD', 'AED', 'JPY', 'CHF']

export function CurrencyConverterBar({
  activeCurrency,
  onCurrencyChange,
  baseAmountUsd
}: CurrencyConverterBarProps) {
  const currentRate = CURRENCY_RATES[activeCurrency] || CURRENCY_RATES.USD

  return (
    <div className="bg-[#0C162B]/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
          <ArrowRightLeft className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-white block">Multi-Currency Global Converter</span>
          <span className="text-[11px] text-slate-400 block">
            1 USD = {currentRate.rateToUSD} {currentRate.code} • Live FX benchmark rates
          </span>
        </div>
      </div>

      {/* Currency Switch Chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {POPULAR_CURRENCIES.map(cCode => {
          const cObj = CURRENCY_RATES[cCode]
          const isSelected = activeCurrency === cCode
          const convertedEst = baseAmountUsd * (cObj?.rateToUSD || 1.0)

          return (
            <button
              key={cCode}
              type="button"
              onClick={() => onCurrencyChange(cCode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{cObj?.symbol}</span>
              <span>{cCode}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
