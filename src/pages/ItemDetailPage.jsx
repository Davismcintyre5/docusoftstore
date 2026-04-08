import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import PaymentModal from '../components/payment/PaymentModal';
import WhatsAppButton from '../components/whatsapp/WhatsAppButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';
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

  // Check purchase status for paid items (only when user is logged in)
  useEffect(() => {
    if (user && item && !item.isFree) {
      checkPurchaseStatus();
    }
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
      // Redirect to login with return URL
      navigate('/login', { state: { from: `/${type}/${id}` } });
    } else {
      setShowPaymentModal(true);
    }
  };

  // Download function - FREE items work without login
  const handleDownload = async () => {
    setDownloading(true);
    setError('');

    try {
      const apiPath = getApiPath();
      let url = `${import.meta.env.VITE_API_URL || '/api'}/${apiPath}/${id}/download`;

      // For paid items, add token as query parameter
      if (!item.isFree) {
        if (!isAuthenticated) {
          setError('Please login to download paid items');
          setDownloading(false);
          navigate('/login', { state: { from: `/${type}/${id}` } });
          return;
        }
        const token = localStorage.getItem('token');
        if (token) {
          url += `?token=${encodeURIComponent(token)}`;
        } else {
          throw new Error('No authentication token found');
        }
      }

      // Open download in new tab/window
      window.open(url, '_blank');
    } catch (err) {
      console.error('Download error:', err);
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(2)} MB`;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!item) return <div className="text-center py-12">Item not found</div>;

  // Determine if user can download
  const canDownload = item.isFree || purchaseStatus?.purchased === true;
  const isPending = purchaseStatus?.status === 'pending' || purchaseStatus?.status === 'processing';
  const isRejected = purchaseStatus?.status === 'rejected';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Left - Icon */}
          <div className="md:w-1/3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-8">
            {type === 'document' ? (
              <span className="text-6xl md:text-7xl">📄</span>
            ) : (
              <span className="text-6xl md:text-7xl">💻</span>
            )}
          </div>

          {/* Right - Details */}
          <div className="md:w-2/3 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{item.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge badge-info capitalize">{type}</span>
              {item.isFree ? (
                <span className="badge badge-success">FREE</span>
              ) : (
                <span className="badge bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                  {formatKES(item.price)}
                </span>
              )}
              <span className="badge bg-gray-100 dark:bg-gray-700">⬇️ {item.downloadCount || 0} downloads</span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-wrap">
              {item.description || 'No description available.'}
            </p>

            {/* File info if available */}
            {item.fileInfo && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4 text-sm">
                <span className="font-medium">📁 {item.fileInfo.originalName}</span>
                {item.fileInfo.size && <span className="text-gray-500 ml-2">({formatFileSize(item.fileInfo.size)})</span>}
              </div>
            )}

            {/* Status Messages */}
            {!item.isFree && (
              <div className="mb-4">
                {canDownload && (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-3 rounded-lg flex items-center gap-2">
                    <span>✅</span> You own this item
                  </div>
                )}
                {isPending && (
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 p-3 rounded-lg flex items-center gap-2">
                    <span>⏳</span> Payment pending verification. You will be able to download once approved.
                  </div>
                )}
                {isRejected && (
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 p-3 rounded-lg flex items-center gap-2">
                    <span>❌</span> Payment was rejected. Please contact support.
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {canDownload ? (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="btn-primary flex items-center gap-2"
                >
                  {downloading ? '⏳ Preparing...' : '⬇️ Download Now'}
                </button>
              ) : isPending ? (
                <button
                  disabled
                  className="btn-secondary flex items-center gap-2 opacity-60 cursor-not-allowed"
                >
                  ⏳ Pending Verification
                </button>
              ) : (
                <button onClick={handleBuyNow} className="btn-primary flex items-center gap-2">
                  💰 Buy Now {!item.isFree && `- ${formatKES(item.price)}`}
                </button>
              )}
              <WhatsAppButton message={`Hello, I have a question about ${item.title}`}>
                💬 Ask Question
              </WhatsAppButton>
            </div>

            {/* Check Status Button for pending payments */}
            {!item.isFree && !canDownload && !isPending && !isRejected && isAuthenticated && (
              <button
                onClick={checkPurchaseStatus}
                className="mt-3 text-sm text-primary-600 hover:text-primary-700"
              >
                🔄 Check payment status
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
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