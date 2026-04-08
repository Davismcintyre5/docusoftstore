import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PaymentModal from '../components/payment/PaymentModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatKES } from '../utils/formatters';
import { ArrowLeft } from 'lucide-react';

const CheckoutPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [type, setType] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchItem();
  }, [id, user]);

  const fetchItem = async () => {
    try {
      const [docRes, softRes] = await Promise.all([
        api.get(`/documents/${id}`).catch(() => null),
        api.get(`/software/${id}`).catch(() => null)
      ]);
      if (docRes?.data) {
        setItem(docRes.data);
        setType('document');
      } else if (softRes?.data) {
        setItem(softRes.data);
        setType('software');
      } else {
        navigate('/');
      }
    } catch (error) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!item) return null;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-primary-600 mb-4"><ArrowLeft size={16} /> Back</button>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <div className="border-b pb-4 mb-4">
          <p className="font-semibold">{item.title}</p>
          <p className="text-sm text-gray-500 capitalize">{type}</p>
        </div>
        <div className="flex justify-between mb-6">
          <span>Total</span>
          <span className="text-xl font-bold text-primary-600">{formatKES(item.price)}</span>
        </div>
        <button onClick={() => setShowPayment(true)} className="btn-primary w-full">Proceed to Payment</button>
      </div>

      {showPayment && <PaymentModal item={{ ...item, type }} onClose={() => setShowPayment(false)} onSuccess={() => navigate('/profile')} />}
    </div>
  );
};

export default CheckoutPage;