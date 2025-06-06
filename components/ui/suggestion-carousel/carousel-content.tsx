import Image from "next/image"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getYouTubeThumbnail } from "@/lib/carousel-utils"
import { CarouselItemInfo } from "./carousel-item-info"
import { CarouselTrailerThumbnail } from "./carousel-trailer"

interface CarouselContentProps {
  item: BaseItemDto
  backgroundImage: string | null
  onPlay?: () => void
  onMoreInfo?: () => void
  onPlayTrailer: () => void
}

export const CarouselContent = ({
  item,
  backgroundImage,
  onPlay,
  onMoreInfo,
  onPlayTrailer
}: CarouselContentProps) => {
  const trailerThumbnail = item.RemoteTrailers && item.RemoteTrailers.length > 0
    ? getYouTubeThumbnail(item.RemoteTrailers[0].Url || '')
    : null

  return (
    <>
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={item.Name || "Movie backdrop"}
          className="object-cover"
          fill
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <CarouselItemInfo
        item={item}
        onPlay={onPlay}
        onMoreInfo={onMoreInfo}
      />
      {trailerThumbnail && (
        <CarouselTrailerThumbnail
          thumbnailUrl={trailerThumbnail}
          onPlay={onPlayTrailer}
        />
      )}
    </>
  )
}
