import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthService from "../services/authService";
import localStorageService from "../services/localStorageService";
import NovelService from "../services/novelService";

class NavBar extends Component {
  state = { isCollapsed: true };

  handleToggle = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  };

  collapse = () => {
    this.setState({ isCollapsed: true });
  };

  render() {
    const classNavbar = this.state.isCollapsed
      ? "collapse navbar-collapse"
      : "collapse navbar-collapse show";
    const classToggleButton = this.state.isCollapsed
      ? "navbar-toggler navbar-toggler-right collapsed"
      : "navbar-toggler navbar-toggler-right";

    const user = AuthService.getCurrentUser();
    const novelId = localStorageService.getCurrentNovel();
    const navBarName = NovelService.getNavBarName(novelId);

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to={`/${novelId}/`}>
          {navBarName}
        </Link>
        <button
          className={classToggleButton}
          onClick={this.handleToggle}
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
              exact
              to={`/${novelId}/`}
              onClick={this.collapse}
            >
              Home
            </NavLink>
            <NavLink
              className="nav-item nav-link"
              to={`/${novelId}/maps`}
              onClick={this.collapse}
            >
              Maps
            </NavLink>
            {user && (
              <NavLink
                className="nav-item nav-link"
                to={`/${novelId}/images`}
                onClick={this.collapse}
              >
                Images
              </NavLink>
            )}
            <NavLink
              className="nav-item nav-link"
              to={`/${novelId}/about`}
              onClick={this.collapse}
            >
              About
            </NavLink>
            {user && (
              <React.Fragment>
                <NavLink
                  className="nav-item nav-link"
                  to={`/${novelId}/logout`}
                  onClick={this.collapse}
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
}

export default NavBar;
