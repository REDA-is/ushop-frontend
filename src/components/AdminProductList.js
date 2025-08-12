import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function AdminProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // simple UI state
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/products");
      setProducts(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach(p => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const byCat = category ? p.category === category : true;
      const s = search.trim().toLowerCase();
      const bySearch = s
        ? (p.productName?.toLowerCase().includes(s) ||
           p.description?.toLowerCase().includes(s))
        : true;
      return byCat && bySearch;
    });
  }, [products, category, search]);

  const confirmDelete = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/products/${id}`);
      // remove from local list quickly
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
       <div className="bg-success text-center rounded"
  style={{
    
    width: "30%",
    
    padding: "8px 0", 
  }}
>
  <h2 className="text-white m-0">Admin / Products</h2>
</div>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            style={{ width: 170 }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            className="form-control"
            style={{ width: 260 }}
            placeholder="Search by name/description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => navigate("/add-product")}
            title="Create a new product"
          >
            + New Product
          </button>
          <button
           className="btn btn-dark"
             onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading…</div>}
      {error && !loading && <div className="alert alert-danger">{error}</div>}

      {!loading && filtered.length === 0 && (
        <div className="alert alert-secondary">No products found.</div>
      )}

      <div className="row g-4">
        {filtered.map(p => (
          <div className="col-12 col-md-6 col-lg-4" key={p.id}>
            <div className="card shadow-sm h-100">
              <div
                className="ratio ratio-16x9 bg-light"
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <img
                  src={p.imageUrl}
                  alt={p.productName}
                  style={{ maxHeight: "100%", objectFit: "contain" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>

              <div className="card-body">
                <h5 className="card-title mb-2">{p.productName}</h5>
                <p className="card-text text-muted" style={{ minHeight: 48 }}>
                  {p.description}
                </p>

                <ul className="list-unstyled small mb-3">
                  <li><strong>Price:</strong> {p.price} MAD</li>
                  <li><strong>Category:</strong> {p.category}</li>
                  <li>
                    <strong>Available:</strong>{" "}
                    <span className={p.available ? "text-success" : "text-danger"}>
                      {p.available ? "In stock" : "Unavailable"}
                    </span>
                  </li>
                  <li>
                    <strong>Quantities:</strong>{" "}
                    {Array.isArray(p.availableQuantities) && p.availableQuantities.length > 0
                      ? p.availableQuantities.join(", ")
                      : "—"}
                  </li>
                </ul>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary flex-fill"
                    onClick={() => navigate(`/update-product/${p.id}`)}
                  >
                    ✏️ Update
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => confirmDelete(p.id, p.productName)}
                    title="Delete product"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
