import React, { useEffect, useState } from 'react';
import { fetchAllInvoices } from '../api/invoiceApi';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        const data = await fetchAllInvoices();
        setInvoices(data);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };
    loadInvoices();
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading your orders...</p>;
  if (invoices.length === 0) return <p style={{ padding: '20px' }}>No orders found.</p>;

  return (
    <div style={{ 
      maxWidth: '950px', 
      margin: '32px auto', 
      background: '#fdfdfd', 
      borderRadius: '10px', 
      boxShadow: '0 2px 20px rgba(0,0,0,0.05)', 
      padding: '32px' 
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '2em', fontWeight: 700, color: '#2a2a2a' }}>
        📦 My Orders
      </h2>

      <table style={{
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 10px'
      }}>
        <thead>
          <tr style={{ background: '#eef3f8', borderBottom: '2px solid #bbb' }}>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#1a3d6e' }}>
              Order
            </th>
            <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: '#1a3d6e' }}>
              Total Payment
            </th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#1a3d6e' }}>
              Date
            </th>
            <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, color: '#1a3d6e' }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, idx) => (
            <tr 
              key={inv.invoiceId} 
              style={{ 
                background: idx % 2 === 0 ? '#f9fbfc' : '#ffffff', 
                boxShadow: '0 1px 5px rgba(0,0,0,0.05)'
              }}
            >
              <td style={{ padding: '10px 16px', fontWeight: 500 }}>{inv.invoiceId}</td>
              <td style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 500 }}>
                ₹{inv.finalPayment.toLocaleString()}
              </td>
              <td style={{ padding: '10px 16px' }}>
                {inv.invoiceDate.toLocaleString()}
              </td>
              <td style={{ textAlign: 'center', padding: '10px 16px' }}>
                <button
                  style={{
                    padding: '8px 20px',
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '1em',
                    boxShadow: '0 2px 8px rgba(0,0,50,0.07)'
                  }}
                  onClick={() => navigate(`/orders/${inv.invoiceId}`)}
                >
                  Invoice Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
