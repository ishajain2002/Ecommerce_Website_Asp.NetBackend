import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
// import { removeToken } from '../../utils/auth';


const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5087/api/auth/login", form);
      console.log("Received token:", res.data.token);
      setToken(res.data.token);
      alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="username"
            onChange={handleChange}
            placeholder="Username"
            required
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            required
            style={styles.input}
          />

          <div style={styles.linkRow}>
            <a href="/forgot-password" style={styles.link}>Forgot password?</a>
          </div>

          <button type="submit" style={styles.button}>Login</button>
        </form>

        <div style={styles.registerRow}>
          <span>Don't have an account?</span>
          <a href="/Register" style={styles.registerLink}> Register</a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageBackground: {
    minHeight: "100vh",
    backgroundImage: "url('./9584482.jpg')", // Update path if needed
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    maxWidth: "400px",
    width: "100%",
    padding: "30px",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
  },
  heading: {
    textAlign: "center",
    color: "#007BFF",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    backgroundColor: "#f8f9fa",
    color: "#333",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
  linkRow: {
    textAlign: "right",
    marginBottom: "10px",
  },
  link: {
    color: "#007BFF",
    fontSize: "14px",
    textDecoration: "none",
  },
  registerRow: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
  },
  registerLink: {
    marginLeft: "5px",
    color: "#007BFF",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default LoginPage;
