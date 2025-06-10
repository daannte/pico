"use client"

import { useJellyfin } from "@/contexts/jellyfin-context"
import { getItemImageUrl } from "@/lib/jellyfin"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import Background from "@/components/background"
import { AnimatePresence } from "motion/react"
import Content from "@/components/content"
import Header from "@/components/header"
import ContentCarousel from "@/components/content-carousel"

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

  const fetchMovie = useCallback(async () => {
    if (!api || !user?.Id) return null

    try {
      const itemsApi = getItemsApi(api)
      const response = await itemsApi.getItems({
        userId: user.Id,
        ids: [movieId],
        fields: ["Genres", "Overview", "People"]
      })
      return response.data.Items ? response.data.Items[0] : null
    } catch (error) {
      console.error("Failed to fetch movie:", error)
      throw error
    }
  }, [api, user, movieId])

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
  }, [api, user, fetchMovie])

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

  const handlePlay = () => {
  }

  const handleMoreInfo = () => {
  }

  const handlePlayTrailer = () => {
  }

  return (
    <div className="w-full bg-black">
      <div className="relative h-[90vh] w-full overflow-hidden">
        <Background imageUrl={backdropUrl} />

        <div className="absolute inset-0 bg-black/20" />

        <div
          className="relative z-10 h-full flex items-center justify-center p-16"
        >
          <div className="relative w-full max-w-8xl h-full rounded-lg overflow-hidden shadow-2xl">
            {state.movie && (
              <AnimatePresence mode="wait">
                <div className="absolute inset-0">
                  <Content
                    item={state.movie}
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
          <Header title="Cast" />
        </div>
        <div className="w-full px-8">
          {state.movie?.People && state.movie.People.length > 0 && (
            <section>
              <ContentCarousel items={state.movie.People} isCast={true} />
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
