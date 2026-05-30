'use client'

import HeroSection from '@/components/sections/HeroSection'
import PhotoWorldIntro from '@/components/sections/PhotoWorldIntro'
import PhotoGallery from '@/components/sections/PhotoGallery'
import Filmmakers from '@/components/sections/Filmmakers'
import VideoWorldIntro from '@/components/sections/VideoWorldIntro'
import VideoGallery from '@/components/sections/VideoGallery'
import InstagramFeed from '@/components/sections/InstagramFeed'
import InquirySection from '@/components/sections/InquirySection'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <HeroSection />
      <PhotoWorldIntro />
      <PhotoGallery />
      <Filmmakers />
      <VideoWorldIntro />
      <VideoGallery />
      <InstagramFeed />
      <InquirySection />
      <Footer />
    </main>
  )
}
