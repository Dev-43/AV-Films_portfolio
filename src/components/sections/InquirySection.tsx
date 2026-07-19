'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionShell from '@/components/sections/SectionShell'

// ── Icons ──────────────────────────────────────────────────────────────────
function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  )
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 2.25-4.5 2.25V9.75z" />
    </svg>
  )
}

function BothIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L9 21zm0 0h-.01m0 0l-5.187-5.187m0 0l1.414-1.414m-1.414 1.414L3 13.5m0 0l5.096-.813L3 13.5zm0 0h.01m0 0L8.197 8.313m0 0l1.414 1.414M8.197 8.313L6 9m0 0l5.096.813L6 9zm0 0V9m0 0l5.187 5.187" />
    </svg>
  )
}

// ── Form Types ─────────────────────────────────────────────────────────────
type ServiceType = 'photography' | 'videography' | 'both'

interface FormState {
  services: ServiceType | ''
  date: string
  location: string
  name: string
  email: string
  phone: string
  message: string
}

interface FormErrors {
  services?: string
  name?: string
  email?: string
  phone?: string
}

// ── Validate Step ──────────────────────────────────────────────────────────
function validateStep(step: number, form: FormState): FormErrors {
  const errs: FormErrors = {}
  if (step === 1) {
    if (!form.services) errs.services = 'Please select a service type'
  }
  if (step === 3) {
    if (!form.name || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email address'
    if (!form.phone || form.phone.replace(/\D/g, '').length < 10) errs.phone = 'Phone number must be at least 10 digits'
  }
  return errs
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function InquirySection() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [form, setForm] = useState<FormState>({
    services: '',
    date: '',
    location: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const getAccentColor = () => {
    if (form.services === 'photography') return '#50c878'
    if (form.services === 'videography') return '#c9a84c'
    if (form.services === 'both') return '#c9a84c'
    return '#a89f96'
  }

  const selectServiceAndAdvance = (service: ServiceType) => {
    setForm((prev) => ({ ...prev, services: service }))
    setErrors({})
    setStep(2)
  }

  const nextStep = () => {
    const errs = validateStep(step, form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setErrors({})
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateStep(3, form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setIsSubmitting(true)
    try {
      // Background email backup (silent)
      fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).catch(() => {
        // Silently ignore — this is a backup only
      })

      // Build WhatsApp message
      const serviceLabel =
        form.services === 'photography'
          ? 'Photography 📸'
          : form.services === 'videography'
          ? 'Videography 🎥'
          : 'Photography & Videography 📸🎥'

      const whatsAppText = `Hello AV Films! 👋\nI would like to inquire about booking your services.\n\nDetails:\n• *Name:* ${form.name}\n• *Email:* ${form.email}\n• *Phone:* ${form.phone}\n• *Service:* ${serviceLabel}\n• *Date:* ${form.date || 'Not specified'}\n• *Location:* ${form.location || 'Not specified'}\n• *Vision:* ${form.message || 'None'}\n\nLooking forward to hearing from you!`

      const whatsAppUrl = `https://wa.me/917517218149?text=${encodeURIComponent(whatsAppText)}`
      window.open(whatsAppUrl, '_blank', 'noopener,noreferrer')

      setSubmitSuccess(true)
      setStep(4)
    } finally {
      setIsSubmitting(false)
    }
  }

  const accent = getAccentColor()

  return (
    <SectionShell
      id="inquiry"
      label="07 · Inquiry"
      bgClass="bg-charcoal"
      minHeightClass="min-h-screen py-16 md:py-24"
    >
      <div className="w-full max-w-2xl mx-auto px-4 md:px-8 flex flex-col gap-12">

        {/* Section Header */}
        <div className="w-full flex flex-col items-center md:items-start text-center md:text-left">
          <span
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.35em' }}
            className="text-muted uppercase text-[9px] md:text-[10px] mb-3"
          >
            LET&apos;S COLLABORATE
          </span>
          <h2
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.1 }}
            className="text-offwhite font-light"
          >
            Start a{' '}
            <em style={{ fontStyle: 'italic', color: accent }} className="transition-colors duration-500">
              Project.
            </em>
          </h2>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div className="w-full">
            <div className="w-full h-[1px] bg-white/10 relative mb-3">
              <div
                className="absolute left-0 top-0 h-full transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%`, backgroundColor: accent }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono tracking-widest text-muted uppercase">
              <span style={{ color: step >= 1 ? '#f5f0e8' : undefined }}>01. Service</span>
              <span style={{ color: step >= 2 ? '#f5f0e8' : undefined }}>02. Details</span>
              <span style={{ color: step >= 3 ? '#f5f0e8' : undefined }}>03. Contact</span>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="w-full bg-[#121110] border border-white/5 rounded-2xl p-6 md:p-10">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">

              {/* ── Step 1: Service Selection ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-sans)' }} className="text-offwhite font-medium text-base md:text-lg mb-1">
                      What services do you need?
                    </h3>
                    <p className="text-muted text-xs">Select an option to get started.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Photography */}
                    <button
                      type="button"
                      onClick={() => selectServiceAndAdvance('photography')}
                      className={`flex flex-col items-center justify-center p-6 border rounded-xl gap-4 transition-all duration-300 cursor-pointer group ${
                        form.services === 'photography'
                          ? 'border-avEmerald bg-avEmerald/5 text-offwhite'
                          : 'border-white/5 text-muted hover:border-avEmerald/40 hover:text-offwhite'
                      }`}
                    >
                      <CameraIcon className={`w-8 h-8 transition-transform duration-300 group-hover:scale-110 ${form.services === 'photography' ? 'text-avEmerald' : 'group-hover:text-avEmerald'}`} />
                      <span style={{ fontFamily: 'var(--font-mono)' }} className="text-[10px] tracking-widest uppercase">Photography</span>
                    </button>

                    {/* Videography */}
                    <button
                      type="button"
                      onClick={() => selectServiceAndAdvance('videography')}
                      className={`flex flex-col items-center justify-center p-6 border rounded-xl gap-4 transition-all duration-300 cursor-pointer group ${
                        form.services === 'videography'
                          ? 'border-avGold bg-avGold/5 text-offwhite'
                          : 'border-white/5 text-muted hover:border-avGold/40 hover:text-offwhite'
                      }`}
                    >
                      <VideoIcon className={`w-8 h-8 transition-transform duration-300 group-hover:scale-110 ${form.services === 'videography' ? 'text-avGold' : 'group-hover:text-avGold'}`} />
                      <span style={{ fontFamily: 'var(--font-mono)' }} className="text-[10px] tracking-widest uppercase">Videography</span>
                    </button>

                    {/* Both */}
                    <button
                      type="button"
                      onClick={() => selectServiceAndAdvance('both')}
                      className={`flex flex-col items-center justify-center p-6 border rounded-xl gap-4 transition-all duration-300 cursor-pointer group ${
                        form.services === 'both'
                          ? 'border-offwhite bg-white/5 text-offwhite'
                          : 'border-white/5 text-muted hover:border-white/30 hover:text-offwhite'
                      }`}
                    >
                      <BothIcon className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
                      <span style={{ fontFamily: 'var(--font-mono)' }} className="text-[10px] tracking-widest uppercase">Both / Hybrid</span>
                    </button>
                  </div>

                  {errors.services && (
                    <span className="text-red-400 text-[10px] font-mono">{errors.services}</span>
                  )}
                </motion.div>
              )}

              {/* ── Step 2: Date & Location ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-sans)' }} className="text-offwhite font-medium text-base md:text-lg mb-1">
                      Event Schedule &amp; Location
                    </h3>
                    <p className="text-muted text-xs">Help us check availability for your shoot.</p>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="date" style={{ fontFamily: 'var(--font-mono)' }} className="text-muted text-[9px] tracking-widest uppercase">
                        Preferred Date (Optional)
                      </label>
                      <input
                        id="date"
                        type="date"
                        value={form.date}
                        onChange={(e) => updateField('date', e.target.value)}
                        className="w-full bg-charcoal border border-white/5 rounded-lg px-4 py-3 text-offwhite text-sm font-sans focus:outline-none focus:border-white/20 transition-colors duration-300"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="location" style={{ fontFamily: 'var(--font-mono)' }} className="text-muted text-[9px] tracking-widest uppercase">
                        Location / Venue (Optional)
                      </label>
                      <input
                        id="location"
                        type="text"
                        placeholder="e.g. Pune, Maharashtra"
                        value={form.location}
                        onChange={(e) => updateField('location', e.target.value)}
                        className="w-full bg-charcoal border border-white/5 rounded-lg px-4 py-3 text-offwhite text-sm font-sans placeholder:text-muted/30 focus:outline-none focus:border-white/20 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button type="button" onClick={prevStep} className="px-6 py-2.5 border border-white/10 hover:border-white/20 rounded-full text-muted hover:text-offwhite text-xs font-mono tracking-wider uppercase transition-colors duration-300 cursor-pointer">
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2.5 rounded-full text-charcoal text-xs font-mono tracking-wider uppercase font-medium transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                      style={{ backgroundColor: accent }}
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Contact Info ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-sans)' }} className="text-offwhite font-medium text-base md:text-lg mb-1">
                      Contact Information
                    </h3>
                    <p className="text-muted text-xs">Your inquiry will be sent via WhatsApp — fast &amp; direct.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" style={{ fontFamily: 'var(--font-mono)' }} className="text-muted text-[9px] tracking-widest uppercase">Name *</label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Your full name"
                          value={form.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          className={`w-full bg-charcoal border rounded-lg px-4 py-3 text-offwhite text-sm font-sans placeholder:text-muted/30 focus:outline-none transition-colors duration-300 ${errors.name ? 'border-red-500/50' : 'border-white/5 focus:border-white/20'}`}
                        />
                        {errors.name && <span className="text-red-400 text-[10px] font-mono">{errors.name}</span>}
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="phone" style={{ fontFamily: 'var(--font-mono)' }} className="text-muted text-[9px] tracking-widest uppercase">Phone *</label>
                        <input
                          id="phone"
                          type="tel"
                          placeholder="+91 99999 99999"
                          value={form.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className={`w-full bg-charcoal border rounded-lg px-4 py-3 text-offwhite text-sm font-sans placeholder:text-muted/30 focus:outline-none transition-colors duration-300 ${errors.phone ? 'border-red-500/50' : 'border-white/5 focus:border-white/20'}`}
                        />
                        {errors.phone && <span className="text-red-400 text-[10px] font-mono">{errors.phone}</span>}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" style={{ fontFamily: 'var(--font-mono)' }} className="text-muted text-[9px] tracking-widest uppercase">Email *</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={`w-full bg-charcoal border rounded-lg px-4 py-3 text-offwhite text-sm font-sans placeholder:text-muted/30 focus:outline-none transition-colors duration-300 ${errors.email ? 'border-red-500/50' : 'border-white/5 focus:border-white/20'}`}
                      />
                      {errors.email && <span className="text-red-400 text-[10px] font-mono">{errors.email}</span>}
                    </div>

                    {/* Vision */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" style={{ fontFamily: 'var(--font-mono)' }} className="text-muted text-[9px] tracking-widest uppercase">Your Vision (Optional)</label>
                      <textarea
                        id="message"
                        rows={3}
                        placeholder="Tell us about the project, style, or specific shots you need..."
                        value={form.message}
                        onChange={(e) => updateField('message', e.target.value)}
                        className="w-full bg-charcoal border border-white/5 rounded-lg px-4 py-3 text-offwhite text-sm font-sans placeholder:text-muted/30 focus:outline-none focus:border-white/20 transition-colors duration-300 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button type="button" onClick={prevStep} className="px-6 py-2.5 border border-white/10 hover:border-white/20 rounded-full text-muted hover:text-offwhite text-xs font-mono tracking-wider uppercase transition-colors duration-300 cursor-pointer">
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 rounded-full text-charcoal text-xs font-mono tracking-widest uppercase font-medium transition-all duration-300 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: accent }}
                    >
                      {isSubmitting ? 'Sending…' : 'Send via WhatsApp'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 4: Success ── */}
              {step === 4 && submitSuccess && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center text-center gap-6 py-10"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center border"
                    style={{ borderColor: accent, color: accent, backgroundColor: `${accent}10` }}
                  >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }} className="text-offwhite font-light mb-2">
                      Inquiry Sent!
                    </h3>
                    <p className="text-muted text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
                      Your details have been forwarded to WhatsApp. AV Films will get back to you shortly.
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <button
                      type="button"
                      onClick={() => { setStep(1); setSubmitSuccess(false); setForm({ services: '', date: '', location: '', name: '', email: '', phone: '', message: '' }) }}
                      className="px-6 py-2.5 border border-white/10 hover:border-white/20 rounded-full text-muted hover:text-offwhite text-xs font-mono tracking-wider uppercase transition-colors duration-300 cursor-pointer"
                    >
                      New Inquiry
                    </button>
                    <a
                      href="https://wa.me/917517218150"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 border border-[#25d366]/30 text-[#25d366] hover:bg-[#25d366] hover:text-charcoal hover:border-[#25d366] rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300"
                    >
                      Alternate Contact
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </SectionShell>
  )
}
