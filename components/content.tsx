import Image from "next/image"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { CarouselItemInfo } from "./ui/suggestion-carousel/carousel-item-info"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { getItemImageUrl } from "@/lib/jellyfin"
import { Star } from "lucide-react"
import Trailer from "./trailer"

interface ContentProps {
  item: BaseItemDto
  backgroundUrl: string | null
  onPlay?: () => void
  onMoreInfo?: () => void
  onPlayTrailer: () => void
  showMetadata?: boolean
}

export default function Content({
  item,
  backgroundUrl,
  onPlay,
  onMoreInfo,
  onPlayTrailer,
  showMetadata = false
}: ContentProps) {
  const { api } = useJellyfin()
  const trailerThumbnail = getItemImageUrl({ item, api: api!, variant: "Thumb" })

  return (
    <div className="relative w-full h-full overflow-hidden">
      {backgroundUrl ? (
        <Image
          src={backgroundUrl}
          alt={item.Name || "Movie backdrop"}
          className="object-cover"
          fill
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
      )}

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative h-full flex flex-col">
        {/* Top Section - Item Info */}
        <div className="flex-1 flex items-center justify-start p-4 sm:p-6 lg:p-8">
          <CarouselItemInfo item={item} onPlay={onPlay} onMoreInfo={onMoreInfo} />
        </div>

        <div className="flex-shrink-0">
          {showMetadata && (
            <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-white/90">
                  {item.ProductionYear && (
                    <span className="text-sm sm:text-base lg:text-lg font-medium">
                      {item.ProductionYear}
                    </span>
                  )}
                  {item.OfficialRating && (
                    <span className="px-2 py-1 border border-white/50 text-xs sm:text-sm font-medium rounded whitespace-nowrap">
                      {item.OfficialRating}
                    </span>
                  )}
                  {(item.RunTimeTicks && item.RunTimeTicks != 0) && (
                    <span className="text-xs sm:text-sm lg:text-base whitespace-nowrap">
                      {Math.round((item.RunTimeTicks / 10_000_000) / 60)} min
                    </span>
                  )}
                  {item.CommunityRating && (
                    <div className="text-xs sm:text-sm lg:text-base font-medium flex items-center gap-1 whitespace-nowrap">
                      <Star className="fill-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{item.CommunityRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {item.Genres && item.Genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {item.Genres.slice(0, 3).map((genre, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm rounded-full whitespace-nowrap"
                      >
                        {genre}
                      </span>
                    ))}
                    {item.Genres.length > 3 && (
                      <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm rounded-full">
                        +{item.Genres.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {(trailerThumbnail || backgroundUrl) && (
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
              <Trailer
                thumbnailUrl={trailerThumbnail || backgroundUrl!}
                onPlay={onPlayTrailer}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
