import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

 // adjust if your endpoint differs

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [product, setProduct] = useState(null);
  const [selectedQty, setSelectedQty] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/products/${id}`);
        if (!mounted) return;
        setProduct(res.data);
        // default to first available quantity if any
        if (Array.isArray(res.data?.availableQuantities) && res.data.availableQuantities.length > 0) {
          setSelectedQty(res.data.availableQuantities[0]);
        }
        setError("");
      } catch (e) {
        console.error(e);
        setError("Failed to load product.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const canAdd = useMemo(() => {
    return !!product && product.available && Number.isFinite(Number(selectedQty));
  }, [product, selectedQty]);

  const addToCart = async () => {
    if (!canAdd) return;
    try {
      await api.post(
      "/api/cart/add",
      {
        product: { id: product.id },          
        selectedQuantity: Number(selectedQty),
      });
      toast.success("Added to cart!");
      navigate("/cart");
    } catch (err) {
      console.error(err);
      toast.error("Could not add to cart.");
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="alert alert-info">Loading product…</div>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || "Product not found."}</div>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div
        className="mx-auto shadow-lg rounded-4 p-4 p-md-5"
        style={{
          maxWidth: 980,
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0">📄 Product Details</h2>
          <button className="btn btn-outline-dark" onClick={() => navigate(-1)}>Back</button>
        </div>

        <div className="row g-4">
          {/* Left column (read-only details) */}
          <div className="col-md-7">
            <div className="mb-3">
              <label className="form-label">Product name</label>
              <input className="form-control" value={product.productName || ""} readOnly />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={4} value={product.description || ""} readOnly />
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Price (MAD)</label>
                <input className="form-control" value={product.price ?? ""} readOnly />
              </div>
              <div className="col-md-4">
                <label className="form-label">Category</label>
                <input className="form-control" value={product.category || ""} readOnly />
              </div>
              <div className="col-md-4">
                <label className="form-label d-block">Availability</label>
                <span className={`badge ${product.available ? "bg-success" : "bg-danger"}`}>
                  {product.available ? "In stock" : "Unavailable"}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <label className="form-label">Available quantities (grams)</label>
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(e.target.value)}
                  disabled={!product.available || !product.availableQuantities?.length}
                >
                  {Array.isArray(product.availableQuantities) && product.availableQuantities.length > 0 ? (
                    product.availableQuantities.map((q) => (
                      <option key={q} value={q}>{q} g</option>
                    ))
                  ) : (
                    <option value="">No quantities</option>
                  )}
                </select>
                <button
                  className="btn btn-primary"
                  onClick={addToCart}
                  disabled={!canAdd}
                >
                  Add to Cart
                </button>
              </div>
              {!product.available && (
                <div className="form-text text-danger mt-1">This product is currently unavailable.</div>
              )}
            </div>
          </div>

          {/* Right column: Image preview only */}
          <div className="col-md-5">
            <label className="form-label">Preview</label>
            <div className="border rounded-3 p-3 bg-dark bg-opacity-25">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ height: 320, background: "rgba(0,0,0,0.2)" }}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    style={{ maxHeight: "300px", maxWidth: "100%", objectFit: "contain" }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <span className="text-white-50">No image</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
