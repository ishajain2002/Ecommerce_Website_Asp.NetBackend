// src/api/invoiceApi.js
import axios from 'axios';

const API_BASE = 'http://localhost:5087/api/invoice';

// ✅ Send cookies (for session auth) and JWT if available
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  const config = {
    withCredentials: true // for JSESSIONID
  };
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }
  return config;
};

export const fetchAllInvoices = async () => {
  const res = await axios.get(`${API_BASE}/all`, getAuthConfig());
  return Array.isArray(res.data) ? res.data : [];
};

export const fetchInvoiceDetails = async (invoiceId) => {
  const res = await axios.get(`${API_BASE}/${invoiceId}`, getAuthConfig());
  return Array.isArray(res.data) ? res.data : [];
};

export const generateInvoice = async (invoiceData) => {
  const res = await axios.post(`${API_BASE}/generate`, invoiceData, getAuthConfig());
  return res.data;
};