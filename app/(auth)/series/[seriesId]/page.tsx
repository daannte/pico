"use client"

import CarouselSlides from "@/components/carousel"
import { useJellyfin } from "@/contexts/jellyfin-context"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getTvShowsApi } from "@jellyfin/sdk/lib/utils/api"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

interface SeriesState {
  episodes: BaseItemDto[]
  loading: boolean
  error: string | null
}

export default function Series() {
  const { api, user } = useJellyfin()
  const params = useParams()
  const [state, setState] = useState<SeriesState>({
    episodes: [],
    loading: true,
    error: null
  })
  const seriesId = params.seriesId as string


  const fetchEpisodes = async () => {
    if (!api || !user?.Id) return []

    try {
      const tvShowsApi = getTvShowsApi(api)
      const response = await tvShowsApi.getEpisodes({
        userId: user.Id,
        seriesId
      })
      console.log(response.data.Items)
      return response.data.Items || []
    } catch (error) {
      console.error("Failed to fetch next up items:", error)
      throw error
    }
  }

  useEffect(() => {
    if (!api || !user) return

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const [episodes] = await Promise.all([
          fetchEpisodes(),
        ])

        setState({
          episodes,
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

  if (state.episodes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Episodes found</h2>
          <p className="text-gray-600">Series appears to be empty</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-4 md:p-8 lg:p-16 space-y-8">
      {state.episodes.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Episodes</h2>
          <CarouselSlides items={state.episodes} episodes />
        </section>
      )}
    </div>
  )
}
