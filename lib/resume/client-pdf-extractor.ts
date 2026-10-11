/**
 * Client-Side PDF & Document Text Extractor
 * Loads Mozilla PDF.js dynamically in the browser to extract text with 100% fidelity.
 * Includes client-side fallbacks for DOCX and binary streams.
 */

declare global {
  interface Window {
    pdfjsLib?: any
  }
}

let pdfJsLoadingPromise: Promise<any> | null = null

const PDFJS_CDNS = [
  {
    script: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    worker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
  },
  {
    script: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
    worker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
  },
  {
    script: 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js',
    worker: 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
  }
]

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already in DOM
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })
}

export async function loadPdfJsLibrary(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only be loaded in the browser.')
  }

  if (window.pdfjsLib) {
    return window.pdfjsLib
  }

  if (pdfJsLoadingPromise) {
    return pdfJsLoadingPromise
  }

  pdfJsLoadingPromise = (async () => {
    let lastError: any = null
    for (const cdn of PDFJS_CDNS) {
      try {
        await loadScript(cdn.script)
        if (window.pdfjsLib) {
          try {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = cdn.worker
          } catch {
            // Worker setup optional
          }
          return window.pdfjsLib
        }
      } catch (err) {
        lastError = err
        console.warn(`[Client PDF] CDN load failed for ${cdn.script}, trying next...`)
      }
    }
    throw lastError || new Error('Could not load PDF.js from any available CDN.')
  })()

  return pdfJsLoadingPromise
}

/**
 * Extracts clean, line-separated text from a PDF file using Mozilla PDF.js.
 */
export async function extractTextFromPdfInBrowser(file: File): Promise<string> {
  console.log(`[Client PDF] Starting client-side extraction for ${file.name} (${file.size} bytes)...`)

  try {
    const pdfjs = await loadPdfJsLibrary()
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    })
    const pdfDoc = await loadingTask.promise

    console.log(`[Client PDF] Document loaded successfully, total pages: ${pdfDoc.numPages}`)

    const pageTexts: string[] = []

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum)
      const textContent = await page.getTextContent()

      // Reconstruct text lines with proper line breaks
      let lastY: number | null = null
      let pageStr = ''

      for (const item of textContent.items) {
        if (!item || typeof item.str !== 'string') continue

        const str = item.str
        const transform = item.transform
        const currentY = transform && transform.length >= 6 ? transform[5] : null

        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
          // New line detected by Y-coordinate delta
          pageStr += '\n' + str
        } else if (item.hasEOL) {
          pageStr += (pageStr ? ' ' : '') + str + '\n'
        } else {
          pageStr += (pageStr.endsWith('\n') || pageStr === '' ? '' : ' ') + str
        }

        if (currentY !== null) {
          lastY = currentY
        }
      }

      const trimmedPage = pageStr.trim()
      if (trimmedPage) {
        pageTexts.push(trimmedPage)
      }
    }

    const fullText = pageTexts.join('\n\n').trim()
    console.log(`[Client PDF] Successfully extracted ${fullText.length} characters across ${pdfDoc.numPages} pages.`)
    return fullText
  } catch (err: any) {
    console.warn('[Client PDF] PDF.js browser extraction error, attempting raw stream fallback:', err.message)
    return extractPdfRawClientFallback(file)
  }
}

/**
 * Client-side raw fallback if PDF.js is unavailable or blocked by browser extensions.
 */
async function extractPdfRawClientFallback(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    const textDecoder = new TextDecoder('latin1')
    const raw = textDecoder.decode(bytes)

    const matches: string[] = []
    // Match literal strings: (Sample Text) Tj
    const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g
    let match: RegExpExecArray | null

    while ((match = tjRegex.exec(raw)) !== null) {
      const clean = match[1].replace(/\\([()\\])/g, '$1').trim()
      if (clean && clean.length > 1) {
        matches.push(clean)
      }
    }

    // Match hex strings: <00480065> Tj
    const hexRegex = /<([0-9a-fA-F]+)>\s*(?:Tj|'|")/g
    while ((match = hexRegex.exec(raw)) !== null) {
      const hex = match[1]
      let s = ''
      if (hex.length >= 4 && hex.length % 4 === 0 && hex.startsWith('00')) {
        // UTF-16BE
        for (let i = 0; i < hex.length; i += 4) {
          const code = parseInt(hex.substring(i, i + 4), 16)
          if (code >= 32 && code <= 126) s += String.fromCharCode(code)
        }
      } else if (hex.length >= 2 && hex.length % 2 === 0) {
        for (let i = 0; i < hex.length; i += 2) {
          const code = parseInt(hex.substring(i, i + 2), 16)
          if (code >= 32 && code <= 126) s += String.fromCharCode(code)
        }
      }
      if (s.trim()) matches.push(s.trim())
    }

    const fallbackResult = matches.join(' ').replace(/\s+/g, ' ').trim()
    if (fallbackResult.length > 50) {
      console.log(`[Client PDF] Raw client fallback extracted ${fallbackResult.length} characters.`)
      return fallbackResult
    }
  } catch (fallbackErr) {
    console.warn('[Client PDF] Raw client fallback failed:', fallbackErr)
  }

  throw new Error('Could not extract text from PDF. The document may be an image scan, encrypted, or password-protected.')
}

/**
 * Client-Side DOCX text extractor using native ZIP & XML parsing.
 */
export async function extractTextFromDocxInBrowser(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    // Locate word/document.xml entry in ZIP
    let offset = 0
    while (offset < bytes.length - 30) {
      if (
        bytes[offset] === 0x50 &&
        bytes[offset + 1] === 0x4b &&
        bytes[offset + 2] === 0x03 &&
        bytes[offset + 3] === 0x04
      ) {
        const view = new DataView(buffer)
        const method = view.getUint16(offset + 8, true)
        const compressedSize = view.getUint32(offset + 18, true)
        const fileNameLen = view.getUint16(offset + 26, true)
        const extraLen = view.getUint16(offset + 28, true)

        const nameBytes = bytes.subarray(offset + 30, offset + 30 + fileNameLen)
        const entryName = new TextDecoder().decode(nameBytes)

        const dataStart = offset + 30 + fileNameLen + extraLen
        if (entryName === 'word/document.xml' && compressedSize > 0) {
          const compressedData = bytes.subarray(dataStart, dataStart + compressedSize)

          if (method === 8 && typeof DecompressionStream !== 'undefined') {
            const ds = new DecompressionStream('deflate-raw')
            const writer = ds.writable.getWriter()
            writer.write(compressedData)
            writer.close()
            const response = new Response(ds.readable)
            const decompressedText = await response.text()
            const cleanText = decompressedText
              .replace(/<w:p[^>]*>/g, '\n')
              .replace(/<[^>]+>/g, '')
              .replace(/\s+/g, ' ')
              .trim()
            if (cleanText.length > 20) {
              return cleanText
            }
          }
        }
        offset = dataStart + compressedSize
      } else {
        offset++
      }
    }
  } catch (err: any) {
    console.warn('[Client DOCX] Client-side DOCX extraction note:', err?.message)
  }

  throw new Error('Unable to parse DOCX document text on client.')
}
