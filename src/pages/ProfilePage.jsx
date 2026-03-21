import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import api from '../services/api';
import { formatKES, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [orders, setOrders] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchases');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('📦 Fetching profile data...');
        
        const [ordersRes, pendingRes] = await Promise.all([
          api.get('/orders/my-orders').catch(err => {
            console.error('Orders fetch error:', err);
            return { data: [] };
          }),
          api.get('/payments/pending').catch(err => {
            console.error('Pending transactions fetch error:', err);
            return { data: [] };
          })
        ]);
        
        console.log('✅ Orders received:', ordersRes.data?.length || 0);
        console.log('✅ Pending transactions received:', pendingRes.data?.length || 0);
        
        setOrders(ordersRes.data || []);
        setPendingTransactions(pendingRes.data || []);
        
      } catch (error) {
        console.error('❌ Failed to fetch profile data:', error);
        setError('Failed to load profile data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) return <LoadingSpinner text="Loading profile..." />;

  return (
    <div style={styles.container}>
      {/* Profile Header */}
      <div style={styles.header}>
        <div style={styles.coverPhoto}></div>
        <div style={styles.profileInfo}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div style={styles.userDetails}>
            <h1 style={styles.userName}>{user?.name}</h1>
            <div style={styles.userMeta}>
              <span style={styles.userEmail}>📧 {user?.email}</span>
              <span style={styles.userPhone}>📱 {user?.phone}</span>
            </div>
            <div style={styles.userStats}>
              <div style={styles.statItem}>
                <span style={styles.statValue}>{orders.length}</span>
                <span style={styles.statLabel}>Purchases</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statValue}>{pendingTransactions.length}</span>
                <span style={styles.statLabel}>Pending</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statValue}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
                <span style={styles.statLabel}>Member Since</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div style={styles.errorAlert}>
          ⚠️ {error}
          <button onClick={() => window.location.reload()} style={styles.retryBtn}>Retry</button>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('purchases')}
          style={{ ...styles.tab, ...(activeTab === 'purchases' ? styles.activeTab : {}) }}
        >
          📦 My Purchases {orders.length > 0 && <span style={styles.badge}>{orders.length}</span>}
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          style={{ ...styles.tab, ...(activeTab === 'pending' ? styles.activeTab : {}) }}
        >
          ⏳ Pending Verifications {pendingTransactions.length > 0 && <span style={styles.badge}>{pendingTransactions.length}</span>}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={{ ...styles.tab, ...(activeTab === 'settings' ? styles.activeTab : {}) }}
        >
          ⚙️ Account Settings
        </button>
      </div>

      {/* Purchases Tab */}
      {activeTab === 'purchases' && (
        <div style={styles.content}>
          {orders.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🛒</div>
              <h3>No purchases yet</h3>
              <p>Start exploring our store and make your first purchase!</p>
              <Link to="/documents" style={styles.browseBtn}>Browse Documents</Link>
              <Link to="/software" style={styles.browseBtn}>Browse Software</Link>
            </div>
          ) : (
            <div style={styles.ordersGrid}>
              {orders.map(order => (
                <div key={order._id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <div>
                      <span style={styles.orderId}>#{order._id.slice(-8)}</span>
                      <span style={styles.orderDate}>{formatDate(order.createdAt)}</span>
                    </div>
                    <span style={{
                      ...styles.orderStatus,
                      backgroundColor: order.status === 'completed' ? '#c6f6d5' : '#feebc8',
                      color: order.status === 'completed' ? '#22543d' : '#7b341e'
                    }}>
                      {order.status === 'completed' ? '✅ Completed' : '⏳ Pending'}
                    </span>
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={styles.orderItem}>
                      <div style={styles.itemIcon}>{item.itemType === 'document' ? '📄' : '💻'}</div>
                      <div style={styles.itemDetails}>
                        <div style={styles.itemTitle}>{item.title}</div>
                        <div style={styles.itemMeta}>
                          <span>{item.itemType}</span>
                          <span>{formatKES(item.price)}</span>
                        </div>
                      </div>
                      <Link to={`/${item.itemType}/${item.itemId}`} style={styles.viewBtn}>View</Link>
                    </div>
                  ))}
                  <div style={styles.orderFooter}>
                    <strong>Total: {formatKES(order.totalAmount)}</strong>
                    {order.status === 'completed' && (
                      <span>⬇️ {order.items.reduce((sum, i) => sum + (i.downloadCount || 0), 0)} downloads</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pending Tab */}
      {activeTab === 'pending' && (
        <div style={styles.content}>
          {pendingTransactions.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>✅</div>
              <h3>No pending verifications</h3>
              <p>All your payments are up to date!</p>
            </div>
          ) : (
            <div style={styles.pendingGrid}>
              {pendingTransactions.map(tx => (
                <div key={tx._id} style={styles.pendingCard}>
                  <div style={styles.pendingHeader}>
                    <span>{tx.itemTitle}</span>
                    <span style={styles.pendingAmount}>{formatKES(tx.amount)}</span>
                  </div>
                  <div style={styles.pendingDetails}>
                    <p>📅 {formatDate(tx.createdAt)}</p>
                    <p>💰 {tx.paymentMethod === 'manual' ? 'Manual Payment' : 'STK Push'}</p>
                    {tx.screenshotUrl && (
                      <a href={tx.screenshotUrl} target="_blank" rel="noopener noreferrer" style={styles.viewScreenshotBtn}>
                        📸 View Screenshot
                      </a>
                    )}
                  </div>
                  <div style={styles.pendingFooter}>
                    ⏳ Awaiting admin verification
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div style={styles.content}>
          <div style={styles.settingsCard}>
            <h3>Account Settings</h3>
            <div style={styles.infoRow}><strong>Name:</strong> {user?.name}</div>
            <div style={styles.infoRow}><strong>Email:</strong> {user?.email}</div>
            <div style={styles.infoRow}><strong>Phone:</strong> {user?.phone}</div>
            <div style={styles.supportSection}>
              <h4>Need Help?</h4>
              <p>Contact: {settings?.businessPhoneNumber}</p>
              <a href={`https://wa.me/254${(settings?.whatsappNumber || '0768784909').slice(1)}`} target="_blank" rel="noopener noreferrer" style={styles.whatsappBtn}>
                💬 WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  header: { backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '24px' },
  coverPhoto: { height: '120px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  profileInfo: { padding: '0 24px 24px 24px', position: 'relative' },
  avatarContainer: { display: 'flex', justifyContent: 'center', marginTop: '-50px', marginBottom: '16px' },
  avatar: { width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '600', border: '4px solid white' },
  userDetails: { textAlign: 'center' },
  userName: { fontSize: '28px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' },
  userMeta: { display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' },
  userEmail: { color: '#718096', fontSize: '14px' },
  userPhone: { color: '#718096', fontSize: '14px' },
  userStats: { display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '16px' },
  statItem: { textAlign: 'center' },
  statValue: { display: 'block', fontSize: '20px', fontWeight: '700', color: '#2d3748' },
  statLabel: { fontSize: '12px', color: '#718096' },
  errorAlert: { backgroundColor: '#fed7d7', padding: '16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' },
  retryBtn: { marginLeft: 'auto', padding: '6px 12px', backgroundColor: '#c53030', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '24px', backgroundColor: 'white', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexWrap: 'wrap' },
  tab: { flex: 1, minWidth: '140px', padding: '12px', border: 'none', borderRadius: '8px', backgroundColor: 'transparent', color: '#718096', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s' },
  activeTab: { backgroundColor: '#667eea', color: 'white' },
  badge: { backgroundColor: '#f56565', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' },
  content: { backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minHeight: '400px' },
  emptyState: { textAlign: 'center', padding: '60px 20px' },
  emptyIcon: { fontSize: '64px', marginBottom: '16px', opacity: 0.5 },
  browseBtn: { display: 'inline-block', margin: '8px', padding: '12px 24px', backgroundColor: '#667eea', color: 'white', textDecoration: 'none', borderRadius: '8px' },
  ordersGrid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  orderCard: { border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' },
  orderHeader: { backgroundColor: '#f8fafc', padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
  orderId: { fontWeight: '600', marginRight: '12px' },
  orderDate: { fontSize: '13px', color: '#718096' },
  orderStatus: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  orderItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #edf2f7' },
  itemIcon: { fontSize: '24px' },
  itemDetails: { flex: 1 },
  itemTitle: { fontWeight: '500', marginBottom: '4px' },
  itemMeta: { display: 'flex', gap: '12px', fontSize: '12px', color: '#718096' },
  viewBtn: { padding: '6px 12px', backgroundColor: '#667eea', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '12px' },
  orderFooter: { backgroundColor: '#f8fafc', padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' },
  pendingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  pendingCard: { backgroundColor: '#fff3e0', borderRadius: '12px', padding: '16px', border: '1px solid #ffd8b0' },
  pendingHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: '600' },
  pendingAmount: { color: '#ed8936' },
  pendingDetails: { marginBottom: '12px', fontSize: '13px', color: '#718096' },
  viewScreenshotBtn: { display: 'inline-block', marginTop: '8px', padding: '4px 8px', backgroundColor: '#4299e1', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '12px' },
  pendingFooter: { marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #ffd8b0', color: '#ed8936', fontSize: '12px', textAlign: 'center' },
  settingsCard: { maxWidth: '600px', margin: '0 auto' },
  infoRow: { padding: '12px 0', borderBottom: '1px solid #e2e8f0' },
  supportSection: { marginTop: '24px', padding: '24px', backgroundColor: '#ebf8ff', borderRadius: '12px', textAlign: 'center' },
  whatsappBtn: { display: 'inline-block', marginTop: '12px', padding: '10px 20px', backgroundColor: '#25D366', color: 'white', textDecoration: 'none', borderRadius: '8px' }
};

export default ProfilePage;