import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"

export type SectionType = "nextup" | "latest" | "favourites"

export interface SectionsCardProps {
  title: string
  items: BaseItemDto[]
  totalCount: number
  type: SectionType
}

export interface SectionsDisplayItem {
  item: BaseItemDto | null
  image: string | null
  isEmpty: boolean
  emptyMessage: string
}

export const getSectionEmptyMessage = (type: SectionType): string => {
  return type === "favourites" ? "No favourites yet" : "Nothing to show"
}

export const getDisplayItem = (items: BaseItemDto[], type: SectionType): BaseItemDto | null => {
  if (items.length === 0) return null

  return type === "nextup"
    ? items[0]
    : items[Math.floor(Math.random() * items.length)]
}
