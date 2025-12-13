import { useEffect, useState } from "react";
import API from "./api";

function Sweets() {
  const [sweets, setSweets] = useState([]);

  const loadSweets = async () => {
    const res = await API.get("/sweets");
    setSweets(res.data);
  };

  const buySweet = async (id) => {
    await API.post(`/sweets/${id}/purchase`, null, {
      params: { quantity: 1 },
    });
    loadSweets();
  };

  useEffect(() => {
    loadSweets();
  }, []);

 return (
  <div className="sweets-page">
    <div className="sweets-header">
      <h2>🍬 Sweet Shop</h2>
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>

    <div className="sweets-grid">
      {sweets.map((s) => (
        <div className="sweet-card" key={s.id}>
          <div className="sweet-top">
            <h3>{s.name}</h3>
            <span className={`stock-badge ${s.quantity === 0 ? "out" : ""}`}>
              {s.quantity === 0 ? "Out" : `${s.quantity} left`}
            </span>
          </div>

          <p className="category">{s.category}</p>

          <div className="sweet-footer">
            <span className="price">₹ {s.price}</span>

            <button
              className="buy-btn"
              disabled={s.quantity === 0}
              onClick={() => buySweet(s.id)}
            >
              Buy
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}

export default Sweets;
