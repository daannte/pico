"use client"

import { useJellyfin } from "@/contexts/jellyfin-context"
import { getItemImageUrl } from "@/lib/jellyfin"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getItemsApi, getTvShowsApi } from "@jellyfin/sdk/lib/utils/api"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import Background from "@/components/background"
import { AnimatePresence } from "motion/react"
import Content from "@/components/content"
import Header from "@/components/header"
import EpisodeCarousel from "@/components/episode-carousel"

interface SeriesState {
  episodes: BaseItemDto[]
  series: BaseItemDto | null
  loading: boolean
  error: string | null
}

export default function Series() {
  const { api, user } = useJellyfin()
  const params = useParams()
  const [state, setState] = useState<SeriesState>({
    episodes: [],
    series: null,
    loading: true,
    error: null
  })

  const seriesId = params.seriesId as string

  const fetchSeries = useCallback(async () => {
    if (!api || !user?.Id) return null
    try {
      const itemsApi = getItemsApi(api)
      const response = await itemsApi.getItems({
        userId: user.Id,
        ids: [seriesId],
        fields: ["Genres", "Overview"]
      })
      return response.data.Items ? response.data.Items[0] : null
    } catch (error) {
      console.error("Failed to fetch series:", error)
      throw error
    }
  }, [api, user?.Id, seriesId])

  const fetchEpisodes = useCallback(async () => {
    if (!api || !user?.Id) return []
    try {
      const tvShowsApi = getTvShowsApi(api)
      const response = await tvShowsApi.getEpisodes({
        userId: user.Id,
        seriesId
      })
      return response.data.Items || []
    } catch (error) {
      console.error("Failed to fetch episodes:", error)
      throw error
    }
  }, [api, user?.Id, seriesId])

  useEffect(() => {
    if (!api || !user) return

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const [episodes, series] = await Promise.all([
          fetchEpisodes(),
          fetchSeries()
        ])
        setState({
          episodes,
          series,
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
  }, [api, user, fetchSeries, fetchEpisodes])

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

  const backdropUrl = state.series ? getItemImageUrl({ item: state.series, api: api!, variant: "Backdrop" }) : null

  const handlePlay = () => {
  }

  const handleMoreInfo = () => {
  }

  const handlePlayTrailer = () => {
  }

  return (
    <div className="w-full">
      <div className="relative h-[90vh] w-full overflow-hidden">
        <Background imageUrl={backdropUrl} />

        <div className="absolute inset-0 bg-black/20" />

        <div
          className="relative z-10 h-full flex items-center justify-center px-4 py-16 lg:p-16"
        >
          <div className="relative w-full max-w-8xl h-full rounded-lg overflow-hidden shadow-2xl">
            {state.series && (
              <AnimatePresence mode="wait">
                <div className="absolute inset-0">
                  <Content
                    item={state.series}
                    backgroundUrl={backdropUrl}
                    onPlay={handlePlay}
                    onMoreInfo={handleMoreInfo}
                    onPlayTrailer={handlePlayTrailer}
                    showMetadata={true}
                  />
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 p-8">
        <div className="flex justify-center items-center">
          <Header title="Episodes" variant="dark" />
        </div>
        <div className="w-full px-8">
          {state.episodes.length > 0 && (
            <section>
              <EpisodeCarousel items={state.episodes} />
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
