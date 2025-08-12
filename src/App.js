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
import DeleteUser from "./components/DeleteUser";
import ProductList from "./components/ProductList";
import CartPage from "./components/CartPage"; 
import { ToastContainer } from "react-toastify";
import OrderPage from "./components/OrderPage";
import AddProduct from "./components/AddProduct";
import AdminProductList from "./components/AdminProductList";
import UpdateProduct from "./components/UpdateProduct";
import ProductDetails from "./components/ProductDetails";
import MyOrders from "./components/MyOrders";
import Questions from "./components/Questions";
import Recommendations from "./components/Recommendations";


function App() {
  return (
    <>  
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/add-role" element={<AddRoleForm />} />
        <Route path="/add-role-name" element={<AddRoleName />} />
        <Route path="/delete-user" element={<DeleteUser />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
         <Route path="/order" element={<OrderPage />} />
         <Route path="/add-product" element={<AddProduct />} />
         <Route path="/admin/products" element={<AdminProductList />} />
         <Route path="/update-product/:id" element={<UpdateProduct />} />
         <Route path="/products/:id" element={<ProductDetails />} />
         <Route path="/my-orders" element={<MyOrders />} />
         <Route path="/questions" element={<Questions />} />
        <Route path="/recommendations" element={<Recommendations />} />


    
        
      
        
       
      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
