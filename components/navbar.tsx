"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const { logout } = useJellyfin()

  const NAV_LINKS = [
    {
      name: "Home",
      href: "/"
    },
    {
      name: "Library",
      href: "/library"
    },
    {
      name: "Media",
      href: "/media"
    }
  ]

  return (
    <header className="w-full px-8 py-2 flex items-center justify-between bg-gradient-to-b from-black/40 to-transparent">
      <div className="text-white text-2xl font-semibold">
        <Link href="/">Pico</Link>
      </div>
      <nav className="flex-1 flex justify-center gap-6 font-medium">
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "text-white" : "text-white/60 hover:text-white/90 transition-colors"}
          >
            {item.name}
          </Link>
        ))}
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
