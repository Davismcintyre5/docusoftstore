import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const WhatsAppButton = ({ message, children }) => {
  const { settings } = useSettings();
  const phone = settings?.whatsappNumber || '0768784909';
  const formattedPhone = phone.replace(/\D/g, '').replace(/^0/, '254');
  const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm"
    >
      💬 {children || 'Chat on WhatsApp'}
    </a>
  );
};

export default WhatsAppButton;