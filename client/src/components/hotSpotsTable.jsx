import React from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";
import localStorageService from "../services/localStorageService";

function HotSpotsTable(props) {
  const columns = [
    {
      label: "Name",
      content: hotSpot =>
        props.mapId ? (
          <Link
            to={`/${localStorageService.getCurrentNovel()}/hotSpotForm/${props.mapId}/hotSpot/${hotSpot._id}`}
          >
            {hotSpot.name}
          </Link>
        ) : (
          ""
        )
    },
    {
      label: "Set Coordinates",
      key: "Coordinates",
      content: hotSpot => (
        <button
          onMouseOver={() => props.onSetCoordinatesMouseOver(hotSpot)}
          onMouseLeave={() => props.onSetCoordinatesMouseLeave(hotSpot)}
          onClick={() => props.onSetCoordinatesClick(hotSpot)}
          className={
            props.coordsTrackingHotSpot &&
              hotSpot._id === props.coordsTrackingHotSpot._id
              ? "btn btn-success"
              : "btn btn-primary"
          }
        >
          Set Coordinates
        </button>
      )
    },
    {
      label: "Zoom?",
      key: "Zoom",
      content: hotSpot =>
        hotSpot.zoomName ? (
          <button
            className="btn btn-primary"
            onClick={() => props.onZoomDownClick(hotSpot)}
          >
            Zoom to {hotSpot.zoomName}
          </button>
        ) : (
          ""
        )
    },
    {
      label: "Delete?",
      key: "Delete",
      content: hotSpot => (
        <button
          className="btn btn-danger"
          onClick={() => props.onDelete(hotSpot)}
        >
          Delete
        </button>
      )
    }
  ];

  return (
    <Table
      data={props.hotSpots}
      columns={columns}
      sortColumn={props.sortColumn}
      onSort={props.onSort}
    />
  );
}

export default HotSpotsTable;
