import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    businessName: 'DocuSoft Store',
    businessPhoneNumber: '0768784909',
    whatsappNumber: '0768784909',
    enableSTKPush: true,
    enableManualPayment: true,
    paymentInstructions: 'Send money to {businessNumber} via M-Pesa, then upload screenshot',
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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPaymentInstructions = (instructions) => {
    if (!instructions) return 'Send money to {businessNumber} via M-Pesa, then upload screenshot';
    return instructions.replace(/{businessNumber}/g, settings.businessPhoneNumber);
  };

  const value = {
    settings,
    loading,
    formatPaymentInstructions
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};