"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { useNextUp } from "@/hooks/use-nextup";
import { useLatestAdded } from "@/hooks/use-latest-added";
import { useLibraryViews } from "@/hooks/use-library-views";
// import { useFavorites } from "@/hooks/use-favorites";
import type { Section } from "@/types/sections";


interface MediaContextType {
  nextUp: ReturnType<typeof useNextUp>;
  latestAdded: ReturnType<typeof useLatestAdded>;
  libraries: ReturnType<typeof useLibraryViews>;
  // favorites: ReturnType<typeof useFavorites>;
  currentSection: Section;
  setCurrentSection: (section: Section) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: ReactNode }) {
  const nextUp = useNextUp();
  const latestAdded = useLatestAdded();
  const libraries = useLibraryViews();
  // const favorites = useFavorites();

  const [currentSection, setCurrentSection] = useState<Section>("watching");

  return (
    <MediaContext.Provider value={{ nextUp, latestAdded, libraries, currentSection, setCurrentSection }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
}
