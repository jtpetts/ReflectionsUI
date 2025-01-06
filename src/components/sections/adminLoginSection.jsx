import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./../loginForm";
import localStorageService from "../../services/localStorageService";

function AdminLoginSection() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    setShowAdminLogin(!showAdminLogin);
  };

  const handleSuccessfulLogin = () => {
    navigate(`/${localStorageService.getCurrentNovel()}/maps`);
  };

  return (
    <section
      className="aboutSection"
      style={{ backgroundColor: "lightblue" }}
    >
      <center>
        <p>Admin login is for authorized individuals only.</p>

        <button onClick={handleAdminLogin} className="btn btn-primary">
          Admin Login
        </button>
      </center>
      <div className="row justify-content-center">
        <div className="col centeredSingleColumn">
          {showAdminLogin && (
            <LoginForm onSuccessfulLogin={handleSuccessfulLogin} />
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminLoginSection;
