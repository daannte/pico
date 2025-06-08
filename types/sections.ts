import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"

export type Section = "watching" | "recentlyAdded" | "favourites";

export interface SectionsCardProps {
  title: string
  items: BaseItemDto[]
  totalCount: number
  type: Section
}

export interface SectionsDisplayItem {
  item: BaseItemDto | null
  image: string | null
  isEmpty: boolean
  emptyMessage: string
}

export const getSectionEmptyMessage = (type: Section): string => {
  return type === "favourites" ? "No favourites yet" : "Nothing to show"
}

export const getDisplayItem = (items: BaseItemDto[], type: Section): BaseItemDto | null => {
  if (items.length === 0) return null

  return type === "watching"
    ? items[0]
    : items[Math.floor(Math.random() * items.length)]
}
