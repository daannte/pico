"use client"

import Image from "next/image"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getItemImageUrl } from "@/lib/jellyfin"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface ItemCardProps {
  item: BaseItemDto
}

export default function ItemCard({ item }: ItemCardProps) {
  const router = useRouter()
  const { api } = useJellyfin()
  const imageUrl = getItemImageUrl({ item, api: api! })

  const handleOnClick = () => {
    if (item.Type === "Movie") {
      router.push(`/movies/${item.Id}`)
    } else if (item.Type === "Series") {
      router.push(`/series/${item.Id}`)
    } else if (item.Type === "Episode") {
      router.push(`/series/${item.SeriesId}`)
    }
  }

  return (
    <div
      className="group relative rounded-sm overflow-hidden bg-zinc-900 shadow-md transform transition-all duration-300 hover:z-10 cursor-pointer"
      onClick={handleOnClick}
    >
      <div className="relative aspect-[2/3]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.Name || "Media Item"}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="bg-zinc-800 w-full h-full flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <div className="w-6 h-6 mx-auto mb-1 bg-zinc-700 rounded-full flex items-center justify-center">
                <Play className="w-3 h-3" />
              </div>
              <p className="text-xs">No image</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black to-transparent">
        <h3 className="font-semibold text-xs mb-1 line-clamp-1">{item.Name}</h3>
        {(item.ProductionYear || item.OfficialRating) && (
          <div className="flex items-center space-x-1 text-xs text-zinc-300">
            {item.ProductionYear && <span>{item.ProductionYear}</span>}
            {item.OfficialRating && (
              <>
                <span>•</span>
                <span className="border border-zinc-400 px-1 text-xs">{item.OfficialRating}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
