import { useJellyfin } from "@/contexts/jellyfin-context"
import type { ItemsApiGetItemsRequest } from "@jellyfin/sdk/lib/generated-client/api/items-api"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api"
import { useEffect, useState } from "react"

interface UseLatestAddedState {
  items: BaseItemDto[]
  totalCount: number
  loading: boolean
  error: string | null
}

export function useLatestAdded(options: ItemsApiGetItemsRequest = {}) {
  const { api, user } = useJellyfin()
  const [state, setState] = useState<UseLatestAddedState>({
    items: [],
    totalCount: 0,
    loading: true,
    error: null
  })

  const {
    limit = 10,
    includeItemTypes = ["Series", "Movie"],
    fields = ["PrimaryImageAspectRatio", "DateCreated"]
  } = options

  useEffect(() => {
    if (!api || !user) {
      setState({
        items: [],
        totalCount: 0,
        loading: false,
        error: null
      })
      return
    }

    const fetchLatestAdded = async () => {
      try {
        const itemsApi = getItemsApi(api)
        const response = await itemsApi.getItems({
          userId: user.Id!,
          limit,
          recursive: true,
          includeItemTypes,
          sortBy: ["DateCreated"],
          sortOrder: ["Descending"],
          fields,
          enableTotalRecordCount: true
        })

        return {
          items: response.data.Items || [],
          totalCount: response.data.TotalRecordCount || 0
        }
      } catch (error) {
        console.error("Failed to fetch latest added:", error)
        throw error
      }
    }

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const { items, totalCount } = await fetchLatestAdded()
        setState({
          items,
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
  }, [api, user, limit, JSON.stringify(includeItemTypes), JSON.stringify(fields)])

  const refetch = async () => {
    if (!api || !user) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const itemsApi = getItemsApi(api)
      const response = await itemsApi.getItems({
        userId: user.Id!,
        limit,
        recursive: true,
        includeItemTypes,
        sortBy: ["DateCreated"],
        sortOrder: ["Descending"],
        fields,
        enableTotalRecordCount: true
      })

      setState({
        items: response.data.Items || [],
        totalCount: response.data.TotalRecordCount || 0,
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
