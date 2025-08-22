import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../utils/auth';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef();
  const { cartItems } = useCart();

  const toggleMenu = () => setShowProfileMenu(prev => !prev);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const linkStyle = {
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '5px',
    transition: 'background 0.2s',
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 28px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {/* Logo / Brand */}
      <h1
        onClick={() => navigate('/dashboard')}
        style={{
          cursor: 'pointer',
          color: '#1a237e', // darker indigo shade
          fontSize: '1.6em',
          fontWeight: 'bold',
          letterSpacing: '1px',
        }}
      >
        🛒 Apni Dukaan
      </h1>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
        <span
          style={linkStyle}
          onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          onClick={() => navigate('/dashboard')}
        >
          🏠 Home
        </span>

        <span
          style={linkStyle}
          onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          onClick={() => navigate('/cart')}
        >
          🛍️ Cart 
        </span>

        <span
          style={linkStyle}
          onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          onClick={toggleMenu}
        >
          👤
        </span>
      </div>

      {/* Profile Dropdown */}
      {showProfileMenu && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
            padding: '10px',
            zIndex: 100,
            width: '160px',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li
              style={{ padding: '8px', cursor: 'pointer', borderRadius: '4px' }}
              onClick={() => navigate('/profile')}
              onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              My Profile
            </li>
            <li
              style={{ padding: '8px', cursor: 'pointer', borderRadius: '4px' }}
              onClick={() => {
                navigate('/orders');
                setShowProfileMenu(false);
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Orders
            </li>
            <li
              style={{ padding: '8px', cursor: 'pointer', color: 'red', borderRadius: '4px' }}
              onClick={() => {
                removeToken();
                navigate('/login');
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#fef2f2')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
