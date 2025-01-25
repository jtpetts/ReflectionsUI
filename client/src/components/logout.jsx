import React from "react";
import AuthService from "../services/authService";
import localStorageService from "../services/localStorageService";
import { useNavigate, useParams } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const params = useParams();

  const handleLogout = async () => {
    AuthService.logout();
    navigate("/");
  };

  localStorageService.setCurrentNovel(params.novelId);

  return (
    <div>
      <p>Thank you for your visit!</p>
      <button className="btn btn-primary" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Logout;
