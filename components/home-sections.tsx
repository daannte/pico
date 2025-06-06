"use client"

import { useEffect, useState } from "react"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { getItemsApi, getTvShowsApi } from "@jellyfin/sdk/lib/utils/api"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import SectionsCard from "./ui/home-sections/sections-card"

interface HomeSectionsState {
  nextUp: BaseItemDto[]
  myLibrary: BaseItemDto[]
  latestAdded: BaseItemDto[]
  loading: boolean
  error: string | null
}

export default function HomeSections() {
  const { api, user } = useJellyfin()
  const [state, setState] = useState<HomeSectionsState>({
    nextUp: [],
    myLibrary: [],
    latestAdded: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    if (!api || !user) return

    const fetchNextUp = async () => {
      try {
        const tvShowsApi = getTvShowsApi(api)
        const response = await tvShowsApi.getNextUp({
          userId: user.Id!,
          limit: 6,
          disableFirstEpisode: true
        })
        return response.data.Items || []
      } catch (error) {
        console.error("Failed to fetch next up:", error)
        return []
      }
    }

    const fetchMyLibrary = async () => {
      try {
        const itemsApi = getItemsApi(api)
        const response = await itemsApi.getItems({
          userId: user.Id!,
          limit: 6,
          recursive: true,
          includeItemTypes: ["Series", "Movie"],
          sortBy: ["Random"],
          fields: ["PrimaryImageAspectRatio"]
        })
        return response.data.Items || []
      } catch (error) {
        console.error("Failed to fetch library items:", error)
        return []
      }
    }

    const fetchLatestAdded = async () => {
      try {
        const itemsApi = getItemsApi(api)
        const response = await itemsApi.getItems({
          userId: user.Id!,
          limit: 6,
          recursive: true,
          includeItemTypes: ["Series", "Movie"],
          sortBy: ["DateCreated"],
          sortOrder: ["Descending"],
          fields: ["PrimaryImageAspectRatio", "DateCreated"]
        })
        return response.data.Items || []
      } catch (error) {
        console.error("Failed to fetch latest added:", error)
        return []
      }
    }

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const [nextUp, myLibrary, latestAdded] = await Promise.all([
          fetchNextUp(),
          fetchMyLibrary(),
          fetchLatestAdded()
        ])
        setState({
          nextUp,
          myLibrary,
          latestAdded,
          loading: false,
          error: null
        })
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        }))
      }
    }

    loadData()
  }, [api, user])

  if (state.loading) {
    return (
      <div className="w-full px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
              <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
              <div className="space-y-2">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="w-full px-4 py-8">
        <div className="text-center text-red-500">
          <p>Error loading content: {state.error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <SectionsCard />
        <SectionsCard />
        <SectionsCard />
      </div>
    </div>
  )
}
