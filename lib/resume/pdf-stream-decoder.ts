import zlib from 'zlib'

/**
 * Robust stream decompressor for PDF files.
 * Uses exact byte index boundaries to find all stream ... endstream blocks,
 * decompressing /Filter /FlateDecode streams and extracting both literal strings
 * and UTF-16BE hex strings from BT...ET text blocks and object streams.
 */
export function decodePdfFlateStreams(buffer: Buffer): string {
  const allText: string[] = []
  const streamMarker = Buffer.from('stream')
  const endMarker = Buffer.from('endstream')

  let searchPos = 0
  const rawStreams: Buffer[] = []

  while (searchPos < buffer.length - streamMarker.length) {
    const sIdx = buffer.indexOf(streamMarker, searchPos)
    if (sIdx === -1) break

    let start = sIdx + streamMarker.length
    // Skip newline after stream keyword (\r\n, \n, or \r)
    if (buffer[start] === 0x0d && buffer[start + 1] === 0x0a) {
      start += 2
    } else if (buffer[start] === 0x0a || buffer[start] === 0x0d) {
      start += 1
    }

    const eIdx = buffer.indexOf(endMarker, start)
    if (eIdx === -1) break

    let end = eIdx
    // Trim trailing newline before endstream
    if (end > start && buffer[end - 1] === 0x0a) end--
    if (end > start && buffer[end - 1] === 0x0d) end--

    if (end > start) {
      rawStreams.push(buffer.subarray(start, end))
    }
    searchPos = eIdx + endMarker.length
  }

  for (const rawChunk of rawStreams) {
    let decompressed = ''

    // 1. Standard zlib inflate
    try {
      decompressed = zlib.inflateSync(rawChunk).toString('latin1')
    } catch {
      // 2. Raw deflate inflate
      try {
        decompressed = zlib.inflateRawSync(rawChunk).toString('latin1')
      } catch {
        // 3. Fall back to raw chunk text
        decompressed = rawChunk.toString('latin1')
      }
    }

    if (!decompressed) continue

    // Extract text from text blocks or whole stream
    extractTextFromDecompressedStream(decompressed, allText)
  }

  // Also check uncompressed text in the entire buffer
  extractTextFromDecompressedStream(buffer.toString('latin1'), allText)

  // Deduplicate consecutive words and assemble
  const combined = allText.join(' ').replace(/\s+/g, ' ').trim()
  return combined
}

function extractTextFromDecompressedStream(content: string, out: string[]) {
  // 1. Literal strings: (text) Tj or ' or "
  const tjMatches = content.match(/\(([^)]*)\)\s*(?:Tj|'|")/g) || []
  for (const m of tjMatches) {
    const t = m
      .replace(/^\(/, '')
      .replace(/\)\s*(?:Tj|'|")$/, '')
      .replace(/\\([()\\])/g, '$1')
      .trim()
    if (t && t.length > 0 && !out.includes(t)) {
      out.push(t)
    }
  }

  // 2. Array strings: [(t1) 12 (t2)] TJ
  const arrayMatches = content.match(/\[([\s\S]*?)\]\s*TJ/g) || []
  for (const m of arrayMatches) {
    const parts = m.match(/\(([^)]*)\)/g) || []
    for (const p of parts) {
      const t = p.slice(1, -1).replace(/\\([()\\])/g, '$1').trim()
      if (t) out.push(t)
    }

    // Hex strings inside array: <004B0041>
    const hexParts = m.match(/<([0-9a-fA-F]+)>/g) || []
    for (const h of hexParts) {
      const decoded = decodeHexPdfString(h.slice(1, -1))
      if (decoded) out.push(decoded)
    }
  }

  // 3. Standalone hex strings: <004B0041> Tj
  const hexTj = content.match(/<([0-9a-fA-F]+)>\s*(?:Tj|'|")/g) || []
  for (const h of hexTj) {
    const hex = h.replace(/^</, '').replace(/>\s*(?:Tj|'|")$/, '')
    const decoded = decodeHexPdfString(hex)
    if (decoded) out.push(decoded)
  }
}

function decodeHexPdfString(hex: string): string {
  if (!hex || hex.length < 2) return ''
  let str = ''

  // Case A: 16-bit big-endian hex (e.g. 00480065006C006C006F -> Hello)
  if (hex.length >= 4 && hex.length % 4 === 0 && hex.startsWith('00')) {
    for (let k = 0; k < hex.length; k += 4) {
      const code = parseInt(hex.substring(k, k + 4), 16)
      if (code >= 32 && code <= 126) {
        str += String.fromCharCode(code)
      } else if (code === 10 || code === 13) {
        str += ' '
      }
    }
    return str.trim()
  }

  // Case B: Standard 8-bit ASCII hex
  if (hex.length % 2 === 0) {
    for (let k = 0; k < hex.length; k += 2) {
      const code = parseInt(hex.substring(k, k + 2), 16)
      if (code >= 32 && code <= 126) {
        str += String.fromCharCode(code)
      } else if (code === 10 || code === 13) {
        str += ' '
      }
    }
    return str.trim()
  }

  return ''
}
