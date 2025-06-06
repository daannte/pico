import Image from "next/image"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { CarouselItemInfo } from "./carousel-item-info"
import { CarouselTrailerThumbnail } from "./carousel-trailer"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { getItemImageUrl } from "@/lib/jellyfin"

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
  const { api } = useJellyfin()
  const trailerThumbnail = getItemImageUrl({ item, api: api!, variant: "Thumb" })

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
      {(trailerThumbnail || backgroundImage) && (
        <CarouselTrailerThumbnail
          thumbnailUrl={trailerThumbnail || backgroundImage!}
          onPlay={onPlayTrailer}
        />
      )}
    </>
  )
}
