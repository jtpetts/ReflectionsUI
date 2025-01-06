import React from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";
import localStorageService from "../services/localStorageService";

function ImagesTable(props) {
  const columns = [
    {
      label: "Name",
      key: "name",
      content: image => (
        <Link
          to={
            image.isImageOnly
              ? `/${localStorageService.getCurrentNovel()}/mapForm/New?imageFilename=${image.imageFilename}`
              : `/${localStorageService.getCurrentNovel()}/mapForm/${image._id}`
          }
        >
          {image.isImageOnly ? "Create Map Entry" : image.name}
        </Link>
      )
    },
    { label: "Image Filename", path: "imageFilename" },
    { label: "Hot Spot Count", path: "hotSpotCount" },
    {
      key: "Delete",
      content: image =>
        image.name ? ( // if no name, then there is no map to delete
          <button
            className="btn btn-danger"
            onClick={() => props.onDelete(image)}
          >
            Delete
          </button>
        ) : ("")
    }
  ];

  return (
    <Table
      data={props.images}
      columns={columns}
      sortColumn={props.sortColumn}
      onSort={props.onSort}
    />
  );
}

export default ImagesTable;
