"use client"

import ItemCard from "@/components/item-card"
import { useJellyfin } from "@/contexts/jellyfin-context"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getUserViewsApi } from "@jellyfin/sdk/lib/utils/api"
import { useEffect, useState } from "react"

export default function Library() {
  const { api, user } = useJellyfin()
  const [views, setViews] = useState<BaseItemDto[] | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!api) return

    const fetchItems = async () => {
      try {
        const apiUser = getUserViewsApi(api!)
        const _views = await apiUser.getUserViews({ userId: user?.Id })
        setViews(_views.data.Items)
      } catch (error) {
        console.error("Failed to fetch Jellyfin items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [api])

  if (!user) return null

  if (loading) return <div>Spinner</div>

  if (!views) return <div>No views</div>

  return (
    <div>
      {views.map((view) => (
        <ItemCard key={view.Id} item={view} />
      ))}
    </div>
  )
}
