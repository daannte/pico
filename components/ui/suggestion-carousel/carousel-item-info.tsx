import { motion } from "motion/react"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { CarouselActionButtons } from "./carousel-buttons"

interface CarouselItemInfoProps {
  item: BaseItemDto
  onPlay?: () => void
  onMoreInfo?: () => void
}

export const CarouselItemInfo = ({ item, onPlay, onMoreInfo }: CarouselItemInfoProps) => (
  <div className="absolute bottom-1/2 translate-y-1/2 left-0 right-0 p-8 text-white">
    <div className="max-w-2xl">
      <motion.h1
        className="text-5xl font-bold mb-4 drop-shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {item.Name}
      </motion.h1>
      <motion.p
        className="text-lg text-gray-200 mb-6 line-clamp-3 drop-shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {item.Overview || "No description available."}
      </motion.p>
      <CarouselActionButtons onPlay={onPlay} onMoreInfo={onMoreInfo} />
    </div>
  </div>
)
