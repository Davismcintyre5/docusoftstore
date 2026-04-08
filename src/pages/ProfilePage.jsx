import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import api from '../services/api';
import { formatKES, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Package, Clock, Settings, User, Mail, Phone, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [orders, setOrders] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchases');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, pendingRes] = await Promise.all([
          api.get('/orders/my-orders').catch(() => ({ data: [] })),
          api.get('/payments/pending').catch(() => ({ data: [] }))
        ]);
        setOrders(ordersRes.data || []);
        setPendingTransactions(pendingRes.data || []);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <LoadingSpinner text="Loading profile..." />;

  const tabs = [
    { id: 'purchases', label: 'My Purchases', icon: Package, count: orders.length },
    { id: 'pending', label: 'Pending Verifications', icon: Clock, count: pendingTransactions.length },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex justify-center -mt-12 mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
            <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Mail size={14} /> {user?.email}</span>
              <span className="flex items-center gap-1"><Phone size={14} /> {user?.phone}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Member since {formatDate(user?.createdAt)}</span>
            </div>
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</div>
                <div className="text-xs text-gray-500">Purchases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{pendingTransactions.length}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition ${
              activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.count > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Purchases Tab */}
      {activeTab === 'purchases' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No purchases yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Start exploring our store and make your first purchase!</p>
              <div className="flex gap-3 justify-center">
                <Link to="/documents" className="btn-primary">Browse Documents</Link>
                <Link to="/software" className="btn-secondary">Browse Software</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <span className="font-mono text-sm font-medium">#{order._id.slice(-8)}</span>
                      <span className="text-xs text-gray-500 ml-2">{formatDate(order.createdAt)}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {order.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-2xl">{item.itemType === 'document' ? '📄' : '💻'}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                        <div className="text-xs text-gray-500 flex gap-3 mt-1">
                          <span className="capitalize">{item.itemType}</span>
                          <span>{formatKES(item.price)}</span>
                          <span>⬇️ {item.downloadCount || 0} downloads</span>
                        </div>
                      </div>
                      <Link to={`/${item.itemType}/${item.itemId}`} className="text-primary-600 hover:text-primary-700 text-sm">View</Link>
                    </div>
                  ))}
                  <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 text-right text-sm font-semibold">
                    Total: {formatKES(order.totalAmount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pending Tab */}
      {activeTab === 'pending' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          {pendingTransactions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No pending verifications</h3>
              <p className="text-gray-500 dark:text-gray-400">All your payments are up to date!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingTransactions.map(tx => {
                const hasScreenshot = !!tx.screenshotUrl;
                const hasMessage = tx.metadata?.paymentConfirmation;
                return (
                  <div key={tx._id} className="border border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{tx.itemTitle}</h4>
                        <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                      </div>
                      <span className="text-lg font-bold text-orange-600">{formatKES(tx.amount)}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="capitalize">{tx.paymentMethod} payment</span> - Awaiting admin verification
                    </div>
                    {hasScreenshot && (
                      <a href={tx.screenshotUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-2">
                        📸 View Screenshot
                      </a>
                    )}
                    {hasMessage && (
                      <div className="bg-white dark:bg-gray-800 rounded p-2 text-sm border border-gray-200 dark:border-gray-700 mt-2">
                        <span className="font-medium">Confirmation:</span>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{tx.metadata.paymentConfirmation}</p>
                      </div>
                    )}
                    {!hasScreenshot && !hasMessage && (
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded p-2 text-sm text-yellow-800 dark:text-yellow-400 mt-2">
                        ⏳ No confirmation provided yet. Please upload screenshot or paste M-Pesa message.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-gray-700">
              <User size={18} className="text-gray-400" />
              <div><div className="text-xs text-gray-500">Full Name</div><div className="font-medium">{user?.name}</div></div>
            </div>
            <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-gray-700">
              <Mail size={18} className="text-gray-400" />
              <div><div className="text-xs text-gray-500">Email Address</div><div className="font-medium">{user?.email}</div></div>
            </div>
            <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-gray-700">
              <Phone size={18} className="text-gray-400" />
              <div><div className="text-xs text-gray-500">Phone Number</div><div className="font-medium">{user?.phone}</div></div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-400" />
              <div><div className="text-xs text-gray-500">Member Since</div><div className="font-medium">{formatDate(user?.createdAt)}</div></div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-3">Need Help?</h4>
            <div className="space-y-2 text-sm">
              <p>📞 Phone: {settings?.businessPhoneNumber || '0768784909'}</p>
              <p>📧 Email: {settings?.contactEmail || 'support@docusoft.com'}</p>
              <p>📍 Address: {settings?.address || 'Nakuru, Kenya'}</p>
            </div>
            <a
              href={`https://wa.me/254${(settings?.whatsappNumber || '0768784909').slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              💬 WhatsApp Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;