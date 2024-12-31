import imageFeudingEnclaves from "../images/reflections/FeudingEnclaves.jpg";
import imageRiverside from "../images/reflections/Riverside.jpg";
import imageWoodvine from "../images/reflections/Woodvine.jpg";
import imageMagmaPaths from "../images/reflections/MagmaPaths.jpg";
import imageMarais from "../images/reflections/Marais.jpg";
import imageSuburbs from "../images/reflections/Suburbs.jpg";
import imageBelowWarehouse from "../images/reflections/BelowWarehouse.jpg";
import imageArena from "../images/reflections/Arena.jpg";
import imageFrostWizardsPrison from "../images/reflections/FrostWizardsPrison.jpg";
import imageKaufen from "../images/reflections/Kaufen.jpg";
import imageMoonGarden from "../images/reflections/MoonGarden.jpg";
import imageThroneRoom from "../images/reflections/ThroneRoom.jpg";
import imageCursedForest from "../images/reflections/CursedForest.jpg";
import imageEiserune from "../images/reflections/Eiserune.jpg";
import imageDeepfort from "../images/reflections/Deepfort.jpg";

import imageAfterlifeRegional from "../images/afterlife/Regional.jpg";
import imageAfterlifeBlackrun from "../images/afterlife/Blackrun.jpg";
import imageAfterlifeSaberRidge from "../images/afterlife/SaberRidge.jpg";
import imageAfterlifeDusthaven from "../images/afterlife/Dusthaven.jpg";
import imageAfterlifeSanctum from "../images/afterlife/Sanctum.jpg";
import imageAfterlifeSilverfield from "../images/afterlife/Silverfield.jpg";
import imageAfterlifeUnityMountain from "../images/afterlife/UnityMountain.jpg";

const imageList = [
  { novelId: "reflections", imageFilename: "FeudingEnclaves.jpg", image: imageFeudingEnclaves },
  { novelId: "reflections", imageFilename: "Riverside.jpg", image: imageRiverside },
  { novelId: "reflections", imageFilename: "Woodvine.jpg", image: imageWoodvine },
  { novelId: "reflections", imageFilename: "MagmaPaths.jpg", image: imageMagmaPaths },
  { novelId: "reflections", imageFilename: "Marais.jpg", image: imageMarais },
  { novelId: "reflections", imageFilename: "Suburbs.jpg", image: imageSuburbs },
  { novelId: "reflections", imageFilename: "BelowWarehouse.jpg", image: imageBelowWarehouse },
  { novelId: "reflections", imageFilename: "Arena.jpg", image: imageArena },
  { novelId: "reflections", imageFilename: "FrostWizardsPrison.jpg", image: imageFrostWizardsPrison },
  { novelId: "reflections", imageFilename: "Kaufen.jpg", image: imageKaufen },
  { novelId: "reflections", imageFilename: "MoonGarden.jpg", image: imageMoonGarden },
  { novelId: "reflections", imageFilename: "ThroneRoom.jpg", image: imageThroneRoom },
  { novelId: "reflections", imageFilename: "CursedForest.jpg", image: imageCursedForest },
  { novelId: "reflections", imageFilename: "Eiserune.jpg", image: imageEiserune },
  { novelId: "reflections", imageFilename: "Deepfort.jpg", image: imageDeepfort },

  { novelId: "afterlife", imageFilename: "Regional.jpg", image: imageAfterlifeRegional },
  { novelId: "afterlife", imageFilename: "Blackrun.jpg", image: imageAfterlifeBlackrun },
  { novelId: "afterlife", imageFilename: "SaberRidge.jpg", image: imageAfterlifeSaberRidge },
  { novelId: "afterlife", imageFilename: "Dusthaven.jpg", image: imageAfterlifeDusthaven },
  { novelId: "afterlife", imageFilename: "Sanctum.jpg", image: imageAfterlifeSanctum },
  { novelId: "afterlife", imageFilename: "Silverfield.jpg", image: imageAfterlifeSilverfield },
  { novelId: "afterlife", imageFilename: "UnityMountain.jpg", image: imageAfterlifeUnityMountain }
];

export function get(imageFilename) {
  const image = imageList.find(i => i.imageFilename === imageFilename);
  if (image) return image.image;
  else return null;
}

export function getImages() {
  return imageList;
}

export function getImagesByNovelId(novelId) {
  return imageList.filter((image) => image.novelId === novelId);
}

const imageService = { get, getImages, getImagesByNovelId };
export default imageService;
