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

const mapKey = "mapKey";

function getMapsArray() {
  var foundMaps = localStorage.getItem(mapKey);
  if (!foundMaps) foundMaps = "";
  return foundMaps.split(",");
}

export function foundMap(mapId) {
  const maps = getMapsArray();
  const map = maps.find(m => m === mapId);

  if (!map) {
    maps.push(mapId);
    // remove any blank entries and then convert to CSV
    localStorage.setItem(mapKey, maps.filter(m => m).join(","));
  }
}

export function countFoundMaps() {
  return getMapsArray().length;
}

const localStorageService = {
  isDetailsActive,
  countDetailClick,
  isZoomInActive,
  countZoomInClick,
  isZoomOutActive,
  countZoomOutClick,
  foundMap,
  countFoundMaps
};
export default localStorageService;
