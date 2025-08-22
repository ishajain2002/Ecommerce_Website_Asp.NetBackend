import React, { useEffect, useState } from 'react';
import { fetchInvoiceDetails } from '../api/invoiceApi';
import { useParams } from 'react-router-dom';

export default function InvoiceDetailsPage() {
  const { invoiceId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const data = await fetchInvoiceDetails(invoiceId);
        console.log("Invoice API Response:", data);
        setItems(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        console.error('Error fetching invoice details', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadInvoice();
  }, [invoiceId]);

  if (loading) return <p style={{ margin: '40px', fontSize: '18px' }}>Loading order details...</p>;
  if (!items.length) return <p style={{ margin: '40px', fontSize: '18px' }}>No items found for this order.</p>;

  const grandTotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  return (
    <div style={{
      maxWidth: '950px',
      margin: '32px auto',
      background: '#fdfdfd',
      borderRadius: '10px',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.05)',
      padding: '32px'
    }}>
      {/* Header + Download Button */}
      <div style={{
        marginBottom: '20px',
        borderBottom: '1px solid #ececec',
        paddingBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2em', fontWeight: 700, color: '#2a2a2a' }}>📦 Orders</h2>
          <div style={{ marginTop: '8px', fontSize: '1.05em', color: '#3a3a3a' }}>
          <strong>Purchase Modes:</strong> {
  [...new Set(items.map(i => i.purchaseMode || i.purchase_mode))]
    .join(', ') || 'N/A'
}

          </div>
        </div>

        {/* Download Button - placeholder */}
      <button
  style={{
    padding: '10px 18px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '1em',
    boxShadow: '0 2px 6px rgba(0,0,50,0.1)'
  }}
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const response = await fetch(`http://localhost:5087/api/invoice/pdf/${invoiceId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      // Convert response to a Blob (PDF)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Clean up the object URL
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("Error downloading invoice");
    }
  }}
>
  Download Invoice
</button>

      </div>

      {/* Table */}
      <table style={{
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 10px'
      }}>
        <thead>
          <tr style={{ background: '#eef3f8', borderBottom: '2px solid #bbb' }}>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#1a3d6e' }}>Product</th>
            <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: '#1a3d6e' }}>Quantity</th>
            <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: '#1a3d6e' }}>Unit Price</th>
            <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: '#1a3d6e' }}>Subtotal</th>
            <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, color: '#1a3d6e' }}>Purchase Mode</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr
              key={item.productId || idx}
              style={{
                background: idx % 2 === 0 ? '#f9fbfc' : '#ffffff',
                borderRadius: '7px',
                boxShadow: '0 1px 5px rgba(0,0,0,0.05)'
              }}
            >
              <td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center' }}>
                <img
                  src={`/images/${item.productImg}`}
                  alt={item.productName}
                  style={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                    marginRight: '12px',
                    borderRadius: '6px',
                    border: '1px solid #e6e6ea',
                    background: '#fff'
                  }}
                />
                <span style={{ fontSize: '1.07em', fontWeight: 500 }}>{item.productName}</span>
              </td>
              <td style={{ textAlign: 'right', padding: '10px 16px' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '10px 16px' }}>₹{item.unitPrice.toLocaleString()}</td>
              <td style={{ textAlign: 'right', padding: '10px 16px' }}>₹{item.subtotal.toLocaleString()}</td>
              <td style={{ textAlign: 'center', padding: '10px 16px' }}>{item.purchaseMode || item.purchase_mode}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: '#eef3f8' }}>
            <td colSpan={3} style={{ padding: '14px 16px', fontWeight: 'bold' }}>Total</td>
            <td style={{ textAlign: 'right', padding: '14px 16px', fontWeight: 'bold', color: '#0b5a98' }}>
              ₹ {grandTotal}+ ₹ {(0.18*grandTotal)}= ₹ {grandTotal+(0.18*grandTotal)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
