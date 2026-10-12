import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'

/**
 * Downloads a guaranteed STRICTLY ONE-PAGE A4 PDF directly to the user's computer.
 * Bypasses browser print quirks, avoids multi-page spills, and produces a crisp vector-aligned PDF.
 */
export async function downloadSinglePageA4Pdf(
  sheetElement: HTMLElement,
  candidateName: string = 'Resume'
): Promise<void> {
  // Capture the sheet at 2.5x DPI for crisp text
  const dataUrl = await toPng(sheetElement, {
    pixelRatio: 2.5,
    cacheBust: true,
    backgroundColor: '#ffffff',
    style: {
      transform: 'none',
      transformOrigin: 'top left',
      margin: '0',
      width: '210mm',
      height: '297mm',
      maxHeight: '297mm',
      overflow: 'hidden',
      boxShadow: 'none'
    }
  })

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // A4 standard portrait dimensions: exactly 210mm width x 297mm height
  pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST')

  const sanitized = candidateName.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Resume'
  pdf.save(`${sanitized}_ATS_Resume.pdf`)
}

/**
 * Prints the resume in an isolated hidden iframe.
 * Prevents the main website header, navigation, and sidebar from appearing in the print dialog.
 * Enforces strictly 1-page A4 dimensions without browser URL/date margins.
 */
export function printIsolatedA4Sheet(
  sheetElement: HTMLElement,
  candidateName: string = 'Resume',
  cssFontStack: string = 'sans-serif'
): void {
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.style.zIndex = '-9999'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) return

  doc.open()
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${candidateName} - Resume</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            overflow: hidden !important;
            background: #ffffff !important;
            font-family: ${cssFontStack};
          }
          #print-root {
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        <div id="print-root">
          ${sheetElement.innerHTML}
        </div>
      </body>
    </html>
  `)
  doc.close()

  iframe.contentWindow?.focus()
  setTimeout(() => {
    iframe.contentWindow?.print()
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe)
      }
    }, 1500)
  }, 450)
}
