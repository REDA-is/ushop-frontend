import { jwtDecode } from "jwt-decode";

export const hasRole = (roleToCheck) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.roles || [];

    return roles.includes(roleToCheck);
  } catch (error) {
    console.error("Erreur de décodage du token :", error);
    return false;
  }
};
