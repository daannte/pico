import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { BaseItemDto, BaseItemPerson } from "@jellyfin/sdk/lib/generated-client/models";
import React from "react";
import MediaCard from "./media-card";
import CastCard from "./cast-card";

interface EpisodeCarouselProps {
  items: BaseItemDto[] | BaseItemPerson[]
  variant?: "default" | "episode"
  isCast?: boolean
}

export default function ContentCarousel({ items, variant = "default", isCast = false }: EpisodeCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full p-4"
    >
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem
            key={item.Id}
            className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            {!isCast ?
              (
                <MediaCard item={item as BaseItemDto} variant={variant} />) : (
                <CastCard item={item as BaseItemPerson} />
              )}

          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
