import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const fmt = (iso) =>
  iso ? new Date(iso).toLocaleString() : "—";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/orders/me"); // <-- your endpoint
        setOrders(res.data || []);
        setErr("");
      } catch (e) {
        console.error(e);
        setErr("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="alert alert-info">Loading your orders…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{err}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4" style={{ color: "#1b5b9cff" }}>📦 My Orders</h2>

      {orders.length === 0 ? (
        <div className="alert alert-secondary">You have no orders yet.</div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((o) => (
            <div key={o.id} className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="m-0">Order </h5>
                  <span className="text-muted small">
                    Created: {fmt(o.createdAt)} • Updated: {fmt(o.updatedAt)}
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th style={{width: 80}}>Image</th>
                        <th>Product</th>
                        <th className="text-end">Unit</th>
                        <th className="text-end">Qty</th>
                        <th className="text-end">Line total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(o.items || []).map((it) => (
                        <tr key={it.id ?? `${it.productId}-${it.productName}`}>
                          <td>
                            <img
                              src={it.imageUrl}
                              alt={it.productName}
                              style={{ width: 64, height: 64, objectFit: "contain" }}
                            />
                          </td>
                          <td>{it.productName}</td>
                          <td className="text-end">{it.unitPrice?.toFixed?.(2)} MAD</td>
                          <td className="text-end">{it.quantity}</td>
                          <td className="text-end fw-semibold">
                            {it.lineTotal?.toFixed?.(2)} MAD
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="text-end fw-semibold">Total:</td>
                        <td className="text-end fw-bold">{o.totalPrice?.toFixed?.(2)} MAD</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
