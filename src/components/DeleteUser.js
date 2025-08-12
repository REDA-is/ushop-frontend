import React, { useState } from "react";
import api from "../services/api"; 

const DeleteUser = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    try {
      await api.delete(`/user/${username}`);
      setMessage(`Utilisateur "${username}" supprimé avec succès.`);
      setUsername("");
    } catch (error) {
      setMessage("Erreur lors de la suppression.");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-danger text-center">Supprimer un utilisateur</h2>
          <input
            type="text"
            className="form-control my-3"
            placeholder="Entrer le nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="btn btn-danger w-100" onClick={handleDelete}>
            Supprimer
          </button>
          {message && <p className="text-center mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
