"use client"

import SectionsCard from "./ui/home-sections/sections-card"
import { useNextUp } from "@/hooks/use-nextup"
import { useLatestAdded } from "@/hooks/use-latest-added"

export default function HomeSections() {
  const nextUp = useNextUp()
  const latestAdded = useLatestAdded()

  const isLoading = nextUp.loading || latestAdded.loading

  const hasError = nextUp.error || latestAdded.error
  const errorMessage = nextUp.error || latestAdded.error

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="relative h-screen w-full overflow-hidden bg-gray-900">
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-16">
                <div className="w-full h-8 bg-gray-700 rounded animate-pulse mb-8"></div>
                <div className="w-full h-full bg-gray-800 rounded animate-pulse shadow-2xl"></div>
                <div className="w-full h-16 bg-gray-700 rounded animate-pulse mt-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="relative h-screen w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-black" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-16">
              <div className="text-red-400 text-2xl text-center">
                Error loading content: {errorMessage}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <SectionsCard
          title="Continue Watching"
          items={nextUp.item ? [nextUp.item] : []}
          totalCount={nextUp.totalCount}
          type="nextup"
        />
        <SectionsCard
          title="Recently Added"
          items={latestAdded.items}
          totalCount={latestAdded.totalCount}
          type="latest"
        />
        <SectionsCard
          title="Favourites"
          items={[]}
          totalCount={0}
          type="favourites"
        />
      </div>
    </div>
  )
}
