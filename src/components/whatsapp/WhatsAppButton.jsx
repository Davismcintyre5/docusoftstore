import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const WhatsAppButton = ({ message, text = '💬 WhatsApp Support' }) => {
  const { settings } = useSettings();
  const phone = settings?.whatsappNumber || '0768784909';
  const formattedPhone = phone.replace(/^0/, '254').replace(/^\+/, '');
  const encodedMessage = encodeURIComponent(message || `Hello, I need help with your store.`);
  const url = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: '#25D366',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        transition: 'all 0.3s',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        width: '100%'
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = '#128C7E'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#25D366'}
    >
      {text}
    </a>
  );
};

export default WhatsAppButton;