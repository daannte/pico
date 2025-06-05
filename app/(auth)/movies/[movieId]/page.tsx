"use client"

import { useJellyfin } from "@/contexts/jellyfin-context"
import { getItemImageUrl } from "@/lib/jellyfin"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Star } from "lucide-react"

interface MovieState {
  movie: BaseItemDto | null
  loading: boolean
  error: string | null
}

export default function Movies() {
  const { api, user } = useJellyfin()
  const params = useParams()
  const [state, setState] = useState<MovieState>({
    movie: null,
    loading: true,
    error: null
  })

  const movieId = params.movieId as string

  const fetchMovie = async () => {
    if (!api || !user?.Id) return null

    try {
      const itemsApi = getItemsApi(api)
      const response = await itemsApi.getItems({
        userId: user.Id,
        ids: [movieId],
        fields: ["Genres", "Overview"]
      })
      return response.data.Items ? response.data.Items[0] : null
    } catch (error) {
      console.error("Failed to fetch movie:", error)
      throw error
    }
  }

  useEffect(() => {
    if (!api || !user) return

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const [movie] = await Promise.all([
          fetchMovie()
        ])
        setState({
          movie,
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

  if (!state.movie) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Movie found</h2>
          <p className="text-gray-600">Movie appears to be not exist</p>
        </div>
      </div>
    )
  }

  const backdropUrl = state.movie ? getItemImageUrl({ item: state.movie, api: api!, variant: "Backdrop" }) : null

  return (
    <div className="w-full">
      {state.movie && backdropUrl && (
        <div className="relative w-full h-screen min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={backdropUrl}
              alt={state.movie.Name || "Movie backdrop"}
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
                  {state.movie.Name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  {state.movie.ProductionYear && (
                    <span className="text-lg font-medium">{state.movie.ProductionYear}</span>
                  )}
                  {state.movie.OfficialRating && (
                    <span className="px-2 py-1 border border-white/50 text-sm font-medium rounded">
                      {state.movie.OfficialRating}
                    </span>
                  )}
                  {state.movie.RunTimeTicks && (
                    <span className="text-md">
                      {Math.round((state.movie.RunTimeTicks / 10000000) / 60)} min
                    </span>
                  )}
                  {state.movie.CommunityRating && (
                    <div className="text-md font-medium flex items-center gap-1">
                      <Star className="fill-yellow-400" size={20} />
                      <span>{state.movie.CommunityRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {state.movie.Genres && state.movie.Genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {state.movie.Genres.slice(0, 3).map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* {state.Movie.Overview && ( */}
                {/*   <p className="text-white/90 text-lg leading-relaxed max-w-xl"> */}
                {/*     {state.Movie.Overview} */}
                {/*   </p> */}
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
