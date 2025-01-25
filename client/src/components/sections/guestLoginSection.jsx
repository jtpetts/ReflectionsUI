import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/authService";
import localStorageService from "../../services/localStorageService";

function GuestLoginSection() {
  const navigate = useNavigate();

  const handleGuestLogin = async () => {
    await AuthService.login("guest@guest.com", "guest");
    navigate(`/${localStorageService.getCurrentNovel()}/maps`);
  };

  return (
    <section className="aboutSection" style={{ backgroundColor: "ivory" }}>
      <center>
        <p>
          The site features a full editor for the map descriptions and hot
          spots. The guest login provides read only access to the editor.
        </p>
        <button onClick={handleGuestLogin} className="btn btn-primary">
          Login as Guest
        </button>
      </center>
    </section>
  );
}

export default GuestLoginSection;
