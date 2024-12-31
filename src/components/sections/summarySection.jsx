import React, { Component } from "react";
import parse from "html-react-parser";
import localStorageService from "../../services/localStorageService";
import novelService from "../../services/novelService";

class SummarySection extends Component {
  render() {
    const novelId = localStorageService.getCurrentNovel();
    const blurbArray = novelService.getBlurb(novelId);
    const blurbHtml = '<p>' + blurbArray.join('</p></p>') + '</p>';

    const title = novelService.getTitle(novelId);
    const backgroundImage = novelService.getHomeBackgroundImage(novelId);

    return (
      <section
        className="fullSection"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="fullSection centeredSectionText">
          <center>
            <h2>{title}</h2>
            <font style={{ fontSize: "100%" }}>
              {parse(blurbHtml)}
            </font>
          </center>
        </div>
      </section>
    );
  }
}

export default SummarySection;
