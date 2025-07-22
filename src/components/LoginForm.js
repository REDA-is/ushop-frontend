// LoginForm.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        new URLSearchParams({
          username: username,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token, refresh_token } = response.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      alert("Connexion réussie !");
      navigate("/dashboard"); // Redirection après login
    } catch (error) {
      console.error("Erreur de connexion :", error);
      alert("Nom d'utilisateur ou mot de passe incorrect");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <form onSubmit={handleLogin} className="border p-4 rounded shadow-sm w-50">
        <h1 className="mb-4 text-center text-primary">USHOP</h1>
        <h3 className="mb-4 text-center">Connexion</h3>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Se connecter</button>
      </form>
    </div>
  );
}

export default LoginForm;
