'use client'

import React, { useState, useEffect } from 'react'
import { SavedInterviewSession, OverallInterviewResult } from '@/types/interview-prep'
import {
  getSavedInterviewSessions,
  deleteInterviewSession,
  clearAllInterviewSessions
} from '@/lib/interview-prep/storage'
import {
  History,
  X,
  Trash2,
  Calendar,
  Building2,
  Briefcase,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react'

interface InterviewHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectSession: (result: OverallInterviewResult) => void
}

export function InterviewHistoryModal({
  isOpen,
  onClose,
  onSelectSession
}: InterviewHistoryModalProps) {
  const [sessions, setSessions] = useState<SavedInterviewSession[]>([])

  useEffect(() => {
    if (isOpen) {
      setSessions(getSavedInterviewSessions())
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteInterviewSession(id)
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your entire interview preparation history?')) {
      clearAllInterviewSessions()
      setSessions([])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0C162B] border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Interview Practice History</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Saved mock interview sessions and performance scores.
              </p>
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

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {sessions.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <History className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">No Saved Interviews Yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Complete a mock interview session to automatically track your scores and progress.
              </p>
            </div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                onClick={() => {
                  onSelectSession(session.result)
                  onClose()
                }}
                className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-blue-500/40 hover:bg-slate-850 cursor-pointer transition flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-300 transition-colors">
                      {session.role}
                    </span>
                    <span className="text-[10px] text-slate-400">@</span>
                    <span className="text-xs font-semibold text-slate-300">
                      {session.company}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{session.interviewType} Round</span>
                    <span>•</span>
                    <span>{session.questionsCount} Questions</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400 block">
                      {session.overallScore} / 100
                    </span>
                    <span className="text-[9.5px] font-semibold text-slate-400">
                      {session.verdict}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={e => handleDelete(e, session.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                    title="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-400">{sessions.length} sessions recorded</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-rose-400 hover:text-rose-300 font-semibold"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
