import { SalaryPredictionResult } from '@/types/salary-predictor'
import { formatCurrencyAmount } from './countries-data'

/**
 * Downloads a string as a client-side file
 */
export function downloadClientFile(content: string, fileName: string, mimeType: string) {
  if (typeof window === 'undefined') return
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Generates Plain Text Report
 */
export function generateSalaryTxtReport(result: SalaryPredictionResult): string {
  const divider = '================================================================================'
  const subDivider = '--------------------------------------------------------------------------------'
  const curr = result.primaryCurrency

  const lines: string[] = [
    divider,
    '               AETHERCV AI - GLOBAL SALARY PREDICTION REPORT',
    divider,
    `Target Role      : ${result.input.jobTitle}`,
    `Target Company   : ${result.input.company || 'Market Standard'}`,
    `Location         : ${result.input.city}, ${result.input.stateProvince}, ${result.input.country}`,
    `Experience Level : ${result.input.experienceBracket} (${result.input.yearsOfExperience} yrs)`,
    `Education        : ${result.input.education}`,
    `Employment Type  : ${result.input.employmentType} (${result.input.workModel})`,
    `Currency         : ${curr} (${result.currencySymbol})`,
    `Generated Date   : ${new Date(result.timestamp).toLocaleString()}`,
    subDivider,
    'COMPENSATION BREAKDOWN (ANNUALIZED)',
    subDivider,
    `Total Compensation (Median) : ${formatCurrencyAmount(result.metrics.totalCompensation.median, curr)}`,
    `Total Comp Range            : ${formatCurrencyAmount(result.metrics.totalCompensation.min, curr)} - ${formatCurrencyAmount(result.metrics.totalCompensation.max, curr)}`,
    `Base Salary (Median)        : ${formatCurrencyAmount(result.metrics.baseSalary.median, curr)}`,
    `Annual Performance Bonus    : ${formatCurrencyAmount(result.metrics.bonusEstimate.average, curr)} (~${result.metrics.bonusEstimate.percentage}%)`,
    `Stock RSUs / Equity (p.a.)  : ${formatCurrencyAmount(result.metrics.stockCompensation.average, curr)}`,
    `Estimated Signing Bonus     : ${formatCurrencyAmount(result.metrics.signingBonus.average, curr)}`,
    `Monthly Base Take-home Est. : ${formatCurrencyAmount(result.metrics.monthlySalary.median, curr)}`,
    `Estimated Hourly Rate       : ${result.currencySymbol}${result.metrics.hourlyRate.median}/hr`,
    '',
    divider,
    'EXPERIENCE LEVEL PROGRESSION',
    divider,
    ...result.experienceProgression.map(
      ep => `${ep.bracket.padEnd(30)} : ${ep.formattedMedian.padEnd(20)} ${ep.isCurrentLevel ? '<-- [CURRENT LEVEL]' : ''}`
    ),
    '',
    divider,
    'SKILL SALARY IMPACT MATRIX',
    divider,
    ...result.skillImpacts.slice(0, 8).map(
      si => `[${si.currentStatus.toUpperCase()}] ${si.skill.padEnd(32)} : ${si.formattedIncrease.padEnd(16)} (Demand: ${si.demandLevel})`
    ),
    '',
    divider,
    'COMPANY PEER COMPARISONS',
    divider,
    ...result.companyComparisons.map(
      cc => `${cc.companyName.padEnd(25)} | Total: ${cc.formattedTotal.padEnd(15)} | Base: ${formatCurrencyAmount(cc.baseSalary, curr)} | Diff: ${cc.diffVsCurrentPercent >= 0 ? '+' : ''}${cc.diffVsCurrentPercent}%`
    ),
    '',
    divider,
    'CAREER PROGRESSION INSIGHTS',
    divider,
    'Next Recommended Roles:',
    ...result.careerInsights.nextCareerRoles.map(
      nr => `  - ${nr.title} (${nr.timeframe}): Expected ${nr.formattedSalary} (+${nr.expectedIncreasePercent}%)`
    ),
    '',
    'High ROI Certifications:',
    ...result.careerInsights.certificationsToObtain.map(
      c => `  - ${c.name} [${c.provider}]: ${c.roi}`
    ),
    '',
    divider,
    `Data Source : ${result.marketTrends.dataSourceLabel}`,
    `Sample Period: ${result.marketTrends.dataSamplePeriod} | Confidence: ${result.marketTrends.confidenceScore}%`,
    divider
  ]

  return lines.join('\n')
}

/**
 * Generates Markdown Report
 */
export function generateSalaryMarkdownReport(result: SalaryPredictionResult): string {
  const curr = result.primaryCurrency

  return `# AetherCV AI — Global Salary Prediction Report

> **Target Role:** ${result.input.jobTitle}  
> **Company:** ${result.input.company || 'Market Standard'}  
> **Location:** ${result.input.city}, ${result.input.stateProvince}, ${result.input.country}  
> **Experience:** ${result.input.experienceBracket} (${result.input.yearsOfExperience} years)  
> **Date:** ${new Date(result.timestamp).toLocaleDateString()}  
> **Confidence Score:** ${result.marketTrends.confidenceScore}%  

---

## 💰 1. Compensation Summary

| Metric | Amount (${curr}) |
| :--- | :--- |
| **Total Compensation (Median)** | **${formatCurrencyAmount(result.metrics.totalCompensation.median, curr)}** |
| **Total Comp Range** | ${formatCurrencyAmount(result.metrics.totalCompensation.min, curr)} – ${formatCurrencyAmount(result.metrics.totalCompensation.max, curr)} |
| **Base Salary** | ${formatCurrencyAmount(result.metrics.baseSalary.median, curr)} |
| **Performance Bonus (Avg.)** | ${formatCurrencyAmount(result.metrics.bonusEstimate.average, curr)} (~${result.metrics.bonusEstimate.percentage}%) |
| **Stock RSUs / Equity (Annualized)** | ${formatCurrencyAmount(result.metrics.stockCompensation.average, curr)} |
| **Signing Bonus** | ${formatCurrencyAmount(result.metrics.signingBonus.average, curr)} |
| **Monthly Base** | ${formatCurrencyAmount(result.metrics.monthlySalary.median, curr)} |
| **Hourly Rate Equivalent** | ${result.currencySymbol}${result.metrics.hourlyRate.median}/hr |

---

## 📈 2. Experience Level Progression

| Career Stage | Median Annual Compensation | Status |
| :--- | :--- | :--- |
${result.experienceProgression
  .map(
    ep => `| ${ep.bracket} | **${ep.formattedMedian}** | ${ep.isCurrentLevel ? '🎯 **Your Current Level**' : '—'} |`
  )
  .join('\n')}

---

## 🚀 3. Skill Impact & Salary Boost

| Skill | Status | Estimated Salary Boost | Market Demand |
| :--- | :--- | :--- | :--- |
${result.skillImpacts
  .slice(0, 8)
  .map(
    si => `| ${si.skill} | ${si.currentStatus === 'possessed' ? '✅ In Resume' : '💡 Recommended'} | **${si.formattedIncrease}** | ${si.demandLevel} |`
  )
  .join('\n')}

---

## 🏢 4. Multi-Company Comparison

| Company | Tier | Total Compensation | Difference vs Target |
| :--- | :--- | :--- | :--- |
${result.companyComparisons
  .map(
    cc => `| **${cc.companyName}** | ${cc.companyTier} | **${cc.formattedTotal}** | ${cc.diffVsCurrentPercent >= 0 ? '+' : ''}${cc.diffVsCurrentPercent}% |`
  )
  .join('\n')}

---

## 🧭 5. Career Progression Roadmap

${result.careerInsights.salaryProgressionRoadmap
  .map(sp => `- **${sp.year}:** ${sp.role} → **${sp.formattedSalary}**`)
  .join('\n')}

### Recommended Certifications
${result.careerInsights.certificationsToObtain.map(c => `- **${c.name}** (${c.provider}) — *${c.roi}*`).join('\n')}

---

*Report generated by [AetherCV AI Global Salary Predictor](https://aethercv-ai.vercel.app/global-salary-predictor)*  
*Source: ${result.marketTrends.dataSourceLabel}*
`
}

/**
 * Generates JSON Report
 */
export function generateSalaryJsonReport(result: SalaryPredictionResult): string {
  return JSON.stringify(result, null, 2)
}

/**
 * Opens Clean Printable HTML Window for PDF Export
 */
export function printSalaryPdfReport(result: SalaryPredictionResult) {
  if (typeof window === 'undefined') return

  const curr = result.primaryCurrency
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to view and download the PDF report.')
    return
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>AetherCV AI - Global Salary Report - ${result.input.jobTitle}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 30px;
      line-height: 1.5;
    }
    .header {
      border-bottom: 2px solid #2563eb;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .header h1 {
      margin: 0 0 6px 0;
      color: #1e3a8a;
      font-size: 24px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      background: #f8fafc;
      padding: 14px;
      border-radius: 8px;
      margin-bottom: 24px;
      font-size: 13px;
    }
    .hero-stat {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      margin-bottom: 24px;
    }
    .hero-stat .label {
      font-size: 13px;
      color: #1e40af;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .hero-stat .value {
      font-size: 32px;
      font-weight: 800;
      color: #1d4ed8;
      margin: 8px 0;
    }
    .hero-stat .sub {
      font-size: 13px;
      color: #475569;
    }
    h2 {
      font-size: 16px;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: 600;
      color: #334155;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      font-size: 11px;
      color: #64748b;
      text-align: center;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>AetherCV AI — Global Salary Prediction Report</h1>
    <div style="font-size: 13px; color: #64748b;">
      Role: <strong>${result.input.jobTitle}</strong> at <strong>${result.input.company || 'Market Standard'}</strong> • ${result.input.city}, ${result.input.country}
    </div>
  </div>

  <div class="meta-grid">
    <div><strong>Location:</strong> ${result.input.city}, ${result.input.stateProvince}, ${result.input.country}</div>
    <div><strong>Experience:</strong> ${result.input.experienceBracket} (${result.input.yearsOfExperience} yrs)</div>
    <div><strong>Education:</strong> ${result.input.education}</div>
    <div><strong>Work Model:</strong> ${result.input.workModel} (${result.input.employmentType})</div>
    <div><strong>Currency:</strong> ${curr} (${result.currencySymbol})</div>
    <div><strong>Date Generated:</strong> ${new Date(result.timestamp).toLocaleDateString()}</div>
  </div>

  <div class="hero-stat">
    <div class="label">Estimated Total Annual Compensation (Median)</div>
    <div class="value">${formatCurrencyAmount(result.metrics.totalCompensation.median, curr)}</div>
    <div class="sub">Market Range: ${formatCurrencyAmount(result.metrics.totalCompensation.min, curr)} — ${formatCurrencyAmount(result.metrics.totalCompensation.max, curr)}</div>
  </div>

  <h2>1. Detailed Compensation Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Minimum</th>
        <th>Median</th>
        <th>Maximum</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Base Salary</strong></td>
        <td>${formatCurrencyAmount(result.metrics.baseSalary.min, curr)}</td>
        <td>${formatCurrencyAmount(result.metrics.baseSalary.median, curr)}</td>
        <td>${formatCurrencyAmount(result.metrics.baseSalary.max, curr)}</td>
      </tr>
      <tr>
        <td><strong>Annual Performance Bonus</strong></td>
        <td>${formatCurrencyAmount(result.metrics.bonusEstimate.min, curr)}</td>
        <td>${formatCurrencyAmount(result.metrics.bonusEstimate.average, curr)}</td>
        <td>${formatCurrencyAmount(result.metrics.bonusEstimate.max, curr)}</td>
      </tr>
      <tr>
        <td><strong>Stock RSUs / Equity (p.a.)</strong></td>
        <td>${formatCurrencyAmount(result.metrics.stockCompensation.min, curr)}</td>
        <td>${formatCurrencyAmount(result.metrics.stockCompensation.average, curr)}</td>
        <td>${formatCurrencyAmount(result.metrics.stockCompensation.max, curr)}</td>
      </tr>
      <tr>
        <td><strong>Total Annual Compensation</strong></td>
        <td><strong>${formatCurrencyAmount(result.metrics.totalCompensation.min, curr)}</strong></td>
        <td><strong>${formatCurrencyAmount(result.metrics.totalCompensation.median, curr)}</strong></td>
        <td><strong>${formatCurrencyAmount(result.metrics.totalCompensation.max, curr)}</strong></td>
      </tr>
    </tbody>
  </table>

  <h2>2. Experience Level Progression</h2>
  <table>
    <thead>
      <tr>
        <th>Experience Bracket</th>
        <th>Median Total Compensation</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${result.experienceProgression
        .map(
          ep => `<tr>
            <td>${ep.bracket}</td>
            <td><strong>${ep.formattedMedian}</strong></td>
            <td>${ep.isCurrentLevel ? '🎯 Current Level' : '—'}</td>
          </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h2>3. Company Peer Comparison</h2>
  <table>
    <thead>
      <tr>
        <th>Company</th>
        <th>Tier</th>
        <th>Total Compensation</th>
        <th>Comparison</th>
      </tr>
    </thead>
    <tbody>
      ${result.companyComparisons
        .map(
          cc => `<tr>
            <td><strong>${cc.companyName}</strong></td>
            <td>${cc.companyTier}</td>
            <td><strong>${cc.formattedTotal}</strong></td>
            <td>${cc.diffVsCurrentPercent >= 0 ? '+' : ''}${cc.diffVsCurrentPercent}%</td>
          </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h2>4. Skills Salary Boost Potential</h2>
  <table>
    <thead>
      <tr>
        <th>High Value Skill</th>
        <th>Status</th>
        <th>Potential Annual Boost</th>
        <th>Market Demand</th>
      </tr>
    </thead>
    <tbody>
      ${result.skillImpacts
        .slice(0, 6)
        .map(
          si => `<tr>
            <td>${si.skill}</td>
            <td>${si.currentStatus === 'possessed' ? '✅ In Resume' : '💡 Recommended'}</td>
            <td><strong>${si.formattedIncrease}</strong></td>
            <td>${si.demandLevel}</td>
          </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    AetherCV AI Platform • https://aethercv-ai.vercel.app/global-salary-predictor<br/>
    ${result.marketTrends.dataSourceLabel} • Confidence: ${result.marketTrends.confidenceScore}%
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}
