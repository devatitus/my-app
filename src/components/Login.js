import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.webp";
import "../styles/styles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || {};

    // Find user by email and password
    const userEntry = Object.values(users).find(
      (u) => u.email === email && u.password === password
    );

    if (userEntry) {
      // Get the corresponding username (key)
      const matchedUsername = Object.keys(users).find(
        (key) => users[key].email === email && users[key].password === password
      );

      localStorage.setItem("currentUser", matchedUsername);
      alert("Login successful!");
      navigate("/profile");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="My Menu Logo" className="logo" />
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <div className="signup-box">
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log in</button>
        </form>
        <div className="signup">
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
