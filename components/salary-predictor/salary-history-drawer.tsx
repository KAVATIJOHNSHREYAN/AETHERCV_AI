'use client'

import React from 'react'
import { SalaryHistoryItem } from '@/types/salary-predictor'
import { History, X, Trash2, ArrowRight, Building, MapPin, Calendar } from 'lucide-react'

interface SalaryHistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: SalaryHistoryItem[]
  onSelect: (item: SalaryHistoryItem) => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

export function SalaryHistoryDrawer({
  isOpen,
  onClose,
  items,
  onSelect,
  onDelete,
  onClearAll
}: SalaryHistoryDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0C162B] border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Estimation History</h3>
                <span className="text-[11px] text-slate-400">{items.length} saved assessments</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <span>No previous salary evaluations saved yet.</span>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item)
                    onClose()
                  }}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/50 transition-all cursor-pointer group space-y-2 relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                      {item.jobTitle}
                    </h4>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {item.totalCompensationFormatted}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-500" />
                      {item.company || 'Market Standard'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {item.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        onDelete(item.id)
                      }}
                      className="text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClearAll}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/30 hover:border-rose-500/30 border border-slate-800 text-slate-400 hover:text-rose-300 text-xs font-semibold transition"
              >
                Clear History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
