"use client";

import ItemCard from "./item-card";
import { useMedia } from "@/contexts/media-context";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function MediaList() {
  const {
    nextUp,
    latestAdded,
    // favouritesItems,
    currentSection,
    setCurrentSection,
  } = useMedia();

  return (
    <div className="bg-black min-h-screen w-full text-white">
      <div className="px-4 py-12 sm:px-8 lg:p-16 space-y-12">

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <Button
            variant="ghost"
            onClick={() => setCurrentSection("watching")}
            className={cn(
              "text-2xl font-semibold px-6 py-4 transition-colors",
              currentSection !== "watching" && "text-muted-foreground"
            )}
          >
            Continue Watching ({nextUp.totalCount})
          </Button>

          <Button
            variant="ghost"
            onClick={() => setCurrentSection("recentlyAdded")}
            className={cn(
              "text-2xl font-semibold px-6 py-4 transition-colors",
              currentSection !== "recentlyAdded" && "text-muted-foreground"
            )}
          >
            Recently Added ({latestAdded.totalCount})
          </Button>

          <Button
            variant="ghost"
            onClick={() => setCurrentSection("favourites")}
            className={cn(
              "text-2xl font-semibold px-6 py-4 transition-colors",
              currentSection !== "favourites" && "text-muted-foreground"
            )}
          >
            Favourites ({0})
          </Button>
        </div>

        {currentSection === "watching" && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {nextUp.items.map((item, i) => (
              <ItemCard key={i} item={item} />
            ))}
          </div>
        )}

        {currentSection === "recentlyAdded" && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {latestAdded.items.map((item, i) => (
              <ItemCard key={i} item={item} />
            ))}
          </div>
        )}

        {/* {currentSection === "favourites" && ( */}
        {/*   <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> */}
        {/*     {favouritesItems.map((item, i) => ( */}
        {/*       <ItemCard key={i} item={item} /> */}
        {/*     ))} */}
        {/*   </div> */}
        {/* )} */}
      </div>
    </div>
  );
}
