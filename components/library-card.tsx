"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getItemImageUrl } from "@/lib/jellyfin"
import { useJellyfin } from "@/contexts/jellyfin-context"

interface LibraryCardProps {
  item: BaseItemDto
}

export default function LibraryCard({ item }: LibraryCardProps) {
  const { api } = useJellyfin()
  const router = useRouter()

  const imageUrl = getItemImageUrl({
    item,
    api: api!,
  })

  const handleClick = () => {
    router.push(`/library/${item.Id}`)
  }

  return (
    <div
      className="group cursor-pointer rounded-md overflow-hidden bg-zinc-900 shadow hover:shadow-lg transition-all"
      onClick={handleClick}
    >
      <div className="relative aspect-[16/9] w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.Name || "Library Item"}
            fill
            sizes="33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="bg-zinc-800 w-full h-full flex items-center justify-center text-zinc-400">
            <p className="text-sm">No image</p>
          </div>
        )}
      </div>
    </div>
  )
}
