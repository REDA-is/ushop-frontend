import React, { useState } from "react";
import API from "../api/axiosInstance";


function AddRoleForm() {
  const [username, setUsername] = useState("");
  const [roleName, setRoleName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken"); 

      await API.post(
        "http://localhost:8080/addRoleToUser",
        { username, roleName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Rôle ajouté avec succès !");
      setUsername("");
      setRoleName("");
    } catch (error) {
      alert("Erreur lors de l'ajout du rôle");
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="border p-5 shadow rounded" style={{ width: "400px" }}>
        <h2 className="text-center text-primary mb-4">USHOP</h2>
        <h4 className="text-center mb-4">Ajouter un rôle à un utilisateur</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nom d'utilisateur</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Nom du rôle</label>
            <label className="form-label">Nom du rôle</label>
            <input
              type="text"
              className="form-control"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Ex: ADMIN"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Ajouter le rôle
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRoleForm;