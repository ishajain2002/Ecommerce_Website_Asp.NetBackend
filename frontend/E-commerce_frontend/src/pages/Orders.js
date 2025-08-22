import React, { useEffect, useState } from 'react';
import { fetchAllInvoices } from '../api/invoiceApi';

const Orders = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await fetchAllInvoices();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
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
            <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#1a3d6e' }}>Invoice ID</th>
            <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: '#1a3d6e' }}>Total Payment</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#1a3d6e' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, idx) => (
            <tr 
              key={inv.invoiceId} 
              style={{ 
                background: idx % 2 === 0 ? '#f9fbfc' : '#ffffff', 
                boxShadow: '0 1px 5px rgba(0,0,0,0.05)', 
                cursor: 'default' 
              }}
            >
              <td style={{ padding: '10px 16px', fontWeight: 500 }}>{inv.invoiceId}</td>
              <td style={{ textAlign: 'right', padding: '10px 16px', fontWeight: 500 }}>₹{inv.unitPrice.toLocaleString()}</td>
              <td style={{ padding: '10px 16px' }}>{new Date(inv.invoiceDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
