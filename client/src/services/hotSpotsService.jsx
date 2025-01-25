import httpService from "./httpService";
import env from "../env";

function getApiUrl() {
  return `${env.reflectionsApiUrl()}maps/`;
}

export async function get(mapId, hotSpotId) {
  return (await httpService.get(`${getApiUrl()}${mapId}/hotSpots/${hotSpotId}`))
    .data;
}

export async function save(mapId, hotSpot) {
  await httpService.post(`${getApiUrl()}${mapId}/hotSpots/`, hotSpot);
}

export async function deleteHotSpot(mapId, hotSpotId) {
  await httpService.delete(`${getApiUrl()}${mapId}/hotSpots/${hotSpotId}`);
}

const hotSpotsService = { get, save, deleteHotSpot };
export default hotSpotsService;
