import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { categoryDefinitions } from '@/data/videos'
import type { VideoCategory, VideoItem } from '@/data/videos'

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm', '.ogg', '.m4v']
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg']

function resolveLinkVideo(url: string): { sourceType: 'youtube' | 'vimeo' | 'drive' | 'direct'; src: string; embedUrl?: string } {
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/)
  if (ytMatch) {
    return { sourceType: 'youtube', src: url, embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0` }
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return { sourceType: 'vimeo', src: url, embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` }
  }

  // Google Drive share link — extract the file ID out of either
  // /file/d/{ID}/view or ?id={ID} style URLs
  const driveMatch = url.match(/drive\.google\.com\/(?:file\/d\/([\w-]+)|open\?id=([\w-]+)|uc\?id=([\w-]+))/)
  if (driveMatch) {
    const fileId = driveMatch[1] || driveMatch[2] || driveMatch[3]
    return { sourceType: 'drive', src: url, embedUrl: `https://drive.google.com/file/d/${fileId}/preview` }
  }

  // Direct file link (Cloudinary etc.) — native <video> playback
  return { sourceType: 'direct', src: url }
}

export async function GET() {
  const publicDir = path.join(process.cwd(), 'public')
  const videosBaseDir = path.join(publicDir, 'videos')

  try {
    // 1. Ensure public/videos base directory exists
    if (!fs.existsSync(videosBaseDir)) {
      fs.mkdirSync(videosBaseDir, { recursive: true })
    }

    // 2. Scan each category definition
    const resolvedCategories: VideoCategory[] = categoryDefinitions.map((cat) => {
      const catDirName = cat.folderName
      const catDir = path.join(videosBaseDir, catDirName)

      // Ensure subdirectory exists
      if (!fs.existsSync(catDir)) {
        fs.mkdirSync(catDir, { recursive: true })
        // Add a .gitkeep so empty directories are tracked
        fs.writeFileSync(path.join(catDir, '.gitkeep'), '', 'utf-8')
      }

      // Read files in the directory
      const files = fs.readdirSync(catDir)

      // Separate video files, text files, and images
      const videoFiles: string[] = []
      const textFiles = new Map<string, string>() // baseName -> contents
      const imageFiles = new Map<string, string>() // baseName -> file name with ext

      // Parse metadata.json if present
      let localMetadata: Record<string, { title?: string; description?: string; driveUrl?: string; url?: string; thumbnail?: string }> = {}
      const metadataPath = path.join(catDir, 'metadata.json')
      if (fs.existsSync(metadataPath)) {
        try {
          const content = fs.readFileSync(metadataPath, 'utf-8')
          localMetadata = JSON.parse(content)
        } catch (e) {
          console.error(`Error parsing metadata.json in ${catDirName}:`, e)
        }
      }

      files.forEach((file) => {
        const ext = path.extname(file).toLowerCase()
        const baseName = path.parse(file).name.toLowerCase()

        if (VIDEO_EXTENSIONS.includes(ext)) {
          videoFiles.push(file)
        } else if (ext === '.txt') {
          try {
            const filePath = path.join(catDir, file)
            const content = fs.readFileSync(filePath, 'utf-8').trim()
            textFiles.set(baseName, content)
          } catch (e) {
            console.error(`Error reading text metadata file ${file}:`, e)
          }
        } else if (IMAGE_EXTENSIONS.includes(ext)) {
          imageFiles.set(baseName, file)
        }
      })

      // Construct VideoItem list
      const videoItems: VideoItem[] = videoFiles.map((file, idx) => {
        const ext = path.extname(file)
        const nameWithoutExt = path.parse(file).name
        const baseKey = nameWithoutExt.toLowerCase()

        // 1. Determine Title
        let title = nameWithoutExt
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase())
        
        // 2. Determine Description
        let description = `Showcase clip in ${cat.title}`

        // 3. Determine Drive URL
        let driveUrl = ''

        // Overlay with metadata.json if exists for this file
        if (localMetadata[file]) {
          const entry = localMetadata[file]
          if (entry.title) title = entry.title
          if (entry.description) description = entry.description
          if (entry.driveUrl) driveUrl = entry.driveUrl
        } else if (localMetadata[nameWithoutExt]) {
          const entry = localMetadata[nameWithoutExt]
          if (entry.title) title = entry.title
          if (entry.description) description = entry.description
          if (entry.driveUrl) driveUrl = entry.driveUrl
        }

        // Overlay with specific .txt file drive URL if present
        if (textFiles.has(baseKey)) {
          driveUrl = textFiles.get(baseKey) || ''
        }

        // 4. Find Video Thumbnail
        let thumbnail = '/images/placeholder.svg'
        // First try to look for exact image name matches (e.g. video1.jpg for video1.mp4)
        if (imageFiles.has(baseKey)) {
          thumbnail = `/videos/${catDirName}/${imageFiles.get(baseKey)}`
        }

        return {
          id: `${cat.id}_item_${idx + 1}`,
          title,
          src: `/videos/${catDirName}/${file}`,
          driveUrl,
          description,
          thumbnail,
          sourceType: 'local',
        }
      })

      // Parse and append link items from metadata.json
      let linkIdx = 0
      Object.entries(localMetadata).forEach(([key, entry]) => {
        if (entry && entry.url) {
          const isLocalFile = videoFiles.some((f) => {
            const nameWithoutExt = path.parse(f).name
            return f === key || nameWithoutExt === key
          })

          if (!isLocalFile) {
            linkIdx++
            const resolved = resolveLinkVideo(entry.url)
            
            // 1. Determine Title
            const title = entry.title || key
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, (char) => char.toUpperCase())

            // 2. Determine Description
            const description = entry.description || `Showcase clip in ${cat.title}`

            // 3. Determine Drive URL
            const driveUrl = entry.driveUrl || (resolved.sourceType === 'drive' ? entry.url : '')

            // 4. Find Video Thumbnail
            let thumbnail = '/images/placeholder.svg'
            if (entry.thumbnail) {
              thumbnail = entry.thumbnail
            } else if (imageFiles.has(key.toLowerCase())) {
              thumbnail = `/videos/${catDirName}/${imageFiles.get(key.toLowerCase())}`
            }

            videoItems.push({
              id: `${cat.id}_link_${linkIdx}`,
              title,
              src: resolved.src,
              driveUrl,
              description,
              thumbnail,
              sourceType: resolved.sourceType,
              embedUrl: resolved.embedUrl,
            })
          }
        }
      })

      // Determine category overall cover thumbnail
      let catThumbnail = '/images/placeholder.svg'
      // Try to find cover.jpg/png or thumbnail.jpg/png in directory
      const coverKeys = ['cover', 'thumbnail', 'folder']
      let foundCover = false
      for (const k of coverKeys) {
        if (imageFiles.has(k)) {
          catThumbnail = `/videos/${catDirName}/${imageFiles.get(k)}`
          foundCover = true
          break
        }
      }
      // Fallback to the first video's thumbnail if no specific cover image exists
      if (!foundCover && videoItems.length > 0 && videoItems[0].thumbnail !== '/images/placeholder.svg') {
        catThumbnail = videoItems[0].thumbnail
      }

      // Determine category preview video URL - only from 'local' or 'direct' videos
      const previewItem = videoItems.find((item) => item.sourceType === 'local' || item.sourceType === 'direct')
      const previewUrl = previewItem ? previewItem.src : ''

      return {
        id: cat.id,
        title: cat.title,
        folderName: cat.folderName,
        description: cat.description,
        count: videoItems.length,
        videos: videoItems,
        thumbnail: catThumbnail,
        previewUrl,
      }
    })

    return NextResponse.json(resolvedCategories)
  } catch (error) {
    console.error('Error scanning video directory structure:', error)
    return NextResponse.json({ error: 'Failed to scan videos' }, { status: 500 })
  }
}
