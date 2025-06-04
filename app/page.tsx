"use client"

import { useEffect, useState } from "react"
import { getUserViewsApi, getItemsApi } from "@jellyfin/sdk/lib/utils/api"

import ItemCard from "@/components/item-card"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { api, user, logout } = useJellyfin()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!api) return

    const fetchItems = async () => {
      try {
        const apiUser = getUserViewsApi(api!)
        const views = await apiUser.getUserViews({ userId: user?.Id })

        const allItems: any[] = []

        for (const view of views.data.Items || []) {
          if (!view.Id) continue

          const res = await getItemsApi(api!).getItems({
            userId: user?.Id,
            parentId: view.Id,
            recursive: true,
            enableImageTypes: ["Primary", "Backdrop", "Banner", "Thumb"],
            imageTypeLimit: 1,
            fields: ["PrimaryImageAspectRatio", "SortName"],
            includeItemTypes: ["Series", "Movie"]
          })

          allItems.push(...(res.data.Items || []))
        }

        setItems(allItems)
      } catch (error) {
        console.error("Failed to fetch Jellyfin items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [api])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <Button onClick={() => logout()}>Logout</Button>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <ItemCard key={item.Id} item={item} />
        ))}
      </div>
    </div>
  )
}
