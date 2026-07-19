'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { instagramConfig } from '@/data/instagram'

gsap.registerPlugin(ScrollTrigger)

// ── Icons ──────────────────────────────────────────────────────────────────
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

function PhoneIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.42 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.72 16l.3.92z" />
    </svg>
  )
}

function LocationIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

// ── Filmstrip Divider ────────────────────────────────────────────────────────
function FilmstripDivider() {
  return (
    <div
      className="w-full h-6 flex items-center gap-0 overflow-hidden"
      aria-hidden="true"
      style={{ opacity: 0.12 }}
    >
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 h-full flex items-center"
          style={{ width: '24px', gap: 0 }}
        >
          <div className="w-[16px] h-[14px] bg-muted rounded-[1px]" />
          <div className="w-[8px] h-full" />
        </div>
      ))}
    </div>
  )
}

// ── Quick Nav Links ──────────────────────────────────────────────────────────
const navLinks = [
  { label: 'Photography', href: '#photo-world' },
  { label: 'Gallery', href: '#photo-gallery' },
  { label: 'Filmmakers', href: '#filmmakers' },
  { label: 'Videography', href: '#video-gallery' },
  { label: 'Instagram', href: '#instagram' },
  { label: 'Book a Shoot', href: '#inquiry' },
]

// ── Footer Component ─────────────────────────────────────────────────────────
export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    const content = contentRef.current
    if (!footer || !content) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, footer)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="w-full bg-charcoal relative overflow-hidden"
      style={{ minHeight: '420px' }}
    >
      {/* Film Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          opacity: 0.02,
        }}
      />

      {/* Top border line (avGold hairline) */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-avGold/20 to-transparent" />

      {/* Main Footer Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-0"
        style={{ opacity: 0 }}
      >
        {/* Top Row: Brand + Nav */}
        <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-0 justify-between mb-14 md:mb-20">

          {/* Brand Block */}
          <div className="flex flex-col gap-6 max-w-xs">
            {/* Logo + Wordmark */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="AV Films Logo"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-offwhite text-xl tracking-[0.2em] font-light"
              >
                AV FILMS
              </span>
            </div>

            <p
              style={{ fontFamily: 'var(--font-sans)' }}
              className="text-muted text-xs leading-relaxed max-w-[260px]"
            >
              Premium photography &amp; videography studio based in Pimpri, Pune.
              Every frame intentional. Every story, unforgettable.
            </p>

            {/* Contact details */}
            <div className="flex flex-col gap-3">
              <a
                href="tel:+917517218149"
                className="flex items-center gap-2.5 text-muted hover:text-avGold transition-colors duration-300"
              >
                <PhoneIcon size={13} />
                <span style={{ fontFamily: 'var(--font-mono)' }} className="text-[11px] tracking-wider">
                  +91 75172 18149
                </span>
              </a>
              <a
                href="tel:+917517218150"
                className="flex items-center gap-2.5 text-muted hover:text-avGold transition-colors duration-300"
              >
                <PhoneIcon size={13} />
                <span style={{ fontFamily: 'var(--font-mono)' }} className="text-[11px] tracking-wider">
                  +91 75172 18150
                </span>
              </a>
              <div className="flex items-center gap-2.5 text-muted">
                <LocationIcon size={13} />
                <span style={{ fontFamily: 'var(--font-mono)' }} className="text-[11px] tracking-wider">
                  Pimpri, Pune, Maharashtra
                </span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href={instagramConfig.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AV Films on Instagram"
                className="flex items-center justify-center w-8 h-8 border border-white/10 rounded-full text-muted hover:text-avEmerald hover:border-avEmerald/40 transition-all duration-300"
              >
                <InstagramIcon size={14} />
              </a>
              <a
                href="https://wa.me/917517218149"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact AV Films on WhatsApp"
                className="flex items-center justify-center w-8 h-8 border border-white/10 rounded-full text-muted hover:text-[#25d366] hover:border-[#25d366]/40 transition-all duration-300"
              >
                <WhatsAppIcon size={13} />
              </a>
            </div>
          </div>

          {/* Nav Grid */}
          <div className="flex flex-col gap-3">
            <span
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em' }}
              className="text-muted uppercase text-[9px] mb-2"
            >
              Quick Links
            </span>
            <nav className="grid grid-cols-2 gap-x-12 gap-y-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{ fontFamily: 'var(--font-sans)' }}
                  className="text-muted hover:text-offwhite text-xs md:text-sm transition-colors duration-300 hover:translate-x-0.5 transition-transform"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* CTA Block */}
          <div className="flex flex-col gap-5 items-start lg:items-end">
            <div className="flex flex-col gap-1 items-start lg:items-end">
              <span
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em' }}
                className="text-muted uppercase text-[9px]"
              >
                Ready to create?
              </span>
              <span
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)' }}
                className="text-offwhite font-light"
              >
                Let&apos;s <em>build</em> something.
              </span>
            </div>

            <a
              href="https://wa.me/917517218149"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-avGold text-charcoal text-xs font-mono tracking-widest uppercase rounded-full hover:brightness-110 transition-all duration-300 hover:-translate-y-0.5"
            >
              <WhatsAppIcon size={13} />
              Book via WhatsApp
            </a>

            <a
              href="#inquiry"
              style={{ fontFamily: 'var(--font-mono)' }}
              className="text-muted hover:text-avGold text-[10px] tracking-wider uppercase transition-colors duration-300 border-b border-transparent hover:border-avGold/30 pb-0.5"
            >
              Or fill the inquiry form →
            </a>
          </div>
        </div>

        {/* Bottom Bar — Filmstrip + Copyright */}
        <div className="w-full border-t border-white/5 pt-5 pb-6 flex flex-col gap-5">
          {/* Filmstrip brand signature */}
          <FilmstripDivider />

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <span
              style={{ fontFamily: 'var(--font-mono)' }}
              className="text-muted text-[9px] tracking-[0.25em] uppercase"
            >
              © {new Date().getFullYear()} AV Films · Pimpri, Pune
            </span>
            <span
              style={{ fontFamily: 'var(--font-mono)' }}
              className="text-muted/40 text-[9px] tracking-wider"
            >
              Crafted with care · Every frame intentional
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
