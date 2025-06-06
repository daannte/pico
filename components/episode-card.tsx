"use client"

import Image from "next/image"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getItemImageUrl } from "@/lib/jellyfin"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { Play } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface EpisodeCardProps {
  item: BaseItemDto
}

export default function EpisodeCard({ item }: EpisodeCardProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { api } = useJellyfin()
  const imageUrl = getItemImageUrl({ item, api: api! })

  return (
    <div
      className="group relative rounded-md overflow-hidden bg-zinc-900 shadow-md transform transition-all duration-300 hover:z-10 cursor-pointer"
      onClick={() => {
        if (pathname.startsWith("/series")) return null
        router.push(`/series/${item.SeriesId}`)
      }}
    >
      <div className="relative aspect-[5/3]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.Name || "Episode"}
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

        {!item.UserData?.Played && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-yellow-300 shadow-sm"></div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black to-transparent">
        {item.IndexNumber != null && (
          <p className="text-xs text-zinc-400 mb-1">Episode {item.IndexNumber}</p>
        )}
        <h3 className="font-semibold text-sm line-clamp-1">{item.Name}</h3>
        {(item.ProductionYear || item.OfficialRating) && (
          <div className="flex items-center space-x-1 text-xs text-zinc-300 mt-1">
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
