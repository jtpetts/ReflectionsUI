import React, { Component } from "react";
import Background from "./../../images/Waterfall.png";
import localStorageService from "../../services/localStorageService";
import novelService from "../../services/novelService";

class AboutSection extends Component {
  render() {
    const novelId = localStorageService.getCurrentNovel();
    const title = novelService.getTitle(novelId);
    const by = novelService.getBy(novelId);
    const aboutTheSite = novelService.getAboutTheSite(novelId);

    return (
      <section
        className="aboutSection"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <center style={{ fontSize: "130%" }}>
          <h4>{title}</h4>
          <p>A novel by {by}</p>
          <p>{aboutTheSite}</p>
        </center>
      </section>
    );
  }
}

export default AboutSection;
