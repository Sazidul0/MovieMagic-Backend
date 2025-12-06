import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartIcon.css';

/**
 * CartIcon Component
 * Displays shopping cart icon with item count badge
 * Updates cart count every 5 seconds
 * Navigates to cart page on click
 */
export default function CartIcon() {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartCount();
    
    // Refresh cart count every 5 seconds
    const interval = setInterval(fetchCartCount, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchCartCount = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCartCount(0);
        return;
      }

      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch cart:', response.status);
        return;
      }

      const data = await response.json();
      
      if (data.cart && data.cart.items) {
        // Count total seats (not items)
        const totalItems = data.cart.items.reduce((sum, item) => {
          return sum + (item.seats ? item.seats.length : 0);
        }, 0);
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="cart-icon-wrapper">
      <button 
        className="cart-icon-container" 
        onClick={handleCartClick}
        title="View Cart"
        aria-label="Shopping Cart"
      >
        {/* Shopping Cart SVG Icon */}
        <svg 
          className="cart-icon" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
          />
        </svg>

        {/* Badge showing item count */}
        {cartCount > 0 && (
          <span className="cart-badge" data-count={cartCount}>
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
