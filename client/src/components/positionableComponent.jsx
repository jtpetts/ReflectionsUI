import { Component } from "react";
import Config from "../config";

class PositionableComponent extends Component {
  getStyle = target => {
    const positioningStyle = {
      position: "absolute",
      left: `${target.x / (Config.mapWidth / 100)}%`,
      top: `${target.y / (Config.mapWidth / 100)}%`,
      margin: "0 0 0 0"
    };

    return positioningStyle;
  };
}

export default PositionableComponent;
