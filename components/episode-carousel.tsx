import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import React from "react";
import MediaCard from "./media-card";

interface EpisodeCarouselProps {
  items: BaseItemDto[]
}

export default function EpisodeCarousel({ items }: EpisodeCarouselProps) {
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
            <MediaCard item={item} variant="episode" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
