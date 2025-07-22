import React from "react";
import { hasRole } from "../services/tokenUtils"; 
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const isAdmin = hasRole("ADMIN");
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="bg-white p-5 rounded shadow text-center" style={{ minWidth: "400px" }}>
        <h1 className="mb-4 text-primary">Bienvenue sur le tableau de bord</h1>

        {isAdmin ? (
          <div className="d-flex flex-column gap-3">
            <button className="btn btn-outline-primary" onClick={() => navigate("/add-role")}>
              Ajouter un rôle à un utilisateur
            </button>
            <button className="btn btn-outline-success" onClick={() => navigate("/users")}>
              Afficher les utilisateurs
            </button>
            <button className="btn btn-outline-warning" onClick={() => navigate("/add-role-name")}>
              Ajouter un rôle (ADMIN only)
            </button>
          </div>
        ) : (
          <div className="alert alert-warning mt-4">
            Vous êtes connecté, mais vous n'avez pas les droits d'administration.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
