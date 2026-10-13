import { OverallInterviewResult } from '@/types/interview-prep'

/**
 * Generates a clean, professional TXT Dossier for the candidate's interview session
 */
export function generateInterviewTxtReport(result: OverallInterviewResult): string {
  const dateStr = new Date(result.createdAt).toLocaleDateString()
  const sep = '================================================================================'

  return `${sep}
AETHERCV AI — ENTERPRISE AI INTERVIEW PREPARATION DOSSIER
CONFIDENTIAL CANDIDATE EVALUATION & RECRUITER REPORT
${sep}

DATE: ${dateStr}
CANDIDATE TARGET: ${result.input.jobRole}
TARGET EMPLOYER: ${result.input.company} (${result.input.country})
EXPERIENCE LEVEL: ${result.input.experienceLevel.toUpperCase()}
DIFFICULTY: ${result.input.difficulty.toUpperCase()}
ROUND TYPE: ${result.input.interviewType.toUpperCase()}
DURATION: ${result.durationMinutes} Minutes

${sep}
OVERALL RECRUITER VERDICT & SCORING
${sep}
OVERALL SCORE: ${result.overallScore} / 100
RECRUITER VERDICT: ${result.verdict.toUpperCase()}
RECRUITER IMPRESSION:
${result.recruiterImpression}

CORE COMPETENCY BENCHMARKS:
• Technical Accuracy:         ${result.metrics.technicalAccuracy} / 100
• Problem Solving & Logic:    ${result.metrics.problemSolving} / 100
• Executive Communication:    ${result.metrics.communication} / 100
• Confidence & Poise:         ${result.metrics.confidence} / 100
• STAR Method Structure:      ${result.metrics.starMethod} / 100
• Leadership & Ownership:     ${result.metrics.leadership} / 100
• Grammar & Professionalism:  ${result.metrics.grammarProfessionalism} / 100

${sep}
CANDIDATE STRENGTHS & KEY DIFFERENTIATORS
${sep}
${result.strengthsSummary.map((s, i) => `${i + 1}. ${s}`).join('\n')}

${sep}
AREAS FOR IMMEDIATE IMPROVEMENT
${sep}
${result.weaknessesSummary.map((w, i) => `${i + 1}. ${w}`).join('\n')}

${sep}
COMPANY-SPECIFIC INTERVIEW INSIGHTS (${result.input.company})
${sep}
${result.companyInsights.candidateReportDisclaimer}
• Interview Difficulty: ${result.companyInsights.interviewDifficulty}
• Hiring Focus: ${result.companyInsights.hiringTrend}
• Frequently Asked Topics: ${result.companyInsights.frequentlyAskedTopics.join(', ')}
• Most Tested Skills: ${result.companyInsights.mostTestedSkills.join(', ')}

Typical Interview Flow:
${result.companyInsights.commonInterviewFlow.map(f => `  ${f}`).join('\n')}

${sep}
ROUND-BY-ROUND TRANSCRIPT & DETAILED EVALUATION
${sep}
${result.questions
  .map((q, idx) => {
    return `
ROUND ${idx + 1}: [${q.category.toUpperCase()}]
INTERVIEWER: ${q.interviewerPersona} (${q.interviewerTitle})
QUESTION:
${q.questionText}

CANDIDATE RESPONSE:
${q.userAnswer || '[No response recorded]'}

${
  q.followUpAnswer
    ? `FOLLOW-UP QUESTION:
${q.activeFollowUpQuestion || ''}
FOLLOW-UP RESPONSE:
${q.followUpAnswer}
`
    : ''
}
EVALUATION:
• Round Score: ${q.evaluation?.score || 0} / 100
• Technical Accuracy: ${q.evaluation?.technicalAccuracy || 0} / 100
• Communication Rating: ${q.evaluation?.communicationRating || 0} / 100

STRENGTHS:
${(q.evaluation?.strengths || []).map(s => `  + ${s}`).join('\n')}

WEAKNESSES:
${(q.evaluation?.weaknesses || []).map(w => `  - ${w}`).join('\n')}

IDEAL RECRUITER ANSWER:
${q.evaluation?.idealRecruiterAnswer || 'N/A'}
--------------------------------------------------------------------------------`
  })
  .join('\n')}

${sep}
ACTIONABLE PREPARATION NEXT STEPS
${sep}
${result.actionableNextSteps.map((step, i) => `[Step ${i + 1}] ${step}`).join('\n')}

${sep}
Verified on AETHERCV AI Interview Preparation Suite
Live Market Trends Aggregated Platform
${sep}
`
}

