import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState({}); // { [productId]: qty }
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let endpoint = "/api/products";

        if (searchTerm.trim() !== "") {
          const q = encodeURIComponent(searchTerm.trim());
          endpoint =
            searchType === "name"
              ? `/api/products/name/${q}`
              : `/api/products/category/${q}`;
        }

        const res = await api.get(endpoint);
        setProducts(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);
      }
    };

    fetchProducts();
  }, [searchTerm, searchType]);

  // change selected quantity for one product
  const handleQuantityChange = (productId, quantity) => {
    setSelectedQuantities((prev) => ({ ...prev, [productId]: quantity }));
  };

  // add to cart
  const handleAddToCart = async (product) => {
  const quantity =
    selectedQuantities[product.id] || product.availableQuantities?.[0];

  if (!quantity) {
    toast.warning("Veuillez choisir une quantité !");
    return;
  }

  try {
    await api.post(
      "/api/cart/add",
      {
        product: { id: product.id },
        selectedQuantity: quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    toast.success(`✅ ${product.productName} (${quantity} g) ajouté au panier`);
  } catch (err) {
    console.error("Erreur ajout panier :", err);
    toast.error("❌ Impossible d'ajouter au panier");
  }
};


  return (
    <div className="container mt-5">
      {/* Header with title & cart icon */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2
          className="fw-bold"
          style={{ color: "#1b5b9cff", fontSize: "3rem", letterSpacing: "2px" }}
        >
          USHOP
        </h2>
        <button onClick={() => navigate('/questions')} className="btn btn-primary">
              Get Personalized Recommendations
        </button>
        <button
          className="btn btn-outline-primary position-relative"
          onClick={() => navigate("/cart")}
        >
          🛒 Cart
        </button>
        
      </div>

      {/* Search */}
      <div className="d-flex justify-content-end align-items-center mb-4">
        <select
          className="form-select w-auto me-2"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="name">NAME</option>
          <option value="category">CATEGORY</option>
        </select>
        <input
          type="text"
          className="form-control w-25"
          placeholder={`SEARCH USING ${
            searchType === "name" ? "NAME" : "CATEGORY"
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products */}
      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow">
              <img
                src={p.imageUrl}
                className="card-img-top"
                alt={p.productName}
                style={{
                  height: "250px",
                  objectFit: "contain",
                  backgroundColor: "#f8f9fa",
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{p.productName}</h5>
                <p className="card-text">{p.description}</p>
                <p>
                  <strong>Price :</strong> {p.price} MAD
                </p>
                <p>
                  <strong>Category :</strong> {p.category}
                </p>
                <p>
                  <strong>Available :</strong>{" "}
                  {p.available ? (
                    <span className="text-success">In stock</span>
                  ) : (
                    <span className="text-danger">Sold out</span>
                  )}
                </p>
                <p>
                  <strong>Quantities :</strong>{" "}
                  {p.availableQuantities?.join(", ")}
                </p>

                {/* Dropdown + ADD when available */}
                {p.available && p.availableQuantities?.length > 0 && (
                  <>
                    <select
                      className="form-select mb-2"
                      value={
                        selectedQuantities[p.id] ?? p.availableQuantities[0]
                      }
                      onChange={(e) =>
                        handleQuantityChange(p.id, parseInt(e.target.value))
                      }
                    >
                      {p.availableQuantities.map((q) => (
                        <option key={q} value={q}>
                          {q} g
                        </option>
                      ))}
                    </select>
                    <div className="d-flex flex-column gap-2">
                    <button className="btn btn-info w-100"
                      onClick={() => navigate(`/products/${p.id}`)}>
                        View details
                    </button>
                    
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleAddToCart(p)}
                    >
                      ➕ ADD
                    </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
