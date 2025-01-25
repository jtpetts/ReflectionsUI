import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import MapsService from "../services/mapsService";
import AuthService from "../services/authService";
import NovelService from "../services/novelService";
import localStorageService from "../services/localStorageService";
import imageBackArrow from "../images/arrow back.png";
import AnnotatedMap from "./annotatedMap";
// import Annotator from "./annotator";
import Explorations from "./explorations";
import Config from "../config";

function Maps() {
  const [map, setMap] = useState({});
  const [maps, setMaps] = useState([]);
  const [breadCrumbs, setBreadcrumbs] = useState([]);
  const [selectedHotSpot, setSelectedHotSpot] = useState(null);
  const [isAnnotationOn, setIsAnnotationOn] = useState(true);
  const [imageDim, setImageDim] = useState(10);
  const imageDivRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();

  const clearSelectedHotSpot = () => {
    setSelectedHotSpot(null);
  }

  // called when component first loads
  useEffect(() => {
    localStorageService.setCurrentNovel(params.novelId);
    const novelId = localStorageService.getCurrentNovel();
    console.log("maps.jsx.useEffect", { params_novelId: params.novelId, novelId });

    MapsService.getMapsByNovelId(novelId)
      .then(response => {
        setMaps(response);
        initMap(response, params.mapName);
      });

    // store the image width, it shifts as the browser is resized.
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  // change to the new map, mark it found, update the breadcrumbs
  const initMap = (maps, mapName) => {
    if (!mapName) {
      const novelId = localStorageService.getCurrentNovel();
      mapName = NovelService.getTopMap(novelId);
    }

    const foundMap = maps.find(m => m.name === mapName);
    if (foundMap) {
      setMap(foundMap);
      if (foundMap._id) localStorageService.foundMap(map._id);

      const newBreadCrumbs = locateBreadcrumbs(maps, foundMap);
      setBreadcrumbs(newBreadCrumbs);
      clearSelectedHotSpot();
    }
  };

  const locateBreadcrumbs = (maps, map) => {
    let searchMapName = map.name;
    const breadCrumbs = [];

    let parent;
    do {
      parent = maps.find(findHotSpotWithZoomName(searchMapName));
      if (parent) {
        breadCrumbs.push(parent.name);
        searchMapName = parent.name;
      }
      if (breadCrumbs.length > 10) break;
    } while (parent);

    breadCrumbs.reverse(); // visually best with top of tree first
    return breadCrumbs;
  };

  const findHotSpotWithZoomName = searchMapName => {
    return function findHotSpot(map) {
      const hotSpot = map.hotSpots.find(h => h.zoomName === searchMapName);
      return hotSpot ? map.name : false;
    };
  };

  const navigateToMap = mapName => {
    initMap(maps, mapName);
    navigate(`/${localStorageService.getCurrentNovel()}/maps/${mapName}`);
  }

  const handleZoomClick = useCallback((hotSpot) => {
    navigateToMap(hotSpot.zoomName);
  }, [maps]);

  const handleHotSpotClick = useCallback((closestHotspot) => {
    // if clicked on same one, clear it
    if (closestHotspot === selectedHotSpot)
      clearSelectedHotSpot();
    else setSelectedHotSpot(closestHotspot);

    // clear tutorial tool tips
    if (closestHotspot) {
      if (closestHotspot.zoomId) localStorageService.countZoomInClick();
      else localStorageService.countDetailClick();
    }
  }, [selectedHotSpot]);

  const handleEdit = useCallback(() => {
    navigate(`/${localStorageService.getCurrentNovel()}/mapform/${map._id}`);
  }, [navigate, map]);

  const handleBreadCrumbClick = breadCrumb => {
    localStorageService.countZoomOutClick();
    navigateToMap(breadCrumb);
  };

  // When absolute positioning is used, divs lose their dimensions.
  // Compute the maximum width of the screen and force the div that holds the
  // image to a minimum width and height so the image will occupy space properly.
  // This dimension is also needed to properly place the hotspots on the image.
  const updateDimensions = () => {
    if (imageDivRef.current) {
      const rect = imageDivRef.current.getBoundingClientRect();

      const newImageDim = rect.width > Config.mapWidth * 2 ? Config.mapWidth * 2 : rect.width;
      setImageDim(newImageDim);
    }
  };

  /*
    // the annotator feature allows toggling on and off the zoom/details buttons,
    // currently disabled as it was confusing users
    handleAnnotatorClick = () => {
      setIsAnnotationOn(!isAnnotationOn);
    };
  */

  const name = map.name
    ? map.name
    : "Loading maps, please wait.";

  const user = AuthService.getCurrentUser();

  return (
    <div className="justify-content-center richBlue fullWorld">
      <div className="row">
        <div className="col">
          <h2 className="text-center">{name}</h2>
          <Explorations
            mapCount={maps ? maps.length : 0}
          />
        </div>
      </div>
      <div className="row">
        <div className="col centeredSingleColumn" ref={imageDivRef}>
          <div
            style={{
              width: `${imageDim}px`,
              height: `${imageDim}px`
            }}
          >
            <TransitionGroup className="relativeBasis">
              <CSSTransition
                key={map._id}
                timeout={1000}
                classNames="fade"
              >
                <AnnotatedMap
                  map={map}
                  selectedHotSpot={selectedHotSpot}
                  onZoomClick={handleZoomClick}
                  onHotSpotClick={handleHotSpotClick}
                  isAnnotationOn={isAnnotationOn}
                  imageDim={imageDim}
                />
              </CSSTransition>
            </TransitionGroup>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col text-center">{map.description}</div>
      </div>
      <div className="row">
        <div className="col centeredSingleColumn">
          <div className="relativeBasis">
            {breadCrumbs.map(b => (
              <button
                key={b}
                className="btn btn-primary btn-sm zoomButton buttonSpacing lowerSpacing"
                onClick={() => handleBreadCrumbClick(b)}
              >
                <img src={imageBackArrow} alt="backArrow" />
                <span className="tinySpacing">{b}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col centeredSingleColumn">
          {user && (
            <button
              className="btn btn-primary btn-sm lowerSpacing"
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
          {/* <Annotator
              className={user ? "buttonSpacing lowerSpacing" : ""}
              onClick={handleAnnotatorClick}
              isAnnotationOn={isAnnotationOn}
            /> */}
        </div>
      </div>
    </div>
  );
}

export default Maps;
