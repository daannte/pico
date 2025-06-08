"use client"

import { useJellyfin } from "@/contexts/jellyfin-context"
import type { TvShowsApiGetNextUpRequest } from "@jellyfin/sdk/lib/generated-client/api/tv-shows-api"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getTvShowsApi } from "@jellyfin/sdk/lib/utils/api"
import { useEffect, useState } from "react"

interface UseNextUpState {
  items: BaseItemDto[]
  item: BaseItemDto | null
  totalCount: number
  loading: boolean
  error: string | null
}

export function useNextUp(options: TvShowsApiGetNextUpRequest = {}) {
  const { api, user } = useJellyfin()
  const [state, setState] = useState<UseNextUpState>({
    items: [],
    item: null,
    totalCount: 0,
    loading: true,
    error: null
  })

  const {
    limit = 5,
    disableFirstEpisode = true,
    enableTotalRecordCount = true
  } = options

  const fetchNextUp = async () => {
    const tvShowsApi = getTvShowsApi(api!)
    const response = await tvShowsApi.getNextUp({
      userId: user!.Id!,
      limit,
      disableFirstEpisode,
      enableTotalRecordCount
    })

    const items = response.data.Items || []
    const totalCount = response.data.TotalRecordCount || 0
    const item = items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null

    return { items, item, totalCount }
  }

  useEffect(() => {
    if (!api || !user) {
      setState({
        items: [],
        item: null,
        totalCount: 0,
        loading: false,
        error: null
      })
      return
    }

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const { items, item, totalCount } = await fetchNextUp()
        setState({
          items,
          item,
          totalCount,
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
  }, [api, user, limit, disableFirstEpisode, enableTotalRecordCount])

  const refetch = async () => {
    if (!api || !user) return

    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const { items, item, totalCount } = await fetchNextUp()
      setState({
        items,
        item,
        totalCount,
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

  return {
    ...state,
    refetch
  }
}
