import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Joi from "joi-browser";
import _ from "lodash";
import { toast } from "react-toastify";
import { handleSubmit, renderSubmitButton, renderInput, renderSelect } from "./common/form";
import HotSpotsService from "../services/hotSpotsService";
import MapsService from "../services/mapsService";
import localStorageService from "../services/localStorageService";

function HotSpotForm() {
  const [data, setData] = useState({ name: "", description: "", zoomName: "" });
  const [zoomableMaps, setZoomableMaps] = useState([]);
  const [mapName, setMapName] = useState("");
  const [errors, setErrors] = useState({});
  const [originalHotSpot, setOriginalHotSpot] = useState({});
  const navigate = useNavigate();
  const params = useParams();

  // update a single error, can also clear the value
  const setError = (inputName, errorMessage) => {
    if (errorMessage)
      setErrors({ ...errors, [inputName]: errorMessage });
    else {
      let { [inputName]: _, ...newErrors } = errors; // clear the one error message
      setErrors(newErrors);
    }
  }

  // update a single item of data
  const setDataItem = (inputName, inputValue) => {
    setData({ ...data, [inputName]: inputValue });
  }

  // initialize component
  useEffect(() => {
    // was ID provided? If so, acquire. If it is "new", then create a new one.
    const mapId = params.mapId;
    const hotSpotId = params.hotSpotId;
    if (hotSpotId !== "New") {
      HotSpotsService.get(mapId, hotSpotId)
        .then(hotSpot => {
          if (!hotSpot) {
            navigate("/notfound");
            return;
          }
          setData(hotSpotToViewModel(hotSpot));
          setOriginalHotSpot(hotSpot);
        })
        .catch(() => {
          navigate("/notfound", { replace: true });
        })
    }

    // fill the combo box
    getZoomableMaps()
      .then(response => {
        const { zoomNames, currentMapName } = response;
        setZoomableMaps(zoomNames);
        setMapName(currentMapName);
      });
  }, []);

  const hotSpotToViewModel = hotSpot => {
    return {
      name: hotSpot.name,
      description: hotSpot.description,
      zoomName: hotSpot.zoomName ? hotSpot.zoomName : ""
    };
  }

  const schema = {
    name: Joi.string()
      .required()
      .label("Name"),
    description: Joi.string()
      .required()
      .label("Description"),
    zoomName: Joi.string()
      .allow("")
      .label("Zoom Name")
  };

  const toastException = ex => {
    if (ex.response)
      if (ex.response.status >= 400 && ex.response.status < 500)
        toast.error("Access denied!");
  };

  const doSubmit = () => {
    const hotSpot = { ...originalHotSpot };

    hotSpot.name = data.name;
    hotSpot.description = data.description;
    hotSpot.zoomName = data.zoomName.trim();

    // if the zoomname changed, then wipe out the zoom id because it is pointing to the wrong image
    if (originalHotSpot && originalHotSpot.zoomName !== hotSpot.zoomName)
      hotSpot.zoomId = null;

    const mapId = params.mapId;
    HotSpotsService.save(mapId, hotSpot)
      .then(() => {
        navigate(`/${localStorageService.getCurrentNovel()}/hotspotseditor/${mapId}`);
      })
      .catch(ex => {
        const errorMessage = ex.response.data;
        const isZoomError = errorMessage.search("zoom") >= 0;

        const newErrors = { ...errors };
        newErrors[isZoomError ? "zoomName" : "name"] = "Access denied";
        setErrors(newErrors);

        toastException(ex);
      })
  };

  const getZoomableMaps = async () => {
    const mapsList = await MapsService.getMapsByNovelId(localStorageService.getCurrentNovel());
    let zoomNames = mapsList.map(m => ({ name: m.name, id: m._id }));

    // exclude the current map's name
    const mapId = params.mapId;
    const currentMap = mapsList.find(m => m._id === mapId);
    zoomNames = zoomNames.filter(n => n.name !== currentMap.name);

    // locate the map that zooms to this one and exclude that too
    // it won't eliminate all possible circular loops, but it'll help
    const zoomParent = mapsList.find(m => m.hotSpots.find(h => h.zoomName === currentMap.name));
    if (zoomParent)
      zoomNames = zoomNames.filter(n => n.name !== zoomParent.name);

    const sortedZoomNames = _.orderBy(zoomNames, "name", "asc");
    return { zoomNames: sortedZoomNames, currentMapName: currentMap.name };
    // can go crazier and eliminate all zooms from any hot spot of parent
    // can also go parent of parent
  };

  return (
    <div>
      <h2>Hot Spot for {mapName}</h2>
      <form onSubmit={(e) => handleSubmit(e, doSubmit, schema, data, setErrors)}>
        {renderInput("Name", "name", schema, data, setDataItem, errors, setError)}
        {renderInput("Description", "description", schema, data, setDataItem, errors, setError)}
        {renderSelect("Zoom Name", "zoomName", zoomableMaps, schema, data, setDataItem, errors, setError)}
        {renderSubmitButton("Submit", schema, data)}
        <button
          className="btn btn-primary buttonSpacing"
          onClick={() => navigate(`/${localStorageService.getCurrentNovel()}/hotspotseditor/${params.mapId}`, { replace: true })}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default HotSpotForm;