/**
 * Generates a structured Markdown Dossier
 */
export function generateInterviewMarkdownReport(result: OverallInterviewResult): string {
  const dateStr = new Date(result.createdAt).toLocaleDateString()

  return `# AETHERCV AI — Enterprise Interview Evaluation Dossier
**Target Position:** ${result.input.jobRole} at **${result.input.company}** (${result.input.country})  
**Date:** ${dateStr} | **Duration:** ${result.durationMinutes} mins | **Difficulty:** ${result.input.difficulty.toUpperCase()}

---

## 🎯 Executive Recruiter Verdict: **${result.verdict}** (${result.overallScore}/100)

> **Recruiter Impression:**  
> ${result.recruiterImpression}

### Core Competency Metrics
| Competency | Score | Benchmark Status |
| :--- | :--- | :--- |
| **Technical Accuracy** | ${result.metrics.technicalAccuracy}/100 | ${result.metrics.technicalAccuracy >= 75 ? '✅ Exceeds Bar' : '⚠️ Needs Focus'} |
| **Problem Solving** | ${result.metrics.problemSolving}/100 | ${result.metrics.problemSolving >= 75 ? '✅ Exceeds Bar' : '⚠️ Needs Focus'} |
| **Communication** | ${result.metrics.communication}/100 | ${result.metrics.communication >= 75 ? '✅ Clear & Executive' : '⚠️ Improve Structure'} |
| **Confidence & Delivery** | ${result.metrics.confidence}/100 | ${result.metrics.confidence >= 75 ? '✅ Poised' : '⚠️ Hesitant'} |
| **STAR Method Structure** | ${result.metrics.starMethod}/100 | ${result.metrics.starMethod >= 75 ? '✅ Structured' : '⚠️ Missing Results'} |
| **Leadership & Ownership**| ${result.metrics.leadership}/100 | ${result.metrics.leadership >= 75 ? '✅ High Ownership' : '⚠️ Moderate'} |

---

## 🏢 Company Insights: ${result.input.company}
*${result.companyInsights.candidateReportDisclaimer}*

- **Difficulty Rating:** ${result.companyInsights.interviewDifficulty}
- **Hiring Trend:** ${result.companyInsights.hiringTrend}
- **Frequently Tested Skills:** ${result.companyInsights.mostTestedSkills.join(', ')}
- **Top Tested Topics:** ${result.companyInsights.frequentlyAskedTopics.join(', ')}

---

## 📝 Round-by-Round Transcripts & AI Feedback

${result.questions
  .map((q, idx) => {
    return `### Round ${idx + 1}: ${q.category.toUpperCase()} — Score: ${q.evaluation?.score || 0}/100
**Interviewer:** ${q.interviewerPersona} (*${q.interviewerTitle}*)  
**Question:**  
> ${q.questionText}

**Your Answer:**  
${q.userAnswer || '*No answer provided*'}

${
  q.followUpAnswer
    ? `**Follow-Up Question:**  
> ${q.activeFollowUpQuestion}  
**Follow-Up Answer:**  
${q.followUpAnswer}`
    : ''
}

**Strengths:**  
${(q.evaluation?.strengths || []).map(s => `- ${s}`).join('\n')}

**Weaknesses:**  
${(q.evaluation?.weaknesses || []).map(w => `- ${w}`).join('\n')}

**Ideal Recruiter Answer:**  
> ${q.evaluation?.idealRecruiterAnswer || 'N/A'}

---`
  })
  .join('\n\n')}

## 🚀 Recommended Action Plan
${result.actionableNextSteps.map((step, idx) => `${idx + 1}. **${step}**`).join('\n')}

*Generated by AETHERCV AI — AI Interview Preparation Suite*
`
}

/**
 * Downloads client-side files
 */
export function downloadInterviewFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Triggers a clean print dialog for PDF saving
 */
