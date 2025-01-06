import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/navBar";
import Home from "./components/home";
import Maps from "./components/maps";
import Images from "./components/images";
import About from "./components/about";
import Logout from "./components/logout";
import MapForm from "./components/mapForm";
import HotSpotsEditor from "./components/hotSpotsEditor";
import HotSpotForm from "./components/hotSpotForm";
import NotFound from "./components/notFound";
import "./App.css";

function App(props) {

  console.log('app.jsx.itself', {props});

  return (
    <React.Fragment>
      <ToastContainer />
      <NavBar />
      <main className="fullHeight container" style={{ maxWidth: "none" }}>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/:novelId/*" element={<Home />} />

          <Route path="/maps/:mapName" element={<Maps />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/images" element={<Images />} />
          <Route path="/about" element={<About />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="/:novelId/maps/:mapName" element={<Maps />} />
          <Route path="/:novelId/maps" element={<Maps />} />
          <Route path="/:novelId/images" element={<Images />} />
          <Route path="/:novelId/about" element={<About />} />
          <Route path="/:novelId/mapform/:id" element={<MapForm />} />
          <Route path="/:novelId/hotspotseditor/:id" element={<HotSpotsEditor />} />
          <Route
            path="/:novelId/hotspotform/:mapId/hotSpot/:hotSpotId"
            element={<HotSpotForm />}
          />
          <Route path="/:novelId/logout" element={<Logout />} />
          <Route path="/notfound" element={<NotFound/>} />
        </Routes>
      </main>
    </React.Fragment>
  );
}

export default App;
