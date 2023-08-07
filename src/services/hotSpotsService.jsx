import httpService from "./httpService";
import env from "../env";

function getApiUrl() {
  return `${env.reflectionsApiUrl()}maps/`;
}

async function get(mapId, hotSpotId) {
  return (await httpService.get(`${getApiUrl()}${mapId}/hotSpots/${hotSpotId}`))
    .data;
}

async function save(mapId, hotSpot) {
  await httpService.post(`${getApiUrl()}${mapId}/hotSpots/`, hotSpot);
}

async function deleteHotSpot(mapId, hotSpotId) {
  await httpService.delete(`${getApiUrl()}${mapId}/hotSpots/${hotSpotId}`);
}

export default { get, save, deleteHotSpot };
