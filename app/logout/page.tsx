"use client"

import { useJellyfin } from "@/contexts/jellyfin-context"
import { useEffect } from "react"

export default function LogoutPage() {
  const { logout } = useJellyfin()

  useEffect(() => {
    logout()
  }, [])

  return <p>Signing out...</p>
}
