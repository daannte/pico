import { useState, useEffect, useRef } from "react"
import { AUTO_CYCLE_DELAY } from "@/lib/carousel-utils"

export const useAutoCarousel = (itemCount: number, isPaused: boolean) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === itemCount - 1 ? 0 : prevIndex + 1
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
    if (itemCount > 1 && !isPaused) {
      startAutoScroll()
    } else {
      stopAutoScroll()
    }

    return () => stopAutoScroll()
  }, [itemCount, isPaused])

  useEffect(() => {
    return () => stopAutoScroll()
  }, [])

  return { currentIndex, setCurrentIndex, nextSlide }
}
