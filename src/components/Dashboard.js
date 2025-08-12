import React from "react";
import { hasRole } from "../services/tokenUtils";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

const Dashboard = () => {
  const isAdmin = hasRole("ADMIN");
  const navigate = useNavigate();

  return (
    <div
      className="vh-100"
      style={{
        backgroundImage: "url('/dashboard.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Overlay sombre */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />

      {isAdmin ? (
  <>
    {/* ADMIN VIEW — two stacked dropdowns, top-right */}
    <div
      className="position-absolute top-0 first-0 p-4 d-flex flex-column align-items-end gap-2"
      style={{ zIndex: 3 }}
    >
      {/* User & Roles Management */}
      <Dropdown align="end">
        <Dropdown.Toggle
          variant="outline-info"
          className="px-4 py-2"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: 2,
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          ⚙️ Admin • User Management
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="dropdown-menu-dark shadow"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            minWidth: 320,
          }}
        >
          <Dropdown.Item className="py-2" onClick={() => navigate("/add-role")}>
            ➕ Add Role to User
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item className="py-2" onClick={() => navigate("/users")}>
            👥 View Users
          </Dropdown.Item>
          <Dropdown.Item className="py-2" onClick={() => navigate("/add-role-name")}>
            🏷️ Create New Role
          </Dropdown.Item>
          <Dropdown.Item className="py-2 text-danger" onClick={() => navigate("/delete-user")}>
            🗑️ Delete User
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Products Management */}
      <Dropdown align="end">
        <Dropdown.Toggle
          variant="outline-success"
          className="px-4 py-2"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: 2,
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          🛒 Product Management
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="dropdown-menu-dark shadow"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            minWidth: 320,
          }}
        >
          <Dropdown.Item className="py-2" onClick={() => navigate("/add-product")}>
            ➕ Add Product
          </Dropdown.Item>
          <Dropdown.Item className="py-2" onClick={() => navigate("/admin/products")}>
            ✏️ Update Product
          </Dropdown.Item>
          <Dropdown.Item className="py-2 text-danger" onClick={() => navigate("/delete-product")}>
            🗑️ Delete Product
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>

    {/* CENTERED MESSAGE */}
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        padding: "1.5rem 3rem",
        borderRadius: "12px",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 2,
      }}
    >
      <h1
        className="text-white fw-bold m-0 text-center"
        style={{
          fontSize: "3rem",
          textShadow: "1px 1px 5px rgba(0,0,0,0.7)",
        }}
      >
        WELCOME ADMIN
      </h1>
    </div>
  </>
  
      ) : (
        // USER VIEW (non-admin)
        <>
  {/* USER NAVBAR */}
  <nav
    className="navbar navbar-expand-lg rounded shadow"
    style={{
      zIndex: 2,
      position: "relative",
      padding: "1rem 2rem",
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
    }}
  >
    <div className="container-fluid d-flex justify-content-between align-items-center w-100">
      <div className="d-flex gap-4">
        
        <button className="btn btn-outline-light" onClick={() => navigate("/products")}>
          🛒 Product
        </button>
        <button className="btn btn-outline-light" onClick={() => navigate("/coaching")}>
          🧠 Coaching/Membership
        </button>
        <button className="btn btn-outline-light" onClick={() => navigate("/my-orders")}>
  📦        My Orders
        </button>
        <button className="btn btn-outline-light" onClick={() => navigate("/help")}>
          ❓ Help
        </button>
      </div>
      <button className="btn btn-outline-info" onClick={() => navigate("/profile")}>
        👤 Profil
      </button>
    </div>
  </nav>

  {/* CENTERED MESSAGE */}
  <div
    className="d-flex justify-content-center align-items-center"
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      padding: "1.5rem 3rem",
      borderRadius: "12px",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      zIndex: 2,
    }}
  >
    <h1
      className="text-white fw-bold m-0 text-center"
      style={{
        fontSize: "3rem",
        textShadow: "1px 1px 5px rgba(0,0,0,0.7)",
      }}
    >
      BE STRONG AND NATY
    </h1>
  </div>
</>

        
        
      )}
    </div>
    
  );
};

export default Dashboard;
