import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    businessName: 'DocuSoft Store',
    businessPhoneNumber: '0768784909',
    whatsappNumber: '0768784909',
    contactEmail: 'support@docusoft.com',
    address: 'Nakuru, Kenya',
    facebook: 'https://facebook.com/DocuSoftStore',
    twitter: 'https://twitter.com/DocuSoftStore',
    instagram: 'https://instagram.com/DocuSoftStore',
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
  const [categories, setCategories] = useState([]);  // NEW
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const fetchCategories = async () => {  // NEW
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSettings(), fetchCategories()]);
      setLoading(false);
    };
    loadData();

    const handleSettingsUpdate = (event) => {
      if (event.detail) setSettings(prev => ({ ...prev, ...event.detail }));
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    // Also refetch categories when settings update (in case categories changed)
    const handleCategoriesUpdate = () => fetchCategories();
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, []);

  const formatPaymentInstructions = (instructions) => {
    if (!instructions) return '';
    return instructions.replace('{businessNumber}', settings.businessPhoneNumber);
  };

  const value = {
    settings,
    categories,
    loading,
    formatPaymentInstructions,
    refreshCategories: fetchCategories,  // NEW
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};