"use client"

import Image from "next/image"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getItemImageUrl } from "@/lib/jellyfin"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { Play, Info, Plus } from "lucide-react"
import { Button } from "./ui/button"

interface ItemCardProps {
  item: BaseItemDto
}

export default function ItemCard({ item }: ItemCardProps) {
  const { api } = useJellyfin()
  const imageUrl = getItemImageUrl({ item, api: api! })

  return (
    <div className="group relative rounded-lg overflow-hidden bg-zinc-900 shadow-lg transform transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer">
      <div className="relative aspect-[2/3]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.Name || "Media Item"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="bg-zinc-800 w-full h-full flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-zinc-700 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6" />
              </div>
              <p className="text-sm">No image available</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black to-transparent">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.Name}</h3>

        <div className="flex items-center space-x-2 mb-2">
          <Button className="bg-white text-black px-4 py-1.5 rounded-md hover:bg-white/90 transition-colors flex items-center space-x-2 text-sm font-medium">
            <Play className="w-4 h-4 fill-current" />
            Play
          </Button>
          <Button size={"icon"} className="bg-zinc-700/80 hover:bg-zinc-600/80 rounded-full transition-colors">
            <Plus />
          </Button>
          <Button size={"icon"} className="bg-zinc-700/80 hover:bg-zinc-600/80 rounded-full transition-colors">
            <Info />
          </Button>
        </div>

        {(item.ProductionYear || item.OfficialRating) && (
          <div className="flex items-center space-x-2 text-sm text-zinc-300">
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
