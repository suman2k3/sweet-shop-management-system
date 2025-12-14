import { useEffect, useState } from "react";
import API from "./api";

function Sweets() {
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [user, setUser] = useState(null);

  // 🔐 Admin form state (WITH IMAGE)
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    stock: "",
    image: ""   // ✅ IMAGE URL
  });

  const [editId, setEditId] = useState(null);

  // 🔑 Load logged-in user
  const loadUser = async () => {
    try {
      const res = await API.get("/me");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const isAdmin = user?.is_admin;

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

  // 🛠 Admin handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitSweet = async () => {
    if (editId) {
      await API.put(`/sweets/${editId}`, null, { params: form });
    } else {
      await API.post("/sweets", null, { params: form });
    }

    setForm({
      name: "",
      category: "",
      price: "",
      quantity: "",
      stock: "",
      image: ""
    });

    setEditId(null);
    loadSweets();
  };

  const editSweet = (s) => {
    setEditId(s.id);
    setForm({
      name: s.name,
      category: s.category,
      price: s.price,
      quantity: s.quantity,
      stock: s.stock,
      image: s.image || ""
    });
  };

  const deleteSweet = async (id) => {
    if (confirm("Delete this sweet?")) {
      await API.delete(`/sweets/${id}`);
      loadSweets();
    }
  };

  useEffect(() => {
    loadSweets();
    loadUser();
  }, []);

  // 🔍 Search & Filter
  const filteredSweets = sweets.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "" || s.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="sweets-page">
      {/* Header */}
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

      {/* 🛠 ADMIN PANEL */}
      {isAdmin && (
        <div className="admin-panel">
          <h3>{editId ? "Update Sweet" : "Add Sweet"}</h3>

          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
          <input name="quantity" placeholder="Quantity (500 g / 50 pc)" value={form.quantity} onChange={handleChange} />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />
          <input name="image" placeholder="Image URL (https://...)" value={form.image} onChange={handleChange} />

          <button onClick={submitSweet}>
            {editId ? "Update Sweet" : "Add Sweet"}
          </button>
        </div>
      )}

      {/* 🔍 Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search sweets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="sweets">Sweets</option>
          <option value="dessert">Dessert</option>
          <option value="snacks">Snacks</option>
        </select>
      </div>

      {/* 🍬 PRODUCT GRID */}
      <div className="sweets-grid">
        {filteredSweets.map((s) => (
          <div className="sweet-card" key={s.id}>
            {/* IMAGE */}
            <img
              className="sweet-image"
              src={s.image || "/image.png"}
              alt={s.name}
            />

            {/* CONTENT */}
            <h3>{s.name}</h3>
            <p className="category">{s.category}</p>

            <p className="price">
              From <span>₹ {s.price}</span>
            </p>

            <button
              className="buy-btn big"
              disabled={s.stock === 0}
              onClick={() => buySweet(s.id)}
            >
              {s.stock === 0 ? "Out of Stock" : "Buy"}
            </button>

            <small className="stock-count">
              Stock: {s.stock} ({s.quantity})
            </small>

            {isAdmin && (
              <div className="admin-actions">
                <button onClick={() => editSweet(s)}>Edit</button>
                <button onClick={() => deleteSweet(s.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sweets;
