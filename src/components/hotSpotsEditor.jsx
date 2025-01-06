import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-toastify";
import MapsService from "../services/mapsService";
import HotSpotsService from "../services/hotSpotsService";
import localStorageService from "../services/localStorageService";
import Images from "../services/imageService";
import HotSpotsTable from "./hotSpotsTable";
import Paginator from "./common/paginator";
import Pointer from "./common/pointer";
import AreYouSureModal from "./common/areYouSureModal";
import Config from "../config";

//https://moduscreate.com/blog/animated_drag_and_drop_with_react_native/

function HotSpotsEditor() {
  const PAGE_SIZE = 5;

  const [activePage, setActivePage] = useState(0);  // sometimes hotspots go to multiple pages
  const [sortColumn, setSortColumn] = useState({ path: "Name", order: "asc" }); // a constant
  const [maps, setMaps] = useState([]);
  const [map, setMap] = useState({ name: "", hotSpots: [] });
  const [hotSpotPointer, setHotSpotPointer] = useState(null);
  const [coordsTrackingOn, setCoordsTrackingOn] = useState(false);
  const [coordsTrackingHotSpot, setCoordsTrackingHotSpot] = useState(null);
  const [zoomUpId, setZoomUpId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const [hotSpotToDelete, setHotSpotToDelete] = useState(null);
  const imageImgRef = useRef(null);
  const navigate = useNavigate();
  const params = useParams();

  const initToCurrentMap = (maps, id) => {
    try {
      const map = maps.find(m => m._id === id);
      if (!map) {
        navigate("/notfound");
        return;
      }

      // find the current map
      map.hotSpots.map(h => (h.mapId = id));
      setMap(map);

      // find the parent's map
      const zoomUpMap = maps.find(m =>
        m.hotSpots.find(h => h.zoomName === map.name)
      );
      setZoomUpId(zoomUpMap ? zoomUpMap._id : "");

      // if it's a new map, go to the first hotspot page (probably only one anyway)
      setActivePage(0);
    } catch (ex) {
      navigate("/notfound", { replace: true });
    }
  };

  // initialize component
  useEffect(() => {
    localStorageService.setCurrentNovel(params.novelId);
    const novelId = localStorageService.getCurrentNovel();

    // download all of the maps the first time in
    MapsService.getMapsByNovelId(novelId)
      .then(response => {
        setMaps(response);
        initToCurrentMap(response, params.id);
      })
  }, [])

  const handleImageClick = async event => {
    if (coordsTrackingOn && coordsTrackingHotSpot) {
      try {
        const myLeft = event.clientX - imageImgRef.current.x;
        const myTop = event.clientY - imageImgRef.current.y;

        // rebuild the hotSpot (dropping __v, which confuses the API, maybe should move to map/hs service)
        const hotSpot = {
          _id: coordsTrackingHotSpot._id,
          name: coordsTrackingHotSpot.name,
          description: coordsTrackingHotSpot.description,
          zoomName: coordsTrackingHotSpot.zoomName,
          zoomId: coordsTrackingHotSpot.zoomId,
          x: myLeft,
          y: myTop
        };

        await HotSpotsService.save(map._id, hotSpot);

        const new_map = copyMapWithoutHotSpot(hotSpot);

        new_map.hotSpots.push(hotSpot);
        const maps = replaceMapInMaps(new_map);

        setMap(new_map);
        setMaps(maps);
        setCoordsTrackingOn(false);
        setCoordsTrackingHotSpot(null);
        setHotSpotPointer(hotSpot);
      } catch (ex) {
        toastException(ex);

        setCoordsTrackingOn(false);
        setCoordsTrackingHotSpot(null);
        setHotSpotPointer(null);
      }
    }
  };

  const copyMapWithoutHotSpot = hotSpot => {
    const copiedMap = {
      ...map
    };

    copiedMap.hotSpots = map.hotSpots.filter(h => h._id !== hotSpot._id);
    return copiedMap;
  };

  const replaceMapInMaps = replacementMap => {
    const newMaps = maps.filter(m => m._id !== map._id);
    newMaps.push(replacementMap);
    return newMaps;
  };

  const handleSetCoordsBtnMouseLeave = hotSpot => {
    if (!coordsTrackingOn)
      setHotSpotPointer(null);
  };

  const handleSetCoordsBtnMouseOver = hotSpot => {
    if (!coordsTrackingOn)
      setHotSpotPointer(hotSpot);
  };

  const handleSetCoordinates = hotSpot => {
    setCoordsTrackingOn(true);
    setCoordsTrackingHotSpot(hotSpot);
  };

  const handleZoomDownClick = hotSpot => {
    navigate(`/${localStorageService.getCurrentNovel()}/hotspotseditor/${hotSpot.zoomId}`);
    initToCurrentMap(maps, hotSpot.zoomId);
  };

  const handleNewHotSpot = () => {
    navigate(`/${localStorageService.getCurrentNovel()}/hotSpotForm/${map._id}/hotSpot/New`);
  };

  const handleZoomUp = async () => {
    navigate(`/${localStorageService.getCurrentNovel()}/hotspotseditor/${zoomUpId}`);
    initToCurrentMap(maps, zoomUpId);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteWarning = async hotSpot => {
    setShowDeleteModal(true);
    setDeleteModalMessage(`Are you sure you wish to delete ${hotSpot.name} on map ${map.name}?`);
    setHotSpotToDelete(hotSpot);
  };

  const toastException = ex => {
    if (ex.response)
      if (ex.response.status >= 400 && ex.response.status < 500)
        toast.error("Access denied!");
  };

  const handleDelete = async () => {
    // actually delete
    const originalMap = map;
    const originalMaps = maps;
    const copiedMap = copyMapWithoutHotSpot(hotSpotToDelete);

    // replace the map in the maps list
    setShowDeleteModal(false);
    setMap(copiedMap);
    setMaps(replaceMapInMaps(copiedMap));

    try {
      await HotSpotsService.deleteHotSpot(
        map._id,
        hotSpotToDelete._id
      );
    } catch (ex) {
      // restore
      setMap(originalMap);
      setMaps(originalMaps);
      toastException(ex);
    }
  };

  const handlePageChange = newActivePage => {
    setActivePage(newActivePage);
  };

  const handleSort = newSortColumn => {
    setSortColumn(newSortColumn);
  };

  const getPagedData = () => {
    const sortedHotSpots = _.sortBy(map.hotSpots, "name", "asc");

    // filters, pages, and sorts the hot spots
    const start = activePage * PAGE_SIZE;

    const pagedHotSpots = _.slice(
      sortedHotSpots,
      start,
      start + PAGE_SIZE
    );

    if (map)
      return {
        itemCount: map.hotSpots.length,
        hotSpots: pagedHotSpots
      };
    else return { itemCount: 0, hotSpots: [] };
  };

  const name = map ? map.name : "no map!";
  const imageFilename = map ? map.imageFilename : "";
  const image = Images.get(imageFilename);

  const { itemCount, hotSpots } = getPagedData();

  const showHotSpot = hotSpotPointer !== null;

  return (
    <React.Fragment>
      <div>
        <div className="row">
          <div className="col">
            <h2 className="text-center">
              Hot Spots for {map.name}
            </h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="row">
            <div className="col centeredSingleColumn">
              <div
                className="relativeBasis"
                style={{ width: Config.mapWidth, height: Config.mapWidth }}
              >
                <img
                  ref={imageImgRef}
                  src={image}
                  alt={name}
                  width={Config.mapWidth}
                  // onMouseMove={onMouseMove}
                  onClick={handleImageClick}
                />
                {showHotSpot && (
                  <Pointer
                    hotspot={hotSpotPointer}
                    type={hotSpotPointer.zoomId ? "zoom" : "info"}
                    size="pointer"
                  />
                )}
              </div>
            </div>
            <div className="col">
              <HotSpotsTable
                hotSpots={hotSpots}
                mapId={map ? map._id : null}
                onDelete={handleDeleteWarning}
                onSort={handleSort}
                sortColumn={sortColumn}
                onSetCoordinatesMouseOver={handleSetCoordsBtnMouseOver}
                onSetCoordinatesMouseLeave={handleSetCoordsBtnMouseLeave}
                onSetCoordinatesClick={handleSetCoordinates}
                coordsTrackingHotSpot={coordsTrackingHotSpot}
                onZoomDownClick={handleZoomDownClick}
              />
              <Paginator
                itemCount={itemCount}
                pageSize={PAGE_SIZE}
                activePage={activePage}
                onPageChange={handlePageChange}
              />
              <div className="row">
                <div className="col">
                  <button
                    className="btn btn-primary"
                    onClick={handleNewHotSpot}
                  >
                    New Hot Spot
                  </button>
                  {zoomUpId && (
                    <button
                      className="btn btn-primary buttonSpacing"
                      onClick={handleZoomUp}
                    >
                      Zoom Up
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <AreYouSureModal
          open={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onTrigger={handleDelete}
          triggerLabel="Delete"
          modalMessage={deleteModalMessage}
        />
      </div>
    </React.Fragment>
  );
}

export default HotSpotsEditor;
