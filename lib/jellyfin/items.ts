import { jellyfinClient } from "./client";
import { BaseItemDtoQueryResult } from "@jellyfin/sdk/lib/generated-client/models"
import { ItemsApiGetItemsRequest } from "@jellyfin/sdk/lib/generated-client/api"
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api"

export async function getItems(params: ItemsApiGetItemsRequest): Promise<BaseItemDtoQueryResult> {
  const api = jellyfinClient.getApi()
  const itemApi = getItemsApi(api)
  const auth = jellyfinClient.getAuthResult()

  const result = await itemApi.getItems({
    userId: auth.User?.Id,
    ...params
  })

  return result.data
}
