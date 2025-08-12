import React, { useMemo, useState } from "react";
import api from "../api/axiosInstance"; // axios instance that injects Authorization
import { useNavigate } from "react-router-dom";

const CREATE_PRODUCT_URL = "/api/products"; // <-- change if your controller uses a different path

const defaultCategories = [
  "WHEY PROTEIN",
  "MASS GAINER",
  "BCAA / EAA",
  "CREATINE",
  "PRE-WORKOUT",
  "VITAMINS",
];

const isValidUrl = (url) => {
  try { new URL(url); return true; } catch { return false; }
};

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    available: true,
  });

  const [qtyInput, setQtyInput] = useState("");
  const [quantities, setQuantities] = useState([]); // number[]
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const priceNumber = useMemo(() => Number(form.price), [form.price]);
  const priceValid = !Number.isNaN(priceNumber) && priceNumber > 0;

  const imageOk = form.imageUrl && isValidUrl(form.imageUrl);

  const canSubmit =
    form.productName.trim().length >= 2 &&
    form.description.trim().length >= 10 &&
    priceValid &&
    form.category.trim().length > 0 &&
    imageOk &&
    quantities.length > 0 &&
    !submitting;

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: field === "available" ? e.target.checked : e.target.value }));

  const addQuantity = () => {
    const n = parseInt(qtyInput, 10);
    if (!Number.isNaN(n) && n > 0) {
      setQuantities((prev) => Array.from(new Set([...prev, n])).sort((a, b) => a - b));
      setQtyInput("");
    }
  };

  const removeQuantity = (n) => setQuantities((prev) => prev.filter((q) => q !== n));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");

    const payload = {
      productName: form.productName.trim(),
      description: form.description.trim(),
      price: priceNumber,
      category: form.category.trim(),
      imageUrl: form.imageUrl.trim(),
      available: !!form.available,
      availableQuantities: quantities,
    };

    try {
      const res = await api.post(CREATE_PRODUCT_URL, payload);
      // Success UX: go to products list or show detail. Adjust the route as you like.
      navigate("/admin/products", { state: { createdId: res.data?.id } });
    } catch (err) {
      console.error("Create product failed:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to create product. Please check your inputs and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div
        className="mx-auto shadow-lg rounded-4 p-4 p-md-5"
        style={{
          maxWidth: 900,
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0 text-black fw-semibold">➕ Add Product</h2>
          <button className="btn btn-outline-dark" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="row g-4">
          {/* Left column */}
          <div className="col-md-7">
            <div className="mb-3">
              <label className="form-label text-dark-70">Product name</label>
              <input
                type="text"
                className="form-control"
                value={form.productName}
                onChange={update("productName")}
                placeholder="e.g. Whey Core Protein 5kg"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-dark-50">Description</label>
              <textarea
                className="form-control"
                rows={4}
                value={form.description}
                onChange={update("description")}
                placeholder="Short description of the product…"
                required
              />
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label text-dark-50">Price (MAD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-control ${form.price && !priceValid ? "is-invalid" : ""}`}
                  value={form.price}
                  onChange={update("price")}
                  placeholder="e.g. 95"
                  required
                />
                {form.price && !priceValid && (
                  <div className="invalid-feedback">Enter a valid positive price.</div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label text-dark-50">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={update("category")}
                  required
                >
                  <option value="">Select a category…</option>
                  {defaultCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label text-dark-50 d-block">Available</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="availableSwitch"
                    checked={form.available}
                    onChange={update("available")}
                  />
                  <label className="form-check-label text-white-50" htmlFor="availableSwitch">
                    {form.available ? "In stock" : "Unavailable"}
                  </label>
                </div>
              </div>
            </div>

            {/* Quantities */}
            <div className="mt-4">
              <label className="form-label text-dark-50">Available quantities (grams)</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addQuantity())}
                  placeholder="e.g. 500"
                />
                <button type="button" className="btn btn-outline-info" onClick={addQuantity}>
                  Add
                </button>
              </div>

              <div className="mt-2 d-flex flex-wrap gap-2">
                {quantities.map((q) => (
                  <span
                    key={q}
                    className="badge rounded-pill bg-light text-dark d-flex align-items-center"
                    style={{ gap: 8, padding: "0.6rem 0.8rem" }}
                  >
                    {q} g
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0 text-danger"
                      onClick={() => removeQuantity(q)}
                      title="Remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {quantities.length === 0 && (
                <div className="form-text text-warning">
                  Add at least one quantity (e.g., 500, 1000…).
                </div>
              )}
            </div>
          </div>

          {/* Right column: Image preview */}
          <div className="col-md-5">
            <label className="form-label text-dark-50">Image URL</label>
            <input
              type="url"
              className={`form-control ${form.imageUrl && !imageOk ? "is-invalid" : ""}`}
              value={form.imageUrl}
              onChange={update("imageUrl")}
              placeholder="https://example.com/image.jpg"
              required
            />
            {form.imageUrl && !imageOk && (
              <div className="invalid-feedback">Enter a valid image URL.</div>
            )}

            <div className="mt-3 border rounded-3 p-3 bg-dark bg-opacity-25">
              <div className="text-white-50 mb-2">Preview</div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ height: 260, background: "rgba(0,0,0,0.2)" }}
              >
                {imageOk ? (
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    style={{ maxHeight: "240px", maxWidth: "100%", objectFit: "contain" }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <span className="text-white-50">Image will appear here</span>
                )}
              </div>
            </div>

            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-success btn-lg"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                {submitting ? "Creating…" : "Create Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
