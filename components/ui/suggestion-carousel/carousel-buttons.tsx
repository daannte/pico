import { motion } from "motion/react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarouselActionButtonsProps {
  onPlay?: () => void
  onMoreInfo?: () => void
}

export const CarouselActionButtons = ({ onPlay, onMoreInfo }: CarouselActionButtonsProps) => (
  <motion.div
    className="flex gap-4 items-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.5 }}
  >
    <Button
      size="lg"
      variant="default"
      className="lg:w-48 text-sm lg:text-lg font-medium uppercase"
      onClick={onPlay}
    >
      <Play className="fill-black" size={20} /> Play
    </Button>
    <Button
      size="lg"
      variant="secondary"
      className="text-sm lg:text-lg text-foreground font-semibold"
      onClick={onMoreInfo}
    >
      More Info
    </Button>
  </motion.div>
)
