import React from "react";
import localStorageService from "../services/localStorageService";
import imageExplorerBadge1 from "../images/explorer badge 1.png";
import imageExplorerBadge2 from "../images/explorer badge 2.png";
import imageExplorerBadge3 from "../images/explorer badge 3.png";

function Explorations(props) {
  var mapFoundMessage = "";
  const foundCount = localStorageService.countFoundMaps();

  if (foundCount === 1)
    mapFoundMessage = `Explore to find all ${props.mapCount} maps.`;
  else if (foundCount === props.mapCount)
    mapFoundMessage = `Found all ${props.mapCount} maps!`;
  else
    mapFoundMessage = `Found ${foundCount} maps out of ${props.mapCount}`;

  var image;
  if (foundCount < props.mapCount / 2) image = imageExplorerBadge1;
  else if (foundCount < props.mapCount) image = imageExplorerBadge2;
  else image = imageExplorerBadge3;

  return (
    <React.Fragment>
      <div className="text-center lowerSpacing">
        <img src={image} alt="badge" />
        <span className="buttonSpacing">{mapFoundMessage}</span>
      </div>
    </React.Fragment>
  );
}

export default Explorations;
