import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PaymentModal from '../components/payments/PaymentModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatKES } from '../utils/formatters';

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/checkout/${id}` } });
      return;
    }

    const fetchItem = async () => {
      try {
        // Try both document and software
        let data;
        try {
          const res = await api.get(`/documents/${id}`);
          data = { ...res.data, type: 'document' };
        } catch {
          const res = await api.get(`/software/${id}`);
          data = { ...res.data, type: 'software' };
        }
        setItem(data);
      } catch (error) {
        console.error('Failed to fetch item:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, isAuthenticated, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!item) return <div>Item not found</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2>Checkout</h2>
        <div style={{ marginTop: '24px' }}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginTop: '16px' }}>
            {formatKES(item.price)}
          </div>
        </div>
        <button
          onClick={() => setShowPaymentModal(true)}
          style={{
            marginTop: '24px',
            padding: '14px 28px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Proceed to Payment
        </button>
      </div>

      {showPaymentModal && (
        <PaymentModal
          item={item}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => navigate('/profile')}
        />
      )}
    </div>
  );
};

export default CheckoutPage;