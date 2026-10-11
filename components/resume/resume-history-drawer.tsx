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
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md h-full bg-card border-l border-border shadow-2xl p-6 flex flex-col justify-between z-10 overflow-hidden"
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-poppins text-foreground">Analysis History</h3>
                  <p className="text-xs text-muted-foreground font-outfit">Previously evaluated resumes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close history"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
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
                    className="p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/60 border border-border/40 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div
                      className="cursor-pointer min-w-0 flex-1"
                      onClick={() => {
                        onSelect(item)
                        onClose()
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold font-poppins text-foreground truncate">
                          {item.candidateName || item.fileName}
                        </h4>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                          item.atsScore >= 80
                            ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
                            : item.atsScore >= 60
                            ? 'text-amber-600 bg-amber-500/10 border-amber-500/20'
                            : 'text-red-600 bg-red-500/10 border-red-500/20'
                        }`}>
                          {item.atsScore} pts
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-outfit mt-1">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {item.fileName}
                        </span>
                        <span>•</span>
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
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-xs text-muted-foreground space-y-2">
                  <FileText className="w-8 h-8 mx-auto opacity-40" />
                  <p>No past analyses recorded yet.</p>
                  <p className="text-[11px]">Upload or scan a resume to track progress over time.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          {history.length > 0 && (
            <div className="pt-4 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                className="w-full text-xs font-outfit text-red-500 hover:text-red-600 hover:bg-red-500/10"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Clear All History
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
