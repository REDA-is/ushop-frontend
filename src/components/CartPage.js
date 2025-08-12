// components/CartPage.js
import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [total, setTotal] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const res = await api.get("/api/cart/user"); // { items: [], totalPrice }
      setItems(res.data.items || []);
      setTotal(res.data.totalPrice || 0);
      setErrorMsg("");
      setSelectedIds(new Set());
    } catch (err) {
      console.error("Cart load error:", err);
      if (err?.response?.status === 401) setErrorMsg("Veuillez vous connecter pour voir votre panier.");
      else setErrorMsg("Impossible de charger le panier.");
      setItems([]);
      setTotal(0);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(items.map(i => i.id)));
  const clearSelection = () => setSelectedIds(new Set());

  const removeItem = async (id) => {
    try {
      await api.delete(`/api/cart/${id}`);
      await loadCart();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/api/cart/clear");
      await loadCart();
    } catch (err) {
      console.error("Clear error:", err);
    }
  };

  // Checkout ALL items
  const checkoutAll = async () => {
    try {
      const res = await api.post("/api/orders/checkout"); // creates order from entire cart
      navigate("/order", { state: { order: res.data } });
    } catch (err) {
      console.error("Erreur commande (tout):", err);
      alert("Impossible de passer la commande.");
    }
  };

  // Checkout SELECTED items only
  const checkoutSelected = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return alert("Sélectionnez au moins un article.");
    try {
      const res = await api.post("/api/orders", { cartIds: ids });
      navigate("/order", { state: { order: res.data } });
    } catch (err) {
      console.error("Erreur commande (sélection):", err);
      alert("Impossible de passer la commande pour la sélection.");
    }
  };

  return (
    <div className="container mt-5">
      
      <h2 className="fw-bold mb-4" style={{ color: "#1b5b9cff", fontSize: "2rem" }}>🛒 Mon Panier</h2>
       <div className="mt-4 text-end">
       <button  className="btn first btn-outline-secondary" onClick={() => navigate("/products")}>Back</button>
       </div>
      {errorMsg && <div className="alert alert-warning">{errorMsg}</div>}
    
      {items.length === 0 && !errorMsg && (
        <p className="text-muted">Votre panier est vide.</p>
      )}

      {items.length > 0 && (
        <>
          <div className="mb-3 d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={selectAll}>Tout sélectionner</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={clearSelection}>Effacer sélection</button>
          </div>

          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th style={{width: 40}}></th>
                <th>Image</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(it.id)}
                      onChange={() => toggleSelect(it.id)}
                    />
                  </td>
                  <td style={{ width: 120 }}>
                    <img
                      src={it.product?.imageUrl}
                      alt={it.product?.productName}
                      style={{ width: 100, height: 100, objectFit: "contain", background: "#f8f9fa" }}
                    />
                  </td>
                  <td>{it.product?.productName}</td>
                  <td>{it.selectedQuantity} g</td>
                  <td>{(it.totalPrice ?? 0).toFixed(2)} MAD</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => removeItem(it.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
            <h4 className="m-0">Total : {total.toFixed(2)} MAD</h4>
            <div className="d-flex gap-2">
              <button className="btn btn-warning" onClick={clearCart}>Vider le panier</button>
              <button className="btn btn-outline-primary" onClick={checkoutSelected}>Commander sélection</button>
              <button className="btn btn-success" onClick={checkoutAll}>Commander tout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
