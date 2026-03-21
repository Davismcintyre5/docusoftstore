import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>{settings?.businessName || 'DocuSoft Store'}</h3>
          <p>Your trusted source for digital documents and software solutions.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/documents">Documents</Link>
          <Link to="/software">Software</Link>
          <Link to="/help">Help Center</Link>
          <Link to="/profile">My Account</Link>
        </div>
        
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>📞 {settings?.businessPhoneNumber || '0768784909'}</p>
          <p>📧 support@docusoft.com</p>
          <p>💬 WhatsApp: {settings?.whatsappNumber || '0768784909'}</p>
        </div>
        
        <div className="footer-section">
          <h3>Business Hours</h3>
          {settings?.businessHours && Object.entries(settings.businessHours).map(([day, hours]) => (
            <p key={day}>{day}: {hours}</p>
          ))}
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {year} {settings?.businessName || 'DocuSoft Store'}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;