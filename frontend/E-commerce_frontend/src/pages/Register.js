// src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { removeToken } from '../../utils/auth';
import { removeToken } from '../utils/auth';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    phoneNo: '',
    email: '',
    loyalty: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!form.username.trim()) return alert('Username is required');
    if (!form.password.trim()) return alert('Password is required');
    if (!form.phoneNo.trim()) return alert('Phone number is required');
    if (!/^\d{10}$/.test(form.phoneNo)) return alert('Phone number must be 10 digits');
    if (!form.email.trim()) return alert('Email is required');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return alert('Invalid email format');
    if (form.loyalty === '') return alert('Please select loyalty');

    try {
      await axios.post('http://localhost:5087/api/auth/register', {
        ...form,
        loyalty: form.loyalty === 'true', // convert to boolean
      });
      alert('User registered successfully');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="phoneNo"
            placeholder="Phone No"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <select
            name="loyalty"
            onChange={handleChange}
            value={form.loyalty}
            required
            style={{
              ...styles.input,
              color: form.loyalty === '' ? '#888' : '#333',
            }}
          >
            <option value="">Select Loyalty</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <button type="submit" style={styles.button}>Register</button>
        </form>

        <div style={styles.loginRow}>
          <span>Already have an account?</span>
          <a href="/login" style={styles.loginLink}> Login</a>
          {/* Optional: use <Link to="/login">Login</Link> if you're using React Router */}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: {
    backgroundImage: 'url("/9584482.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    maxWidth: "500px",
    width: "90%",
    padding: "30px",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
    backdropFilter: "blur(8px)",
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
  loginRow: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
  },
  loginLink: {
    marginLeft: "5px",
    color: "#007BFF",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
