import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import localStorageService from "../services/localStorageService";
import NovelService from "../services/novelService";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  }

  const collapse = () => {
    setIsCollapsed(true);
  }


  // whenever location changes
  useEffect(() => {
    console.log('navbar.jsx.location:', location);
  }, [location]);



  const affixNovel = (e, path) => {
    // navigate
    const novelId = localStorageService.getCurrentNovel();
    const destination = `/${novelId}/${path}`;
    console.log("navBar.jsx.affixNovel", { novelId, destination, path, theeese_e: e, theees: this });

    navigate(destination);
    e.preventDefault();

    // ensure the menu "button" is collapsed
    collapse();
  };

  const classNavbar = isCollapsed
    ? "collapse navbar-collapse"
    : "collapse navbar-collapse show";
  const classToggleButton = isCollapsed
    ? "navbar-toggler navbar-toggler-right collapsed"
    : "navbar-toggler navbar-toggler-right";

  const user = AuthService.getCurrentUser();

  const pathname = location.pathname;
  localStorageService.setCurrentNovelFromHref(pathname);

  const novelId = localStorageService.getCurrentNovel();
  const navBarName = NovelService.getNavBarName(novelId);

  console.log("NavBar.jsx.itself", { user, novelId, pathname, location: location });

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to={`/${novelId}/`}>
        {navBarName}
      </Link>
      <button
        className={classToggleButton}
        onClick={toggleCollapsed}
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className={classNavbar} id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink
            className="nav-item nav-link"
            to={`/${novelId}/`}
            onClick={(e) => affixNovel(e, "")}
          >
            Home
          </NavLink>
          <NavLink
            className="nav-item nav-link"
            to={`/${novelId}/maps`}
            onClick={(e) => affixNovel(e, "maps")}
          >
            Maps
          </NavLink>
          {user && (
            <NavLink
              className="nav-item nav-link"
              to={`/${novelId}/images`}
              onClick={(e) => affixNovel(e, "images")}
            >
              Images
            </NavLink>
          )}
          <NavLink
            className="nav-item nav-link"
            to={`/${novelId}/about`}
            onClick={(e) => affixNovel(e, "about")}
          >
            About
          </NavLink>
          {user && (
            <React.Fragment>
              <NavLink
                className="nav-item nav-link"
                to={`/${novelId}/logout`}
                onClick={(e) => affixNovel(e, "logout")}
              >
                Logout
              </NavLink>

              <label className="nav-item nav-link">{user.name}</label>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
