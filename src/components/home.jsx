import React, { Component } from "react";
import SummarySection from "./sections/summarySection";
import MeadowSection from "./sections/meadowSection";
import localStorageService from "../services/localStorageService";
import novelService from "../services/novelService";

class Home extends Component {
  render() {
    const novelId = localStorageService.getCurrentNovel();
    const showMeadow = novelService.getHomeSecondImage(novelId) != null;

    return (
      <React.Fragment>
        <SummarySection />
        {showMeadow && <MeadowSection />}
      </React.Fragment>
    );
  }
}

export default Home;
