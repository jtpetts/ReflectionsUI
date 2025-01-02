import NovelService from "./novelService";

const details = "refShowDetails";
const zoomIn = "refShowZoomIn";
const zoomOut = "refShowZoomOut";
// const hideAt = 3;

function parseKey(key) {
  const countStr = localStorage.getItem(key);
  var count = parseInt(countStr, 10);
  if (!count) count = 0; // when first logging in, the parameter doesn't exist, treat as zero
  return count;
}

function increment(key) {
  localStorage.setItem(key, (parseKey(key) + 1).toString());
}

// function isTipActive(key) {
//   return parseKey(key) < hideAt;
// }

export function isDetailsActive() {
  return false;
  //  return isTipActive(details);
}

export function countDetailClick() {
  increment(details);
}

export function isZoomInActive() {
  return false;
  //  return isTipActive(zoomIn);
}

export function countZoomInClick() {
  increment(zoomIn);
}

export function isZoomOutActive() {
  return false;
  //  return isTipActive(zoomOut);
}

export function countZoomOutClick() {
  increment(zoomOut);
}

function getMapIdsKey() {
  const novelId = getCurrentNovel();

  return `mapKey_${novelId}`;
}

function getMapIdsArray() {
  var foundMaps = localStorage.getItem(getMapIdsKey());
  if (!foundMaps) foundMaps = "";
  return foundMaps.split(",");
}

export function foundMap(mapId) {
  const mapIds = getMapIdsArray();
  const map = mapIds.find(m => m === mapId);

  if (!map) {
    mapIds.push(mapId);
    // remove any blank entries and then convert to CSV
    localStorage.setItem(getMapIdsKey(), mapIds.filter(m => m).join(","));
  }
}

export function countFoundMaps() {
  return getMapIdsArray().length;
}

// current novel
const novelKey = "novelKey";

function setCurrentNovelFromHref(href) {
  const novelId = NovelService.identifyNovelIdFromHref(href);
  localStorage.setItem(novelKey, novelId);
}

function getCurrentNovel() {
  const novelId = localStorage.getItem(novelKey);
  return novelId;
}

const localStorageService = {
  isDetailsActive,
  countDetailClick,
  isZoomInActive,
  countZoomInClick,
  isZoomOutActive,
  countZoomOutClick,
  foundMap,
  countFoundMaps,
  setCurrentNovelFromHref,
  getCurrentNovel
};
export default localStorageService;
