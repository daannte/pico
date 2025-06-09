"use client"

import { useState, useEffect } from "react"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { getSuggestionsApi } from "@jellyfin/sdk/lib/utils/api"
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"

export const useSuggestions = () => {
  const { api, user } = useJellyfin()
  const [suggestions, setSuggestions] = useState<BaseItemDto[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSuggestions = async () => {
    if (!api || !user?.Id) return []
    try {
      const suggestionsApi = getSuggestionsApi(api)
      const response = await suggestionsApi.getSuggestions({
        userId: user.Id,
        type: ["Movie", "Series"],
        limit: 5,
      })
      return response.data.Items || []
    } catch (error) {
      console.error("Failed to fetch suggestions:", error)
      return []
    }
  }

  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true)
      const items = await fetchSuggestions()
      setSuggestions(items)
      setLoading(false)
    }
    loadSuggestions()
  }, [api, user])

  return { suggestions, loading }
}
