import { useJellyfin } from "@/contexts/jellyfin-context"
import type { TvShowsApiGetNextUpRequest } from "@jellyfin/sdk/lib/generated-client/api/tv-shows-api"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getTvShowsApi } from "@jellyfin/sdk/lib/utils/api"
import { useEffect, useState } from "react"

interface UseNextUpState {
  item: BaseItemDto | null
  totalCount: number
  loading: boolean
  error: string | null
}

export function useNextUp(options: TvShowsApiGetNextUpRequest = {}) {
  const { api, user } = useJellyfin()
  const [state, setState] = useState<UseNextUpState>({
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

  useEffect(() => {
    if (!api || !user) {
      setState({
        item: null,
        totalCount: 0,
        loading: false,
        error: null
      })
      return
    }

    const fetchNextUp = async () => {
      try {
        const tvShowsApi = getTvShowsApi(api)
        const response = await tvShowsApi.getNextUp({
          userId: user.Id!,
          limit,
          disableFirstEpisode,
          enableTotalRecordCount
        })

        const items = response.data.Items || []
        const totalCount = response.data.TotalRecordCount || 0
        const item = items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null

        return {
          item,
          totalCount
        }
      } catch (error) {
        console.error("Failed to fetch next up:", error)
        throw error
      }
    }

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const { item, totalCount } = await fetchNextUp()
        setState({
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
      const tvShowsApi = getTvShowsApi(api)
      const response = await tvShowsApi.getNextUp({
        userId: user.Id!,
        limit,
        disableFirstEpisode,
        enableTotalRecordCount
      })

      const items = response.data.Items || []
      const totalCount = response.data.TotalRecordCount || 0
      const item = items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null

      setState({
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
