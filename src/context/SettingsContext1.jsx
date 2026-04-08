import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    businessName: 'DocuSoft Store',
    businessPhoneNumber: '0768784909',
    whatsappNumber: '0768784909',
    contactEmail: 'support@docusoft.com',
    address: 'Nairobi, Kenya',
    facebook: '',
    twitter: '',
    instagram: '',
    enableSTKPush: true,
    enableManualPayment: true,
    paymentInstructions: 'Send money to {businessNumber} via M-Pesa, then upload screenshot',
    requireTermsAcceptance: true,
    termsAndConditions: { content: '', lastUpdated: null },
    privacyPolicy: { content: '', lastUpdated: null },
    businessHours: {
      monday: '9am-5pm',
      tuesday: '9am-5pm',
      wednesday: '9am-5pm',
      thursday: '9am-5pm',
      friday: '9am-5pm',
      saturday: 'Closed',
      sunday: 'Closed'
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Listen for real‑time updates from admin panel
    const handleSettingsUpdate = (event) => {
      if (event.detail) {
        setSettings(prev => ({ ...prev, ...event.detail }));
      }
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    // Poll every 30 seconds as a fallback
    const interval = setInterval(fetchSettings, 30000);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      clearInterval(interval);
    };
  }, []);

  const formatPaymentInstructions = (instructions) => {
    if (!instructions) return '';
    return instructions.replace('{businessNumber}', settings.businessPhoneNumber);
  };

  const value = {
    settings,
    loading,
    formatPaymentInstructions,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};