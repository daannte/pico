"use client"

import { useJellyfin } from "@/contexts/jellyfin-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useJellyfin()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
