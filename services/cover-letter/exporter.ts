import { jsPDF } from 'jspdf'
import { GeneratedCoverLetter } from '@/types/cover-letter'

// 1. Export as PDF
export function exportCoverLetterToPdf(letter: GeneratedCoverLetter, filename?: string) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter'
  })

  const margin = 54 // 0.75 in
  const pageWidth = doc.internal.pageSize.getWidth()
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // Candidate Name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(30, 80, 218) // #1E50DA
  doc.text(letter.candidateName || 'Candidate', margin, y)
  y += 18

  // Contact info
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(100, 116, 139)
  const contactParts = [
    letter.candidateEmail,
    letter.candidatePhone,
    letter.candidateLocation
  ].filter(Boolean)
  if (contactParts.length > 0) {
    doc.text(contactParts.join('  •  '), margin, y)
    y += 18
  }

  // Divider
  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(1)
  doc.line(margin, y, pageWidth - margin, y)
  y += 24

  // Date
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(51, 65, 85)
  doc.text(letter.date || new Date().toLocaleDateString(), margin, y)
  y += 20

  // Recipient info
  doc.setFont('helvetica', 'bold')
  doc.text(letter.recipientName || 'Hiring Team', margin, y)
  y += 14
  doc.setFont('helvetica', 'normal')
  if (letter.recipientTitle) {
    doc.text(letter.recipientTitle, margin, y)
    y += 14
  }
  doc.text(letter.companyName, margin, y)
  y += 22

  // Greeting
  doc.setFont('helvetica', 'bold')
  doc.text(letter.greeting, margin, y)
  y += 20

  // Paragraphs
  const paragraphs = [
    letter.openingParagraph,
    letter.skillsParagraph,
    letter.experienceParagraph,
    letter.projectsParagraph,
    letter.whyCompanyParagraph,
    letter.closingParagraph
  ].filter(Boolean)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  doc.setTextColor(30, 41, 59)

  for (const p of paragraphs) {
    const lines = doc.splitTextToSize(p, contentWidth)
    if (y + lines.length * 15 > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(lines, margin, y, { lineHeightFactor: 1.45 })
    y += lines.length * 15 + 14
  }

  // Sign off
  if (y + 40 > doc.internal.pageSize.getHeight() - margin) {
    doc.addPage()
    y = margin
  }
  doc.text('Sincerely,', margin, y)
  y += 22
  doc.setFont('helvetica', 'bold')
  doc.text(letter.candidateName || 'Candidate', margin, y)

  const finalName = filename || `${(letter.companyName || 'Company').replace(/\s+/g, '_')}_Cover_Letter.pdf`
  doc.save(finalName)
}

// 2. Export as DOCX (XML Blob compatible with MS Word)
export function exportCoverLetterToDocx(letter: GeneratedCoverLetter, filename?: string) {
  const paragraphs = [
    letter.openingParagraph,
    letter.skillsParagraph,
    letter.experienceParagraph,
    letter.projectsParagraph,
    letter.whyCompanyParagraph,
    letter.closingParagraph
  ].filter(Boolean)

  const xmlContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:rPr><w:b/><w:sz w:val="32"/></w:rPr><w:t>${escapeXml(letter.candidateName)}</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:color w:val="64748B"/><w:sz w:val="18"/></w:rPr><w:t>${escapeXml([letter.candidateEmail, letter.candidatePhone, letter.candidateLocation].filter(Boolean).join(' | '))}</w:t></w:r></w:p>
    <w:p><w:r><w:t/></w:r></w:p>
    <w:p><w:r><w:t>${escapeXml(letter.date)}</w:t></w:r></w:p>
    <w:p><w:r><w:t>${escapeXml(letter.recipientName)}</w:t></w:r></w:p>
    <w:p><w:r><w:t>${escapeXml(letter.recipientTitle)}</w:t></w:r></w:p>
    <w:p><w:r><w:t>${escapeXml(letter.companyName)}</w:t></w:r></w:p>
    <w:p><w:r><w:t/></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${escapeXml(letter.greeting)}</w:t></w:r></w:p>
    ${paragraphs.map(p => `
    <w:p><w:r><w:t>${escapeXml(p)}</w:t></w:r></w:p>
    `).join('')}
    <w:p><w:r><w:t/></w:r></w:p>
    <w:p><w:r><w:t>Sincerely,</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${escapeXml(letter.candidateName)}</w:t></w:r></w:p>
  </w:body>
</w:document>`

  const blob = new Blob([xmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  triggerDownload(blob, filename || `${(letter.companyName || 'Company').replace(/\s+/g, '_')}_Cover_Letter.docx`)
}

// 3. Export as Plain Text
export function exportCoverLetterToTxt(letter: GeneratedCoverLetter, filename?: string) {
  const blob = new Blob([letter.fullPlainText], { type: 'text/plain;charset=utf-8' })
  triggerDownload(blob, filename || `${(letter.companyName || 'Company').replace(/\s+/g, '_')}_Cover_Letter.txt`)
}

// Helper XML escaper
function escapeXml(unsafe: string = ''): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Helper trigger download
function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
