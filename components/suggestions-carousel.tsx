"use client"

import { useJellyfin } from "@/contexts/jellyfin-context"
import { getSuggestionsApi } from "@jellyfin/sdk/lib/utils/api"
import { getItemImageUrl } from "@/lib/jellyfin"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Play } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

export default function SuggestionsCarousel() {
  const { api, user } = useJellyfin()
  const [suggestions, setSuggestions] = useState<BaseItemDto[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const AUTO_CYCLE_DELAY = 3000

  const fetchSuggestions = async () => {
    if (!api || !user?.Id) return []
    try {
      const suggestionsApi = getSuggestionsApi(api)
      const response = await suggestionsApi.getSuggestions({
        userId: user.Id,
        type: ["Movie", "Series"],
        limit: 5,
      })
      return response.data.Items || []
    } catch (error) {
      console.error("Failed to fetch suggestions:", error)
      return []
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1
    )
  }

  const startAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(nextSlide, AUTO_CYCLE_DELAY)
  }

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true)
      const items = await fetchSuggestions()
      setSuggestions(items)
      setLoading(false)
    }
    loadSuggestions()
  }, [api, user])

  useEffect(() => {
    if (suggestions.length > 1 && !isPaused) {
      startAutoScroll()
    } else {
      stopAutoScroll()
    }

    return () => stopAutoScroll()
  }, [suggestions.length, isPaused])

  useEffect(() => {
    return () => stopAutoScroll()
  }, [])

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
    if (!isPaused && suggestions.length > 1) {
      startAutoScroll()
    }
  }

  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[7].length === 11) ? match[7] : null
  }

  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  const handlePlayTrailer = () => {
    if (currentItem.RemoteTrailers && currentItem.RemoteTrailers.length > 0) {
      const firstTrailer = currentItem.RemoteTrailers[0]
      window.open(firstTrailer.Url!, '_blank')
    }
  }

  const trailerThumbnail = currentItem.RemoteTrailers && currentItem.RemoteTrailers.length > 0
    ? getYouTubeThumbnail(currentItem.RemoteTrailers[0].Url || '')
    : null

  const slideVariants = {
    enter: {
      x: '-100%',
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: '-100%',
      opacity: 0,
    }
  }

  const transition = {
    duration: 0.5,
    ease: "easeInOut"
  }

  return (
    <div>
      {suggestions.length > 0 && (
        <section
          className="relative h-screen w-full overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${currentIndex}`}
              className="absolute inset-0 bg-cover bg-center blur-sm z-0"
              style={{ backgroundImage: `url(${backgroundImage})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-black/10" />

          <div
            className="relative z-10 h-full flex items-center justify-center p-16"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}

          >
            {backgroundImage && (
              <div className="relative w-full max-w-8xl h-full rounded-lg overflow-hidden shadow-2xl">
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-3">
                  {suggestions.map((_, index) => (
                    <Button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={`w-3 h-3 p-0 rounded-full transition-all duration-300 hover:bg-white/75 ${index === currentIndex
                        ? "bg-white scale-110"
                        : "bg-white/50"
                        }`}
                      aria-label={`Go to suggestion ${index + 1}`}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    className="absolute inset-0"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={transition}
                  >
                    <Image
                      src={backgroundImage}
                      alt={currentItem.Name || "Movie backdrop"}
                      className="object-cover"
                      fill
                      priority
                    />
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="absolute bottom-1/2 translate-y-1/2 left-0 right-0 p-8 text-white">
                      <div className="max-w-2xl">
                        <motion.h1
                          className="text-5xl font-bold mb-4 drop-shadow-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          {currentItem.Name}
                        </motion.h1>
                        <motion.p
                          className="text-lg text-gray-200 mb-6 line-clamp-3 drop-shadow-md"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          {currentItem.Overview || "No description available."}
                        </motion.p>
                        <motion.div
                          className="flex gap-4 items-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        >
                          <Button
                            size={"lg"}
                            className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded font-bold transition-colors flex items-center gap-2"
                          >
                            <Play className="fill-black" size={20} /> Play
                          </Button>

                          <Button
                            size={"lg"}
                            className="px-8 py-3 bg-gray-600/80 hover:bg-gray-500/80 text-white rounded font-semibold transition-colors"
                          >
                            More Info
                          </Button>
                        </motion.div>
                      </div>
                    </div>

                    <div className="absolute bottom-10 left-5">
                      {currentItem.RemoteTrailers && currentItem.RemoteTrailers.length > 0 && (
                        <div className="flex items-center">
                          {trailerThumbnail && (
                            <motion.div
                              className="relative"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5, duration: 0.5 }}
                            >
                              <div
                                onClick={handlePlayTrailer}
                                className="relative w-96 h-48 rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                              >
                                <Image
                                  src={trailerThumbnail}
                                  alt="Trailer thumbnail"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
