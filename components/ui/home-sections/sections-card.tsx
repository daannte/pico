"use client"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { getItemImageUrl } from "@/lib/jellyfin"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getTvShowsApi } from "@jellyfin/sdk/lib/utils/api"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "../button"
import SectionsHeader from "./sections-header"

interface SectionsCardProps {
  title: string
}

interface HomeSectionsState {
  item: BaseItemDto | null
  totalCount: number
  loading: boolean
  error: string | null
}

export default function SectionsCard({ title }: SectionsCardProps) {
  const { api, user } = useJellyfin()
  const [state, setState] = useState<HomeSectionsState>({
    item: null,
    totalCount: 0,
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
          limit: 5,
          disableFirstEpisode: true,
          enableTotalRecordCount: true
        })
        const items = response.data.Items || []
        const totalCount = response.data.TotalRecordCount || 0
        const item = items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null
        return {
          Item: item ? item : null,
          TotalRecordCount: totalCount
        }
      } catch (error) {
        console.error("Failed to fetch next up:", error)
        return { Item: null, TotalRecordCount: 0 }
      }
    }

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const nextUpData = await fetchNextUp()
        setState({
          item: nextUpData.Item,
          totalCount: nextUpData.TotalRecordCount,
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

  const item = state.item
  if (!item) return <div>Nothing to watch</div>

  const image = getItemImageUrl({ item, api: api! })

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center blur-xs scale-102 z-0"
        style={{
          backgroundImage: image
            ? `url(${image})`
            : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)'
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center p-16">
        <SectionsHeader title={title} count={state.totalCount} />

        <div className="relative w-full h-full overflow-hidden shadow-2xl">
          {image ? (
            <Image
              src={image}
              alt={item.Name || "Backdrop"}
              className="object-cover"
              fill
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
        </div>

        <div className="mt-8 w-full relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded-sm blur-sm group-hover:blur-none transition-all duration-300 opacity-0 group-hover:opacity-100" />
          <Button
            size="lg"
            className="relative w-full py-6 px-8 bg-black/20 backdrop-blur-md hover:bg-white/95 hover:text-black border-2 border-white/80 hover:border-white uppercase text-2xl font-bold text-white tracking-widest transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] rounded-sm"
          >
            <span className="relative z-10">See All</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-sm" />
          </Button>
        </div>
      </div>
    </section>
  )
}
