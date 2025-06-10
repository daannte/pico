"use client"

import Image from "next/image"
import type { BaseItemPerson } from "@jellyfin/sdk/lib/generated-client/models"
import { getItemImageUrl } from "@/lib/jellyfin"
import { useJellyfin } from "@/contexts/jellyfin-context"

interface CastCardProps {
  item: BaseItemPerson
}

export default function CastCard({ item }: CastCardProps) {
  const { api } = useJellyfin()

  const imageUrl = getItemImageUrl({
    item,
    api: api!,
  })

  return (
    <div className="relative rounded-md overflow-hidden bg-zinc-900 shadow-md">
      <div className="relative aspect-[2/3]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.Name || "Cast Name"}
            fill
            sizes="50vw"
            className="object-cover"
          />
        ) : (
          <div className="bg-zinc-800 w-full h-full flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <p className="text-xs">No image</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black to-transparent">
        <h3 className="font-semibold text-sm line-clamp-1">{item.Name}</h3>
        {item.Role && (
          <p className="text-xs text-zinc-300 line-clamp-1">{item.Role}</p>
        )}
      </div>
    </div>
  )
}
