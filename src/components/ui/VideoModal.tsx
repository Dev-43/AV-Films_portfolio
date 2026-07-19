'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { VideoCategory, VideoItem } from '@/data/videos'

interface VideoModalProps {
  category: VideoCategory
  isOpen: boolean
  onClose: () => void
}

function DriveIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 22h20L12 2z" />
      <path d="M12 2v20" />
      <path d="M17 12H7" />
    </svg>
  )
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

export default function VideoModal({ category, isOpen, onClose }: VideoModalProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Initialize active video when category changes or modal opens
  useEffect(() => {
    if (category && category.videos.length > 0) {
      setActiveVideo(category.videos[0])
    } else {
      setActiveVideo(null)
    }
  }, [category, isOpen])

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // disable scroll
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Auto-play active video when selected
  useEffect(() => {
    const video = videoRef.current
    if (video && activeVideo) {
      video.load()
      video.play().catch(() => {
        // Handle auto-play constraints
      })
    }
  }, [activeVideo])

  if (!isOpen) return null

  const getWhatsAppInquiryUrl = (videoName: string) => {
    const text = `Hello AV Films! I clicked on the video "${videoName}" under "${category.title}" and would like to inquire about this style of work.`
    return `https://wa.me/917517218149?text=${encodeURIComponent(text)}`
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative z-10 w-full h-full md:h-[85vh] max-w-6xl bg-[#0f0e0d] border border-white/5 md:rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-2xl"
        >
          {/* Close button (top right float) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full bg-charcoal/80 border border-white/10 flex items-center justify-center text-offwhite hover:text-avGold hover:border-avGold/30 transition-all duration-300 cursor-pointer"
            aria-label="Close modal"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Left panel: Custom Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center relative aspect-video lg:aspect-auto overflow-hidden">
            {activeVideo ? (
              <video
                ref={videoRef}
                src={activeVideo.src}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
                aria-label={`Playing ${activeVideo.title}`}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted">
                <svg className="w-12 h-12 stroke-current opacity-40 animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span className="text-xs font-mono tracking-widest uppercase">No video clip found</span>
              </div>
            )}
          </div>

          {/* Right panel: Metadata + Clips List */}
          <div className="w-full lg:w-[350px] border-t lg:border-t-0 lg:border-l border-white/5 p-6 flex flex-col justify-between overflow-y-auto bg-[#0d0c0b] h-auto lg:h-full">
            <div className="flex flex-col gap-6">
              {/* Category label */}
              <div>
                <span
                  style={{ fontFamily: 'var(--font-mono)' }}
                  className="text-avGold text-[9px] uppercase tracking-widest block mb-2"
                >
                  {category.title}
                </span>
                <h3
                  style={{ fontFamily: 'var(--font-sans)' }}
                  className="text-offwhite font-medium text-lg leading-snug"
                >
                  {activeVideo ? activeVideo.title : 'No Video Selected'}
                </h3>
                <p className="text-muted text-xs leading-relaxed mt-2 font-sans font-light">
                  {activeVideo ? activeVideo.description : `We are loading clips for the ${category.title} category.`}
                </p>
              </div>

              {/* Google Drive Download Button */}
              {activeVideo && (
                <div className="flex flex-col gap-2">
                  {activeVideo.driveUrl ? (
                    <a
                      href={activeVideo.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-avGold text-charcoal rounded-full text-xs font-mono font-medium tracking-wider uppercase hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <DriveIcon size={14} />
                      Download Original file
                    </a>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/5 text-muted rounded-full text-xs font-mono tracking-wider uppercase cursor-not-allowed">
                        Drive Link Coming Soon
                      </div>
                      <a
                        href={getWhatsAppInquiryUrl(activeVideo.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 border border-avGold/30 text-avGold hover:bg-avGold/5 rounded-full text-[11px] font-mono tracking-wider uppercase transition-all duration-300"
                      >
                        <WhatsAppIcon size={12} />
                        Request File via WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Clip Playlist / Alternatives */}
              {category.videos.length > 1 && (
                <div className="flex flex-col gap-3 mt-2">
                  <span
                    style={{ fontFamily: 'var(--font-mono)' }}
                    className="text-muted uppercase text-[9px] tracking-widest block"
                  >
                    Clip Playlist ({category.videos.length})
                  </span>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2.5 max-h-[180px] lg:max-h-[300px] overflow-y-auto pr-1">
                    {category.videos.map((video) => {
                      const isActive = activeVideo?.id === video.id
                      return (
                        <button
                          key={video.id}
                          onClick={() => setActiveVideo(video)}
                          className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-all duration-300 cursor-pointer ${
                            isActive
                              ? 'border-avGold/30 bg-[#121110]'
                              : 'border-white/5 hover:border-white/10 hover:bg-[#121110]/40'
                          }`}
                        >
                          <div className="relative w-14 h-10 bg-black rounded overflow-hidden flex-shrink-0">
                            {video.thumbnail !== '/images/placeholder.svg' ? (
                              <Image
                                src={video.thumbnail}
                                alt={video.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted/30">
                                <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <span
                              style={{ fontFamily: 'var(--font-sans)' }}
                              className={`text-[11px] font-medium leading-snug line-clamp-1 ${
                                isActive ? 'text-avGold' : 'text-offwhite/85'
                              }`}
                            >
                              {video.title}
                            </span>
                            <span className="text-[9px] text-muted block mt-0.5 font-mono">
                              {video.driveUrl ? 'Drive file ready' : 'Preview only'}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer indicator inside modal */}
            <div className="pt-4 border-t border-white/5 mt-6 lg:mt-0">
              <span className="text-[9px] text-muted/40 font-mono tracking-widest uppercase block text-center lg:text-left">
                AV Films · Portfolio Video Hub
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
