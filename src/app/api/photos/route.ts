import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { photos as defaultPhotos } from '@/data/photos'

// A general helper to parse dimensions for PNG and WebP files from their headers
function getImageDimensions(filePath: string): { width: number; height: number } | null {
  try {
    const buffer = Buffer.alloc(30)
    const fd = fs.openSync(filePath, 'r')
    fs.readSync(fd, buffer, 0, 30, 0)
    fs.closeSync(fd)

    // Check PNG signature: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      // PNG width is at offset 16 (4 bytes Big Endian), height is at offset 20 (4 bytes Big Endian)
      const width = buffer.readUInt32BE(16)
      const height = buffer.readUInt32BE(20)
      if (width > 0 && height > 0) {
        return { width, height }
      }
    }

    // Check WebP signature: RIFF ???? WEBP
    if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      const type = buffer.toString('ascii', 12, 16)
      if (type === 'VP8X') {
        // VP8X extended: width is 3 bytes starting at 24, height is 3 bytes starting at 27 (little-endian)
        const width = (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)) + 1
        const height = (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)) + 1
        if (width > 0 && height > 0) {
          return { width, height }
        }
      } else if (type === 'VP8L') {
        // VP8L lossless: bits pack width/height.
        const b1 = buffer[21]
        const b2 = buffer[22]
        const b3 = buffer[23]
        const b4 = buffer[24]
        const width = (((b2 & 0x3f) << 8) | b1) + 1
        const height = (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)) + 1
        if (width > 0 && height > 0) {
          return { width, height }
        }
      } else if (type === 'VP8 ') {
        // VP8 lossy: width/height are at bytes 26-29 (2 bytes each, little-endian)
        const width = buffer.readUInt16LE(26) & 0x3fff
        const height = buffer.readUInt16LE(28) & 0x3fff
        if (width > 0 && height > 0) {
          return { width, height }
        }
      }
    }

    return null
  } catch (err) {
    console.error(`Error reading image dimensions for ${filePath}:`, err)
    return null
  }
}

export async function GET() {
  const galleryDir = path.join(process.cwd(), 'public', 'gallery')

  if (!fs.existsSync(galleryDir)) {
    try {
      fs.mkdirSync(galleryDir, { recursive: true })
    } catch (err) {
      console.error('Failed to create gallery dir:', err)
    }
    return NextResponse.json(defaultPhotos)
  }

  try {
    const files = fs.readdirSync(galleryDir)
    const photoFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp'
    })

    // If there are no images in the folder, return the defaultPhotos from src/data/photos.ts
    if (photoFiles.length === 0) {
      return NextResponse.json(defaultPhotos)
    }

    const dynamicPhotos = photoFiles.map((file, idx) => {
      const filePath = path.join(galleryDir, file)
      const dims = getImageDimensions(filePath)

      let aspect: 'square' | 'portrait' | 'landscape' = 'landscape'
      if (dims) {
        const ratio = dims.width / dims.height
        if (ratio > 1.2) {
          aspect = 'landscape'
        } else if (ratio < 0.8) {
          aspect = 'portrait'
        } else {
          aspect = 'square'
        }
      }

      // Format a clean alt name and try to infer the year
      const nameWithoutExt = path.parse(file).name
      const cleanName = nameWithoutExt.replace(/[-_]/g, ' ')
      const yearMatch = nameWithoutExt.match(/\b(20\d{2})\b/)
      const year = yearMatch ? yearMatch[1] : '2026'

      return {
        id: `p_${idx + 1}`,
        src: `/gallery/${file}`,
        alt: `AV Films product photography - ${cleanName}`,
        year,
        aspect,
      }
    })

    return NextResponse.json(dynamicPhotos)
  } catch (error) {
    console.error('Error reading gallery:', error)
    return NextResponse.json(defaultPhotos)
  }
}
