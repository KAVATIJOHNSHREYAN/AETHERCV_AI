'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResumeAnalysisHistoryItem } from '@/lib/resume/types'
import { History, X, Trash2, Calendar, FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ResumeHistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  history: ResumeAnalysisHistoryItem[]
  onSelect: (item: ResumeAnalysisHistoryItem) => void
  onClear: () => void
  onDelete: (id: string) => void
}

export function ResumeHistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear,
  onDelete
}: ResumeHistoryDrawerProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-md"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md h-full bg-[#0F172A] border-l border-blue-500/25 shadow-[-10px_0_40px_rgba(37,99,235,0.25)] p-6 flex flex-col justify-between z-10 overflow-hidden"
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-blue-500/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-sky-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-poppins text-white">Analysis History</h3>
                  <p className="text-xs text-slate-400 font-outfit">Previously evaluated resumes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close history"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-blue-600/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
              {history.length > 0 ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#08111F]/90 hover:bg-[#08111F] border border-blue-500/20 hover:border-sky-400/40 transition-all flex items-center justify-between gap-3 group shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
                  >
                    <div
                      className="cursor-pointer min-w-0 flex-1"
                      onClick={() => {
                        onSelect(item)
                        onClose()
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold font-poppins text-white truncate">
                          {item.candidateName || item.fileName}
                        </h4>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          item.atsScore >= 80
                            ? 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                            : item.atsScore >= 60
                            ? 'text-sky-300 bg-sky-500/10 border-sky-500/30'
                            : 'text-blue-300 bg-blue-500/10 border-blue-500/30'
                        }`}>
                          {item.atsScore} pts
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-outfit mt-1.5">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-sky-400" />
                          {item.fileName}
                        </span>
                        <span className="text-blue-500">•</span>
                        <span>
                          {new Date(item.timestamp).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Delete analysis"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(item.id)
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-sky-300 hover:bg-sky-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-sky-400/50" />
                  <p>No past analyses recorded yet.</p>
                  <p className="text-[11px]">Upload or scan a resume to track progress over time.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          {history.length > 0 && (
            <div className="pt-4 border-t border-blue-500/20">
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                className="w-full text-xs font-outfit bg-transparent border-blue-500/30 text-sky-300 hover:text-white hover:bg-blue-600/20 transition-all shadow-[0_0_12px_rgba(59,130,246,0.15)]"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                Clear All History
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
