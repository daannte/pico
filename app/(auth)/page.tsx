"use client"

import SuggestionsCarousel from "@/components/suggestions-carousel"
import HomeSections from "@/components/home-sections"

export default function Home() {
  return (
    <div className="w-full">
      <SuggestionsCarousel />
      <HomeSections />
    </div>
  )
}
