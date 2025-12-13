import { useState } from "react";
import API from "./api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        // REGISTER
        await API.post(
          `/register?username=${username}&password=${password}`
        );
        alert("Registered successfully. Please login.");
        setIsRegister(false);
      } else {
        // LOGIN
        const res = await API.post(
          `/login?username=${username}&password=${password}`
        );
        localStorage.setItem("token", res.data.access_token);
        onLogin();
      }
    } catch (err) {
      alert(isRegister ? "Registration failed" : "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegister ? "Create Account" : "Login"} 🍬</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {isRegister ? "Register" : "Login"}
        </button>

        <p
          style={{ marginTop: "12px", cursor: "pointer", color: "#667eea" }}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "New user? Register here"}
        </p>
      </div>
    </div>
  );
}

export default Login;
