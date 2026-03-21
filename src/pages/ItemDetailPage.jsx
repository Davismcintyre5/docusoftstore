import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import PaymentModal from '../components/payments/PaymentModal';
import WhatsAppButton from '../components/whatsapp/WhatsAppButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatKES } from '../utils/formatters';

const ItemDetailPage = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  const getApiPath = () => type === 'document' ? 'documents' : 'software';

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/${getApiPath()}/${id}`);
        setItem(data);
      } catch (error) {
        console.error('Failed to fetch item:', error);
        setError(error.response?.data?.message || 'Failed to load item');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id, type]);

  // Check purchase status
  useEffect(() => {
    if (user && item) checkPurchaseStatus();
  }, [user, item, refreshCount]);

  const checkPurchaseStatus = async () => {
    if (!user || !item) return;
    setCheckingStatus(true);
    try {
      const { data } = await api.get(`/payments/status/${id}`);
      setPurchaseStatus(data);
    } catch (error) {
      console.error('Failed to check purchase status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      sessionStorage.setItem('pendingPurchase', JSON.stringify({
        itemId: id,
        itemType: type,
        price: item.price,
        title: item.title
      }));
      navigate('/login', { state: { from: `/checkout/${id}` } });
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleDownload = async () => {
    if (!item.isFree && !isAuthenticated) {
      alert('Please login to download paid items');
      navigate('/login', { state: { from: `/${type}/${id}` } });
      return;
    }

    setDownloading(true);
    setError('');
    
    try {
      console.log('⬇️ Downloading item:', item.title);
      
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken && !item.isFree) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const apiPath = getApiPath();
      // FIXED: Correct URL format - ID before /download
      const url = `/${apiPath}/${id}/download`;
      console.log('Download URL:', url);
      
      const response = await api.get(url, {
        responseType: 'blob',
        headers: storedToken ? {
          'Authorization': `Bearer ${storedToken}`
        } : {},
        timeout: 60000
      });

      const contentDisposition = response.headers['content-disposition'];
      let filename = item.fileInfo?.originalName || 
                     item.title + (type === 'document' ? '.pdf' : '.zip');
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, '');
        }
      }

      const url_blob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url_blob;
      link.setAttribute('download', decodeURIComponent(filename));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url_blob);

    } catch (error) {
      console.error('❌ Download failed:', error);
      
      let errorMessage = 'Download failed';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Your session has expired. Please login again.';
          localStorage.removeItem('token');
        } else if (error.response.status === 403) {
          errorMessage = 'You have not purchased this item';
        } else if (error.response.status === 404) {
          errorMessage = 'File not found on server';
        } else {
          errorMessage = error.response.data?.message || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      alert(`❌ ${errorMessage}`);
      
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!item) return <div>Item not found</div>;

  const canDownload = item.isFree || purchaseStatus?.status === 'completed' || purchaseStatus?.purchased === true;
  const isPending = purchaseStatus?.status === 'pending';
  const isRejected = purchaseStatus?.status === 'rejected';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>{item.title}</h1>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '14px' }}>
          <span style={{ backgroundColor: '#e2e8f0', padding: '4px 12px', borderRadius: '20px' }}>
            {type === 'document' ? '📄 Document' : '💻 Software'}
          </span>
          <span>Category: <Link to={`/category/${item.category?.slug}`}>{item.category?.name}</Link></span>
        </div>
        <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>{item.description}</p>
        <div style={{ marginBottom: '24px' }}>
          {item.isFree ? (
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#48bb78' }}>FREE</span>
          ) : (
            <span style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>{formatKES(item.price)}</span>
          )}
        </div>

        {/* Status messages */}
        {!item.isFree && (
          <div style={{ marginBottom: '20px' }}>
            {canDownload && <div style={{ backgroundColor: '#c6f6d5', padding: '12px', borderRadius: '8px', color: '#22543d' }}>✅ You own this item</div>}
            {isPending && <div style={{ backgroundColor: '#feebc8', padding: '12px', borderRadius: '8px', color: '#7b341e' }}>⏳ Payment pending verification</div>}
            {isRejected && <div style={{ backgroundColor: '#fed7d7', padding: '12px', borderRadius: '8px', color: '#c53030' }}>❌ Payment was rejected</div>}
            {!canDownload && !isPending && !isRejected && <div style={{ backgroundColor: '#f7fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#4a5568' }}>🔒 You need to purchase this item to download it</div>}
          </div>
        )}

        {/* Authentication Status */}
        <div style={{ marginBottom: '20px' }}>
          {isAuthenticated ? (
            <div style={{ backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px', color: '#0369a1', fontSize: '14px' }}>
              👤 Logged in as: <strong>{user?.email}</strong>
              {canDownload && <span style={{ marginLeft: '12px', backgroundColor: '#48bb78', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>✓ Owned</span>}
            </div>
          ) : (
            <div style={{ backgroundColor: '#fff7ed', padding: '12px', borderRadius: '8px', color: '#9a3412', fontSize: '14px' }}>
              🔒 Not logged in
              <Link to="/login" style={{ marginLeft: '12px', color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {canDownload ? (
            <button 
              onClick={handleDownload} 
              disabled={downloading} 
              style={{ padding: '14px 28px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', minHeight: '48px', flex: '1' }}
            >
              {downloading ? '⏳ Downloading...' : '⬇️ Download Now'}
            </button>
          ) : (
            <button 
              onClick={handleBuyNow} 
              disabled={checkingStatus || isPending} 
              style={{ padding: '14px 28px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', minHeight: '48px', flex: '1' }}
            >
              {checkingStatus ? '⏳ Checking...' : isPending ? '⏳ Pending Verification' : `💰 Buy Now ${!item.isFree ? `- ${formatKES(item.price)}` : ''}`}
            </button>
          )}
          <WhatsAppButton message={`Hello, I have a question about ${item.title}`} text="💬 Ask Question" />
        </div>

        {!item.isFree && !canDownload && (
          <button 
            onClick={checkPurchaseStatus} 
            style={{ padding: '10px 20px', backgroundColor: '#4299e1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}
          >
            🔄 Check Purchase Status
          </button>
        )}
      </div>

      {showPaymentModal && (
        <PaymentModal
          item={{ ...item, type }}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            setRefreshCount(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
};

export default ItemDetailPage;