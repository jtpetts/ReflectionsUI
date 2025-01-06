import React from "react";
import { useParams } from "react-router-dom";
import SummarySection from "./sections/summarySection";
import MeadowSection from "./sections/meadowSection";
import localStorageService from "../services/localStorageService";
import novelService from "../services/novelService";

function Home() {
  const params = useParams();

  localStorageService.setCurrentNovel(params.novelId);
  const novelId = localStorageService.getCurrentNovel();
  const showMeadow = novelService.getHomeSecondImage(novelId) != null;

  return (
    <React.Fragment>
      <SummarySection />
      {showMeadow && <MeadowSection />}
    </React.Fragment>
  );
}

export default Home;
