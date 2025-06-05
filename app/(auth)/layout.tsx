"use client"

import { useJellyfin } from "@/contexts/jellyfin-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
import { ArrowLeft, Film, Home, LibraryBig } from "lucide-react"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useJellyfin()
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <Home className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      )
    },
    {
      label: "Library",
      href: "/library",
      icon: (
        <LibraryBig className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      )
    },
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <ArrowLeft className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      )
    }
  ]

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="flex min-h-screen h-screen overflow-hidden">
      <div className="sticky top-0 h-screen">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody>
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              <Film size={24} />
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
