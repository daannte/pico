"use client";

import { motion, AnimatePresence } from "motion/react";
import { useMedia } from "@/contexts/media-context";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import MediaCard from "./media-card";

export const slideVariants = {
  enter: { x: "100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

export const slideTransition = {
  duration: 0.5,
  ease: "easeInOut" as const,
};

export default function MediaList() {
  // TODO: Add favourites hook
  const {
    nextUp,
    latestAdded,
    currentSection,
    setCurrentSection,
  } = useMedia();

  const renderSectionItems = () => {
    if (currentSection === "watching") {
      return nextUp.items.map((item, i) => <MediaCard key={i} item={item} variant="episode" />);
    }

    if (currentSection === "recentlyAdded") {
      return latestAdded.items.map((item, i) => <MediaCard key={i} item={item} />);
    }

    return [];
  };

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
            Favourites (0)
          </Button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {renderSectionItems()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
