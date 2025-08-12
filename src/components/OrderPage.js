// components/OrderPage.js
import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const OrderPage = () => {
  const location = useLocation();
  const initialOrder = location.state?.order || null;

  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(initialOrder);

  // Load cart from API if we don't already have an order snapshot
  const loadCart = async () => {
    try {
      const res = await api.get("/api/cart/user");
      setCartItems(res.data.items || []);
      setCartTotal(res.data.totalPrice || 0);
    } catch (err) {
      console.error("Erreur chargement panier:", err);
      toast.error("Impossible de charger le panier.");
    }
  };

  useEffect(() => {
    if (!initialOrder) loadCart();
  }, [initialOrder]);

  // Confirm all items in cart
  const confirmAllOrder = async () => {
    if (cartItems.length === 0) {
      toast.warning("Votre panier est vide.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.post("/api/orders/checkout");
      setOrderResult(res.data);
      toast.success("Commande confirmée (tous les articles) !");
      setCartItems([]);
      setCartTotal(0);
    } catch (err) {
      console.error("Erreur création commande:", err);
      toast.error("Impossible de confirmer la commande.");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm selected items only
  const confirmSelectedOrder = async (selectedIds) => {
    if (selectedIds.length === 0) {
      toast.warning("Aucun article sélectionné.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.post("/api/orders", { cartIds: selectedIds });
      setOrderResult(res.data);
      toast.success("Commande confirmée (articles sélectionnés) !");
      // Optionally remove selected from cartItems
      setCartItems((prev) => prev.filter((it) => !selectedIds.includes(it.id)));
      setCartTotal((prev) =>
        prev - prev.filter((it) => selectedIds.includes(it.id)).reduce((sum, it) => sum + (it.totalPrice ?? 0), 0)
      );
    } catch (err) {
      console.error("Erreur création commande:", err);
      toast.error("Impossible de confirmer la commande.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4" style={{ color: "#1b5b9cff" }}>
        ✅ Confirmation de commande
      </h2>

      {orderResult ? (
        <>
          <div className="mb-3">
            <div><strong>Numéro :</strong> {orderResult.id}</div>
            <div><strong>Client :</strong> {orderResult.username}</div>
            <div><strong>Total :</strong> {orderResult.totalPrice} MAD</div>
            <div><strong>Date :</strong> {new Date(orderResult.createdAt || Date.now()).toLocaleString()}</div>
          </div>

          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Image</th>
                <th>Produit</th>
                <th>Qté</th>
                <th>Prix unitaire</th>
                <th>Total ligne</th>
              </tr>
            </thead>
            <tbody>
              {orderResult.items?.map((it) => (
                <tr key={it.id}>
                  <td style={{ width: 120 }}>
                    <img
                      src={it.imageUrl}
                      alt={it.productName}
                      style={{ width: 100, height: 100, objectFit: "contain", background: "#f8f9fa" }}
                    />
                  </td>
                  <td>{it.productName}</td>
                  <td>{it.quantity}</td>
                  <td>{it.unitPrice?.toFixed?.(2)} MAD</td>
                  <td>{it.lineTotal?.toFixed?.(2)} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          {cartItems.length > 0 ? (
            <>
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((it) => (
                    <tr key={it.id}>
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
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <h4>Total panier : {cartTotal.toFixed(2)} MAD</h4>
                <div>
                  <button className="btn btn-success me-2" onClick={confirmAllOrder} disabled={submitting}>
                    {submitting ? "Validation..." : "Tout confirmer"}
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => confirmSelectedOrder(cartItems.slice(0, 1).map((it) => it.id))} 
                    disabled={submitting}
                  >
                    {submitting ? "Validation..." : "Confirmer sélection"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-muted">Votre panier est vide.</p>
          )}
        </>
      )}
    </div>
  );
};

export default OrderPage;
