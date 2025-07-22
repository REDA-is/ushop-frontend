// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import UserList from "./components/UserList";
import RegisterForm from "./components/RegisterForm.js";
import AddRoleForm from "./components/AddRoleForm";
import AddRoleName from "./components/AddRole";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/add-role" element={<AddRoleForm />} />
        <Route path="/add-role-name" element={<AddRoleName />} />
        
       
      </Routes>
    </Router>
  );
}

export default App;
