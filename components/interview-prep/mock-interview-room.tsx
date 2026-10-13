'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  InterviewQuestion,
  InterviewInput,
  QuestionEvaluation
} from '@/types/interview-prep'
import {
  evaluateAnswer,
  generateIntelligentFollowUp
} from '@/lib/interview-prep/interview-engine'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  Sparkles,
  Send,
  Code2,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Bot,
  User,
  Zap,
  Layers
} from 'lucide-react'

interface MockInterviewRoomProps {
  input: InterviewInput
  questions: InterviewQuestion[]
  onCompleteInterview: (updatedQuestions: InterviewQuestion[], durationMinutes: number) => void
  onExit: () => void
}

export function MockInterviewRoom({
  input,
  questions: initialQuestions,
  onCompleteInterview,
  onExit
}: MockInterviewRoomProps) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>(initialQuestions)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [followUpAnswer, setFollowUpAnswer] = useState('')
  const [isFollowUpMode, setIsFollowUpMode] = useState(false)
  const [activeFollowUpText, setActiveFollowUpText] = useState('')

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Voice Mode & TTS
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  // Webcam Practice Mode
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Guidance toggle
  const [showGuidance, setShowGuidance] = useState(false)
  const [isEvaluatingCurrent, setIsEvaluatingCurrent] = useState(false)
  const [evaluatedPreview, setEvaluatedPreview] = useState<QuestionEvaluation | null>(null)

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Sync answer state when switching question
  useEffect(() => {
    if (currentQuestion) {
      setCurrentAnswer(currentQuestion.userAnswer || (currentQuestion.codeTemplate || ''))
      setFollowUpAnswer(currentQuestion.followUpAnswer || '')
      setIsFollowUpMode(Boolean(currentQuestion.activeFollowUpQuestion))
      setActiveFollowUpText(currentQuestion.activeFollowUpQuestion || '')
      setEvaluatedPreview(currentQuestion.evaluation || null)
    }
  }, [currentIndex, currentQuestion])

  // Clean up speech synthesis & webcam on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Speech Recognition setup (Voice Mode)
  const toggleListening = () => {
    if (typeof window === 'undefined') return

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setSpeechError('Speech-to-Text is not supported in this browser. Please use Google Chrome or Edge.')
      return
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsListening(false)
      return
    }

    try {
      setSpeechError(null)
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        let transcript = ''
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' '
        }
        if (isFollowUpMode) {
          setFollowUpAnswer(transcript.trim())
        } else {
          setCurrentAnswer(transcript.trim())
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event)
        if (event.error !== 'no-speech') {
          setSpeechError(`Speech recognition error: ${event.error}`)
        }
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (err: any) {
      setSpeechError('Could not start microphone.')
      setIsListening(false)
    }
  }

  // Text-to-Speech (Recruiter Voice)
  const toggleRecruiterSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const textToSpeak = isFollowUpMode
      ? activeFollowUpText
      : `${currentQuestion.interviewerPersona} says: ${currentQuestion.questionText}`

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.rate = 0.95
    utterance.pitch = 1.0

    // Try to pick a natural English voice
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David'))
    )
    if (preferredVoice) utterance.voice = preferredVoice

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  // Webcam Toggle
  const toggleWebcam = async () => {
    if (isWebcamActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
      setIsWebcamActive(false)
      return
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setIsWebcamActive(true)
      } else {
        alert('Webcam is not available in your browser.')
      }
    } catch (err) {
      console.warn('Webcam access error:', err)
      alert('Could not access webcam. Please check camera permissions in browser settings.')
    }
  }

  // Generate Intelligent Follow-Up
  const handleTriggerFollowUp = () => {
    if (!currentAnswer.trim()) {
      alert('Please provide your initial answer before asking for a follow-up challenge.')
      return
    }

    const followUpQuestion = generateIntelligentFollowUp(currentQuestion, currentAnswer, input)
    setActiveFollowUpText(followUpQuestion)
    setIsFollowUpMode(true)

    // Update in question state
    const updated = [...questions]
    updated[currentIndex] = {
      ...updated[currentIndex],
      userAnswer: currentAnswer,
      isFollowUpActive: true,
      activeFollowUpQuestion: followUpQuestion
    }
    setQuestions(updated)
  }

  // Submit Answer & Evaluate
  const handleSaveAndEvaluate = () => {
    if (!currentAnswer.trim()) {
      alert('Please enter or speak your answer before proceeding.')
      return
    }

    setIsEvaluatingCurrent(true)

    const fullAnswerText = isFollowUpMode && followUpAnswer
      ? `${currentAnswer}\n\n[FOLLOW-UP: ${activeFollowUpText}]\n${followUpAnswer}`
      : currentAnswer

    const evalResult = evaluateAnswer(currentQuestion, fullAnswerText, input)

    const updated = [...questions]
    updated[currentIndex] = {
      ...updated[currentIndex],
      userAnswer: currentAnswer,
      followUpAnswer: isFollowUpMode ? followUpAnswer : undefined,
      answeredAt: new Date().toISOString(),
      evaluation: evalResult
    }

    setQuestions(updated)
    setEvaluatedPreview(evalResult)
    setIsEvaluatingCurrent(false)
  }

  // Next Question
  const handleNextQuestion = () => {
    if (!evaluatedPreview) {
      handleSaveAndEvaluate()
    }

    if (isLastQuestion) {
      const minutes = Math.max(1, Math.round(elapsedSeconds / 60))
      onCompleteInterview(questions, minutes)
    } else {
      setCurrentIndex(prev => prev + 1)
      setEvaluatedPreview(null)
      setIsFollowUpMode(false)
      setActiveFollowUpText('')
      setFollowUpAnswer('')
    }
  }

  // Format Elapsed Time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (!currentQuestion) return null

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-300">
      {/* Top Bar: Recruiter Banner & Controls */}
      <div className="bg-[#0C162B] border border-blue-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Recruiter Persona */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-blue-500/20">
              {currentQuestion.interviewerPersona
                .split(' ')
                .map(n => n[0])
                .join('')}
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0C162B]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white">
                {currentQuestion.interviewerPersona}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold font-mono">
                {currentQuestion.category.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentQuestion.interviewerTitle}</p>
          </div>
        </div>

        {/* Room Status & Timer */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <div className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
            Round <strong className="text-white">{currentIndex + 1}</strong> of {questions.length}
          </div>

          <button
            type="button"
            onClick={onExit}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 transition"
          >
            Exit Room
          </button>
        </div>
      </div>

      {/* Main Grid: Question & Answer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Question, Recruiter Audio, Answer Input */}
        <div className="lg:col-span-8 space-y-4">
          {/* Question Card */}
          <div className="bg-[#0C162B] border border-blue-500/20 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-blue-400" />
                Interviewer Question #{currentIndex + 1}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleRecruiterSpeech}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                    isSpeaking
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Listen to interviewer voice"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Mute Audio' : 'Listen'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowGuidance(!showGuidance)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hints</span>
                  {showGuidance ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Question Text */}
            <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
              {currentQuestion.questionText}
            </p>

            {/* System Design / Coding Constraints */}
            {currentQuestion.systemDesignConstraints && (
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                <span className="text-[11px] font-bold text-cyan-400 uppercase">Scale Constraints:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
                  {currentQuestion.systemDesignConstraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recruiter Intent & Suggested Key Points Guidance */}
            {showGuidance && (
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs space-y-2.5 animate-in fade-in duration-150">
                <div>
                  <span className="font-bold text-blue-300 block mb-0.5">Recruiter Focus:</span>
                  <p className="text-slate-300">{currentQuestion.recruiterIntent}</p>
                </div>
                <div>
                  <span className="font-bold text-blue-300 block mb-1">Recommended Angles to Hit:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentQuestion.suggestedKeyPoints.map((pt, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        ✓ {pt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Follow-Up Card (If Triggered) */}
          {isFollowUpMode && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Live Recruiter Probing Follow-Up
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                  Deep Dive
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                {activeFollowUpText}
              </p>
            </div>
          )}

          {/* Answer Workspace Card */}
          <div className="bg-[#0C162B] border border-blue-500/20 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4">
            {/* Input Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  {isFollowUpMode ? 'Your Response to Follow-Up' : 'Your Candidate Answer'}
                </span>
              </div>

              {/* Voice, Code, and Tool controls */}
              <div className="flex items-center gap-2">
                {/* Voice Mode Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 font-semibold ${
                    isListening
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/20 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                  title="Speech-to-Text microphone recording"
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Recording (Click to stop)' : 'Voice Answer'}</span>
                </button>

                {/* Webcam toggle */}
                <button
                  type="button"
                  onClick={toggleWebcam}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                    isWebcamActive
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Toggle webcam practice mirror"
                >
                  {isWebcamActive ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                  <span>{isWebcamActive ? 'Hide Camera' : 'Camera Mode'}</span>
                </button>
              </div>
            </div>

            {speechError && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Textarea Answer Area */}
            <div className="relative">
              <textarea
                rows={isFollowUpMode ? 4 : 8}
                value={isFollowUpMode ? followUpAnswer : currentAnswer}
                onChange={e => {
                  if (isFollowUpMode) setFollowUpAnswer(e.target.value)
                  else setCurrentAnswer(e.target.value)
                }}
                placeholder={
                  currentQuestion.category === 'dsa'
                    ? '// Write your algorithmic solution or explain your approach here...\nfunction solution() {\n  // ...\n}'
                    : 'Speak using the Voice Answer button above, or type your structured response (Situation, Task, Action, Result)...'
                }
                className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed resize-y"
              />
            </div>

            {/* Answer Footer Info & Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span>
                  Words:{' '}
                  <strong className="text-white">
                    {(isFollowUpMode ? followUpAnswer : currentAnswer)
                      .split(/\s+/)
                      .filter(Boolean).length}
                  </strong>
                </span>
                {!isFollowUpMode && (
                  <button
                    type="button"
                    onClick={handleTriggerFollowUp}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Request Recruiter Follow-Up Challenge</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveAndEvaluate}
                  disabled={isEvaluatingCurrent}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-medium transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Evaluate Answer</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <span>{isLastQuestion ? 'Finish & Generate Dossier' : 'Next Round'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Real-Time Evaluation Preview Banner (If Answer Evaluated) */}
          {evaluatedPreview && (
            <div className="bg-[#0C162B] border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-md shadow-xl space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span className="text-xs font-bold text-white">Round Evaluation Feedback</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Score:</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {evaluatedPreview.score} / 100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-semibold text-emerald-300">Strengths Highlighted:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                    {evaluatedPreview.strengths.slice(0, 2).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-semibold text-amber-300">Key Improvement Tip:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {evaluatedPreview.improvementTips[0] || 'Clarify production scale constraints.'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300">
                <span className="font-semibold text-blue-300 block mb-1">Ideal Recruiter Framing:</span>
                <p className="text-[11px] italic text-slate-300 leading-relaxed">
                  {evaluatedPreview.idealRecruiterAnswer}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Webcam Mirror & Round Navigator */}
        <div className="lg:col-span-4 space-y-4">
          {/* Webcam Mirror Card */}
          {isWebcamActive && (
            <div className="bg-[#0C162B] border border-blue-500/30 rounded-2xl p-3.5 backdrop-blur-md shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-blue-400" />
                  Interview Presence Mirror
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Live Video</span>
              </div>
              <div className="w-full aspect-video rounded-xl bg-black overflow-hidden relative border border-slate-800">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                Check your eye contact, lighting, and posture as you speak.
              </p>
            </div>
          )}

          {/* Round Navigation Checklist */}
          <div className="bg-[#0C162B] border border-blue-500/20 rounded-2xl p-5 backdrop-blur-md shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Interview Loop Progress
            </h4>

            <div className="space-y-1.5">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex
                const isAnswered = Boolean(q.evaluation)

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx)
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                      isCurrent
                        ? 'bg-blue-600/25 border-blue-500 text-white font-semibold'
                        : isAnswered
                        ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                      <span className="truncate">{q.category.replace('_', ' ').toUpperCase()}</span>
                    </div>

                    <div>
                      {isAnswered ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/50">
                          {q.evaluation?.score}%
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[10px] text-blue-300">In Progress</span>
                      ) : (
                        <span className="text-[10px] text-slate-600">Pending</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Interview Tips */}
          <div className="bg-[#0C162B] border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl text-xs space-y-2 text-slate-400">
            <h5 className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Recruiter Cheat Sheet
            </h5>
            <p className="leading-relaxed text-[11px]">
              • <strong>STAR Framework:</strong> Quantify results (&quot;reduced p99 latency by 35%&quot;).
            </p>
            <p className="leading-relaxed text-[11px]">
              • <strong>Trade-offs:</strong> Never claim one tech is universally best; explain why it fits these constraints.
            </p>
            <p className="leading-relaxed text-[11px]">
              • <strong>Reverse Questions:</strong> Prepare 2 sharp architectural questions for the recruiter at the end.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
