import { useEffect, useState } from "react"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getUserViewsApi } from "@jellyfin/sdk/lib/utils/api"
import { useJellyfin } from "@/contexts/jellyfin-context"

export function useLibraryViews() {
  const { api, user } = useJellyfin()
  const [views, setViews] = useState<BaseItemDto[] | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    if (!api || !user) return

    const fetchViews = async () => {
      try {
        const userApi = getUserViewsApi(api)
        const res = await userApi.getUserViews({ userId: user.Id })
        setViews(res.data.Items)
      } catch (err) {
        console.error("Failed to fetch views", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchViews()
  }, [api, user])

  return { views, loading, error }
}
