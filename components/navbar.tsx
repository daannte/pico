"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const { logout } = useJellyfin()

  return (
    <header className="w-full px-8 py-2 flex items-center justify-between bg-gradient-to-b from-black/40 to-transparent">
      <div className="text-white text-2xl font-semibold">
        <Link href="/">Pico</Link>
      </div>
      <nav className="text-white flex-1 flex justify-center gap-6 font-medium">
        <Link
          href="/"
          className={pathname === "/" ? "text-white" : "text-white/60 hover:text-white/90 transition-colors"}
        >
          Home
        </Link>
        <Link
          href="/library"
          className={pathname === "/library" ? "text-white" : "text-white/60 hover:text-white/90 transition-colors"}
        >
          Library
        </Link>
      </nav>
      <div>
        <Button
          onClick={logout}
          variant="secondary"
          className="text-foreground font-semibold"
        >
          Logout
        </Button>
      </div>
    </header >
  )
}
