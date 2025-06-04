"use client"

import { useEffect, useState } from "react"
import { getUserViewsApi, getItemsApi } from "@jellyfin/sdk/lib/utils/api"
import { jellyfinClient } from "@/lib/jellyfin"
import { useRouter } from "next/navigation"

import { useAuth } from "@/contexts/auth-context"
import ItemCard from "@/components/item-card"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("router")
      router.replace("/login")
      return
    }

    const fetchItems = async () => {
      try {
        const japi = jellyfinClient.getApi()
        const userId = jellyfinClient.getAuthResult().User?.Id
        if (!userId) return

        const api = getUserViewsApi(japi)
        const views = await api.getUserViews({ userId })

        const allItems: any[] = []

        for (const view of views.data.Items || []) {
          if (!view.Id) continue

          const res = await getItemsApi(japi).getItems({
            userId,
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
  }, [isAuthenticated])

  if (!isAuthenticated) return null

  if (loading) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.Id} item={item} />
      ))}
    </div>
  )
}
