import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import React from "react";
import ItemCard from "./item-card";
import EpisodeCard from "./episode-card";

interface CarouselSlidesProps {
  items: BaseItemDto[]
  episodes?: boolean
}

export default function CarouselSlides({ items, episodes }: CarouselSlidesProps) {
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
            className={episodes ? "md:basis-1/2 lg:basis-1/3 xl:basis-1/4" : "md:basis-1/4 lg:basis-1/5 xl:basis-1/6"}
          >
            {episodes ?
              <EpisodeCard item={item} /> :
              <ItemCard item={item} />
            }
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
