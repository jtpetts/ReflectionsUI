import httpService from "./httpService";
import env from "../env";

function getApiUrl() {
  return `${env.reflectionsApiUrl()}maps/`;
}

export async function getMap(id) {
  return (await httpService.get(`${getApiUrl()}${id}`)).data;
}

export async function getMapByName(name) {
  return (await httpService.get(`${getApiUrl()}/name/${name}`)).data;
}

export async function getMaps() {
  return (await httpService.get(`${getApiUrl()}`)).data;
}

export async function save(map) {
  if (map._id) return (await httpService.put(getApiUrl(), map)).data;
  else return (await httpService.post(getApiUrl(), map)).data;
}

export async function deleteMap(id) {
  await httpService.delete(`${getApiUrl()}${id}`);
}

const mapsService = { getMap, getMaps, save, deleteMap, getMapByName };
export default mapsService;
