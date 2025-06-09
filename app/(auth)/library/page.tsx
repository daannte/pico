"use client"

import LibraryCard from "@/components/library-card"
import { useMedia } from "@/contexts/media-context"

export default function Libraries() {
  const { libraries } = useMedia()

  if (libraries.loading) return <div>Spinner</div>

  if (!libraries.views) return <div>No views</div>

  return (
    <div className="h-screen bg-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-16">
        {libraries.views.map((view) => (
          <LibraryCard key={view.Id} item={view} />
        ))}
      </div>
    </div>
  )
}
