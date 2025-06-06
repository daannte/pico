import Image from "next/image"
import { motion } from "motion/react"

interface CarouselTrailerThumbnailProps {
  thumbnailUrl: string
  onPlay: () => void
}

export const CarouselTrailerThumbnail = ({ thumbnailUrl, onPlay }: CarouselTrailerThumbnailProps) => (
  <div className="absolute bottom-0 left-0 p-8">
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div
        onClick={onPlay}
        className="relative w-96 h-48 rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform"
      >
        <Image
          src={thumbnailUrl}
          alt="Trailer thumbnail"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-4 hover:bg-black/70 transition-colors">
            <svg
              className="w-8 h-8 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
)
