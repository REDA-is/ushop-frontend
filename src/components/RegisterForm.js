// src/components/RegisterForm.js
import React, { useState } from "react";
import API from "../api/axiosInstance";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("http://localhost:8080/users", {
        username,
        password,
      });
      alert("Compte créé avec succès !");
      navigate("/login");
    } catch (error) {
      alert("Erreur lors de la création du compte");
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="border p-5 shadow rounded" style={{ width: "400px" }}>
        <h2 className="text-center text-primary mb-4">USHOP</h2>
        <h4 className="text-center mb-4">Créer un compte</h4>
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
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
