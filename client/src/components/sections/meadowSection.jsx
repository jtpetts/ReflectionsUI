import React from "react";
import localStorageService from "../../services/localStorageService";
import novelService from "../../services/novelService";

function MeadowSection() {
  const novelId = localStorageService.getCurrentNovel();
  const backgroundImage = novelService.getHomeSecondImage(novelId);
  const title = novelService.getHomeSecondTitle(novelId);
  const description = novelService.getHomeSecondDescription(novelId);

  return (
    <section
      className="fullSection"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      }}
    >
      <div
        className="fullHeight"
        style={{
          display: "flex",
          paddingLeft: "10%",
          paddingRight: "10%"
        }}
      >
        <div style={{ color: "white" }}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}

export default MeadowSection;
