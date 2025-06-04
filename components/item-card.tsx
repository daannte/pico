"use client"

import Image from "next/image"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getItemImageUrl } from "@/lib/jellyfin"
import { useJellyfin } from "@/contexts/jellyfin-context"

interface ItemCardProps {
  item: BaseItemDto
}

export default function ItemCard({ item }: ItemCardProps) {
  const { api } = useJellyfin()
  const imageUrl = getItemImageUrl({ item, api: api! })

  return (
    <div className="rounded overflow-hidden bg-card shadow-md">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={item.Name || "Media Item"}
          width={300}
          height={450}
          className="object-cover w-full h-auto rounded-t"
        />
      ) : (
        <div className="bg-muted h-[450px] w-full flex items-center justify-center text-muted-foreground text-sm">
          No image available
        </div>
      )}
      <div className="p-2 text-center font-medium">{item.Name}</div>
    </div>
  )
}
