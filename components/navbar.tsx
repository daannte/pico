"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useJellyfin } from "@/contexts/jellyfin-context"

export default function Navbar() {
  const { logout } = useJellyfin()

  return (
    <header className="w-full px-4 py-2 flex items-center justify-between bg-transparent/0">
      <div className="text-xl font-semibold">
        <Link href="/">Pico</Link>
      </div>

      <nav className="flex-1 flex justify-center gap-6 text-sm font-medium">
        <Link href="/">Home</Link>
        <Link href="/library">Library</Link>
        {/* <Link href="/tv">TV Shows</Link> */}
        {/* <Link href="/movies">Movies</Link> */}
      </nav>

      <div>
        <Button onClick={logout} variant="ghost" className="px-2 text-sm text-red-500 hover:text-red-600">
          Logout
        </Button>
      </div>
    </header>
  )
}
