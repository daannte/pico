"use client"
import { useCallback, useEffect, useState } from "react"
import { getUserViewsApi, getItemsApi, getTvShowsApi } from "@jellyfin/sdk/lib/utils/api"
import { useJellyfin } from "@/contexts/jellyfin-context"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import SuggestionsCarousel from "@/components/suggestions-carousel"

interface HomeState {
  allItems: BaseItemDto[]
  nextUpItems: BaseItemDto[]
  loading: boolean
  error: string | null
}

export default function Home() {
  const { api, user } = useJellyfin()
  const [state, setState] = useState<HomeState>({
    allItems: [],
    nextUpItems: [],
    loading: true,
    error: null
  })

  const fetchAllItems = useCallback(async () => {
    if (!api || !user?.Id) return []

    try {
      const userViewsApi = getUserViewsApi(api)
      const itemsApi = getItemsApi(api)

      const views = await userViewsApi.getUserViews({ userId: user.Id })
      const allItems: BaseItemDto[] = []

      const itemPromises = (views.data.Items || [])
        .filter(view => view.Id)
        .map(async (view) => {
          const response = await itemsApi.getItems({
            userId: user.Id,
            parentId: view.Id!,
            recursive: true,
            enableImageTypes: ["Primary", "Backdrop", "Banner", "Thumb"],
            imageTypeLimit: 1,
            fields: ["PrimaryImageAspectRatio", "SortName"],
            includeItemTypes: ["Series", "Movie"]
          })
          return response.data.Items || []
        })

      const itemArrays = await Promise.all(itemPromises)
      itemArrays.forEach(items => allItems.push(...items))

      return allItems
    } catch (error) {
      console.error("Failed to fetch library items:", error)
      throw error
    }
  }, [api, user])

  const fetchNextUpItems = useCallback(async () => {
    if (!api || !user?.Id) return []

    try {
      const tvShowsApi = getTvShowsApi(api)
      const response = await tvShowsApi.getNextUp({
        userId: user.Id,
        disableFirstEpisode: true
      })
      return response.data.Items || []
    } catch (error) {
      console.error("Failed to fetch next up items:", error)
      throw error
    }
  }, [api, user])

  useEffect(() => {
    if (!api || !user) return

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const [allItems, nextUpItems] = await Promise.all([
          fetchAllItems(),
          fetchNextUpItems(),
        ])

        setState({
          allItems,
          nextUpItems,
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
  }, [api, user, fetchNextUpItems, fetchAllItems])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Please log in to continue</div>
      </div>
    )
  }

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading your library...</div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-600">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (state.allItems.length === 0 && state.nextUpItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No content found</h2>
          <p className="text-gray-600">Your library appears to be empty</p>
        </div>
      </div>
    )
  }


  return (
    <div className="w-full space-y-8">
      <SuggestionsCarousel />
    </div>
  )
}
