import Image from "next/image"
import { motion } from "motion/react"

interface TrailerProps {
  thumbnailUrl: string
  onPlay: () => void
}

export default function Trailer({ thumbnailUrl, onPlay }: TrailerProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div
        onClick={onPlay}
        className="relative w-32 h-20 sm:w-48 sm:h-28 lg:w-64 lg:h-36 rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-lg"
      >
        <Image
          src={thumbnailUrl}
          alt="Trailer thumbnail"
          fill
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 192px, 256px"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-2 sm:p-3 lg:p-4 hover:bg-black/70 transition-colors">
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
