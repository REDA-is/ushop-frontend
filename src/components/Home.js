
import React from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div className="text-center bg-white p-5 rounded shadow" style={{ minWidth: "300px" }}>
        <h1 className="text-primary mb-4">USHOP</h1>
        <p className="mb-4">Bienvenue, que souhaitez-vous faire ?</p>
        <div className="d-grid gap-3">
          <button className="btn btn-outline-primary" onClick={() => navigate("/login")}>
            Se connecter
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
