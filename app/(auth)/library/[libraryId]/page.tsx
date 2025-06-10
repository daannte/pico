"use client"

import MediaCard from "@/components/media-card"
import { useJellyfin } from "@/contexts/jellyfin-context"
import type { BaseItemDto, BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models"
import { getItemsApi, getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

interface LibraryState {
  items: BaseItemDto[] | null
  loading: boolean
  error: string | null
}

export default function Library() {
  const { api, user } = useJellyfin()
  const params = useParams()
  const [state, setState] = useState<LibraryState>({
    items: null,
    loading: true,
    error: null
  })

  const libraryId = params.libraryId as string

  const fetchLibrary = useCallback(async () => {
    if (!api || !user?.Id) return null
    try {
      const libraryApi = getUserLibraryApi(api)
      const res = await libraryApi.getItem({
        itemId: libraryId,
        userId: user.Id
      })
      const library = res.data

      let itemType: BaseItemKind | undefined;

      if (library.CollectionType === "movies") {
        itemType = "Movie";
      } else if (library.CollectionType === "tvshows") {
        itemType = "Series";
      } else if (library.CollectionType === "boxsets") {
        itemType = "BoxSet";
      }

      const itemsApi = getItemsApi(api)
      const response = await itemsApi.getItems({
        userId: user.Id,
        parentId: libraryId,
        recursive: true,
        includeItemTypes: itemType ? [itemType] : undefined
      })
      return response.data.Items || []
    } catch (error) {
      console.error("Failed to fetch series:", error)
      throw error
    }
  }, [api, user?.Id, libraryId])

  useEffect(() => {
    if (!api || !user) return

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const items = await fetchLibrary()

        setState({
          items,
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
  }, [api, user, fetchLibrary])

  return (
    <div className="bg-black min-h-screen">
      <div className="p-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {state.items && state.items.map((item, i) => (
          <MediaCard key={i} item={item} />
        ))}
      </div >
    </div>
  )
}
