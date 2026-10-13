'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
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
  Layers,
  RefreshCw,
  Award,
  TrendingUp
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

  // Evaluation & Pipeline Loading State
  const [isEvaluatingCurrent, setIsEvaluatingCurrent] = useState(false)
  const [evaluatingStageText, setEvaluatingStageText] = useState('')
  const [evaluatedPreview, setEvaluatedPreview] = useState<QuestionEvaluation | null>(null)
  const [evalError, setEvalError] = useState<string | null>(null)
  const [showGuidance, setShowGuidance] = useState(false)

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  // Live Running Scores Calculation across answered questions
  const liveScores = useMemo(() => {
    const answered = questions.filter(q => q.evaluation)
    if (answered.length === 0) return null

    const count = answered.length
    const overall = Math.round(answered.reduce((a, b) => a + (b.evaluation?.score || 50), 0) / count)
    const tech = Math.round(answered.reduce((a, b) => a + (b.evaluation?.technicalAccuracy || 50), 0) / count)
    const comm = Math.round(answered.reduce((a, b) => a + (b.evaluation?.communicationRating || 50), 0) / count)
    const conf = Math.round(answered.reduce((a, b) => a + (b.evaluation?.confidenceScore || 50), 0) / count)

    return { overall, tech, comm, conf, count }
  }, [questions])

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Sync state when switching questions
  useEffect(() => {
    if (currentQuestion) {
      setCurrentAnswer(currentQuestion.userAnswer || (currentQuestion.codeTemplate || ''))
      setFollowUpAnswer(currentQuestion.followUpAnswer || '')
      setIsFollowUpMode(Boolean(currentQuestion.activeFollowUpQuestion))
      setActiveFollowUpText(currentQuestion.activeFollowUpQuestion || '')
      setEvaluatedPreview(currentQuestion.evaluation || null)
      setEvalError(null)
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

  // Speech Recognition (Voice Mode)
  const toggleListening = () => {
    if (typeof window === 'undefined') return

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setSpeechError('Speech-to-Text is not supported in this browser. Please use Google Chrome or Microsoft Edge.')
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
        if (isFollowUpMode && activeFollowUpText) {
          setFollowUpAnswer(transcript.trim())
        } else {
          setCurrentAnswer(transcript.trim())
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event)
        if (event.error !== 'no-speech') {
          setSpeechError(`Microphone notice: ${event.error}`)
        }
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (err: any) {
      setSpeechError('Could not start microphone. Please check permissions.')
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

    const textToSpeak = isFollowUpMode && activeFollowUpText
      ? `Follow up challenge: ${activeFollowUpText}`
      : `${currentQuestion.interviewerPersona} asks: ${currentQuestion.questionText}`

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.rate = 0.95
    utterance.pitch = 1.0

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

  // Webcam Mirror Toggle
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

  /**
   * Robust Backend API Call with Automatic Retry & Fallback
   */
  const requestEvaluationFromAPI = async (
    questionToEval: InterviewQuestion,
    answerText: string,
    retryCount = 0
  ): Promise<{ evaluation: QuestionEvaluation; followUpQuestion: string }> => {
    try {
      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate-answer',
          question: questionToEval,
          answer: answerText,
          input
        })
      })

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`)
      }

      const data = await res.json()
      if (!data.success || !data.evaluation) {
        throw new Error(data.error || 'Invalid API evaluation payload')
      }

      return {
        evaluation: data.evaluation,
        followUpQuestion: data.followUpQuestion || generateIntelligentFollowUp(questionToEval, answerText, input)
      }
    } catch (err: any) {
      console.warn(`Evaluation attempt ${retryCount + 1} failed:`, err)
      if (retryCount < 1) {
        // Auto-retry once after 400ms delay
        await new Promise(r => setTimeout(r, 400))
        return requestEvaluationFromAPI(questionToEval, answerText, retryCount + 1)
      }

      // Safe deterministic fallback ensures NO freeze and NO infinite loading
      const localEval = evaluateAnswer(questionToEval, answerText, input)
      const localFollowUp = generateIntelligentFollowUp(questionToEval, answerText, input)
      return {
        evaluation: localEval,
        followUpQuestion: localFollowUp
      }
    }
  }

  /**
   * Main Answer Submission Pipeline
   */
  const handleSubmitAnswer = async () => {
    const rawAnswer = currentAnswer.trim()
    if (!rawAnswer) {
      alert('Please type or speak your answer before submitting for evaluation.')
      return
    }

    setIsEvaluatingCurrent(true)
    setEvalError(null)

    try {
      // Stage 1
      setEvaluatingStageText('Evaluating your answer with AI recruiter engine...')
      await new Promise(r => setTimeout(r, 300))

      // Stage 2
      setEvaluatingStageText('Generating recruiter feedback, strengths & ideal response...')
      const fullAnswerText = isFollowUpMode && followUpAnswer.trim()
        ? `${rawAnswer}\n\n[FOLLOW-UP ANSWER: ${activeFollowUpText}]\n${followUpAnswer.trim()}`
        : rawAnswer

      const apiResult = await requestEvaluationFromAPI(currentQuestion, fullAnswerText)

      // Stage 3
      setEvaluatingStageText('Preparing intelligent probing follow-up challenge...')
      await new Promise(r => setTimeout(r, 200))

      // Safely apply result to questions state
      const updatedQ: InterviewQuestion = {
        ...currentQuestion,
        userAnswer: rawAnswer,
        followUpAnswer: isFollowUpMode ? followUpAnswer.trim() : undefined,
        answeredAt: new Date().toISOString(),
        evaluation: apiResult.evaluation,
        isFollowUpActive: true,
        activeFollowUpQuestion: apiResult.followUpQuestion
      }

      const newQuestions = questions.map((q, idx) => (idx === currentIndex ? updatedQ : q))
      setQuestions(newQuestions)
      setEvaluatedPreview(apiResult.evaluation)
      setActiveFollowUpText(apiResult.followUpQuestion)
      setIsFollowUpMode(true)
    } catch (err: any) {
      console.error('Submission pipeline failed:', err)
      setEvalError('A temporary network interruption occurred. Please click Retry.')
    } finally {
      setIsEvaluatingCurrent(false)
      setEvaluatingStageText('')
    }
  }

  /**
   * Submit Follow-Up Response Specifically
   */
  const handleSubmitFollowUp = async () => {
    if (!followUpAnswer.trim()) {
      alert('Please speak or type your response to the follow-up question.')
      return
    }

    setIsEvaluatingCurrent(true)
    setEvaluatingStageText('Evaluating your follow-up answer & updating score...')

    try {
      const combined = `${currentAnswer}\n\n[FOLLOW-UP RESPONSE: ${activeFollowUpText}]\n${followUpAnswer.trim()}`
      const apiResult = await requestEvaluationFromAPI(currentQuestion, combined)

      const updatedQ: InterviewQuestion = {
        ...currentQuestion,
        userAnswer: currentAnswer,
        followUpAnswer: followUpAnswer.trim(),
        answeredAt: new Date().toISOString(),
        evaluation: apiResult.evaluation
      }

      const newQuestions = questions.map((q, idx) => (idx === currentIndex ? updatedQ : q))
      setQuestions(newQuestions)
      setEvaluatedPreview(apiResult.evaluation)
    } catch (err: any) {
      setEvalError('Could not evaluate follow-up response. Please retry.')
    } finally {
      setIsEvaluatingCurrent(false)
      setEvaluatingStageText('')
    }
  }

  /**
   * Proceed to Next Round or Finalize
   */
  const handleProceedToNextRound = () => {
    // Construct the latest verified questions array synchronously
    let currentQ = questions[currentIndex]

    if (!currentQ.evaluation && currentAnswer.trim()) {
      // Evaluate synchronously if somehow not evaluated
      const quickEval = evaluateAnswer(currentQ, currentAnswer.trim(), input)
      currentQ = {
        ...currentQ,
        userAnswer: currentAnswer.trim(),
        evaluation: quickEval,
        answeredAt: new Date().toISOString()
      }
    }

    const verifiedQuestions = questions.map((q, idx) => (idx === currentIndex ? currentQ : q))
    setQuestions(verifiedQuestions)

    if (isLastQuestion) {
      const minutes = Math.max(1, Math.round(elapsedSeconds / 60))
      onCompleteInterview(verifiedQuestions, minutes)
    } else {
      setCurrentIndex(prev => prev + 1)
      setEvaluatedPreview(null)
      setIsFollowUpMode(false)
      setActiveFollowUpText('')
      setFollowUpAnswer('')
      setEvalError(null)
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
      {/* Top Bar: Recruiter Banner, Live Scores & Timer */}
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

        {/* Live Running Scores & Status */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {liveScores && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Score: <strong className="text-white font-bold">{liveScores.overall}%</strong></span>
            </div>
          )}

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

            {/* Scale Constraints (System Design) */}
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

            {/* Guidance hints */}
            {showGuidance && (
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs space-y-2.5 animate-in fade-in duration-150">
                <div>
                  <span className="font-bold text-blue-300 block mb-0.5">Recruiter Focus:</span>
                  <p className="text-slate-300">{currentQuestion.recruiterIntent}</p>
                </div>
                <div>
                  <span className="font-bold text-blue-300 block mb-1">Recommended Points to Cover:</span>
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

          {/* Follow-Up Card (If Triggered/Available) */}
          {isFollowUpMode && activeFollowUpText && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Live Recruiter Probing Challenge
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-semibold">
                  Follow-Up Round
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                {activeFollowUpText}
              </p>

              {/* Follow-up answer textarea if candidate wants to answer follow-up */}
              <div className="space-y-2 pt-1">
                <textarea
                  rows={3}
                  value={followUpAnswer}
                  onChange={e => setFollowUpAnswer(e.target.value)}
                  placeholder="Type or dictate your response to this follow-up challenge..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmitFollowUp}
                    disabled={isEvaluatingCurrent || !followUpAnswer.trim()}
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition disabled:opacity-50 flex items-center gap-1.5 shadow"
                  >
                    <span>Submit Follow-Up Response</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Answer Workspace Card */}
          <div className="bg-[#0C162B] border border-blue-500/20 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4">
            {/* Input Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">Your Candidate Answer</span>
              </div>

              {/* Voice and Video toggles */}
              <div className="flex items-center gap-2">
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

            {evalError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{evalError}</span>
                </div>
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Retry Evaluation
                </button>
              </div>
            )}

            {/* Answer Textarea */}
            <div className="relative">
              <textarea
                rows={8}
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                placeholder={
                  currentQuestion.category === 'dsa'
                    ? '// Write your algorithmic solution or explain your approach here...\nfunction solution() {\n  // ...\n}'
                    : 'Speak using the Voice Answer button above, or type your structured response (Situation, Task, Action, Result)...'
                }
                className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed resize-y"
              />
            </div>

            {/* Progressive Loading State Banner (Step 7) */}
            {isEvaluatingCurrent && (
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 flex items-center gap-3 animate-in fade-in duration-150">
                <RefreshCw className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">{evaluatingStageText}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Analyzing technical accuracy, communication depth, and recruiter benchmarks...
                  </p>
                </div>
              </div>
            )}

            {/* Answer Footer Info & Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span>
                  Words:{' '}
                  <strong className="text-white">
                    {currentAnswer.split(/\s+/).filter(Boolean).length}
                  </strong>
                </span>
                {evaluatedPreview && (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Evaluated ({evaluatedPreview.score}%)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Primary Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluatingCurrent || !currentAnswer.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEvaluatingCurrent ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Evaluating Answer...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>{evaluatedPreview ? 'Re-Evaluate Answer' : 'Submit & Evaluate Answer'}</span>
                    </>
                  )}
                </button>

                {/* Proceed Button */}
                <button
                  type="button"
                  onClick={handleProceedToNextRound}
                  disabled={isEvaluatingCurrent}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <span>{isLastQuestion ? 'Finish & Generate Dossier' : 'Proceed to Next Round'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Real-Time Evaluation Preview Banner (If Answer Evaluated) */}
          {evaluatedPreview && (
            <div className="bg-[#0C162B] border border-emerald-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white">Round Evaluation Feedback</span>
                    <span className="text-[11px] text-slate-400 block mt-0.2">
                      Recruiter metrics updated in real time
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Round Score</span>
                  <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                    {evaluatedPreview.score} / 100
                  </div>
                </div>
              </div>

              {/* Strengths & Improvement Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-semibold text-emerald-300">Strengths Highlighted:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    {evaluatedPreview.strengths.slice(0, 3).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-semibold text-amber-300">Actionable Improvement Tip:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {evaluatedPreview.improvementTips[0] || 'Incorporate explicit architectural trade-offs.'}
                  </p>
                </div>
              </div>

              {/* Ideal Recruiter Answer */}
              <div className="p-3.5 rounded-xl bg-blue-950/25 border border-blue-500/25 text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-blue-300 block">Ideal Recruiter Framing:</span>
                <p className="text-[11px] sm:text-xs italic text-slate-200 leading-relaxed">
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
                Maintain steady eye contact and clear posture while answering.
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
                        <span className="text-[10px] text-blue-300 font-semibold">Active</span>
                      ) : (
                        <span className="text-[10px] text-slate-600">Pending</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recruiter Cheat Sheet */}
          <div className="bg-[#0C162B] border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl text-xs space-y-2 text-slate-400">
            <h5 className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Recruiter Cheat Sheet
            </h5>
            <p className="leading-relaxed text-[11px]">
              • <strong>STAR Framework:</strong> Structure behavioral answers into Situation, Task, Action, and Result.
            </p>
            <p className="leading-relaxed text-[11px]">
              • <strong>Trade-offs:</strong> Explicitly explain why you chose this design over viable alternatives.
            </p>
            <p className="leading-relaxed text-[11px]">
              • <strong>Follow-Ups:</strong> Answering the recruiter follow-up challenge boosts your overall score.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
