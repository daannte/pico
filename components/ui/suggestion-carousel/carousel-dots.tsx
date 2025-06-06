import { Button } from "@/components/ui/button"

interface CarouselDotsProps {
  count: number
  currentIndex: number
  onDotClick: (index: number) => void
}

export const CarouselDots = ({ count, currentIndex, onDotClick }: CarouselDotsProps) => (
  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-3">
    {Array.from({ length: count }).map((_, index) => (
      <Button
        key={index}
        onClick={() => onDotClick(index)}
        className={`w-3 h-3 p-0 rounded-full transition-all duration-300 hover:bg-white/75 ${index === currentIndex ? "bg-white scale-110" : "bg-white/50"
          }`}
        aria-label={`Go to suggestion ${index + 1}`}
      />
    ))}
  </div>
)
