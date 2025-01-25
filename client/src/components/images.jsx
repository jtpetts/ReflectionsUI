import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-toastify";
import MapsService from "../services/mapsService";
import ImagesService from "../services/imageService";
import ImagesTable from "./imagesTable";
import Paginator from "./common/paginator";
import AreYouSureModal from "./common/areYouSureModal";
import localStorageService from "../services/localStorageService";

function Images() {
  const PAGE_SIZE = 8;
  const [activePage, setActivePage] = useState(0);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [images, setImages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const [imageToDelete, setImageToDelete] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  // initialize component
  useEffect(() => {
    localStorageService.setCurrentNovel(params.novelId);
    console.log('images.jsx.useEffect', {params_novelId: params.novelId});

    try {
      const novelId = localStorageService.getCurrentNovel();

      MapsService.getMapsByNovelId(novelId)
        .then(mapsList => {
          blendImagesWithMapDb(mapsList, novelId);
        });
    } catch (ex) {
      navigate("/notfound", { replace: true });
    }
  }, []);

  const blendImagesWithMapDb = (mapsList, novelId) => {
    const maps = mapsList.map(m => ({
      name: m.name,
      imageFilename: m.imageFilename,
      _id: m._id,
      hotSpotCount: m.hotSpots ? m.hotSpots.length : 0,
      isImageOnly: false
    }));

    const images = ImagesService.getImagesByNovelId(novelId);
    const blendedMapsImages = maps.concat(
      images
        .filter(i => !maps.find(m => m.imageFilename === i.imageFilename))
        .map(i => ({
          name: "",
          imageFilename: i.imageFilename,
          _id: i.imageFilename,
          hotSpotCount: 0,
          isImageOnly: true
        }))
    );

    setImages(blendedMapsImages);
  };

  const handleEdit = image => {
    if (image._id === image.imageFilename)
      navigate(`/${localStorageService.getCurrentNovel()}/mapForm/New?imageFilename=${image.imageFilename}`);
    else
      navigate(`/${localStorageService.getCurrentNovel()}/mapForm/${image._id}`);
  };

  const handleDeleteWarning = image => {
    setShowDeleteModal(true);
    setDeleteModalMessage(`Are you sure you want to delete the map and hotspot records for ${image.name}`);
    setImageToDelete(image);
  };

  const handleDelete = async () => {
    const image = imageToDelete;

    if (image._id) {
      const originalImages = images;

      try {
        setShowDeleteModal(false);
        await MapsService.deleteMap(image._id);

        // sorting out the blended images with the maps is more trouble than its worth,
        // especially considering how rare delete will be. I've chosen to refresh from
        // database.
        const novelId = localStorageService.getCurrentNovel();
        const mapsList = await MapsService.getMapsByNovelId(novelId);
        blendImagesWithMapDb(mapsList, novelId);
      } catch (ex) {
        if (ex.response)
          if (ex.response.status >= 400 && ex.response.status < 500)
            toast.error("Access denied!");

        setImages(originalImages);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handlePageChange = newActivePage => {
    setActivePage(newActivePage);
  };

  const handleSort = newSortColumn => {
    setSortColumn(newSortColumn);
  };

  const getPagedData = () => {
    // filters, pages, and sorts the hot spots
    if (!images) return { itemCount: 0, pagedImages: [] };

    const sortedImages = _.orderBy(
      images,
      sortColumn.path,
      sortColumn.order
    );

    const start = activePage * PAGE_SIZE;

    const pagedImages = _.slice(
      sortedImages,
      start,
      start + PAGE_SIZE
    );

    return {
      itemCount: images.length,
      pagedImages
    };
  };

  const { itemCount, pagedImages } = getPagedData();

  return (
    <React.Fragment>
      <div className="row">
        <div className="col">
          <h2>Images</h2>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ImagesTable
            images={pagedImages}
            onDelete={handleDeleteWarning}
            onEdit={handleEdit}
            onSort={handleSort}
            sortColumn={sortColumn}
          />
          <Paginator
            itemCount={itemCount}
            pageSize={PAGE_SIZE}
            activePage={activePage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <AreYouSureModal
        open={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onTrigger={handleDelete}
        triggerLabel="Delete"
        modalMessage={deleteModalMessage}
      />
    </React.Fragment>
  );
}

export default Images;
