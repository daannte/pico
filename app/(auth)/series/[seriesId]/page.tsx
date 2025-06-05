"use client"
import CarouselSlides from "@/components/carousel"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { getItemImageUrl } from "@/lib/jellyfin"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getItemsApi, getTvShowsApi } from "@jellyfin/sdk/lib/utils/api"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Star } from "lucide-react"

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

  const fetchSeries = async () => {
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
  }

  const fetchEpisodes = async () => {
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
  }

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

  const backdropUrl = state.series ? getItemImageUrl({ item: state.series, api: api!, variant: "Backdrop" }) : null

  return (
    <div className="w-full">
      {state.series && backdropUrl && (
        <div className="relative w-full h-[90vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={backdropUrl}
              alt={state.series.Name || "Series backdrop"}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 h-full flex items-center">
            <div className="absolute left-8">
              <div className="max-w-2xl space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-8xl font-bold text-white drop-shadow-lg">
                  {state.series.Name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  {state.series.ProductionYear && (
                    <span className="text-lg font-medium">{state.series.ProductionYear}</span>
                  )}
                  {state.series.OfficialRating && (
                    <span className="px-2 py-1 border border-white/50 text-sm font-medium rounded">
                      {state.series.OfficialRating}
                    </span>
                  )}
                  {state.series.RunTimeTicks && (
                    <span className="text-md">
                      {Math.round((state.series.RunTimeTicks / 10000000) / 60)} min avg
                    </span>
                  )}
                  {state.series.CommunityRating && (
                    <div className="text-md font-medium flex items-center gap-1">
                      <Star className="fill-yellow-400" size={20} />
                      <span>{state.series.CommunityRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {state.series.Genres && state.series.Genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {state.series.Genres.slice(0, 3).map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* {state.series.Overview && ( */}
                {/*   <p className="text-white/90 text-lg leading-relaxed max-w-xl"> */}
                {/*     {state.series.Overview} */}
                {/*   </p> */}
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full p-4 md:p-8 lg:p-16 space-y-8">
        {state.episodes.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Episodes</h2>
            <CarouselSlides items={state.episodes} episodes />
          </section>
        )}
      </div>
    </div>
  )
}
