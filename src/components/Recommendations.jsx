import { useLocation } from "react-router-dom";

export default function Recommendations() {
  const { state } = useLocation();
  const products = state?.products || [];

  return (
    <div className="container">
      <h2>Your Recommended Products</h2>
      {products.length === 0 ? (
        <p>No products matched.</p>
      ) : (
        <ul>
          {products.map((prod, index) => (
            <li key={index}>{prod}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
