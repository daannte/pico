import type { Api } from "@jellyfin/sdk";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

interface Props {
  item: BaseItemDto;
  api: Api;
  quality?: number;
  width?: number;
  variant?:
  | "Primary"
  | "Backdrop"
  | "ParentBackdrop"
  | "ParentLogo"
  | "Logo"
  | "AlbumPrimary"
  | "SeriesPrimary"
  | "Screenshot"
  | "Thumb"
  | "EpisodeThumb";
}

export const getItemImageUrl = ({
  item,
  api,
  variant = "Primary",
  quality = 90,
  width = 1000,
}: Props): string | null => {
  if (!api || !item?.Id) return null;

  const basePath = api.basePath;

  switch (variant) {
    case "Backdrop":
      if (item.Type === "Episode") {
        const tag = item.ParentBackdropImageTags?.[0];
        if (!tag || !item.ParentBackdropItemId) return null;
        return `${basePath}/Items/${item.ParentBackdropItemId}/Images/Backdrop/0?quality=${quality}&tag=${tag}&width=${width}`;
      } else {
        const tag = item.BackdropImageTags?.[0];
        if (!tag) return null;
        return `${basePath}/Items/${item.Id}/Images/Backdrop/0?quality=${quality}&tag=${tag}&width=${width}`;
      }

    case "Primary":
      if (item.Type === "Episode") {
        const tag = item.SeriesPrimaryImageTag;
        if (!tag || !item.SeriesId) return null;
        return `${basePath}/Items/${item.SeriesId}/Images/Primary?quality=${quality}&tag=${tag}&width=${width}`;
      } else {
        const primaryTag = item.ImageTags?.Primary;
        if (!primaryTag) return null;
        return `${basePath}/Items/${item.Id}/Images/Primary?quality=${quality}&tag=${primaryTag}&width=${width}`;
      }

    case "Thumb":
      if (item.Type === "Episode") {
        const tag = item.ParentThumbImageTag;
        if (!tag || !item.ParentThumbItemId) return null;
        return `${basePath}/Items/${item.ParentThumbItemId}/Images/Thumb?quality=${quality}&tag=${tag}&width=${width}`;
      } else {
        const thumbTag = item.ImageTags?.Thumb;
        if (!thumbTag) return null;
        return `${basePath}/Items/${item.Id}/Images/Thumb?quality=${quality}&tag=${thumbTag}&width=${width}`;
      }

    default:
      const fallbackTag = item.ImageTags?.Primary;
      if (!fallbackTag) return null;
      return `${basePath}/Items/${item.Id}/Images/Primary?quality=${quality}&tag=${fallbackTag}&width=${width}`;
  }
};
