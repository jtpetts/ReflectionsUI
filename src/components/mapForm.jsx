import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import queryString from "query-string";
import { handleSubmit, renderSubmitButton, renderInput } from "./common/form";
import MapsService from "../services/mapsService";
import localStorageService from "../services/localStorageService";

function MapForm() {
  const [data, setData] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [imageFilename, setImageFilename] = useState("");
  const [originalMap, setOriginalMap] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
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
    localStorageService.setCurrentNovel(params.novelId);

    // was ID provided? If so, acquire. If it is "new", then create a new one.
    const id = params.id;
    if (id === "New") {
      const { imageFilename: parsedImageFilename } = queryString.parse(location.search);
      setImageFilename(parsedImageFilename);
    } else {
      MapsService.getMap(id)
        .then(map => {
          if (!map) {
            navigate("/notfound");
            return;
          }

          setData(mapToViewModel(map));
          setOriginalMap(map);
          setImageFilename(map.imageFilename);
        })
        .catch(ex => {
          toastException(ex);
        });
    }
  }, []);

  const mapToViewModel = (map) => {
    return {
      name: map.name,
      description: map.description
    };
  }

  const toastException = ex => {
    if (ex.response)
      if (ex.response.status >= 400 && ex.response.status < 500)
        toast.error("Access denied!");
  };

  const schema = {
    name: Joi.string()
      .required()
      .label("Name"),
    description: Joi.string()
      .required()
      .label("Description")
  };

  const doSubmit = () => {
    // get the fields and submit to the API, will need auth first.
    const novelId = localStorageService.getCurrentNovel();

    const map = {
      ...originalMap,
      name: data.name,
      novelId: novelId,
      description: data.description,
      imageFilename: imageFilename
    };

    MapsService.save(map)
      .then(updatedMap => {
        if (updatedMap)
          navigate(`/${localStorageService.getCurrentNovel()}/hotspotseditor/${updatedMap._id}`);
      })
      .catch(ex => {
        // const errorMessage = ex.response.data;
        const newErrors = { ...errors };
        newErrors["name"] = "Access denied";
        setErrors({ newErrors });
        toastException(ex);
      });
  }

  const handleEditHotSpots = () => {
    const id = params.id;
    navigate(`/${localStorageService.getCurrentNovel()}/hotspotseditor/${id}`);
  };

  const id = params.id;

  return (
    <div>
      <h2>Map</h2>
      <h4>Image Filename: {imageFilename}</h4>
      <form onSubmit={(e) => handleSubmit(e, doSubmit, schema, data, setErrors)}>
        {renderInput("Name", "name", schema, data, setDataItem, errors, setError)}
        {renderInput("Description", "description", schema, data, setDataItem, errors, setError)}
        {renderSubmitButton("Submit", schema, data)}
        {id && (
          <button
            className="btn btn-primary buttonSpacing"
            onClick={handleEditHotSpots}
          >
            Jump to Hot Spots
          </button>
        )}
      </form>
    </div>
  );
}

export default MapForm;
