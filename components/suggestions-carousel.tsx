"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

import { useJellyfin } from "@/contexts/jellyfin-context"
import { getItemImageUrl } from "@/lib/jellyfin"
import { slideVariants, slideTransition } from "@/lib/carousel-utils"
import { useSuggestions } from "@/hooks/use-suggestions"
import { useAutoCarousel } from "@/hooks/use-auto-carousel"
import { CarouselDots, CarouselContent } from "@/components/ui/suggestion-carousel"
import { useRouter } from "next/navigation"

export default function SuggestionsCarousel() {
  const router = useRouter()
  const { api } = useJellyfin()
  const { suggestions, loading } = useSuggestions()
  const [isPaused, setIsPaused] = useState(false)
  const { currentIndex, setCurrentIndex } = useAutoCarousel(suggestions.length, isPaused)

  if (loading || suggestions.length === 0) {
    return null
  }

  const currentItem = suggestions[currentIndex]
  const backgroundImage = getItemImageUrl({
    item: currentItem,
    api: api!,
    variant: "Backdrop"
  })

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handlePlay = () => {
    if (currentItem.Type == "Series") {
      router.push(`/series/${currentItem.Id}`)
    } else if (currentItem.Type == "Movie") {
      router.push(`/movies/${currentItem.Id}`)
    }
  }

  const handleMoreInfo = () => {
    // TODO: Implement more info functionality
    console.log("More info:", currentItem.Name)
  }

  const handlePlayTrailer = () => {
    if (currentItem.RemoteTrailers && currentItem.RemoteTrailers.length > 0) {
      const firstTrailer = currentItem.RemoteTrailers[0]
      window.open(firstTrailer.Url!, '_blank')
    }
  }

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentIndex}`}
          className="absolute inset-0 bg-cover bg-center blur-xs scale-102 z-0"
          style={{
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/20" />

      <div
        className="relative z-10 h-full flex items-center justify-center p-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative w-full max-w-8xl h-full rounded-lg overflow-hidden shadow-2xl">
          <CarouselDots
            count={suggestions.length}
            currentIndex={currentIndex}
            onDotClick={handleDotClick}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="absolute inset-0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
            >
              <CarouselContent
                item={currentItem}
                backgroundImage={backgroundImage}
                onPlay={handlePlay}
                onMoreInfo={handleMoreInfo}
                onPlayTrailer={handlePlayTrailer}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
