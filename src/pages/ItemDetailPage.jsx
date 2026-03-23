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

  const getApiPath = () => (type === 'document' ? 'documents' : 'software');

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError('');
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
      sessionStorage.setItem(
        'pendingPurchase',
        JSON.stringify({
          itemId: id,
          itemType: type,
          price: item.price,
          title: item.title,
        })
      );
      navigate('/login', { state: { from: `/checkout/${id}` } });
    } else {
      setShowPaymentModal(true);
    }
  };

  // ----- DOWNLOAD FUNCTION (PRODUCTION FIX) -----
  const handleDownload = () => {
    if (!item.isFree && !isAuthenticated) {
      alert('Please login to download paid items');
      navigate('/login', { state: { from: `/${type}/${id}` } });
      return;
    }

    setDownloading(true);
    setError('');

    try {
      const apiPath = getApiPath();
      // Use the API base URL from environment (production) or relative path (dev via proxy)
      const baseUrl = import.meta.env.VITE_API_URL || '/api';
      let url = `${baseUrl}/${apiPath}/${id}/download`;

      // For paid items, add token as query parameter
      if (!item.isFree) {
        const token = localStorage.getItem('token');
        if (token) {
          url += `?token=${encodeURIComponent(token)}`;
          console.log('🔑 Added token to download URL');
        } else {
          throw new Error('No authentication token found');
        }
      }

      console.log('⬇️ Full download URL:', url);
      console.log('📦 Item:', item.title, 'Free:', item.isFree, 'GitHub URL:', item.fileUrl);

      // Direct navigation – browser will follow redirects
      window.location.href = url;

      // Reset downloading state after a short delay
      setTimeout(() => setDownloading(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
      setError('Download failed. Please try again.');
      setDownloading(false);
    }
  };
  // ----- END DOWNLOAD FUNCTION -----

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(2)} MB`;
  };

  const getFileIcon = () => {
    const ext = item?.fileInfo?.extension?.toLowerCase();
    if (ext === '.pdf') return '📄';
    if (ext === '.doc' || ext === '.docx') return '📝';
    if (ext === '.zip' || ext === '.rar') return '🗜️';
    if (ext === '.txt') return '📃';
    if (type === 'software') return '💻';
    return '📁';
  };

  const getFileTypeLabel = () => {
    const ext = item?.fileInfo?.extension?.toLowerCase();
    if (ext === '.zip' || ext === '.rar') return 'Archive File';
    if (type === 'software') return 'Software Installer';
    return 'Document File';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!item) return <div>Item not found</div>;

  const canDownload = item.isFree || purchaseStatus?.status === 'completed' || purchaseStatus?.purchased === true;
  const isPending = purchaseStatus?.status === 'pending';
  const isRejected = purchaseStatus?.status === 'rejected';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>{item.title}</h1>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
            fontSize: '14px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ backgroundColor: '#e2e8f0', padding: '4px 12px', borderRadius: '20px' }}>
            {type === 'document' ? '📄 Document' : '💻 Software'}
          </span>
          <span>
            Category:{' '}
            <Link to={`/category/${item.category?.slug}`}>{item.category?.name}</Link>
          </span>
        </div>

        <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>{item.description}</p>

        {/* File Information Block */}
        {item.fileInfo && (
          <div
            style={{
              backgroundColor: '#f7fafc',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '28px' }}>{getFileIcon()}</span>
              <div>
                <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '16px' }}>
                  {getFileTypeLabel()}
                </div>
                <div style={{ fontSize: '13px', color: '#718096', wordBreak: 'break-all' }}>
                  {item.fileInfo.originalName}
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                fontSize: '12px',
                color: '#a0aec0',
              }}
            >
              <span>📦 Size: {formatFileSize(item.fileInfo.size)}</span>
              <span>📁 Type: {item.fileInfo.extension?.toUpperCase() || 'FILE'}</span>
              <span>⬇️ Downloads: {item.downloadCount || 0}</span>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          {item.isFree ? (
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#48bb78' }}>FREE</span>
          ) : (
            <span style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
              {formatKES(item.price)}
            </span>
          )}
        </div>

        {/* Status messages */}
        {!item.isFree && (
          <div style={{ marginBottom: '20px' }}>
            {canDownload && (
              <div
                style={{
                  backgroundColor: '#c6f6d5',
                  padding: '12px',
                  borderRadius: '8px',
                  color: '#22543d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>✅</span> You own this item
              </div>
            )}
            {isPending && (
              <div
                style={{
                  backgroundColor: '#feebc8',
                  padding: '12px',
                  borderRadius: '8px',
                  color: '#7b341e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>⏳</span> Payment pending verification
              </div>
            )}
            {isRejected && (
              <div
                style={{
                  backgroundColor: '#fed7d7',
                  padding: '12px',
                  borderRadius: '8px',
                  color: '#c53030',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>❌</span> Payment was rejected
              </div>
            )}
            {!canDownload && !isPending && !isRejected && (
              <div
                style={{
                  backgroundColor: '#f7fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  color: '#4a5568',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>🔒</span> You need to purchase this item to download it
              </div>
            )}
          </div>
        )}

        {/* Authentication Status */}
        <div style={{ marginBottom: '20px' }}>
          {isAuthenticated ? (
            <div
              style={{
                backgroundColor: '#f0f9ff',
                padding: '12px',
                borderRadius: '8px',
                color: '#0369a1',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <span>👤</span> Logged in as: <strong>{user?.email}</strong>
              {canDownload && (
                <span
                  style={{
                    marginLeft: 'auto',
                    backgroundColor: '#48bb78',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                >
                  ✓ Owned
                </span>
              )}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#fff7ed',
                padding: '12px',
                borderRadius: '8px',
                color: '#9a3412',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <span>🔒</span> Not logged in
              <Link
                to="/login"
                style={{ marginLeft: 'auto', color: '#667eea', textDecoration: 'none', fontWeight: '500' }}
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {canDownload ? (
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{
                flex: '1',
                padding: '14px 28px',
                backgroundColor: '#48bb78',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: downloading ? 'not-allowed' : 'pointer',
                minHeight: '48px',
                opacity: downloading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {downloading ? '⏳ Starting download...' : '⬇️ Download Now'}
            </button>
          ) : (
            <button
              onClick={handleBuyNow}
              disabled={checkingStatus || isPending}
              style={{
                flex: '1',
                padding: '14px 28px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: checkingStatus || isPending ? 'not-allowed' : 'pointer',
                minHeight: '48px',
                opacity: checkingStatus || isPending ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {checkingStatus
                ? '⏳ Checking...'
                : isPending
                ? '⏳ Pending Verification'
                : `💰 Buy Now ${!item.isFree ? `- ${formatKES(item.price)}` : ''}`}
            </button>
          )}
          <WhatsAppButton message={`Hello, I have a question about ${item.title}`} text="💬 Ask Question" />
        </div>

        {!item.isFree && !canDownload && !isPending && !isRejected && (
          <button
            onClick={checkPurchaseStatus}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              fontWeight: '500',
            }}
          >
            🔄 Check Purchase Status
          </button>
        )}

        {error && (
          <div
            style={{
              backgroundColor: '#fed7d7',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '16px',
              color: '#c53030',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            ⚠️ {error}
          </div>
        )}
      </div>

      {showPaymentModal && (
        <PaymentModal
          item={{ ...item, type }}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            setRefreshCount((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
};

export default ItemDetailPage;