export function printInterviewPdfReport(result: OverallInterviewResult) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to generate the printable PDF report.')
    return
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>AETHERCV AI Interview Dossier - ${result.input.jobRole} at ${result.input.company}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; line-height: 1.5; padding: 20px; font-size: 13px; }
    h1 { font-size: 22px; color: #0f172a; border-bottom: 2px solid #2563eb; padding-bottom: 6px; margin-bottom: 4px; }
    h2 { font-size: 16px; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 24px; }
    h3 { font-size: 14px; color: #0284c7; margin-top: 16px; margin-bottom: 6px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; }
    .strong-hire { background: #dcfce7; color: #166534; }
    .hire { background: #e0f2fe; color: #0369a1; }
    .leaning { background: #fef3c7; color: #92400e; }
    .needs-imp { background: #fee2e2; color: #991b1b; }
    .meta-table, .metrics-table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 16px; }
    .meta-table td, .metrics-table th, .metrics-table td { padding: 6px 10px; border: 1px solid #e2e8f0; font-size: 12px; }
    .metrics-table th { background: #f8fafc; font-weight: bold; text-align: left; }
    blockquote { background: #f8fafc; border-left: 3px solid #2563eb; padding: 8px 12px; margin: 8px 0; font-style: italic; }
    .transcript-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <h1>AETHERCV AI — Interview Performance Dossier</h1>
  <p style="color: #64748b; font-size: 11px;">Candidate Mock Interview Evaluation | Verified Live Aggregated Framework</p>

  <table class="meta-table">
    <tr>
      <td><strong>Candidate Role:</strong> ${result.input.jobRole}</td>
      <td><strong>Target Employer:</strong> ${result.input.company} (${result.input.country})</td>
    </tr>
    <tr>
      <td><strong>Overall Score:</strong> ${result.overallScore} / 100</td>
      <td><strong>Recruiter Verdict:</strong> <span class="badge ${result.verdict === 'Strong Hire' ? 'strong-hire' : result.verdict === 'Hire' ? 'hire' : result.verdict === 'Leaning Hire' ? 'leaning' : 'needs-imp'}">${result.verdict}</span></td>
    </tr>
  </table>

  <h2>Recruiter Impression & Analysis</h2>
  <blockquote>${result.recruiterImpression}</blockquote>

  <h2>Core Competency Benchmarks</h2>
  <table class="metrics-table">
    <tr>
      <th>Competency</th>
      <th>Score (100)</th>
      <th>Competency</th>
      <th>Score (100)</th>
    </tr>
    <tr>
      <td>Technical Accuracy</td>
      <td><strong>${result.metrics.technicalAccuracy}</strong></td>
      <td>Problem Solving</td>
      <td><strong>${result.metrics.problemSolving}</strong></td>
    </tr>
    <tr>
      <td>Communication</td>
      <td><strong>${result.metrics.communication}</strong></td>
      <td>Confidence</td>
      <td><strong>${result.metrics.confidence}</strong></td>
    </tr>
    <tr>
      <td>STAR Structure</td>
      <td><strong>${result.metrics.starMethod}</strong></td>
      <td>Professionalism</td>
      <td><strong>${result.metrics.grammarProfessionalism}</strong></td>
    </tr>
  </table>

  <h2>Questions Transcript & Evaluation</h2>
  ${result.questions
    .map(
      (q, i) => `
    <div class="transcript-box">
      <h3>Round ${i + 1}: ${q.category.toUpperCase()} — Score: ${q.evaluation?.score || 0}/100</h3>
      <p><strong>Interviewer:</strong> ${q.interviewerPersona} (${q.interviewerTitle})</p>
      <p><strong>Question:</strong> ${q.questionText}</p>
      <p><strong>Your Answer:</strong> ${q.userAnswer || 'No response recorded'}</p>
      <p><strong>Ideal Recruiter Answer:</strong> <em>${q.evaluation?.idealRecruiterAnswer || ''}</em></p>
    </div>
  `
    )
    .join('')}

  <h2>Actionable Preparation Next Steps</h2>
  <ol>
    ${result.actionableNextSteps.map(s => `<li>${s}</li>`).join('')}
  </ol>
</body>
</html>`

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
  setTimeout(() => {
    printWindow.print()
  }, 250)
}
