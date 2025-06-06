"use client"

import { getItemImageUrl } from "@/lib/jellyfin"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { getDisplayItem, getSectionEmptyMessage } from "@/types/sections"
import type { SectionsCardProps } from "@/types/sections"
import SectionsHeader from "./sections-header"
import SectionsBackground from "./sections-background"
import SectionsButton from "./sections-button"

export default function SectionsCard({ title, items, totalCount, type }: SectionsCardProps) {
  const { api } = useJellyfin()

  const displayItem = getDisplayItem(items, type)
  const image = displayItem ? getItemImageUrl({ item: displayItem, api: api! }) : null
  const isEmpty = !displayItem || totalCount === 0
  const emptyMessage = getSectionEmptyMessage(type)

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <SectionsBackground image={image} isEmpty={isEmpty} />
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-16">
        <SectionsHeader title={title} count={totalCount} />
        <div className="relative w-full h-full overflow-hidden shadow-2xl">
          {isEmpty ? (
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center h-full">
              <div className="text-white/60 text-2xl">{emptyMessage}</div>
            </div>
          ) : (
            <SectionsBackground.Image
              image={image}
              alt={displayItem?.Name || "Backdrop"}
            />
          )}
        </div>

        <div className="mt-8 w-full">
          <SectionsButton
            disabled={totalCount === 0}
            text={totalCount === 0 ? "Nothing to show" : "See All"}
          />
        </div>
      </div>
    </section>
  )
}
