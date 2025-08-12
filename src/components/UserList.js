import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Erreur lors de la récupération :", error));
  }, []);

   return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center text-primary mb-4">Liste des utilisateurs</h2>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Nom d'utilisateur</th>
                <th>Rôles</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.appRoles.map((r) => r.roleName).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
