import React, { useState } from "react";
import API from "../api/axiosInstance"; // Utilise l'instance avec interceptor
import { useNavigate } from "react-router-dom";

function AddRole() {
  const [roleName, setRoleName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/roles", { roleName });
      alert("Rôle ajouté avec succès !");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de l'ajout du rôle :", error);
      alert("Échec de l'ajout du rôle.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="border p-5 shadow rounded" style={{ width: "400px" }}>
        <h3 className="text-center text-warning mb-4">Ajouter un rôle</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="roleName" className="form-label">Nom du rôle :</label>
            <input
              type="text"
              id="roleName"
              className="form-control"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning w-100">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRole;
